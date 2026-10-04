---
title: Comment mon amour pour GraphQL est tombé de la falaise
description: D'un tutoriel de Net Ninja aux filtres LoopBack, au débogage de GraphQL en production et à un bref coup d'œil à Hasura.
date: 2026-10-04
tags:
  - graphql
  - architecture
  - debogage
draft: false
cover:
  src: ../../assets/images/writing/graphql-over-the-cliff-cover.png
  alt: Une feuille de requêtes stylisée basculant d'une falaise vers un réseau de conduits et de nœuds de service.
locale: fr
slug: graphql-over-the-cliff
---

Je me souviens d'une requête en apparence inoffensive. Une page d'environ vingt entités, chacune dotée d'extensions effectuant environ cinq requêtes vers un autre service. La version mise en production a subi une panne d'épuisement de mémoire (OOMKill), et nous avons fini par utiliser `p-limit`.

À cette époque, je trouvais déjà la configuration de production singulière. Il y avait de la couture de schémas (stitching), de la délégation, des points d'extension, des fragments et DataLoader. Une petite requête pouvait m'imposer un long chemin de lecture avant de comprendre ce qui se passait.

C'était bien loin de ce qui m'avait d'abord attiré vers GraphQL.

## Avant tout cela, j'adorais ça

Vers 2018, j'ai suivi un tutoriel de [Net Ninja](https://www.youtube.com/watch?v=Y0lDGjwRYKw&list=PL4cUxeGkcC9iK6Qhn-QLcXCXPQUov1U7f) et j'ai adoré GraphQL. Choisir des champs et interroger des données imbriquées était très agréable. Je pouvais décrire ce que je voulais et obtenir cette forme exacte en retour.

Puis j'ai décroché un poste utilisant LoopBack, le framework d'IBM/StrongLoop. Il nous permettait de définir des modèles rattachés à une base de données et de passer des filtres dans la chaîne de requête. Nous pouvions choisir les champs et inclure des relations.

Voici une requête LoopBack 3 illustrative, et non du code issu de ce poste. Supposons un modèle `Post` doté d'une relation configurée `category` :

```js
const filter = {
  where: { published: true },
  fields: { id: true, title: true, categoryId: true },
  include: { relation: "category" },
  limit: 10,
};

const params = new URLSearchParams({
  filter: JSON.stringify(filter),
});
const response = await fetch(`/api/posts?${params}`);
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const posts = await response.json();
```

Le filtre sélectionne les articles publiés, demande des champs spécifiques et inclut la catégorie. J'ai conservé `categoryId` parce que charger une relation peut exiger sa clé de liaison.[^1]

Cela couvrait déjà une partie de ce qui m'avait séduit dans GraphQL. C'était un filtre sur une requête HTTP, et pour ces besoins, je trouvais cela bien suffisant.

Dans notre infrastructure, nous pouvions aussi interroger et filtrer des modèles entre plusieurs services. Je me rappelle que Strong Remoting entrait en jeu. Le connecteur distant de LoopBack l'utilise pour appeler des méthodes de modèle exposées dans une autre application LoopBack, bien que je ne puisse reconstituer notre câblage exact à partir de ce seul souvenir.[^2]

J'ai mentionné LoopBack 3 et 4 en racontant cette histoire, mais il ne faut pas les mélanger ici. Ce connecteur distant ne prend explicitement pas en charge LoopBack 4.[^2]

## De retour dans une architecture de production

Quand je suis revenu à GraphQL dans un autre emploi, nous utilisions Apollo côté interface et GraphQL Yoga côté serveur. C'est là que j'ai trouvé l'agencement étrange : couture de schémas, délégation, extensions, fragments, et tout le travail nécessaire pour suivre une requête à travers eux.

Même vérifier si une requête avait réussi demandait plus d'attention. Dans notre configuration, les requêtes étaient des POST, et un code HTTP 200 pouvait contenir des erreurs ou seulement une partie des données demandées.

Avec `fetch`, vérifier `response.ok` ne contrôle que le statut HTTP. Cela n'inspecte pas les erreurs GraphQL.[^3] Après cette vérification, un client qui refuse les résultats partiels a besoin de quelque chose comme ceci :

```js
const result = await response.json();

if (result.errors?.length) {
  throw new Error(result.errors.map((error) => error.message).join("; "));
}

return result.data;
```

C'est une politique possible, pas la seule. Un écran peut vouloir afficher les parties réussies, auquel cas il doit conserver à la fois les données et les erreurs. GraphQL autorise des erreurs d'exécution aux côtés de données partielles.[^4]

De même, chaque défaillance GraphQL ne renvoie pas un code 200, et chaque requête n'exige pas un POST. Ces détails dépendent de la défaillance et de la gestion HTTP.[^5] Mon grief porte sur l'environnement dans lequel je travaillais : le statut seul ne me disait pas assez de choses, et je devais inspecter davantage d'éléments avant de savoir ce qui avait échoué.

Et je devais encore trouver où cela avait échoué.

## Suivre la requête en apparence inoffensive

C'est ici que cette page de vingt entités revient dans l'histoire. La requête était courte. Le travail dissimulé derrière ses champs d'extension n'était pas évident à la lecture.

Pour illustrer le genre d'indirection dont je parle, voici un résolveur de délégation GraphQL Tools simplifié. Ce n'est pas notre code de production. Il montre comment un champ peut transférer le travail à un schéma sous-jacent :

```js
// resolvers.js
import { delegateToSchema } from "@graphql-tools/delegate";

export const resolvers = {
  Query: {
    page: (_parent, args, context, info) =>
      delegateToSchema({
        schema: subschema,
        operation: "query",
        fieldName: "entity",
        args,
        context,
        info,
      }),
  },
  Entity: {
    extras: (entity) =>
      Promise.all(extraClients.map((client) => client(entity.id))),
  },
};
```

Cet extrait suppose un sous-schéma distant configuré qui expose `entity`. La délégation transmet le travail à ce schéma sous-jacent ; un résolveur d'extension peut ensuite y ajouter son propre travail.[^6] Apollo et Yoga décrivent les parties client et serveur de notre infrastructure, et non chaque étape franchie par la requête entre son arrivée et le retour du résultat.

Supposons que l'extension fasse appel à cinq clients de service pour chaque entité renvoyée. C'est ainsi qu'une page de vingt entités peut planifier cent appels en aval, avant même de compter la requête initiale vers le schéma amont.

Notre mise en production a subi une panne d'épuisement de mémoire, et nous avons utilisé `p-limit` pour réguler la concurrence. Un résolveur d'extension illustratif pourrait partager un limiteur ainsi :

```js
// En dehors du résolveur, partagé au sein de ce processus.
const limit = pLimit(5);

// À l'intérieur du résolveur d'extension.
return Promise.all(
  extraClients.map((client) => limit(() => client(entity.id))),
);
```

Les appels ont toujours lieu. Cela limite le nombre d'opérations exécutées simultanément ; cela ne les regroupe pas par lots et ne réduit pas leur quantité. Le plafond est partagé par les tâches utilisant ce limiteur dans ce processus, et non par chaque serveur d'un déploiement.[^7]

Je n'ai pas ici de profil mémoire démontrant la cause exacte de notre panne. Ces extraits expliquent la dispersion des appels et le contrôle de concurrence, pas l'incident dans son intégralité.

Mais c'est la partie qui me frustre. Pour comprendre un seul champ, je me retrouve à examiner une requête amont, un résolveur délégué, une extension et des appels vers un autre service. La requête initiale en façade ne me donne presque aucun indice sur cet itinéraire.

DataLoader est un autre élément à comprendre dans cette même configuration. Il peut regrouper les chargements par lots et mettre en cache les résultats au sein d'une instance, mais cela ne signifie pas que chaque appel en aval est automatiquement regroupé. Sa documentation recommande des instances cantonnées aux requêtes individuelles.[^8]

Je dois savoir où nous l'avons employé, tout comme je dois savoir où nous avons cousu des schémas ou ajouté des points d'extension. Quand un problème survient, ces détails cessent d'être de simples choix d'implémentation d'arrière-plan.

## Et il y a eu d'autres incidents

Je me rappelle un champ qui fuyait dans une autre requête parce que nous n'avions pas configuré les choses correctement. Il y avait aussi des énumérations avec les mêmes valeurs mais des noms différents. Le résultat n'apparaissait pas tant que je ne faisais pas ce que j'ai décrit comme un « retri de types ». Je n'ai pas le correctif exact sous les yeux, donc je ne prétendrai pas savoir s'il s'agissait d'un changement de typage ou d'une correspondance à l'exécution.

Voilà les expériences qui nourrissent mon avis. Je trouve qu'une API REST avec des statuts utiles et un filtrage suffisant est plus facile à appréhender. REST peut dissimuler du travail lui aussi, mais je n'ai pas eu le sentiment d'avoir besoin de toute cette délégation pour obtenir le filtrage et les relations que je souhaitais.

J'ai le sentiment que de meilleurs services, la mise en cache et les réseaux modernes ont répondu à bon nombre des problèmes que GraphQL était censé résoudre. Pendant ce temps, travailler avec cette configuration est devenu un cauchemar pour moi. Je ne l'aime vraiment plus du tout. Je le déteste.

Il y a un autre aspect dans cette histoire : notre outil interne inspiré de Hasura. Je le déteste aussi, et il pèse lourd dans ce que je ressens envers GraphQL. Mais c'est une histoire pour un autre jour.

C'est cet outil qui m'a poussé à aller voir Hasura lui-même. Et, après un bref coup d'œil, j'ai adoré.

Je ne sais toujours pas si cela venait de mon attachement aux filtres LoopBack ou de la simplicité de ce que j'ai vu. Je n'y avais jeté qu'un regard rapide, mais cela m'a plu.

## Notes

[^1]: LoopBack 3 : [interroger des données](https://loopback.io/doc/en/lb3/Querying-data.html) et [inclure des relations en conservant les clés de liaison](https://loopback.io/doc/en/lb3/Include-filter.html).
[^2]: [Connecteur distant LoopBack](https://github.com/strongloop/loopback-connector-remote), incluant son utilisation de Strong Remoting et son absence de support pour LoopBack 4.
[^3]: [Standard Fetch : propriété `ok`](https://fetch.spec.whatwg.org/#dom-response-ok).
[^4]: [Spécification GraphQL : réponse](https://spec.graphql.org/September2025/#sec-Response).
[^5]: [Brouillon GraphQL over HTTP](https://graphql.github.io/graphql-over-http/draft/) : méthodes, types MIME de réponse et gestion des statuts.
[^6]: GraphQL Tools : [sous-schémas distants](https://the-guild.dev/graphql/stitching/docs/getting-started/remote-subschemas) et [extensions de schéma](https://the-guild.dev/graphql/stitching/docs/approaches/schema-extensions).
[^7]: [Documentation de `p-limit`](https://github.com/sindresorhus/p-limit).
[^8]: [DataLoader : regroupement par lots et cache par requête](https://github.com/graphql/dataloader).
