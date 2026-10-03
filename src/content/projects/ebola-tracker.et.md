---
slug: ebola-tracker
title: Ebola Tracker
summary: Reaalajas epidemioloogiline kaart ja olukorrapaneel 2026. aasta Bundibugyo ebolaviiruse puhangule Kesk-Aafrikas.
description: Staatiline, mobiilisõbralik seireliides, mida toetab automatiseeritud andmehõive- ja valideerimiskonveier.
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

## Andmekogumise maastik

Puhanguandmed laekuvad eraldiseisvate rahvatervise allikate, eri formaatide ja geograafiliste tasandite kaudu. Toimiv avalik vaade peab säilitama andmete päritolu ja värskuse, ilma et ebakindlat teavet esitataks kindla tõena.

Samuti peab liides hoidma tiheda kaardivaate ja olukorrakokkuvõtte mugavalt kasutatavana nutitelefonides, kus ekraanipind on piiratud.

## Valideerimine enne esitust

Ehitasin ajastatud konveieri, mis tuvastab KDV terviseministeeriumi olukorraaruandeid, töötleb nende PDF-andmeid, lõimib ÜRO OCHA HDX andmevooge ning kooskõlastab riiklikke, provintsi ja tervisetsoonide koondandmeid.

Konveier kasutab ranget tõrkekindlat valideerimist (fail-closed), muutumatuid hetktõmmiseid, anomaaliate tuvastust ja taastetööriistu, tagamaks, et kättesaamatu või vastuoluline allikas ei asendaks kunagi vaikimisi viimast kinnitatud andmestikku.

Leafletil ja OpenStreetMapil põhinev staatiline lahendus toetub kohanduvatele paneelidele, puutesõbralikele juhtelementidele, epideemiakõveratele, demograafilistele graafikutele ning selgetele allikate usaldusväärsuse indikaatoritele.

## Staatiline avalik kiht operatiivse tuumaga

Avalikku juhtpaneeli serveeritakse GitHub Pagesi kaudu ilma serverita toodangukeskkonnas, samal ajal kui GitHub Actions uuendab valideeritud andmeid iga nelja tunni tagant.

Projekt eristab allikate kättesaadavust epidemioloogilisest värskusest ning säilitab varasemad hetktõmmised kiireks operatiivseks taastamiseks.
