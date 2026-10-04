---
title: mutunda.me kolimine Next.js-ist Astrosse
description: Miks asendasin oma Next.js-i portfoolio Astroga, versioonitud kirjutiste ja lugemiseks mõeldud disainisüsteemiga.
date: 2026-10-03
tags:
  - astro
  - architecture
  - blogging
draft: false
cover:
  src: /images/writing/mutunda-nextjs-to-astro-cover.png
  alt: Brauseriaken ületab esimese tõkke teel rahulikuma avaldamissüsteemi poole.
locale: et
slug: moving-mutunda-me-from-nextjs-to-astro
---

![Brauseriaken ületab esimese tõkke teel rahulikuma avaldamissüsteemi poole.](/images/writing/mutunda-nextjs-to-astro-cover.png)

Kõik algas väikese ja veidi ebamugava küsimusega: kuhu ma oma kirjutised panen?

dev.to tundus ilmne vastus. Arendajad käivad seal juba lugemas ja mul ei ole veel oma publikut. Kuid mul oli ka domeen ning vana portfoolio, mis oli hakanud meenutama lukustatud tuba. See oli üks leht, mis oli ehitatud Next.js 12, React 18 ja Emotioniga. Seal olid kogemus ja tehnoloogiad, aga ka ajutine tekst ning puudus päris koht, kus artikkel saaks elada.

Enne kui sain kedagi oma kirjutiste juurde saata, oli mul vaja kohta, kuhu neid tasuks saata.

## Miks Astro

Miski selle saidi juures ei vajanud täismahus Reacti rakendust. Tahtsin avaldada artikleid, lühikest tutvustust ja projektimärkmeid. Astro sobis selleks, sest see ei jää ette. Saan kirjutada lehe MDX-is, saidi kokku ehitada ja selle avaldada. Isikliku portfoolio ümber ei ole vaja lisasüsteeme.

Next.js saab selle tööga väga hästi hakkama. See ei olnud põgenemine halva tööriista eest. Tahtsin, et artikli lisamine oleks lihtsalt artikli lisamine, mitte rakenduse muutmine. Astro teeb staatilisi lehti, mida otsingumootorid saavad lugeda. Kui saidil on kunagi vaja serveris loodud lehti, saab Astro ka seda teha. Praegu ei ole seda vaja.

## Vajadused, mida mul ei olnud

On lihtne valmistuda suureks retkeks, kuigi tegelikult piisab heast saapapaarist. Portfoolio ümbertegemine võib kaasa tuua peata sisuhalduri, andmebaasi, otsingu, haldusvaate ja nii palju liikuvaid osi, et algne probleem kaob nende alla.

See ei olnud selle saidi aus kirjeldus. Mul oli vaja püsivat avalehte, projektimärkmeid, artikleid, kindlaid URL-e ja võimalust neid muuta ilma kuid hiljem pooleldi unustatud masinat avamata. Selle üleskirjutamine muutis küsimust. Lõpetasin parima frontendi otsimise ja hakkasin otsima viisi, mis muudaks avaldamise lihtsaks ning hoiaks töö teisaldatavana.

Staatiline väljund ja Markdown vastasid suuremale osale sellest vajadusest. JavaScripti on alles seal, kus sellest on kasu. Sait jätab teema meelde, vahetab keelt, avab käsupaleti ja liigub lehtede vahel ilma kogu lehte uuesti laadimata. Kuid sõnad, navigeerimine ja lugemiskogemus jõuavad kohale esimesena.

## Saidile kasvuruumi andmine

Uuel saidil on eraldi kohad kirjutistele, projektidele ja lehele „Minust“. Nii saab iga osa ruumi. Projekt ei ole enam nimi tehnoloogialogo kõrval. Seal saab kirja panna probleemi, otsused ja õpitu. Artiklil on püsiv aadress ning koht arhiivis.

Sisu elab Markdowni failides. Astro sisukogud kontrollivad metaandmeid saidi koostamisel. Git sobib minu tööviisiga. Saan muudatuse üle vaadata, vana versiooni leida ja kirjutised vajaduse korral mujale kaasa võtta. Markdowni fail ei luba, et kolimine on alati kerge, kuid see tähendab, et sõnad ei jää ühe liidese sisse lukku.

See väike kontroll on juba kasulik olnud. Puuduv pealkiri või vale kuupäev peatab koostamise muudatuse lähedal. Eelistan selle probleemiga kohtuda enne avaldamist.

## Lugemiseks tehtud teema

Tahtsin, et disain meenutaks tehnilist välipäevikut. Sellest tulid toimetuslik tüpograafia, väikesed märkused, peened jooned ja piisavalt ruumi pikemale tekstile. See andis saidile ka kasuliku piiri. Sait ei pidanud näima uus ainult uudsuse pärast. See pidi tegema lugemise meeldivaks.

Jagatud muutujad ja stiilijuhend hoiavad lehti saidi kasvades ühtsena. Jätsin koodile ruumi, hoidsin teksti mugava laiusega ning tegin navigeerimise klaviatuuriga kasutatavaks. Hele, tume ja süsteemne teema jätavad külastaja valiku meelde. Saidil on ka inglise, prantsuse ja eesti keele marsruudid. Seega vajavad lingid ja metaandmed sama palju hoolt kui tõlgitud lõigud.

## Kontrollida tuleb enamat kui koostamist

Ka staatiline sait võib katki minna. Leht võib valmida katkise lingiga, mustand võib sattuda arhiivi ja tõlgitud marsruut võib vaikselt valesse kohta viia. Projekt kontrollib Astrot ja TypeScripti, ehitab saidi, kontrollib linke ning katab brauseris peamised teed: liikumise saidil, keele vahetamise, teema säilimise ja puuduvalt lehelt tagasitee leidmise. RSS-voog ja saidikaart sünnivad koostamise ajal, mitte hiljem lisatava ülesandena.

Mul ei ole siin müüa jõudlusvõitu. Ma ei mõõtnud vana saiti uue vastu. Raamistiku nimi ei ole tõend. Mul on lihtsalt sait, mida on lihtsam avaldada, lihtsam hiljem uuesti kätte võtta ja mis on valmis vastu võtma töö, mida tahan jagada.

## Toimetuslik otsus

Saidi kolimine ei olnud ainult tehniline koristamine. Vana üksikleht jättis kirjutised ja projektid tagaplaanile. Nüüd võib artikkel olla lühike, kui peab, või võtta aega, kui teema seda väärib. Projekt saab näidata oma kompromisse, mitte lõppeda ilustatud reana loendis.

Jätsin kõrvale asjad, mis ei lahendanud päris probleemi, sealhulgas andmebaasiga sisuhalduri ja otsinguteenuse. Eesmärk ei olnud tööriistade ja ametinimetuste kataloog. Tahtsin kohta, mis näitab, kuidas ma tööle lähenen.

## dev.to koht selles loos

Soovin dev.to-d endiselt kasutada leitavuse jaoks. Avaldan esmalt mutunda.me-s ning avaldan valitud tekste mujal koos kanoonilise lingiga algse teksti juurde. Oma domeeni omamine ei tekita publikut. See annab mulle vähemalt ühtse koha, kus tööd hoida, kuni publikut ehitan.

Järgmine osa räägib valmis saidi kolimisest Vercelist Cloudflare Workersi: [Vercelist Cloudflare Workersisse](/et/writing/moving-mutunda-me-from-vercel-to-cloudflare-workers/).
