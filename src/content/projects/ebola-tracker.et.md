---
slug: ebola-tracker
title: Ebola Tracker
summary: Avalik olukorra juhtpaneel 2026. aasta Bundibugyo ebolaviiruse puhangu jälgimiseks Kongo DV-s ja naaberpiirkondades.
description: Regulaarselt uuendatav kaart ja juhtpaneel, mis koondab hajutatud ametlikud raportid selgeks ülevaateks.
role: Autor ja tarkvarainsener
year: 2026
featured: true
draft: false
locale: et
technologies:
  - JavaScript
  - Vite+
  - Leaflet
  - OpenStreetMap
  - TanStack Charts
  - GitHub Actions
cover:
  src: /images/projects/ebola-tracker-cover.png
  alt: Ebola Trackeri kaardi ja olukorra juhtpaneeli arvutivaade.
links:
  live: https://fottym.github.io/ebola-tracker/
  repository: https://github.com/FottyM/ebola-tracker
---

## Probleem

Lokaalse puhangu korral on vajalikku avalikku teavet sageli keeruline leida. Olulised arvud peituvad eri PDF-bülletäänides, kaugel inimestest, kes püüavad toimuvast aru saada. Soovisin luua avaliku koha, kus teave oleks kättesaadav ja loetav ilma aruannetes ekslemata.

Ehitasin Ebola Trackeri nädalavahetuse eksperimendina. Sellest on välja kasvanud olukorra juhtpaneel 2026. aasta Bundibugyo ebolaviiruse puhangu jälgimiseks: Kongo Demokraatlik Vabariik, Uganda piirialad ja rahvusvahelised meditsiinilise evakuatsiooni teekonnad.

## Faktide, mitte pealkirjade jälgimine

Iga nelja tunni järel kontrollib konveier ametlikke raporteid ja uuendab andmeid tavapärase koodi, mitte keelemudeli abil. See koondab Kongo DV terviseministeeriumi ja INSP bülletäänid, tervisetsoonide andmed ning kinnitused organisatsioonidelt nagu WHO ja Africa CDC.

Kongo DV arvud hoitakse lahus rahvusvahelistest meditsiinilistest evakueerimistest. See eristus on oluline: patsiendi ravi mujal ei tohi jätta muljet, nagu oleks puhang sinna üle kandunud.

Juhtpaneel hoiab allika ja viimase uuenduse aja selgelt nähtaval. Kaardil saab liikuda riigi, provintsi ja tervisetsooni tasemel. Olukorra kokkuvõtted, puhangu ajajooned ja demograafilised graafikud teevad arvud loetavaks nii telefonis kui ka suurel ekraanil.

## Väike avalik pind, hoolikas andmetöötlus

Avalik veebisait töötab GitHub Pagesis ilma tootmisrakenduse serverita. GitHub Actions hoolitseb plaanilise uuendamise eest. Valideerimine, hetktõmmised, muudatuste tuvastamine ja tagasipööramise kontroll tagavad, et kättesaamatu või ebakõlaline bülletään ei asenda märkamatult viimast usaldusväärset andmestikku.
