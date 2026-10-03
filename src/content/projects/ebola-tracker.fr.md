---
slug: ebola-tracker
title: Ebola Tracker
summary: Un tableau de bord public sur la flambée de virus Ebola Bundibugyo de 2026, en RDC et sur les voies de surveillance voisines.
description: Une carte et un tableau de bord régulièrement mis à jour qui rendent des rapports officiels dispersés plus faciles à lire.
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
links:
  live: https://fottym.github.io/ebola-tracker/
  repository: https://github.com/FottyM/ebola-tracker
---

## Le problème

Lorsqu'une flambée reste locale, il peut être difficile de trouver des informations publiques utiles. Des chiffres importants peuvent rester dans des bulletins PDF dispersés, loin des personnes qui cherchent à comprendre la situation. Je voulais un lieu public où l'information pouvait être trouvée et lue sans devoir chercher dans de nombreux rapports.

J'ai créé Ebola Tracker comme une petite expérience de week-end. Il est depuis devenu un tableau de bord pour la flambée de virus Ebola Bundibugyo de 2026 : la République démocratique du Congo, le contexte de la frontière ougandaise et les évacuations médicales internationales.

## Suivre les données, pas seulement le titre

Toutes les quatre heures, le pipeline consulte les rapports officiels et met les données à jour avec du code classique, sans modèle de langage. Il rassemble les bulletins du ministère de la Santé et de l'INSP en RDC, des données par zone de santé, ainsi que des vérifications d'organisations comme l'OMS et Africa CDC.

Les chiffres de la RDC restent séparés des évacuations médicales internationales. C'est important : le soin d'un patient ailleurs ne doit pas donner l'impression que la flambée s'y est déplacée.

Le tableau de bord affiche clairement la source et l'heure de la dernière mise à jour. Sa carte peut passer du pays à la province puis à la zone de santé. Des résumés de situation, des chronologies de flambée et des graphiques démographiques rendent les chiffres plus lisibles sur téléphone comme sur grand écran.

## Une petite surface publique, des données traitées avec soin

Le site public fonctionne sur GitHub Pages sans serveur applicatif en production. GitHub Actions assure la mise à jour planifiée. La validation, les instantanés, la détection des changements et les contrôles de restauration empêchent un bulletin indisponible ou incohérent de remplacer silencieusement le dernier jeu de données fiable.
