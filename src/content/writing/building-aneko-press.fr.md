---
slug: building-aneko-press
title: "Construire un lecteur hors ligne pour Aneko Press : d'un lit avec YouTube à une architecture conçue pour durer"
description: "Comment une application officielle défaillante, un cadeau Pixel inattendu et des envies d'écoute au coucher ont donné naissance à une application mobile conçue pour durer."
date: 2026-10-06
tags:
  - mobile
  - audio
  - reflexion
draft: true
cover:
  src: ../../assets/images/writing/building-aneko-press-cover.png
  alt: Une illustration abstraite Memphis du milieu du siècle d'un smartphone incliné avec des ondulations d'ondes acoustiques, des livres classiques flottants et des cubes de données géométriques sur une surface crème chaleureuse.
locale: fr
---

J'ai découvert Aneko Press[^1] sur YouTube[^2] tout à fait par hasard, en cherchant des livres chrétiens.

Au début, j'écoutais quelques enregistrements en fond sonore pendant que je travaillais la journée. Cela fonctionnait assez bien. Les difficultés ont commencé lorsque j'ai voulu écouter avant de dormir et dans mon lit.

Laisser YouTube tourner sur un téléphone dans une chambre sombre est une expérience pénible. L'écran reste allumé et illumine toute la pièce, et dès que l'affichage se met en veille, la lecture s'interrompt à moins de payer un abonnement.

J'ai remarqué qu'Aneko Press avait une application mobile officielle. Je l'ai installée en espérant un véritable lecteur, mais l'application était *terrible*. Elle diffusait les pistes directement depuis SoundCloud. Parfois cela fonctionnait; parfois elle s'arrêtait tout simplement au milieu d'une phrase. Elle était si peu fiable qu'ils ont fini par la retirer complètement du Google Play Store.

J'étais déjà un adepte d'Audible, mais payer des crédits d'abonnement mensuels pour des livres du domaine public qu'Aneko mettait gratuitement à disposition sur YouTube était exclu pour moi. Des années ont passé. L'envie d'écouter ces enregistrements ne m'a jamais quitté, mais je n'avais toujours aucun moyen décent d'en profiter.

## Un cadeau inattendu

Vers cette période, j'ai acheté un téléphone Google Pixel.[^3] Dans le cadre de cet achat, Google offrait un an d'abonnement gratuit à Gemini Advanced.

C'était un cadeau inattendu, et au début, je n'avais aucune idée de ce que j'allais en faire. Puis une pensée m'a traversé l'esprit: <mark>je pouvais utiliser ce cadeau gratuit pour offrir quelque chose au monde</mark>.

J'ai ouvert Excalidraw,[^4] esquissé l'interface que j'attendais depuis des années, et confié les dessins à Gemini pour commencer à monter la structure de l'application.

La première version était mauvaise. Je l'ai jetée et j'ai recommencé. Quand j'ai commencé, je pensais que tout cela prendrait deux ou trois semaines. En réalité, cela a pris des mois, rythmés par de longues pauses quand la vie prenait le dessus. Ce qui n'était au départ qu'un bouton de lecture et de pause rudimentaire a grandi pas à pas, écran par écran et commit par commit, pour devenir une application complète.

## Construire pour les sens

Lorsque vous développez un logiciel pour votre propre usage, vous ne vous souciez pas des listes de fonctionnalités superflues. Vous vous souciez des détails sensoriels qui vous donnent envie d'ouvrir l'application chaque jour.

Trois aspects comptaient par-dessus tout pour moi:

Premièrement, les habitudes quotidiennes. J'ai ajouté des séries de lecture et des trophées, car maintenir un rythme régulier avec la littérature classique demande de la constance. Voir la série se maintenir a donné à cette habitude un élan paisible.

Deuxièmement, l'ambiance sonore au coucher. Écouter une voix nue dans une chambre silencieuse peut sembler rude. Je voulais une ambiance sonore discrète (un piano délicat, une pluie douce ou des cordes chaleureuses) superposée sous la voix du narrateur pour que la chambre reste paisible. Faire jouer ces deux flux en harmonie, en laissant l'ambiance sonore en retrait sans écraser le récitant ni encombrer l'écran de verrouillage, est devenu l'une de mes parties préférées de tout le lecteur.

Troisièmement, les trajets. J'écoute en voiture tout aussi souvent qu'avant de dormir. J'ai connecté le lecteur directement à Apple CarPlay et Android Auto pour qu'en montant dans le véhicule, le chapitre reprenne aussitôt sur le tableau de bord sans avoir à manipuler les menus du téléphone ou le Bluetooth.

## Couper le cordon

La version initiale n'était qu'une interface mobile avec une base de données locale pour enregistrer les chapitres hors ligne. Mais s'en remettre directement à SoundCloud a vite montré ses limites.

Les flux RSS publics étaient plafonnés à cinq cents pistes, ce qui faisait disparaître les livres les plus anciens. Les descriptions manquaient de cohérence, l'ordre des pistes était mélangé et presque chaque balise d'auteur était générique.

J'ai compris que pour bâtir une bibliothèque véritablement durable, l'application ne pouvait pas dépendre des caprices d'un service d'hébergement externe. J'ai déployé un Cloudflare Worker comme middleware pour agréger l'intégralité du catalogue au-delà des plafonds de SoundCloud. Quand les descriptions étaient tronquées, j'ai eu recours à l'OCR visuel pour lire les couvertures et reconstituer les signatures des auteurs.

Aujourd'hui, l'application mobile ne sait même plus que SoundCloud existe. Elle ne communique qu'avec Cloudflare. Même si la plateforme d'origine fermait demain, chaque livre, chaque chapitre et chaque couverture continuerait de fonctionner sans broncher.

## Perspectives

Ce qui a commencé par une simple frustration personnelle face à un écran allumé au lit a pris une ampleur inattendue.

À mesure que le lecteur prenait forme, j'ai commencé à me renseigner plus en profondeur sur Aneko Press : leur identité, leurs publications et leur public réel. J'ai découvert que leurs livres audio touchent bien plus que des auditeurs du coucher, desservant des personnes aux connexions intermittentes, des régions en développement et des aumôneries de prisons. Ces recherches ont fondamentalement transformé le projet. Elles ont donné naissance au document d'architecture et ont fait d'un outil privé une plateforme de diffusion hors ligne résiliente, conçue pour fonctionner partout.

Après avoir achevé l'application, j'ai contacté l'équipe d'Aneko Press pour leur montrer ce que j'avais créé. Cette conversation sera le sujet d'un autre récit; pour l'instant, il me reste encore à publier l'application auprès du public.

Un cadeau reçu, et un cadeau partagé à son tour.

> « Que chacun emploie le don selon qu'il a reçu, au service des autres, comme de bons dispensateurs des diverses grâces de Dieu. » (1 Pierre 4:10, OST)

## Notes

[^1]: Aneko Press publie de la littérature chrétienne classique et des livres audio: [anekopress.com](https://anekopress.com).
[^2]: Chaîne Aneko Press sur YouTube: [youtube.com/@Anekopress/videos](https://www.youtube.com/@Anekopress/videos).
[^3]: Gamme de smartphones Google Pixel: [store.google.com/category/phones](https://store.google.com/category/phones).
[^4]: Tableau blanc virtuel Excalidraw: [excalidraw.com](https://excalidraw.com).
