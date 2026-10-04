---
slug: ebola-tracker
title: Ebola Tracker
summary: Un tableau de bord public pour suivre la flambée de virus Ebola Bundibugyo 2026 en RDC et dans les zones de surveillance voisines.
description: Une carte et un tableau de bord actualisés régulièrement qui transforment des rapports officiels dispersés en une vue claire de la flambée.
role: Créateur et ingénieur logiciel
year: 2026
featured: true
draft: false
locale: fr
technologies:
  - JavaScript
  - Vite+
  - Leaflet
  - OpenStreetMap
  - TanStack Charts
  - GitHub Actions
cover:
  src: ../../assets/images/projects/ebola-tracker-cover.png
  alt: Vue sur ordinateur de la carte et du tableau de bord de situation Ebola Tracker.
links:
  live: https://fottym.github.io/ebola-tracker/
  repository: https://github.com/FottyM/ebola-tracker
---

## Le problème

Lorsqu'une flambée est locale, les informations publiques utiles sont souvent difficiles à trouver. Des chiffres essentiels restent enfermés dans des bulletins PDF dispersés, loin des personnes qui cherchent à comprendre la situation. Je voulais un espace public où ces données soient accessibles et lisibles sans devoir éplucher des dizaines de rapports.

J'ai créé Ebola Tracker comme une expérience menée sur un week-end. Le projet s'est transformé en un tableau de bord de situation pour la flambée de virus Ebola Bundibugyo 2026 : la République démocratique du Congo, le contexte frontalier ougandais et les routes d'évacuation médicale internationale.

## Suivre les données plutôt que les titres

Toutes les quatre heures, le pipeline vérifie les rapports officiels et actualise les données avec du code standard, sans modèle de langage. Il regroupe les bulletins du ministère de la Santé de la RDC et de l'INSP, les données par zone de santé et les vérifications d'organisations comme l'OMS et Africa CDC.

Les chiffres de la RDC restent séparés des évacuations médicales internationales. C'est important : le soin d'un patient ailleurs ne doit pas donner l'impression que la flambée s'y est déplacée.

Le tableau de bord affiche clairement la source et l'heure de la dernière mise à jour. Sa carte peut passer du pays à la province puis à la zone de santé. Des résumés de situation, des chronologies de flambée et des graphiques démographiques rendent les chiffres plus lisibles sur téléphone comme sur grand écran.

## Une petite surface publique, des données traitées avec soin

Le site public fonctionne sur GitHub Pages sans serveur applicatif en production. GitHub Actions assure la mise à jour planifiée. La validation, les instantanés, la détection des changements et les contrôles de restauration empêchent un bulletin indisponible ou incohérent de remplacer silencieusement le dernier jeu de données fiable.
