---
title: J'aimais GraphQL, jusqu'au jour où j'ai dû le déboguer
description: Une réflexion sur la séduction de GraphQL, les filtres LoopBack et le coût d'inspection d'une requête au sein d'un système distribué.
date: 2026-10-04
tags:
  - graphql
  - architecture
  - debogage
draft: false
cover:
  src: /images/writing/graphql-over-the-cliff-cover.png
  alt: Une feuille de requête stylisée basculant d'une falaise vers un réseau de conduits et de nœuds de services.
locale: fr
slug: graphql-over-the-cliff
---

![Une feuille de requête stylisée basculant d'une falaise vers un réseau de conduits et de nœuds de services.](/images/writing/graphql-over-the-cliff-cover.png)

Vers 2018, j'ai suivi un tutoriel GraphQL de The Net Ninja et j'ai adoré instantanément. Je pouvais demander exactement les champs dont j'avais besoin, naviguer dans les relations et recevoir une réponse propre et imbriquée en un seul appel. C'était précis. C'était moderne. J'avais enfin l'impression que l'API cessait de se quereller avec le client.

À l'époque, j'étais fasciné par la requête elle-même. Un schéma compact à l'écran semblait promettre une charge de travail tout aussi réduite en coulisses.

C'était une erreur, bien que parfaitement compréhensible.

## L'outil moins tendance qui fonctionnait

Mon premier emploi m'a confronté à LoopBack 3, puis plus tard à LoopBack 4.[^1] L'outil venait de StrongLoop et d'IBM plutôt que du versant le plus exaltant de l'écosystème JavaScript, mais il nous apportait des éléments précieux : des modèles, des relations et des filtres.

Un point de terminaison pouvait exposer un modèle et accepter un filtre. Je pouvais sélectionner des champs, contraindre un résultat et inclure un modèle associé. Ce n'était pas aussi élégant qu'une requête GraphQL, mais l'essentiel de l'utilité s'y trouvait déjà.

```text
GET /customers?filter={
  "fields": ["id", "name"],
  "where": {"active": true},
  "include": ["orders"]
}
```

La documentation de LoopBack détaille clairement la sélection de champs, les filtres et l'inclusion de modèles associés.[^2] La syntaxe peut devenir lourde, notamment dès lors qu'une chaîne de requête doit véhiculer du JSON encodé, mais le travail reste explicite. Je vois la ressource, la condition et la relation que j'ai demandées.

Cela a fait évoluer ma perception initiale de GraphQL. J'ai cessé de croire que « GraphQL est l'unique moyen d'éviter les API inefficaces ». Une API REST bien pensée, munie de filtres et de relations, répond à une part surprenante de ces mêmes besoins.

## La requête simple qui ne l'était pas

Des années plus tard, j'ai rejoint une équipe qui utilisait GraphQL de bout en bout. J'étais ravi au début : la technologie que j'avais tant admirée était désormais exploitée à grande échelle.

Puis j'ai dû comprendre pourquoi une requête était lente, incomplète ou erronée.

De l'extérieur, une requête peut paraître admirablement concise :

```graphql
query CustomerOrder {
  customer(id: "42") {
    name
    orders { id total }
  }
}
```

Mais cette forme ne révèle presque rien du chemin sous-jacent. `customer` peut être un résolveur. `orders` peut interroger un autre service. Une passerelle (gateway) peut déléguer une partie de la sélection à un second schéma. Un DataLoader peut regrouper une série de lectures, pendant qu'un autre résolveur continue d'émettre un appel distinct pour chaque enregistrement. La requête paraît bien plus sereine que l'armada technique qui la porte.

Aucune de ces idées n'est absurde. DataLoader existe pour regrouper et mettre en cache les requêtes d'une même passe d'exécution.[^3] L'assemblage de schémas (schema stitching) permet de présenter plusieurs services au travers d'un schéma unifié, et la délégation de schéma est le mécanisme qui achemine une fraction de requête vers le service en mesure d'y répondre.[^4] Ce sont de vraies réponses à de vraies problématiques.

Ce sont aussi autant d'endroits supplémentaires où chercher quand la réponse tarde.

La difficulté pour moi n'était pas que GraphQL rendait le système complexe. Le système l'était déjà. GraphQL permettait simplement à cette complexité de se dissimuler derrière une requête d'apparence inoffensive.

## Un code de statut vert n'empêche pas un long après-midi

L'autre surprise concernait les pannes. Dans le système avec lequel je travaillais, de nombreuses opérations transitaient en POST et renvoyaient un code HTTP 200 même lorsqu'une partie du travail demandé avait échoué. La réponse utile pouvait côtoyer un tableau `errors`, ou s'effacer derrière un résultat partiel.

```json
{
  "data": { "customer": { "name": "Ada", "orders": null } },
  "errors": [{ "message": "Orders service timed out" }]
}
```

Cette réponse constitue un comportement GraphQL tout à fait valide, et non un défaut en soi. La spécification GraphQL-over-HTTP distingue formellement une réponse GraphQL syntaxiquement correcte du succès de chacun des champs qui la composent.[^5] Cependant, cela a bouleversé mon premier réflexe en phase de diagnostic. Un code 200 ne suffisait plus à me garantir que l'opération s'était bien déroulée. Il me fallait inspecter le corps de la réponse, remonter la trace des champs, puis déterminer quel service avait réellement rencontré l'échec.

REST peut aussi dissimuler le désordre derrière un point de terminaison. Il est parfaitement possible de concevoir un service REST aux routes imprécises, aux codes de statut mal employés et ponctué d'appels internes impossibles à retracer. Le protocole ne protège personne des mauvaises frontières.

Pour autant, j'ai plus de facilité à appréhender mentalement une requête REST bien conçue. Je sais quelle opération j'analyse. J'ai une ressource, une méthode, un statut, et généralement une liste plus courte de points de départ. Le filtrage ne rend pas le point de terminaison magique ; il le rend simplement plus utile.

Dans mon travail, cette forme de sobriété est devenue une vertu.

## L'exception qui m'a fait hésiter

Plus tard, je me suis penché brièvement sur Hasura.[^6] J'ai accroché presque immédiatement, ce qui était un peu déroutant après toutes ces réticences.

Je ne l'ai pas utilisé assez longuement pour affirmer qu'il résout les problèmes évoqués plus haut. Ce qui a capté mon attention m'était familier : un lien direct entre le modèle de données et l'API, avec filtres et relations déjà prêts à l'emploi. Son modèle relationnel m'a rappelé le côté pragmatique que j'avais apprécié dans LoopBack.[^7]

Peut-être que je ne rejette pas tant GraphQL que la nécessité de devoir fouiller un graphe d'exécution pour élucider une requête d'allure anodine. Hasura n'a pas encore emporté mon jugement définitif, mais il a clairement mérité que je m'y attarde à nouveau.

## Notes

[^1]: [Documentation de LoopBack 3](https://loopback.io/doc/en/lb3/) et [documentation de LoopBack 4](https://loopback.io/doc/en/lb4/).
[^2]: [Filtre de champs dans LoopBack 4](https://loopback.io/doc/en/lb4/Fields-filter.html), [filtres de requêtes](https://loopback.io/doc/en/lb4/Querying-data.html) et [filtre d'inclusion](https://loopback.io/doc/en/lb4/Include-filter.html).
[^3]: [DataLoader](https://github.com/graphql/dataloader).
[^4]: [Assemblage et délégation de schémas avec GraphQL Tools](https://the-guild.dev/graphql/stitching/docs).
[^5]: [Spécification GraphQL over HTTP](https://http-spec.graphql.org/draft/).
[^6]: [Hasura](https://hasura.io/).
[^7]: [Relations dans Hasura](https://hasura.io/learn/graphql/hasura/relationships/).
