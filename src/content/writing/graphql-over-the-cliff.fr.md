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

Voyons comment mon amour pour GraphQL est tombé de la falaise.

Vers 2018, quand GraphQL commençait à se faire connaître — en fait, je ne sais pas quand ça a commencé —, j'ai suivi un tutoriel de The Net Ninja et j'ai adoré. C'était cool. Pouvoir demander des champs et des données imbriquées, c'était vraiment bien.

Puis j'ai trouvé un emploi en 2018 où on utilisait LoopBack, le framework web d'IBM/StrongLoop. Je parle de LoopBack 3 et 4.

Il proposait ce qu'on pourrait appeler un constructeur de requêtes. On définissait un modèle, un enregistrement, une entité rattachée à une base de données. Dans une requête, on pouvait passer un filtre dans la chaîne de requête de l'URL et récupérer les champs précis qu'on voulait.

À mon avis, ça résolvait déjà certains des problèmes que GraphQL essayait de résoudre.

On pouvait aussi inclure des relations. Dans la configuration sur laquelle je travaillais, on pouvait même interroger et filtrer différents modèles provenant de différents services. Je me souviens que strong-remoting intervenait là-dedans, même si je ne suis pas sûr que ce soit le bon nom pour la partie qui permettait ça.

Récemment, je suis revenu à GraphQL à cause d'un nouvel emploi où ils l'utilisent partout.

La première chose que j'ai remarquée dans notre configuration, c'est que les requêtes étaient des requêtes POST. Les erreurs n'étaient pas visibles dans le statut HTTP : on recevait un 200, puis des objets d'erreur dans la réponse. Parfois, on avait une réussite partielle.

Ensuite, il y a la délégation de schémas, l'assemblage de schémas et DataLoader. Pour moi, ça fait beaucoup.

Les requêtes ont généralement l'air inoffensives. On voit une petite requête, mais en interne, il peut y avoir davantage de filtrage, davantage de champs, de l'assemblage de schémas et de la délégation de schémas. Ça devient le bazar quand il faut déboguer et comprendre ce qui va où.

Parfois, ça prend beaucoup de temps par rapport à une requête d'API REST bien faite qui donne un statut utile. Et si le système de filtrage est assez bon, je n'ai pas l'impression d'avoir besoin de toute cette délégation magique.

J'ai l'impression que beaucoup des problèmes que GraphQL essayait de résoudre ont déjà été réglés par de meilleurs services, de la mise en cache et de meilleures communications réseau. Travailler avec est devenu un cauchemar pour moi. Vraiment, je ne l'aime plus. Je le déteste.

Mais ensuite, j'ai regardé Hasura juste une seconde, et j'ai adoré.

Maintenant, je ne sais pas si c'est à cause de mon amour pour les filtres LoopBack ou simplement de la simplicité de ce que j'ai vu. Je ne sais pas encore pourquoi j'aime Hasura.
