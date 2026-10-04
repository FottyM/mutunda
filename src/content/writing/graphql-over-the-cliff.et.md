---
title: Mulle meeldis GraphQL, kuni pidin seda siluma
description: Mõtisklus GraphQL-i meeldivast pealispinnast, LoopBacki filtritest ja päringu teekonna jälgimise tegelikust hinnast liitsüsteemis.
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

Umbes 2018. aastal läbisin ühe The Net Ninja GraphQL-i koolituse ja see hakkas mulle kohe meeldima. Sain küsida täpselt soovitud välju, liikuda seoste kaudu edasi ja saada üheainsa päringuga puhta, hierarhilise vastuse. See tundus täpne. See tundus kaasaegne. Tundus, nagu oleks API lõpuks ometi lõpetanud kliendiga vaidlemise.

Tol ajal lummas mind päring ise. Väike kuju ekraanil näis lubavat, et selle taga peitub samavõrra vähe tööd.

See oli eksitus, kuigi igati mõistetav.

## Vähem moekas lahendus, mis töötas

Minu esimesel töökohal puutusin kokku LoopBack 3 ja hiljem LoopBack 4-ga.[^1] See pärines StrongLoopilt ja IBM-ilt, mitte JavaScripti maailma kõige põnevamast nurgast, kuid pakkus meile praktilisi asju: mudeleid, seoseid ja filtreid.

Lõpp-punkt võis kuvada mudeli ja võtta vastu filtri. Sain valida välju, kitsendada tulemust ja kaasata seotud mudeli. See ei olnud nii elegantne kui GraphQL-i päring, kuid suurem osa vajalikust oli juba olemas.

```text
GET /customers?filter={
  "fields": ["id", "name"],
  "where": {"active": true},
  "include": ["orders"]
}
```

LoopBack dokumenteerib väljade valikut, filtreid ja seotud mudelite kaasamist selgelt.[^2] Süntaks võib muutuda kohmakaks, eriti siis, kui päringustring peab kandma kodeeritud JSON-i, kuid tehtav töö jääb nähtavaks. Näen ressurssi, tingimust ja seost, mida ma küsisin.

See muutis minu esmamuljet GraphQL-ist. Ma ei arvanud enam, et „GraphQL on ainus viis vältida raiskavaid API-sid“. Läbimõeldud REST API koos filtreerimise ja seostega suudab rahuldada üllatavalt suure osa neist samadest vajadustest.

## Lihtne päring, mis polnud sugugi lihtne

Aastaid hiljem liitusin meeskonnaga, kus GraphQL-i kasutati läbivalt. Olin alguses elevil: tehnoloogia, mida olin imetlenud, oli nüüd tõsises kasutuses.

Seejärel pidin välja selgitama, miks mõni päring oli aeglane, puudulik või vigane.

Väljastpoolt vaadates võib päring olla imetlusväärselt lühike:

```graphql
query CustomerOrder {
  customer(id: "42") {
    name
    orders { id total }
  }
}
```

Kuid see vorm ei ütle peaaegu midagi selle all kulgeva teekonna kohta. `customer` võib olla lahendaja (resolver). `orders` võib pöörduda teise teenuse poole. Lüüs võib delegeerida osa valikust teisele skeemile. DataLoader võib rühmitada ühe osa otsingutest, samal ajal kui teine lahendaja teeb ikka iga kirje kohta eraldi väljakutse. Päring näeb välja tunduvalt rahulikum kui seda teenindav masinavärk.

Ükski neist ideedest pole vale. DataLoader eksisteerib selleks, et päringupõhiseid laadimisi rühmitada ja puhverdada.[^3] Skeemide kokkuõmblemine (schema stitching) võimaldab esitada mitut teenust ühe skeemi kaudu ning skeemi delegeerimine on mehhanism, mis suunab osa päringust teenusele, mis oskab sellele vastata.[^4] Need on reaalsed vastused reaalsetele probleemidele.

Kuid need on ka lisakohad, kust otsida, kui vastus viibib.

Minu jaoks ei seisnenud raskus selles, et GraphQL tegi süsteemi keeruliseks. Süsteem oligi juba keeruline. GraphQL tegi selle keerukuse varjamise lihtsamaks päringu taha, mis näis süütu.

## Roheline olekukood võib ikkagi tähendada pikka pärastlõunat

Teine üllatus oli tõrgete käsitlemine. Süsteemis, kus töötasin, saabusid paljud operatsioonid POST-i kaudu ja tagastasid HTTP 200 isegi siis, kui osa nõutud tööst oli ebaõnnestunud. Kasulik vastus võis asuda massiivi `errors` kõrval või kaduda osalise tulemuse taha.

```json
{
  "data": { "customer": { "name": "Ada", "orders": null } },
  "errors": [{ "message": "Orders service timed out" }]
}
```

Selline vastus on GraphQL-i jaoks täiesti korrektne käitumine, mitte viga iseenesest. GraphQL-over-HTTP spetsifikatsioon eristab tehniliselt korrektset GraphQL-i vastust selle sees olevate üksikute väljade edukusest.[^5] Kuid see muutis minu esimest sammu vigade otsimisel. Kood 200 ei olnud enam piisav kinnitus selle kohta, et operatsioon õnnestus. Pidin uurima vastuse keha, seejärel jälgima väljade ahelat ja välja selgitama, milline teenus tegelikult tõrkus.

Ka REST suudab lõpp-punkti taha segadust peita. On täiesti võimalik ehitada REST-teenus ebamääraste teekondade, valede olekukoodide ja sellise sisemiste päringute jadaga, mida keegi ei suuda jälgida. Protokoll ei päästa kedagi halbadest piiridest.

Sellegipoolest on mul hästi kavandatud REST-päringut lihtsam peas hoida. Ma tean, millist operatsiooni ma uurin. Mul on ressurss, meetod, staatus ja tavaliselt lühem nimekiri kohtadest, kust alustada. Filtreerimine ei tee lõpp-punkti maagiliseks, see teeb selle lihtsalt kasulikumaks.

Minu töös on sellisest etteaimatavusest saanud voorus.

## Erand, mis pani mind peatuma

Hiljem vaatasin põgusalt Hasurat.[^6] See meeldis mulle peaaegu kohe, mis oli pärast kõike seda kurtmist pisut ootamatu.

Ma pole seda kasutanud piisavalt põhjalikult, et väita, nagu lahendaks see ülaltoodud probleemid. Minu tähelepanu köitis miski tuttav: otsene seos andmemudeli ja API vahel, kus filtreerimine ja seosed on juba valmis kujul olemas. Selle seoste mudel meenutas mulle seda praktilist poolt, mis mulle LoopBackis meeldis.[^7]

Võib-olla ei häiri mind niivõrd GraphQL, kuivõrd vajadus kaevata lahti terve täitmisteekond, et mõista ühte süütuna näivat päringut. Hasura pole minu lõplikku hinnangut veel saanud, kuid see on kindlasti väärt teist pilku.

## Märkmed

[^1]: [LoopBack 3 dokumentatsioon](https://loopback.io/doc/en/lb3/) ja [LoopBack 4 dokumentatsioon](https://loopback.io/doc/en/lb4/).
[^2]: [LoopBack 4 väljade filter](https://loopback.io/doc/en/lb4/Fields-filter.html), [päringufiltrid](https://loopback.io/doc/en/lb4/Querying-data.html) ja [kaasamise filter](https://loopback.io/doc/en/lb4/Include-filter.html).
[^3]: [DataLoader](https://github.com/graphql/dataloader).
[^4]: [GraphQL Tools skeemide sidumine ja delegeerimine](https://the-guild.dev/graphql/stitching/docs).
[^5]: [GraphQL over HTTP spetsifikatsioon](https://http-spec.graphql.org/draft/).
[^6]: [Hasura](https://hasura.io/).
[^7]: [Hasura seosed](https://hasura.io/learn/graphql/hasura/relationships/).
