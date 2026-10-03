---
slug: ebola-tracker
title: Ebola Tracker
summary: Avalik olukorra juhtpaneel 2026. aasta Bundibugyo ebolaviiruse puhangu kohta KDV-s ja naaberalade seireradadel.
description: Regulaarselt uuenev kaart ja juhtpaneel, mis muudavad laiali olevad ametlikud aruanded arusaadavamaks.
role: Looja ja tarkvarainsener
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
links:
  live: https://fottym.github.io/ebola-tracker/
  repository: https://github.com/FottyM/ebola-tracker
---

## Probleem

Kui puhang jääb kohalikuks, võib kasulikku avalikku teavet olla raske leida. Olulised arvud võivad jääda laiali olevatesse PDF-bülletäänidesse, kaugele inimestest, kes püüavad olukorda mõista. Tahtsin avalikku kohta, kus teabe leiab ja seda saab lugeda ilma paljusid aruandeid läbi otsimata.

Ehitasin Ebola Trackeri väikese nädalavahetuse katsena. Sellest on kasvanud olukorra juhtpaneel 2026. aasta Bundibugyo ebolaviiruse puhangu jaoks: Kongo Demokraatlik Vabariik, Uganda piiri kontekst ja rahvusvahelised meditsiinilised evakuatsiooniteed.

## Andmete, mitte ainult pealkirja jälgimine

Iga nelja tunni järel kontrollib töövoog ametlikke aruandeid ja uuendab andmeid tavalise koodi, mitte keelemudeli abil. See ühendab KDV terviseministeeriumi ja INSP bülletäänid, tervisetsoonide andmed ning kontrolli organisatsioonidelt nagu WHO ja Africa CDC.

KDV arvud jäävad rahvusvahelistest meditsiinilistest evakuatsioonidest eraldi. See on oluline: patsiendi ravi mujal ei tohi jätta muljet, et puhang on sinna liikunud.

Juhtpaneel näitab selgelt allikat ja viimase uuenduse aega. Kaardil saab liikuda riigi, provintsi ja tervisetsooni vahel. Olukorra kokkuvõtted, puhangu ajajooned ja demograafilised graafikud muudavad arvud loetavamaks nii telefonis kui ka suuremal ekraanil.

## Väike avalik pind, hoolikas andmetöö

Avalik sait töötab GitHub Pagesis ilma tootmisrakenduse serverita. GitHub Actions teeb ajastatud uuenduse. Valideerimine, hetktõmmised, muudatuste tuvastamine ja taastamise kontrollid takistavad kättesaamatul või vastuolulisel bülletäänil vaikselt viimast head andmestikku asendada.
