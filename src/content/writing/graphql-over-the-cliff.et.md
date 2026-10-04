---
title: Kuidas mu armastus GraphQL-i vastu kaljult alla kukkus
description: Net Ninja õpetusest LoopBacki filtriteni, GraphQL-i silumiseni tööl ja põgusa pilguni Hasurale.
date: 2026-10-04
tags:
  - graphql
  - architecture
  - debugging
draft: false
cover:
  src: ../../assets/images/writing/graphql-over-the-cliff-cover.png
  alt: Abstraktne päringuleht kaldumas üle kaljuserva torude ja teenusesõlmede võrgustikku.
locale: et
slug: graphql-over-the-cliff
---

Mäletan ühte pealtnäha süütut päringut. Leht umbes kahekümne olemiga, millest igaühel olid laiendused, mis tegid umbes viis päringut teise teenusesse. Väljalase põrkus mälupuuduse tõrkega (OOMKill) ja me lõpetasime `p-limit`i kasutamisega.

Selleks ajaks tundus tootmisseadistus mulle juba kummaline. Seal oli skeemide kokkuõmblemine (stitching), delegeerimine, laienduspunktid, fragmendid ja DataLoader. Väike päring võis nõuda pikka süvenemist enne, kui sain aru, mis tegelikult toimub.

See oli kaugel sellest, mis mind algselt GraphQL-i juures köitis.

## Enne seda kõike ma armastasin seda

Umbes 2018. aastal vaatasin [Net Ninja](https://www.youtube.com/watch?v=Y0lDGjwRYKw&list=PL4cUxeGkcC9iK6Qhn-QLcXCXPQUov1U7f) õpetust ja olin GraphQL-ist vaimustuses. Väljade valimine ja pesastatud andmete pärimine oli väga meeldiv. Sain kirjeldada, mida tahtsin, ja saada täpselt selle kuju tagasi.

Seejärel sain töökoha, kus kasutati LoopBacki, IBM/StrongLoopi raamistikku. See võimaldas defineerida andmebaasiga seotud mudeleid ja anda päringustringis filtreid kaasa. Saime valida välju ja kaasata ka seoseid.

Siin on näitlik LoopBack 3 päring, mitte kood sellest töökohast. Oletame `Post` mudelit seotud `category` seosega:

```js
const filter = {
  where: { published: true },
  fields: { id: true, title: true, categoryId: true },
  include: { relation: "category" },
  limit: 10,
};

const params = new URLSearchParams({
  filter: JSON.stringify(filter),
});
const response = await fetch(`/api/posts?${params}`);
if (!response.ok) throw new Error(`HTTP ${response.status}`);
const posts = await response.json();
```

Filter valib avaldatud postitused, küsib konkreetsed väljad ja kaasab kategooria. Jätsin alles `categoryId`, sest seose laadimine võib vajada selle sidumisvõtit.[^1]

See kattis juba osa sellest, mis mulle GraphQL-i juures muljet avaldas. See oli filter HTTP-päringul ja nende vajaduste jaoks piisas mulle sellest täiesti.

Meie seadistuses saime mudeleid pärida ja filtreerida ka teenuste vahel. Mäletan, et selles osales Strong Remoting. LoopBacki kaugkonnektor kasutab seda teise LoopBacki rakenduse avaldatud mudelimeetodite väljakutsumiseks, kuigi ma ei suuda sellest mälestusest meie täpset ühendust taastada.[^2]

Olen seda lugu rääkides maininud LoopBack 3 ja 4, kuid neid ei tohiks siin omavahel segi ajada. See kaugkonnektor ei toeta selgesõnaliselt LoopBack 4.[^2]

## Tagasi tootmisseadistuses

Kui naasin GraphQL-i juurde teises töökohas, kasutasime kasutajaliidese poolel Apollot ja tagaosas GraphQL Yogat. Seal muutus korraldus minu jaoks kummaliseks: kokkuõmblemine, delegeerimine, laiendused, fragmendid ja kogu vaev, mida oli vaja päringu jälgimiseks läbi nende.

Isegi päringu õnnestumise kontrollimine vajas rohkem tähelepanu. Meie seadistuses olid päringud POST-id ja HTTP 200 võis sisaldada vigu või ainult osa küsitud andmetest.

Käsuga `fetch` kontrollib `response.ok` ainult HTTP olekut. See ei kontrolli GraphQL-i vigu.[^3] Pärast seda kontrolli vajab klient, mis keeldub osalistest tulemustest, midagi sellist:

```js
const result = await response.json();

if (result.errors?.length) {
  throw new Error(result.errors.map((error) => error.message).join("; "));
}

return result.data;
```

See on üks poliitika, mitte ainus. Ekraan võib soovida näidata õnnestunud osi, sel juhul peab see säilitama nii andmed kui ka vead. GraphQL lubab täitmisvigu koos osaliste andmetega.[^4]

Samuti ei tagasta iga GraphQL-i tõrge koodi 200 ega nõua iga päring POST-i. Need üksikasjad sõltuvad tõrkest ja HTTP käsitlusest.[^5] Minu etteheide puudutab keskkonda, kus ma töötasin: olek üksi ei öelnud mulle piisavalt ja ma pidin uurima enamat, enne kui teadsin, mis ebaõnnestus.

Ja siis pidin veel leidma, kus see oli ebaõnnestunud.

## Pealtnäha süütu päringu jälitamine

Siin tuleb see kahekümne olemiga leht loosse tagasi. Päring oli väike. Selle laiendusväljade taga olev töö ei olnud seda lugedes ilmne.

Selle kaudsuse illustreerimiseks on siin lihtsustatud GraphQL Toolsi delegeerimislahendaja. See ei ole meie tootmiskood. See näitab, kuidas väli saab suunata töö alusskeemile:

```js
// resolvers.js
import { delegateToSchema } from "@graphql-tools/delegate";

export const resolvers = {
  Query: {
    page: (_parent, args, context, info) =>
      delegateToSchema({
        schema: subschema,
        operation: "query",
        fieldName: "entity",
        args,
        context,
        info,
      }),
  },
  Entity: {
    extras: (entity) =>
      Promise.all(extraClients.map((client) => client(entity.id))),
  },
};
```

See väljavõte eeldab konfigureeritud ülemist alamskeemi, mis avaldab olemi `entity`. Delegeerimine saadab töö sellele alusskeemile; laienduslahendaja saab seejärel lisada oma töö.[^6] Apollo ja Yoga kirjeldavad meie seadistuse kliendi- ja serveriosi, mitte iga sammu, mida päring teeb saabumise ja tulemuse tagastamise vahel.

Oletame, et laiendus kasutab iga tagastatud olemi jaoks viit teenuseklienti. Nii võib kahekümne olemiga leht ajastada sada allavoolu väljakutset enne esialgse ülemise päringu arvestamist.

Meie väljalaset tabas mälupuuduse tõrge ja me kasutasime samaaegsuse piiramiseks `p-limit`it. Näitlik laienduslahendaja saaks piirajat jagada nii:

```js
// Väljaspool lahendajat, jagatud selles protsessis.
const limit = pLimit(5);

// Laienduslahendaja sees.
return Promise.all(
  extraClients.map((client) => limit(() => client(entity.id))),
);
```

Väljakutsed toimuvad endiselt. See piirab samaaegselt töötavate mähitud operatsioonide arvu; see ei rühmita neid ega vähenda nende arvu. Ülempiiri jagavad seda piirajat kasutavad toimingud selles protsessis, mitte iga server klastris.[^7]

Mul ei ole siin mäluprofiili, mis tõestaks meie rikke täpset põhjust. Need koodijupid selgitavad väljakutsete hargnemist ja samaaegsuse juhtimist, mitte kogu intsidenti.

Kuid see on osa, mis mind frustreerib. Ühe välja mõistmiseks vaatan nüüd ülemist päringut, delegeeritud lahendajat, laiendust ja kõnesid teise teenusesse. Päring eesotsas annab mulle sellest teekonnast väga vähe teada.

DataLoader on teine asi, mida samas seadistuses mõista. See saab laadimisi rühmitada ja tulemusi eksemplari sees vahemällu salvestada, kuid see ei tähenda, et iga allavoolu kõne rühmitatakse automaatselt. Selle dokumentatsioon soovitab eksemplare, mis on seotud üksikute päringutega.[^8]

Pean teadma, kus me seda kasutasime, samamoodi nagu pean teadma, kus me skeeme kokku õmblesime või laienduspunkte lisasime. Kui midagi läheb valesti, lakkavad need üksikasjad olemast taustal tehtud teostusvalikud.

## Ja oli ka teisi intsidente

Mäletan, et üks väli lekkis teise päringusse, sest me polnud asju õigesti seadistanud. Oli ka samade väärtuste, kuid erinevate nimedega enume. Tulemust ei kuvatud enne, kui tegin midagi, mida kirjeldasin tüüpide ümbervalamisena. Mul pole siin täpset parandust käepärast, seega ei teeskle ma teadvat, kas tegu oli tüübiteisenduse või käitusaja vastendusega.

Need on kogemused minu arvamuse taga. Minu meelest on kasulike olekute ja piisava filtreerimisega REST API-st lihtsam aru saada. Ka REST võib tööd peita, kuid ma ei tundnud, et vajan soovitud filtreerimise ja seoste saamiseks kogu seda delegeerimist.

Tunnen, et paremad teenused, vahemällu salvestamine ja võrgud on lahendanud paljud probleemid, mida GraphQL pidi lahendama. Samal ajal muutus selle seadistusega töötamine minu jaoks õudusunenäoks. Ma tõesti ei armasta seda enam. Ma vihkan seda.

Selles on veel üks osa: meie majasisene Hasura-laadne tööriist. Ma vihkan ka seda ja see mõjutab tugevalt minu suhtumist GraphQL-i. Kuid see on lugu teiseks päevaks.

See tööriist oli põhjus, miks läksin ja vaatasin Hasurat ennast. Ja pärast põgusat pilku olin sellest vaimustuses.

Ma ei tea endiselt, kas see tuli minu kiindumusest LoopBacki filtrite vastu või sellest, kui lihtne nähtu oli. Olin vaid korraks vaadanud, kuid see meeldis mulle.

## Notes

[^1]: LoopBack 3: [andmete pärimine](https://loopback.io/doc/en/lb3/Querying-data.html) ning [seoste kaasamine ja sidumisväljade säilitamine](https://loopback.io/doc/en/lb3/Include-filter.html).
[^2]: [LoopBacki kaugkonnektor](https://github.com/strongloop/loopback-connector-remote), sealhulgas selle Strong Remotingi kasutus ja LoopBack 4 toe puudumine.
[^3]: [Fetch standard: vastuse `ok`](https://fetch.spec.whatwg.org/#dom-response-ok).
[^4]: [GraphQL-i spetsifikatsioon: vastus](https://spec.graphql.org/September2025/#sec-Response).
[^5]: [GraphQL over HTTP mustand](https://graphql.github.io/graphql-over-http/draft/): meetodid, vastuse meediatüübid ja olekukäsitlus.
[^6]: GraphQL Tools: [kaug-alamskeemid](https://the-guild.dev/graphql/stitching/docs/getting-started/remote-subschemas) ja [skeemilaiendused](https://the-guild.dev/graphql/stitching/docs/approaches/schema-extensions).
[^7]: [`p-limit`i dokumentatsioon](https://github.com/sindresorhus/p-limit).
[^8]: [DataLoader: rühmitamine ja päringupõhine vahemälu](https://github.com/graphql/dataloader).
