---
title: Pourquoi les alertes exploitables comptent
description: Comment une simple alerte de redémarrage de pod a révélé une boucle de crash silencieuse toutes les quatre heures, un cache NestJS mal configuré et des mois d'erreurs invisibles dans un service graphique legacy.
date: 2026-11-19
tags:
  - observabilite
  - alertes
  - nestjs
  - debogage
  - kubernetes
  - pprof
draft: false
cover:
  src: ../../assets/images/writing/why-actionable-alerts-matter-cover.png
  alt: Un panneau de tableau de bord géométrique encadré montrant un graphique en dents de scie surmonté d'une balise jaune lumineuse, encadré par deux barres de jauge horizontales et un cadran circulaire.
locale: fr
slug: why-actionable-alerts-matter
---

Lorsque nous avons ajouté une simple **alerte de redémarrage de pod** sur un service backend legacy, elle n'a pas tardé à se déclencher. Un pod redémarrait *toutes les quatre heures*, absolument tous les jours.

En remontant les graphiques, ce rythme tournait depuis des mois. Personne ne l'avait remarqué, non pas parce que le problème était subtil, mais parce que rien n'était configuré pour nous prévenir.

## Le coût silencieux d'un service sans alertes

Je m'occupe de ce service legacy depuis quelque temps, et le plus difficile n'a jamais été de corriger un bug isolé. C'est de découvrir combien de problèmes peuvent s'accumuler au grand jour quand aucune alerte n'existe.

Il s'agit d'une API graphique construite avec NestJS. Récemment, le service a reçu une série d'optimisations destinées à accélérer certains traitements : un cache et des DataLoaders ont été ajoutés pour limiter le travail répété dans les résolveurs. Sur le papier, l'idée tenait la route. Les requêtes auraient dû devenir plus rapides et moins coûteuses pour les dépendances en aval.

En pratique, nous n'avons commencé à mesurer l'état réel du service qu'au moment de définir nos nouveaux **objectifs de niveau de service (SLO)**.[^1] Les chiffres ont immédiatement fait apparaître bien plus d'erreurs que prévu.

C'est à ce moment-là que nous avons décidé d'arrêter de voler à l'aveugle et de poser une alerte simple et exploitable : nous prévenir dès qu'un conteneur de ce service redémarre.

Voici une expression d'alerte Prometheus illustrative, et non notre règle de production, qui montre le type de signal recherché :

```yaml
# Règle d'alerte Prometheus illustrative
alert: GraphApiPodRestarted
expr: |
  sum by (namespace, pod) (
    increase(kube_pod_container_status_restarts_total{namespace="graph-api"}[15m])
  ) > 0
```

Il s'agit d'un simple compteur exposé par `kube-state-metrics`.[^2] Contrairement à un avertissement CPU vague que tout le monde finit par ignorer, un conteneur qui redémarre en production pose toujours une question concrète : *pourquoi ce processus est-il mort ?*

## Un métronome de quatre heures

Une fois l'alerte active, le schéma était impossible à manquer. Toutes les quatre heures, presque comme un métronome, un pod tombait et Kubernetes en relançait aussitôt un nouveau.

Comme Kubernetes remplaçait silencieusement le pod planté à chaque fois, le trafic continuait de passer et personne n'était réveillé. <mark>Un orchestrateur qui masque les crashs sans alerter ne rend pas un service fiable ; il rend simplement les pannes silencieuses.</mark>

Le déclenchement de cette alerte nous a donné d'un coup deux éléments qui nous manquaient depuis des mois : la preuve qu'une fuite ou un crash actif se produisait, et une fenêtre nette de quatre heures à inspecter.

## Remonter la fuite avec pprof, les métriques et l'IA

Pour comprendre ce qui remplissait le processus, nous avons activé **`@datadog/pprof`** afin de capturer des profils de tas mémoire et voir où partait réellement la RAM.[^4] Nous avons croisé ces profils avec nos bonnes vieilles métriques **Grafana et Prometheus** pour aligner la montée en mémoire, les horaires de redémarrage et l'historique des déploiements.

Cette chronologie a fait la moitié du travail. La courbe mémoire en dents de scie avait démarré juste après la mise en production du cache et des DataLoaders. À partir de là, nous avons utilisé l'IA en appui des sorties `pprof` et du code pour remonter la piste d'allocation exacte et distinguer les suspects probables de la véritable cause.

Ce que nous avons trouvé prête presque à sourire avec le recul.

## Des écritures dans le tas mémoire, des lectures dans Redis

L'équipe pensait avoir adossé le nouveau cache à Redis. Ce qui se passait réellement était plus subtil et bien pire : **les lectures partaient vers Redis, tandis que les écritures partaient dans la mémoire locale du processus**, avec un **TTL d'une semaine** posé via la couche de cache NestJS.[^3]

Voici une configuration NestJS illustrative, et non notre code de production, qui montre à quel point un décalage entre un client Redis dédié et un `CacheModule` en mémoire par défaut peut faire parler lectures et écritures à deux endroits différents :

```ts
import { CacheInterceptor, CacheModule, CacheTTL } from "@nestjs/cache-manager";
import { Controller, Get, Module, UseInterceptors } from "@nestjs/common";

@Module({
  // Sans stockage externe explicite, CacheModule utilise la mémoire du processus.
  imports: [CacheModule.register()],
})
export class AppModule {}

@Controller("items")
@UseInterceptors(CacheInterceptor)
export class ItemsController {
  // Les écritures vont dans le tas local du pod avec un TTL de 7 jours,
  // tandis que la lecture interroge Redis et rate le cache à chaque fois.
  @Get()
  @CacheTTL(7 * 24 * 60 * 60 * 1000)
  findAll() {
    return this.loadItemsFromRedisOrDb();
  }
}
```

Chaque requête cumulait donc le pire des deux mondes. La lecture interrogeait Redis et manquait sa cible, puisque rien n'y était jamais écrit. La réponse écrivait ensuite le contenu dans la mémoire locale du pod, accompagné d'un minuteur d'expiration censé le nettoyer une semaine plus tard.

Le pod n'approchait jamais d'une semaine d'existence. Toutes les quatre heures, le tas atteignait son plafond, le conteneur mourait, et le nouveau pod recommençait à remplir sa mémoire vide depuis zéro. <mark>Comme les lectures allaient vers Redis et les écritures vers la mémoire locale, le cache n'a jamais servi une seule fois tout en faisant planter le pod toutes les quatre heures.</mark>

## Corriger le stockage et voir les courbes s'apaiser

Une fois la cause identifiée, le correctif était direct : aligner lectures et écritures sur le même stockage Redis afin que les entrées en cache et leurs expirations vivent dans Redis au lieu de s'accumuler dans la RAM du pod.

De façon illustrative, le passage explicite à un stockage externe ressemble à ceci :

```ts
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import KeyvRedis from "@keyv/redis";

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        stores: [new KeyvRedis(process.env.REDIS_URL)],
        ttl: 7 * 24 * 60 * 60 * 1000,
      }),
    }),
  ],
})
export class AppModule {}
```

Après la mise en production du correctif, la courbe en dents de scie s'est aplatie. L'alerte de redémarrage de pod a complètement cessé de se déclencher. Mieux encore, avec un cache enfin hébergé dans Redis et persistant entre les requêtes et les redémarrages, notre **latence p95** est descendue nettement en dessous de son niveau précédent.

Rien de tout cela n'est arrivé parce que nous serions soudain devenus meilleurs pour deviner ce qui clochait dans un service legacy. C'est arrivé parce qu'une petite alerte exploitable a enfin mis en lumière une panne qui se répétait toutes les quatre heures.

## Notes

[^1]: Google SRE Book : [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).
[^2]: `kube-state-metrics` : [Métriques de pod (`kube_pod_container_status_restarts_total`)](https://github.com/kubernetes/kube-state-metrics/blob/main/docs/metrics/workload/pod-metrics.md).
[^3]: Documentation NestJS : [Caching (`@nestjs/cache-manager`)](https://docs.nestjs.com/techniques/caching).
[^4]: Datadog `pprof` pour Node.js : [`@datadog/pprof` (`DataDog/pprof-nodejs`)](https://github.com/DataDog/pprof-nodejs).
