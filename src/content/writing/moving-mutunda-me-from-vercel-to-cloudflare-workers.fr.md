---
title: Déplacer mutunda.me de Vercel vers Cloudflare Workers
description: Une note de migration sur Cloudflare Workers, les aperçus et le DNS.
date: 2026-10-04
tags:
  - astro
  - livraison
  - architecture
draft: false
locale: fr
slug: moving-mutunda-me-from-vercel-to-cloudflare-workers
---

![Des pages statiques franchissent un obstacle vers une passerelle dans le nuage.](/images/writing/mutunda-vercel-to-cloudflare-cover.png)

Le chemin de Vercel vers Cloudflare Workers a commencé par un signe auquel je ne faisais pas confiance. Vercel construisait le site avec succès, mais GitHub marquait le déploiement comme échoué. Le problème ne venait pas de la construction Astro. Deux contrôles externes avaient atteint la limite du forfait Hobby de Vercel.

Une construction verte et un statut de publication rouge forment une mauvaise énigme. Le nouveau site avait-il atteint le domaine public ? Y avait-il un aperçu à vérifier ? L'échec venait-il de mon code ou seulement d'une limite de compte ? Je ne voulais pas que chaque publication commence ainsi.

Cloudflare était déjà un terrain connu. Je l'utilise pour d'autres projets, donc les outils et les tableaux de bord ne ressemblaient pas à un autre royaume avec ses propres coutumes étranges. L'expérience développeur était plus claire et plus agréable pour le travail que je voulais faire. Le forfait gratuit donnait aussi plus de place à ce petit site au moment de la migration. Cela peut changer, mais c'était important à ce moment-là.

Cloudflare réunit aussi le DNS, la protection contre les attaques par déni de service et d'autres contrôles de sécurité à la périphérie. Un site personnel n'a pas besoin d'une forteresse, mais il est bon de savoir que les murs existent. Je voulais surtout une plateforme adaptée à mon travail et un chemin lisible entre un commit Git et une page publique.

## Ce que je publiais vraiment

Astro écrit le site fini dans `dist` : HTML, CSS, JavaScript, images, flux RSS et plan du site. Ce dossier est ce qui est publié. Il n'y a pas de serveur applicatif à maintenir ni de base de données à déplacer. Cloudflare Workers diffuse le site construit.

L'ensemble est assez simple pour que je le garde en tête. GitHub contient le code source. `npm run build` crée le site. `dist` est l'artefact publié. Le Worker le rend disponible. Le site mémorise encore les thèmes, change de langue et ouvre une palette de commandes, mais la page reste utile avant l'arrivée de ces éléments.

## Un nom de Worker n'est pas un nom de domaine

La première difficulté était une erreur de nom. J'avais appelé le Worker `mutunda.me`, et Wrangler l'a refusé. Les noms de Worker utilisent des lettres minuscules, des chiffres et des tirets. Un point appartient à un domaine, pas au nom d'un Worker.

Le Worker est donc devenu `mutunda`, tandis que `mutunda.me` est resté l'adresse utilisée par les visiteurs. Les deux noms se ressemblent assez pour être confondus, mais ils appartiennent à des parties différentes du système. Le Worker exécute le site. Le DNS dirige le domaine vers lui. Le noter a rendu la suite de la migration moins glissante.

La commande de configuration de Cloudflare pouvait détecter Astro et proposer des valeurs par défaut. Elle ne pouvait pas connaître tous les détails de ce projet. J'ai gardé la configuration dans le dépôt et vérifié les valeurs générées avant qu'elles ne deviennent une partie de la publication.

## La construction et l'artefact

Cloudflare Workers Builds exécute le familier `npm run build`, puis Wrangler publie le résultat. J'ai gardé la construction en un seul endroit. Construire une nouvelle fois pendant la publication aurait rendu le chemin plus difficile à suivre et aurait pu produire un artefact différent de celui déjà vérifié.

Le dépôt indique les versions de Node prises en charge, et Cloudflare enregistre la version choisie dans le journal de construction. Le fichier de verrouillage, le gestionnaire de paquets et la version de Node font autant partie d'une construction prévisible que le framework. Le journal signalait aussi le script après installation de `esbuild`. Il était attendu, mais je préfère savoir qu'il a été exécuté plutôt que le laisser disparaître dans le bruit.

## L'URL d'aperçu manquante

Les aperçus comptaient parce qu'une grande partie de ce site est visuelle. Une illustration d'article, une mise en page sur petit écran, un sélecteur de langue et une transition de page demandent un navigateur, pas seulement une comparaison de fichiers.

Le premier aperçu s'est construit avec succès mais ne donnait aucune URL utilisable pour ce commit. Le site existait, mais il n'y avait aucun endroit où le visiter. La configuration avait besoin d'un bloc `previews` et de `preview_urls: true`. Le réglage correspondant des URL de version devait aussi être activé pour le Worker. Une fois ces éléments réunis, le commit suivant a reçu un véritable aperçu.

J'ai aussi limité Cloudflare Access aux aperçus. Le travail sur les branches reste privé, tandis que le site public reste public. Cette petite frontière comptait pour moi.

## Le DNS fait partie de la publication

Le DNS a demandé plus de soin que la construction. La zone contenait des enregistrements pour des services sans rapport avec le portfolio, notamment le courrier électronique. Ils sont restés en place. J'ai retiré uniquement les anciens enregistrements qui dirigeaient le site, puis j'ai relié le nom de domaine public au nouveau Worker.

Une zone DNS est une petite carte avec des enregistrements qui servent des objectifs différents. J'ai vérifié que l'ancienne route avait disparu et que la nouvelle existait avant d'attendre que le résultat public la rattrape. La migration ne demandait pas d'effacer la carte et de la dessiner à nouveau.

## Garder un chemin de retour

Je voulais pouvoir revenir en arrière tant que la migration était récente. Le code source est resté dans GitHub. La construction fonctionnait toujours en local. J'ai identifié les anciens enregistrements de routage avant de les retirer. Si le Worker n'avait pas fonctionné, j'aurais pu restaurer l'ancienne route au lieu de reconstruire toute la zone.

Cette retenue comptait parce qu'un tableau de bord est toujours prêt à configurer plus qu'une petite migration ne le demande. Je voulais que chaque changement reste limité et explicable.

Le résultat est un chemin de publication plus calme. GitHub contient le code source, Astro crée l'artefact, le Worker `mutunda` le publie et le DNS dirige le domaine public vers lui. Les pull requests peuvent recevoir des URL d'aperçu protégées. Cloudflare a ses propres aspérités, mais chaque partie a maintenant un rôle distinct. C'est tout ce que je voulais : moins d'énigmes entre un article terminé et le moment où il peut être lu.

Cette note est la seconde partie de la migration. La première explique pourquoi j'ai déplacé le site de Next.js vers Astro : [de Next.js vers Astro](/fr/writing/moving-mutunda-me-from-nextjs-to-astro/).
