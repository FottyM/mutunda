---
title: Déplacer mutunda.me de Next.js vers Astro
description: Pourquoi j'ai remplacé mon portfolio Next.js par Astro, des textes versionnés et un système de design pensé pour la lecture.
date: 2026-10-03
tags:
  - astro
  - architecture
  - blogging
draft: false
locale: fr
slug: moving-mutunda-me-from-nextjs-to-astro
---

![Une fenêtre de navigateur franchit le premier obstacle vers un système de publication plus calme.](/images/writing/mutunda-nextjs-to-astro-cover.png)

Tout a commencé par une petite question un peu gênante : où mettre mes textes ?

dev.to semblait être une réponse évidente. Des développeurs s'y rendent déjà pour lire, et je n'ai pas encore mon propre public. Mais j'avais aussi un domaine et un ancien portfolio qui avait fini par ressembler à une pièce fermée. C'était une page unique construite avec Next.js 12, React 18 et Emotion. Elle présentait mon expérience et mes technologies, mais elle contenait aussi du texte provisoire et aucun vrai endroit pour publier un article.

Avant d'envoyer quelqu'un vers mes textes, il me fallait un endroit qui mérite de les accueillir.

## Pourquoi Astro

Rien dans ce site ne demandait une application React complète. Je voulais publier des articles, une biographie et des notes sur mes projets. Astro convenait à ce travail parce qu'il ne se met pas en travers du chemin. Je peux écrire une page en MDX, construire le site et la publier. Je n'ai pas besoin d'ajouter des systèmes autour d'un portfolio personnel.

Next.js peut très bien faire ce travail. Il ne s'agissait pas de fuir un mauvais outil. Je voulais qu'ajouter un article ressemble à l'ajout d'un article, et non à la modification d'une application. Astro crée des pages statiques que les moteurs de recherche peuvent lire. S'il faut un jour générer des pages côté serveur, Astro le permet aussi. Pour l'instant, le site n'en a pas besoin.

## Les besoins que je n'avais pas

Il est facile de préparer une grande expédition alors qu'une bonne paire de chaussures suffit. Refaire un portfolio peut appeler un CMS sans tête, une base de données, une recherche, un tableau de bord et assez de pièces mobiles pour faire disparaître le problème initial sous elles.

Ce n'était pas une description honnête de ce site. Il me fallait une page d'accueil durable, des notes de projet, des articles, des URL stables et un moyen de les modifier sans rouvrir une machine à moitié oubliée des mois plus tard. L'écrire a changé la question. J'ai cessé de chercher quel frontend était le meilleur et j'ai commencé à chercher ce qui rendrait la publication simple et garderait mon travail portable.

La sortie statique et Markdown répondaient à l'essentiel. Il reste du JavaScript là où il est utile. Le site mémorise un thème, change de langue, ouvre une palette de commandes et passe d'une page à l'autre sans redémarrer complètement. Mais les mots, la navigation et la lecture arrivent d'abord.

## Donner au site de la place pour grandir

Le nouveau site sépare les textes, les projets et la page à propos. Chaque élément a ainsi de la place. Un projet n'est plus un nom à côté d'un logo technique. Il peut contenir le problème, les décisions et ce que j'ai appris. Un article a une adresse stable et une place dans les archives.

Le contenu vit dans des fichiers Markdown. Les collections de contenu d'Astro vérifient les métadonnées lors de la construction du site. Git correspond à ma façon de travailler. Je peux relire une modification, retrouver une ancienne version et emporter mes textes ailleurs si besoin. Un fichier Markdown ne promet pas une migration sans effort, mais il évite que les mots restent enfermés dans une seule interface.

Cette petite vérification s'est déjà montrée utile. Un titre manquant ou une mauvaise date font échouer la construction près de la modification qui les a causés. Je préfère rencontrer ce problème avant la publication.

## Un thème fait pour lire

Je voulais que le design ressemble à un journal de terrain technique. Cela a donné une typographie éditoriale, de petites annotations, des filets fins et assez d'espace pour un texte plus long. Cela a aussi donné au site une limite utile. Il n'avait pas besoin d'avoir l'air neuf pour le plaisir d'avoir l'air neuf. Il devait rendre la lecture agréable.

Les variables partagées et le guide de style empêchent les pages de dériver à mesure que le site grandit. J'ai prévu de la place pour le code, gardé le texte à une largeur confortable et rendu la navigation utilisable au clavier. Les thèmes clair, sombre et système mémorisent le choix du visiteur. Le site propose aussi des routes en anglais, en français et en estonien. Les liens et les métadonnées demandent donc autant de soin que les paragraphes traduits.

## Vérifier plus que la construction

Un site statique peut tout de même se casser. Une page peut être construite avec un lien brisé, un brouillon peut se glisser dans les archives et une route traduite peut mener discrètement au mauvais endroit. Le projet vérifie Astro et TypeScript, construit le site, vérifie les liens et couvre les principaux parcours dans un navigateur : naviguer, changer de langue, conserver un thème et retrouver son chemin depuis une page absente. Le flux RSS et le plan du site sont créés pendant la construction, et non ajoutés à la fin.

Je n'ai pas de victoire de performance à vendre ici. Je n'ai pas mesuré l'ancien site contre le nouveau. Le nom d'un framework n'est pas une preuve. J'ai plutôt un site plus simple à publier, plus facile à reprendre et prêt à accueillir le travail que je veux partager.

## Une décision éditoriale

Déplacer le site n'était pas seulement un rangement technique. L'ancienne page unique faisait passer les textes et les projets au second plan. Maintenant, un article peut être bref quand il le doit, ou prendre son temps quand le sujet le mérite. Un projet peut montrer ses compromis plutôt que finir en ligne parfaite dans une liste.

J'ai laissé de côté ce qui ne résolvait pas un vrai problème, notamment un CMS avec base de données et un service de recherche. Le but n'était pas un catalogue d'outils et de titres. Je voulais un endroit qui montre ma façon d'aborder le travail.

## La place de dev.to

Je compte toujours utiliser dev.to pour être découvert. Je publierai d'abord sur mutunda.me, puis je republierai certains textes avec un lien canonique vers l'original. Posséder un domaine ne crée pas un public. Cela me donne au moins un endroit cohérent pour garder mon travail pendant que je le construis.

La suite raconte le déplacement du site fini de Vercel vers Cloudflare Workers : [de Vercel vers Cloudflare Workers](/fr/writing/moving-mutunda-me-from-vercel-to-cloudflare-workers/).
