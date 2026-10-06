---
title: Staatilised veebisaidid on operatiivsed süsteemid
description: Miks staatiline arhitektuur nõuab endiselt põhjalikku läbimõtlemist kooste, sisulepingute, tarne ja tõrkerežiimide osas.
date: 2026-10-03
tags:
  - architecture
  - astro
  - delivery
draft: false
cover:
  src: ../../assets/images/writing/static-sites-are-operational-systems-cover.png
  alt: Abstraktne mehaaniline koosteliin muudab joonislehed ja geomeetrilised klotsid pakendatud väljalaskepakkideks.
locale: et
slug: static-sites-are-operational-systems
---

Staatiline veebisait eemaldab rakendusserveri päringute teelt. See ei eemalda aga tootest operatiivseid aspekte.

Süsteemil on endiselt sisendid, teisendused, liideselepingud ja tarneprotsess. Sisu siseneb failidena. Koosteprotsess muudab need failid lehtedeks. Majutusteenus avaldab tulemuse. Igaüks neist piiridest võib tõrkuda ja igaühele neist tuleb kasuks selge määratlus.

## Sisu on liides

Front matterit on lihtne pidada mitteametlikuks siltide kogumiks. Niipea kui lehed sellest sõltuvad, on tegemist ametliku liidesega. Pealkirjad peavad olema kohustuslikud. Kuupäevad peavad olema korrektsed kuupäevaobjektid, mitte suvalised tekstijupid. Mustandi staatusel peab kogu süsteemis olema ühene tähendus.

Astro sisukogud muudavad selle lepingu täidetavaks ja kontrollitavaks.[^1] Vigane sisu peatab tarne juba kompileerimisetapis, võimalikult lähedal selle tekitanud autorietapile.

## Koostetulemus on tarnitav artefakt

Staatilise saidi puhul on loodud kataloog see toode, mis tegelikult avaldatakse.[^2] Seetõttu kinnitab asjalik väljalaskekontroll enamat kui pelgalt seda, et kompilaator lõpetas veata. See veendub, et oodatud marsruudid on olemas, mustandid puuduvad ja dokumendi oluline semantiline struktuur säilis renderdamisel.

Selline lähenemine hoiab testid lähedal sellele, mida külastajad tegelikult näevad, ilma et iga tekstimuudatuse jaoks oleks vaja rasket brauserit käivitada.

## Lihtsus peab olema vaadeldav

Staatilise arhitektuuri eesmärk ei ole inseneritöö vältimine.[^3] Selle eesmärk on paigutada keerukus sinna, kus seda saab kontrollida ja auditeerida: versioonitud sisusse, deterministlikesse koostetesse ja selgetesse tarnelepingutesse.

Kui need piirid on nähtavad, muutub avaldamine tavapäraseks Giti töövooks ning taastamine eelmise artefakti ennistamiseks, mitte hädaabiremondiks toodangus.

## Notes

[^1]: [Astro sisukogud](https://docs.astro.build/en/guides/content-collections/).
[^2]: [Astro staatiline renderdamine](https://docs.astro.build/en/basics/rendering-modes/#pre-rendered-static).
[^3]: [Staatilised saidigeneraatorid ja Jamstacki arhitektuur](https://jamstack.org/glossary/ssg/).
