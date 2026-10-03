---
slug: ebola-tracker
title: Ebola Tracker
summary: Une carte épidémiologique en direct et un tableau de bord de situation pour la flambée du virus Ebola Bundibugyo 2026 en Afrique centrale.
description: Une interface de surveillance statique et adaptée aux mobiles, alimentée par un pipeline d'ingestion et de validation automatisé.
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

## Le paysage de la collecte de données

Les rapports de situation épidémiologique proviennent de sources de santé publique hétérogènes, avec des formats et des échelons géographiques distincts. Une vue publique exploitable doit préserver la provenance et la fraîcheur des données sans présenter des chiffres incertains comme des certitudes.

L'interface doit également conserver une carte dense et une vue synthétique parfaitement utilisables sur smartphone, où l'espace d'affichage est contraint.

## Valider avant de présenter

J'ai conçu un pipeline automatisé qui extrait les rapports de situation du ministère de la Santé de la RDC, analyse leurs données PDF, intègre les flux HDX d'OCHA (ONU) et réconcilie les totaux aux niveaux national, provincial et des zones de santé.

Ce pipeline applique une validation stricte (fail-closed), produit des instantanés immuables, détecte les anomalies et propose des mécanismes de rétention et de restauration afin qu'une source indisponible ou incohérente ne remplace jamais silencieusement le dernier jeu de données validé.

L'expérience cartographique avec Leaflet et OpenStreetMap repose sur des panneaux adaptatifs, des commandes optimisées pour le tactile, des courbes épidémiques, des graphiques démographiques et des indicateurs explicites de fiabilité des sources.

## Une vitrine statique dotée d'un cœur opérationnel

Le tableau de bord public est distribué via GitHub Pages sans aucun serveur d'application en production, tandis que GitHub Actions actualise les données validées selon un cycle planifié de quatre heures.

Le projet dissocie la disponibilité des sources de la fraîcheur épidémiologique et archive les instantanés antérieurs pour permettre une reprise opérationnelle rapide.
