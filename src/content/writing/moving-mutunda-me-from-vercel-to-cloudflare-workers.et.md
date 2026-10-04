---
title: mutunda.me kolimine Vercelist Cloudflare Workersisse
description: Kolimismärkus Cloudflare Workersist, eelvaadetest ja DNS-ist.
date: 2026-10-04
tags:
  - astro
  - delivery
  - architecture
draft: false
cover:
  src: /images/writing/mutunda-vercel-to-cloudflare-cover.png
  alt: Staatilised lehed ületavad tõkke teel pilveväravani.
locale: et
slug: moving-mutunda-me-from-vercel-to-cloudflare-workers
---

![Staatilised lehed ületavad tõkke teel pilveväravani.](/images/writing/mutunda-vercel-to-cloudflare-cover.png)

Tee Vercelist Cloudflare Workersisse algas märgiga, mida ma ei usaldanud. Vercel ehitas saidi edukalt, kuid GitHub märkis väljalaske ebaõnnestunuks. Probleem ei olnud Astro koostes. Kaks välist väljalaskekontrolli olid jõudnud Verceli Hobby paketi piirini.

Roheline kooste ja punane väljalaske olek on halb mõistatus. Kas uus sait jõudis avalikku domeeni? Kas oli eelvaade, mida kontrollida? Kas tõrge tuli minu koodist või ainult konto piirangust? Ma ei tahtnud, et iga avaldamine algaks sellise arvamisega.

Cloudflare oli juba tuttav maa. Kasutan seda teiste projektide jaoks, seega ei tundunud tööriistad ja haldusvaated nagu järjekordne kuningriik oma kummaliste tavadega. Arendajakogemus oli töö jaoks, mida tahtsin teha, selgem ja meeldivam. Tasuta pakett andis sellele väikesele saidile kolimise ajal ka rohkem ruumi. See võib muutuda, kuid sel hetkel oli see oluline.

Cloudflare toob samasse kohta ka DNS-i, teenusetõkestusrünnete kaitse ja muud äärevõrgu turvavõimalused. Isiklik sait ei vaja kindlust, kuid hea on teada, et müürid on olemas. Kõige rohkem tahtsin platvormi, mis sobib minu tööga ja teeb tee Git commitist avaliku leheni selgelt nähtavaks.

## Mida ma tegelikult avaldasin

Astro kirjutab valmis saidi kausta `dist`: HTML-i, CSS-i, JavaScripti, pildid, RSS-voo ja saidikaardi. See kaust ongi avaldatav asi. Puudub rakendusserver, mida elus hoida, ning andmebaas, mida kolida. Cloudflare Workers teenindab valmis saiti.

Süsteem on piisavalt lihtne, et seda peas hoida. GitHubis on lähtekood. `npm run build` teeb saidi. `dist` on avaldatav artefakt. Worker teeb selle kättesaadavaks. Sait jätab endiselt teema meelde, vahetab keelt ja avab käsupaleti, kuid leht on kasutatav enne nende osade kohalejõudmist.

## Workeri nimi ei ole domeeninimi

Esimene takistus oli nimeviga. Panin Workeri nimeks `mutunda.me` ja Wrangler keeldus sellest. Workeri nimes kasutatakse väiketähti, numbreid ja kriipse. Punkt kuulub domeeni, mitte Workeri nimesse.

Worker sai nimeks `mutunda`, kuid `mutunda.me` jäi külastajate kasutatavaks aadressiks. Need nimed näivad piisavalt sarnased, et neid segi ajada, kuid nad kuuluvad süsteemi eri osadesse. Worker käitab saiti. DNS juhib domeeni sinna. Selle üleskirjutamine muutis ülejäänud kolimise vähem libedaks.

Cloudflare'i seadistuskäsk suutis Astro ära tunda ja pakkuda vaikimisi väärtusi. See ei saanud teada kõiki selle projekti üksikasju. Hoidsin seadistuse hoidlas ja vaatasin loodud väärtused üle, enne kui need said avaldamise osaks.

## Kooste ja artefakt

Cloudflare Workers Builds käivitab tuttava käsu `npm run build`, seejärel avaldab Wrangler tulemuse. Hoidsin koostamise ühes kohas. Uus kooste avaldamise ajal oleks muutnud jälje raskemini järgitavaks ja oleks võinud luua teistsuguse artefakti kui juba üle vaadatud versioon.

Hoidla kirjeldab toetatud Node'i versioone ning Cloudflare salvestab valitud versiooni koostelogisse. Lukufail, paketihaldur ja Node'i versioon on ennustatava koostamise osa sama palju kui raamistik. Logi märkis ka `esbuild`i paigaldusjärgset skripti. See oli oodatud, kuid eelistan teada, et see käivitus, mitte lasta sellel muusse logimürasse kaduda.

## Puuduv eelvaate URL

Eelvaated olid tähtsad, sest suur osa saidist on visuaalne. Artikli illustratsioon, väikese ekraani paigutus, keelevalik ja lehe üleminek vajavad brauserit, mitte ainult failide võrdlust.

Esimene eelvaade ehitati edukalt, kuid commitil puudus kasutatav URL. Sait oli olemas, kuid seda ei olnud kusagil külastada. Seadistuses oli vaja plokki `previews` ja väärtust `preview_urls: true`. Ka Workeri vastav versiooni-URL-ide säte tuli sisse lülitada. Kui need osad kokku said, oli järgmisel commitil päris eelvaade.

Piirasin Cloudflare Accessi ainult eelvaadetega. Harutöö jääb privaatseks, kuid avalik sait jääb avalikuks. See väike piir oli mulle oluline.

## DNS on osa avaldamisest

DNS vajas rohkem hoolt kui kooste. Tsoonis olid kirjed teenuste jaoks, mis portfoolioga ei seotud, sealhulgas e-post. Need jäid paika. Eemaldasin ainult vanad saidi marsruutimise kirjed ning ühendasin avaliku domeeninime uue Workeriga.

DNS-tsoon on väike kaart, mille eri kirjed teenivad eri eesmärke. Kontrollisin, et vana marsruut oli kadunud ja uus olemas, enne kui ootasin, et avalik tulemus sellele järele jõuaks. Kolimine ei nõudnud kogu kaardi kustutamist ja uuesti joonistamist.

## Tagasitee alles hoidmine

Tahtsin võimalust tagasi pöörduda, kuni kolimine oli veel värske. Lähtekood jäi GitHubi. Kooste töötas endiselt kohalikult. Tuvastasin vanad marsruutimiskirjed enne nende eemaldamist. Kui Worker poleks töötanud, oleksin saanud taastada vana marsruudi, mitte kogu tsooni uuesti üles ehitada.

See vaoshoitus oli oluline, sest haldusvaade on alati valmis seadistama rohkem, kui väike kolimine nõuab. Tahtsin, et iga muudatus oleks väike ja selgitatav.

Tulemuseks on rahulikum avaldamistee. GitHubis on lähtekood, Astro loob artefakti, Worker `mutunda` avaldab selle ja DNS juhib avaliku domeeni sinna. Tõmbetaotlused võivad saada kaitstud eelvaate URL-id. Cloudflare'il on oma teravad nurgad, kuid igal osal on nüüd eraldi roll. Seda ma tahtsingi: vähem mõistatusi valmis artikli ja selle loetavaks saamise vahel.

See märkus on kolimise teine osa. Esimene räägib, miks kolisin saidi Next.js-ist Astrosse: [Next.js-ist Astrosse](/et/writing/moving-mutunda-me-from-nextjs-to-astro/).
