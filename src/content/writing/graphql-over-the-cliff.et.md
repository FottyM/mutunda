---
title: Kuidas mu armastus GraphQL-i vastu kaljult alla kukkus
description: The Net Ninja õpetusest LoopBacki filtriteni, GraphQL-i silumiseni tööl ja põgusa pilguni Hasurale.
date: 2026-10-04
tags:
  - graphql
  - architecture
  - debugging
draft: false
cover:
  src: /images/writing/graphql-over-the-cliff-cover.png
  alt: Abstraktne päringuleht kaldumas üle kaljuserva torude ja teenusesõlmede võrgustikku.
locale: et
slug: graphql-over-the-cliff
---

![Abstraktne päringuleht kaldumas üle kaljuserva torude ja teenusesõlmede võrgustikku.](/images/writing/graphql-over-the-cliff-cover.png)

Vaatame, kuidas mu armastus GraphQL-i vastu kaljult alla kukkus.

Umbes 2018. aastal, kui GraphQL hakkas levima — ma tegelikult ei tea, millal see levima hakkas —, tegin läbi ühe The Net Ninja õpetuse ja olin vaimustuses. See oli lahe. Võimalus pärida välju ja pesastatud andmeid oli tõesti mõnus.

Siis sain 2018. aastal töökoha, kus kasutasime IBMi/StrongLoopi veebiraamistikku LoopBack. Pean silmas LoopBack 3 ja 4.

Seal oli midagi, mida võiks nimetada päringukoostajaks. Määratlesid mudeli, kirje, andmebaasiga seotud olemi. Päringu URL-i päringustringis sai kaasa anda filtri ja saada tagasi just need väljad, mida tahtsid.

Minu arvates lahendas see juba osa probleemidest, mida GraphQL püüdis lahendada.

Kaasata sai ka seoseid. Selles lahenduses, millega mina töötasin, saime isegi pärida ja filtreerida eri teenuste eri mudeleid. Mäletan, et strong-remoting oli sellega seotud, kuigi ma pole kindel, kas see on õige nimi sellele osale, mis selle võimalikuks tegi.

Hiljuti läksin tagasi GraphQL-i juurde, sest sain uue töökoha, kus seda kasutatakse läbivalt.

Esimene asi, mida meie lahenduse puhul märkasin, oli see, et päringud olid POST-päringud. HTTP olekukoodist polnud vigu näha: said 200 ja siis vastuses veaobjektid. Mõnikord õnnestus päring osaliselt.

Siis on veel skeemide delegeerimine, skeemide kokkuõmblemine ja DataLoader. Minu jaoks on seda palju.

Päringud näevad üldiselt süütud välja. Näed väikest päringut, aga sees võib olla rohkem filtreerimist, rohkem välju, skeemide kokkuõmblemist ja skeemide delegeerimist. Asi läheb segaseks, kui pead vigu otsima ja aru saama, mis kuhu läheb.

Mõnikord võtab see palju aega võrreldes korraliku REST API päringuga, mis annab kasuliku olekukoodi. Ja kui filtreerimissüsteem on piisavalt hea, siis ma ei tunne, et mul kogu seda maagilist delegeerimist vaja oleks.

Mulle tundub, et paljud probleemid, mida GraphQL püüdis lahendada, on paremate teenuste, vahemälu ja võrguühendustega juba lahendatud. Sellega töötamine on minu jaoks muutunud õudusunenäoks. Ma tõesti ei armasta seda enam. Ma vihkan seda.

Aga siis vaatasin korraks Hasurat ja olin vaimustuses.

Nüüd ma pole kindel, kas see tuleb mu armastusest LoopBacki filtrite vastu või lihtsalt sellest, kui lihtne nähtu oli. Ma ei tea veel, miks mulle Hasura meeldib.
