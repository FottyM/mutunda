---
title: Comment mon amour pour GraphQL est tombé de la falaise
description: D'un tutoriel de The Net Ninja aux filtres LoopBack, au débogage de GraphQL au travail et à un bref coup d'œil à Hasura.
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

Je me souviens d'une requête stupide : une page d'environ 20 entités, et chaque entité avait une extension qui faisait quelque chose comme cinq requêtes vers un autre service. La version mise en production a épuisé la mémoire, et on a dû corriger ça avec p-limit. Bon sang, je déteste GraphQL.

Vers 2018, quand GraphQL commençait à se faire connaître,  en fait, je ne sais pas quand ça a commencé,, j'ai suivi un tutoriel de The Net Ninja et j'ai adoré. C'était cool. Pouvoir demander des champs et des données imbriquées, c'était vraiment bien.

Puis j'ai trouvé un emploi en 2018 où on utilisait LoopBack, le framework web d'IBM/StrongLoop. Je parle de LoopBack 3 et 4.

Il proposait ce qu'on pourrait appeler un constructeur de requêtes. On définissait un modèle, un enregistrement, une entité rattachée à une base de données. Dans une requête, on pouvait passer un filtre dans la chaîne de requête de l'URL et récupérer les champs précis qu'on voulait.

À mon avis, ça résolvait déjà certains des problèmes que GraphQL essayait de résoudre.

On pouvait aussi inclure des relations. Dans la configuration sur laquelle je travaillais, on pouvait même interroger et filtrer différents modèles provenant de différents services. Je me souviens que strong-remoting intervenait là-dedans, même si je ne suis pas sûr que ce soit le bon nom pour la partie qui permettait ça.

Récemment, je suis revenu à GraphQL à cause d'un nouvel emploi où ils l'utilisent partout.

La première chose que j'ai remarquée dans notre configuration, c'est que les requêtes étaient des requêtes POST. Les erreurs n'étaient pas visibles dans le statut HTTP : on recevait un 200, puis des objets d'erreur dans la réponse. Parfois, on avait une réussite partielle.

Ensuite, il y a la délégation de schémas, l'assemblage de schémas et DataLoader. Pour moi, ça fait beaucoup.

Les requêtes ont généralement l'air inoffensives. On voit une petite requête, mais en interne, il peut y avoir davantage de filtrage, davantage de champs, de l'assemblage de schémas et de la délégation de schémas. Ça devient le bazar quand il faut déboguer et comprendre ce qui va où.

Il y a eu un autre incident où un champ se retrouvait dans une autre requête parce qu'on avait mal configuré les choses. Et puis il y avait des enums avec les mêmes valeurs mais des noms différents. Le résultat ne s'affichait même pas avant que j'ajuste le typage ou le mapping des enums. C'est comme ça que je m'en souviens ; je n'ai pas la correction exacte sous les yeux.

Parfois, ça prend beaucoup de temps par rapport à une requête d'API REST bien faite qui donne un statut utile. Et si le système de filtrage est assez bon, je n'ai pas l'impression d'avoir besoin de toute cette délégation magique.

J'ai l'impression que beaucoup des problèmes que GraphQL essayait de résoudre ont déjà été réglés par de meilleurs services, de la mise en cache et de meilleures communications réseau. Travailler avec est devenu un cauchemar pour moi. Vraiment, je ne l'aime plus. Je le déteste.

### Note technique : filtres et champs

LoopBack 3 accepte un paramètre de requête `filter` encodé en JSON ; `where` filtre les enregistrements, `fields` sélectionne les propriétés et `include` charge les relations définies.[^1][^2][^3] Sélectionner des champs tout en incluant une relation peut nécessiter de garder les clés de relation : l'exemple `belongsTo` de la documentation conserve `categoryId`.[^3] LoopBack 4 documente la même précaution.[^4]

Voici un exemple illustratif avec `fetch` dans le navigateur, pas du code tiré de mon travail. Il suppose un modèle `Post` de LoopBack 3 avec les champs indiqués et une relation `category` configurée. Les identifiants sont conservés volontairement.

```js
async function getPosts() {
  const filter = {
    where: { published: true },
    fields: { id: true, title: true, categoryId: true },
    include: { relation: "category", scope: { fields: ["id", "name"] } },
    limit: 10,
  };
  const params = new URLSearchParams({ filter: JSON.stringify(filter) });
  const response = await fetch(`/api/posts?${params}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
```

### Note technique : le rôle de strong-remoting

Ce souvenir est plausible : `strong-remoting` expose des méthodes JavaScript via des adaptateurs de transport, et `loopback-connector-remote` l'utilise explicitement pour appeler les méthodes de modèles exposées par une autre application LoopBack.[^5][^6] C'est différent de `loopback-connector-rest`, qui encapsule d'autres API REST avec des opérations sur les ressources ou des modèles de requêtes.[^7] Ces sources ne permettent pas de savoir quel connecteur notre application utilisait ni comment nous composions ses requêtes entre services.

Dans LoopBack 4, les éléments correspondants sont les contrôleurs HTTP, les repositories pour l'accès aux données et les résolveurs d'inclusion des relations.[^8][^9][^10] Ça ne veut pas dire qu'il partage les mécanismes internes de remoting de LoopBack 3 : le connecteur remote indique explicitement qu'il ne prend pas en charge LoopBack 4.[^6]

### Note technique : réussite HTTP et réussite GraphQL

Le passage sur POST et 200 décrit notre configuration. Le brouillon GraphQL-over-HTTP exige la prise en charge de POST et permet GET pour les requêtes de lecture, pas pour les mutations.[^11] GraphQL distingue les erreurs de requête avant l'exécution (sans `data`) des erreurs d'exécution, qui peuvent accompagner des `data` partielles.[^12] Toutes les erreurs ne donnent pas un 200 : le traitement des statuts HTTP dépend de l'étape où survient l'échec et du type de média de la réponse ; le document HTTP reste un brouillon.[^11]

Avec `fetch`, `response.ok` vérifie seulement si le statut HTTP est compris entre 200 et 299 ; il n'inspecte pas les `errors` de GraphQL.[^13] Ce deuxième exemple illustratif pour le navigateur suppose le schéma indiqué. Il **rejette volontairement les données partielles** dès que `errors` n'est pas vide, même en cas de réussite HTTP. Une interface qui accepte les données partielles doit adopter une autre politique : conserver `data` et `errors` et montrer quelles parties ont échoué.[^12]

```js
async function getPosts() {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/graphql-response+json, application/json",
    },
    body: JSON.stringify({ query: "{ posts { id title category { id name } } }" }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const result = await response.json();
  if (result.errors?.length) {
    throw new Error(result.errors.map(error => error.message).join("; "));
  }
  return result.data;
}
```

Ces extraits montrent la forme des requêtes et les vérifications d'erreurs, pas un filtrage équivalent ni des clients prêts pour la production. La requête GraphQL n'a pas d'arguments de filtrage ou de limite ; ils dépendraient du schéma. L'authentification et la gestion des erreurs dans l'interface sont omises. Une réponse non-2xx est rejetée avant la lecture de son corps ; un client plus complet pourrait aussi conserver les diagnostics du serveur.

### Note technique : le cache de DataLoader

DataLoader regroupe les chargements et mémorise les résultats au sein d'une instance. Sa documentation recommande de créer des instances par requête plutôt que de partager les valeurs en cache entre différents utilisateurs. Ce cache ne remplace pas un cache partagé comme Redis.[^14]

### Note technique : concurrence et nombre de requêtes

`p-limit` limite le nombre d'opérations enveloppées qui s'exécutent en même temps ; il ne les regroupe ni ne les déduplique, donc limiter la concurrence ne supprime pas à lui seul la multiplication des appels de type N+1.[^15] La limite s'applique au travail confié au même limiteur : un limiteur créé par requête entrante borne le travail de cette requête ; un limiteur partagé dans un processus borne le travail qui lui est confié par les requêtes de ce processus, pas celui de tous les serveurs.[^15] Les chiffres et l'incident de mémoire ci-dessus sont mon souvenir, pas un profil mémoire mesuré ni une reconstitution de la cause racine.

### Note illustrative : Hasura derrière Hono

Hasura v2 possède sa propre fonctionnalité Remote Schemas.[^16] Cet exemple place plutôt une **passerelle JavaScript personnalisée** devant Hasura ; il ne prétend pas que Hasura utilise GraphQL Tools en interne.

Ici, `hasura` est un sous-schéma `{ schema, executor }` configuré pour un endpoint Hasura exposant une table `entity`. Le schéma peut venir de l'introspection ou de SDL fourni ; l'exécuteur envoie les opérations en amont.[^17] `stitchSchemas` ajoute `page` et `extras` ; `delegateToSchema` transmet les champs d'entité sélectionnés et `selectionSet` récupère l'identifiant nécessaire à l'extension.[^18] Hono gère HTTP et `graphql()` exécute le schéma assemblé.[^19][^20]

```js
import { Hono } from "hono";
import { graphql } from "graphql";
import { stitchSchemas } from "@graphql-tools/stitch";
import { delegateToSchema } from "@graphql-tools/delegate";
import pLimit from "p-limit";

const limit = pLimit(5);
export function gateway(hasura, extraClients) {
  const schema = stitchSchemas({
    subschemas: [hasura],
    typeDefs: `
      extend type Query { page: [entity!] }
      extend type entity { extras: [String] }
    `,
    resolvers: {
      Query: {
        page: (_, args, context, info) => delegateToSchema({
          schema: hasura, operation: "query", fieldName: "entity",
          args: { limit: 20, order_by: [{ id: "asc" }] }, context, info,
        }),
      },
      entity: {
        extras: {
          selectionSet: "{ id }",
          resolve: (row, args, context) => extraClients.map(client =>
            limit(() => client(row.id, context))),
        },
      },
    },
  });
  const app = new Hono();
  app.post("/graphql", async c => {
    const { query, variables } = await c.req.json();
    return c.json(await graphql({
      schema, source: query, variableValues: variables, contextValue: {},
    }));
  });
  return app;
}
```

`extraClients` est un tableau injecté de cinq clients de services asynchrones, chacun renvoyant une chaîne. `{ page { extras } }` peut donc programmer 100 appels pour 20 lignes, tandis que le limiteur du module autorise cinq appels actifs entre les requêtes d'un même processus. Le reste attend toujours. C'est une illustration, pas une reconstitution de notre incident. Seuls des services de test locaux ont été testés, pas un vrai serveur Hasura. L'extrait omet la configuration amont, l'authentification, les délais d'expiration, le contrôle d'admission et la gestion complète de GraphQL-over-HTTP ; ne l'exposez pas tel quel.

Mais ensuite, j'ai regardé Hasura juste une seconde, et j'ai adoré.

Maintenant, je ne sais pas si c'est à cause de mon amour pour les filtres LoopBack ou simplement de la simplicité de ce que j'ai vu. Je ne sais pas encore pourquoi j'aime Hasura.

## Notes

[^1]: [Querying data](https://loopback.io/doc/en/lb3/Querying-data.html).
[^2]: [Fields filter](https://loopback.io/doc/en/lb3/Fields-filter.html).
[^3]: [Include filter](https://loopback.io/doc/en/lb3/Include-filter.html).
[^4]: [Include filter](https://loopback.io/doc/en/lb4/Include-filter.html).
[^5]: [strong remoting documentation](https://raw.githubusercontent.com/strongloop/strong-remoting/master/README.md).
[^6]: [loopback connector remote documentation](https://raw.githubusercontent.com/strongloop/loopback-connector-remote/master/README.md).
[^7]: [REST connector](https://loopback.io/doc/en/lb3/REST-connector.html).
[^8]: [Controller](https://loopback.io/doc/en/lb4/Controller.html).
[^9]: [Repository](https://loopback.io/doc/en/lb4/Repository.html).
[^10]: [Relations](https://loopback.io/doc/en/lb4/Relations.html).
[^11]: [draft](https://graphql.github.io/graphql-over-http/draft).
[^12]: [September2025](https://spec.graphql.org/September2025).
[^13]: [fetch.spec.whatwg.org](https://fetch.spec.whatwg.org).
[^14]: [dataloader documentation](https://raw.githubusercontent.com/graphql/dataloader/main/README.md).
[^15]: [readme.md](https://raw.githubusercontent.com/sindresorhus/p-limit/main/readme.md).
[^16]: [overview](https://hasura.io/docs/2.0/remote-schemas/overview).
[^17]: [remote subschemas](https://the-guild.dev/graphql/stitching/docs/getting-started/remote-subschemas).
[^18]: [schema extensions](https://the-guild.dev/graphql/stitching/docs/approaches/schema-extensions).
[^19]: [basic](https://hono.dev/docs/getting-started/basic).
[^20]: [graphql](https://www.graphql-js.org/api-v16/graphql).
