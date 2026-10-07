---
slug: building-aneko-press
title: "Võrguühenduseta helimängija ehitamine Aneko Pressile: YouTube'ist voodis kestva arhitektuurini"
description: "Kuidas katkine ametlik rakendus, ootamatu Pixeli kingitus ja magamaminekuaegsed kuulamissoovid muutusid kestvaks võrguühenduseta mobiilirakenduseks."
date: 2026-10-06
tags:
  - mobile
  - audio
  - reflection
draft: true
cover:
  src: ../../assets/images/writing/building-aneko-press-cover.png
  alt: Sajandi keskpaiga Memphise stiilis abstraktne illustratsioon nurga all olevast nutitelefonist akustiliste helilainete, hõljuvate klassikaliste raamatute ja geomeetriliste andmekuubikutega soojal kreemikal pinnal.
locale: et
---

Avastasin Aneko Pressi[^1] YouTube'ist[^2] täiesti juhuslikult, kui otsisin kristlikke raamatuid.

Alguses kuulasin mõnda salvestist taustaks päevasel ajal töötades. See toimis piisavalt hästi. Probleemid algasid siis, kui tahtsin kuulata enne uinumist ja voodis olles.

YouTube'i mängima jätmine telefonis pimedas magamistoas on vaevaline kogemus. Ekraan jääb põlema ja valgustab tervet tuba ning hetkel, mil ekraan läheb unerežiimi, katkeb heli, kui sul pole tasulist tellimust.

Märkasin, et Aneko Pressil oli ametlik mobiilirakendus. Paigaldasin selle lootuses leida korralik mängija, kuid rakendus oli *kohutav*. See striimis palasid otse SoundCloudist. Mõnikord see töötas; mõnikord andis see poole lause pealt lihtsalt alla. See oli nii ebatöökindel, et lõpuks eemaldati see Google Play poest täielikult.

Olin juba kogenud Audible'i kuulaja, kuid maksta igakuiseid krediite avalikus omandis olevate raamatute eest, mida Aneko YouTube'is tasuta pakkus, oli minu jaoks välistatud. Möödusid aastad. Soov neid salvestisi kuulata ei kadunud kuhugi, kuid mul polnud endiselt mõistlikku viisi nende nautimiseks.

## Ootamatu kingitus

Umbes sel ajal ostsin Google Pixeli telefoni.[^3] Ostuga kaasnes Google'i tasuta üheaastane Gemini Advancedi tellimus.

See oli ootamatu kingitus ja esialgu polnud mul aimugi, mida sellega peale hakata. Siis tärkas minus mõte: <mark>ma võiksin kasutada seda tasuta kingitust, et kinkida midagi omakorda maailmale</mark>.

Avasin Excalidraw',[^4] visandasin kasutajaliidese, mida olin aastaid igatsenud, ja andsin joonised Geminile, et hakata rakenduse raamistikku looma.

Esimene versioon oli halb. Viskasin selle minema ja alustasin uuesti. Kui alustasin, arvasin, et kogu ettevõtmine võtab paar nädalat. Selle asemel kulus kuid, mida katkestasid pikad pausid, kui igapäevaelu vahele tuli. Algselt primitiivsest esita ja peata nupust kasvas ekraan ekraani ja koodiversioon koodiversiooni haaval välja täiemahuline rakendus.

## Ehitades meeltele

Kui ehitad tarkvara iseendale, ei hooli sa liigsetest funktsioonide nimekirjadest. Sa hoolid meelelistest üksikasjadest, mis tekitavad soovi rakendust iga päev avada.

Minu jaoks olid kolm asja kõige olulisemad:

Esiteks igapäevased harjumused. Lisasin kuulamisseeriad ja saavutuste karikad, sest klassikalise kirjandusega kindla rütmi hoidmine nõuab teadlikkust. Seeria püsimise nägemine andis kuulamisele rahuliku hoo.

Teiseks magamaminekuaegne helipilt. Kuiva etteloetud hääle kuulamine vaikses toas võib tunduda järsk. Tahtsin lugeja hääle alla mahedat taustaheli (õrn klaver, vaikne vihmasadu või soojad keelpillid), et magamistoas valitseks rahu. Mõlema helivoo harmooniline kooskõla, kus taustaheli püsib vaikselt taustal ilma jutustajat summutamata või lukustuskuva hõivamata, sai kogu mängija üheks minu lemmikosaks.

Kolmandaks reisimine ja sõidud. Kuulan autos sama tihti kui enne magamaminekut. Ühendasin mängija otse Apple CarPlay ja Android Autoga, nii et autosse istudes kandub peatükk otse armatuurlauale ilma telefonis seadeid või Bluetoothi valikuid otsimata.

## Sõltuvuse katkestamine

Rakenduse varaseim versioon oli vaid mobiilne kasutajaliides koos kohaliku andmebaasiga, et salvestada peatükke võrguühenduseta kuulamiseks. Kuid otsene tuginemine SoundCloudile põrkus peagi vastu seina.

Avalikud RSS-vood olid piiratud viiesaja palaga, mis tähendas, et vanemad raamatud lihtsalt kadusid. Kirjeldused olid ebaühtlased, lugude järjekord sassis ja peaaegu iga autorisilt oli üldine kirjastuse nimi.

Mõistsin, et kui tahan tõeliselt kestvat raamatukogu, ei saa rakendus sõltuda välise voogedastusplatvormi tujudest. Võtsin kasutusele Cloudflare Workeri vahevarana, et koondada terve kataloog väljaspool SoundCloudi limiite. Kui kirjeldused olid segased, kasutasin visuaalset OCR-i, et lugeda raamatukaantelt puuduvad autorite nimed.

Tänu sellele ei tea mobiilirakendus tänapäeval enam isegi SoundCloudi olemasolust. See suhtleb ainult Cloudflare'iga. Isegi kui algallikas peaks homme kaduma, mängivad kõik raamatud, peatükid ja kaanepildid rakenduses tõrgeteta edasi.

## Edasivaade

See, mis algas isikliku meelehärmiga pimedas toas helendava telefoniekraani ees, kasvas millekski palju suuremaks.

Mängija valmimisel hakkasin Aneko Pressi põhjalikumalt uurima: kes nad on, mida nad välja annavad ja kes neid tegelikult kuulab. Avastasin, et nende heliraamatud jõuavad palju kaugemale kui tavalised magamistoa kuulajad, teenindades katkendliku internetiühendusega inimesi, arengupiirkondi ja vanglamissioone. See uurimistöö muutis projekti suunda põhimõtteliselt. See kujundas arhitektuuridokumendi ning muutis eraviisilise tööriista vastupidavaks võrguühenduseta platvormiks, mis peab vastu igas olukorras.

Pärast põhirakenduse valmimist võtsin ühendust Aneko Pressi meeskonnaga, et neile tehtut tutvustada. See vestlus jääb aga teiseks korraks; praegu on minu eesmärk rakendus lõpuks maailmale avaldada.

Kingitus saadud, ja kingitus edasi antud.

> „Teenigu igaüks teisi selle armuanniga, mille ta on saanud, nagu Jumala mitmesuguse armu head majapidajad.” (1. Peetruse 4:10, P1997)

## Notes

[^1]: Aneko Press kirjastab klassikalist kristlikku kirjandust ja heliraamatuid: [anekopress.com](https://anekopress.com).
[^2]: Aneko Pressi kanal YouTube'is: [youtube.com/@Anekopress/videos](https://www.youtube.com/@Anekopress/videos).
[^3]: Google Pixel nutitelefonide seeria: [store.google.com/category/phones](https://store.google.com/category/phones).
[^4]: Excalidraw virtuaalne joonistustahvel: [excalidraw.com](https://excalidraw.com).
