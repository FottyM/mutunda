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

Mäletan ühte *pealtnäha süütut* päringut, mis viis toodangu mälupuuduse tõttu krahhini **(OOMKill)**. Pealtnäha oli tegu puhta ja lihtsa andmelehega, kuid selle all peituvad mehhanismid muutusid kontrollimatuks päringute laviiniks.

Selleks ajaks tundus tootmisseadistus mulle juba kummaline. Seal oli **skeemide kokkuõmblemine (stitching)**, **delegeerimine**, **laienduspunktid**, **fragmendid** ja **DataLoader**. Väike päring võis nõuda pikka süvenemist enne, kui sain aru, mis tegelikult toimub.

See oli kaugel sellest, mis mind algselt GraphQL-i juures köitis.

## Enne seda kõike ma armastasin seda

Umbes 2018. aastal vaatasin [Net Ninja](https://www.youtube.com/watch?v=Y0lDGjwRYKw&list=PL4cUxeGkcC9iK6Qhn-QLcXCXPQUov1U7f) õpetust ja olin GraphQL-ist *vaimustuses*. Väljade valimine ja pesastatud andmete pärimine oli väga meeldiv. Sain kirjeldada, mida tahtsin, ja saada täpselt selle kuju tagasi.

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

See kattis juba osa sellest, mis mulle GraphQL-i juures muljet avaldas. See oli filter HTTP-päringul ja nende vajaduste jaoks piisas mulle sellest *täiesti*.

Meie seadistuses saime mudeleid pärida ja filtreerida ka teenuste vahel. Mäletan, et selles osales Strong Remoting (`strong-remoting`). LoopBacki kaugkonnektor kasutab seda teises rakenduses avatud mudelimeetodite väljakutsumiseks, ehkki see konnektor kuulus rangelt LoopBack 3 juurde ja ei toetanud selgesõnaliselt LoopBack 4 versiooni.[^2]

## Tagasi tootmisseadistuses

Kui naasin teisel töökohal GraphQL-i juurde, kasutasime kliendi poolel Apollot ja taustaprogrammis GraphQL Yogat. Kohe muutus päringu õnnestumise kontrollimine omaette katsumuseks. Meie seadistuses olid päringud POST-id ja HTTP 200 võis sisaldada vigu või ainult osa küsitud andmetest.

Käsuga `fetch` kontrollib `response.ok` ainult HTTP olekut. See ei kontrolli GraphQL-i vigu.[^3] Pärast seda kontrolli vajab klient, mis keeldub osalistest tulemustest, midagi sellist:

```js
const result = await response.json();

if (result.errors?.length) {
  throw new Error(result.errors.map((error) => error.message).join("; "));
}

return result.data;
```

See on üks poliitika, mitte ainus. Ekraan võib soovida näidata õnnestunud osi, sel juhul peab see säilitama nii andmed kui ka vead. GraphQL lubab täitmisvigu koos osaliste andmetega.[^4]

GraphQL-i server võib valideerimistõrgete või lüüsi krahhi korral tehniliselt tagastada koodi 400 või 500 ning päringuid saab põhimõtteliselt teha ka GET-iga.[^5] Kuid meie seadistuses oli iga päring POST ning täitmistõrked saabusid reeglina pakituna HTTP 200 sisse. <mark>HTTP olek üksi ei öelnud mulle midagi.</mark> Pidin vastuse keha lahti pakkima ainuüksi selleks, et teada saada, kas päring ebaõnnestus.

Ja siis pidin veel leidma, *kus* see oli ebaõnnestunud.

## Pealtnäha süütu päringu jälitamine

Siin tuleb see pealtnäha süütu päring uuesti mängu. See küsis lehekülge umbes kahekümne olemiga, kuid selle laiendusväljade taga peituv töö oli kutsuja eest täielikult varjatud.

Meie ülesehituses laiendasime skeemi kohandatud lahendajatega.[^6] Nendes lahendajates sai väli delegeerida teisele skeemile, käitada GraphQL-i päringu üle HTTP või teha tavalisi HTTP-päringuid allavoolu teenustesse.

Meie puhul tegi lahendaja iga olemi jaoks tavalisi HTTP-päringuid **viide teise teenusesse**.

Selle kaudsuse illustreerimiseks on siin lihtsustatud lahendaja. See ei ole meie tootmiskood, kuid see näitab, kuidas need väljakutsed seesmiselt toimisid:

```js
// resolver.ts
export const resolver = {
  async resolve(parent: any, args: any, context: any, info: any) {
    const [serviceA, serviceB, serviceC, serviceD, serviceE] =
      await Promise.all([
        fetch(`https://api.internal/service-a/${parent.id}`).then((r) => r.json()),
        fetch(`https://api.internal/service-b/${parent.id}`).then((r) => r.json()),
        fetch(`https://api.internal/service-c/${parent.id}`).then((r) => r.json()),
        fetch(`https://api.internal/service-d/${parent.id}`).then((r) => r.json()),
        fetch(`https://api.internal/service-e/${parent.id}`).then((r) => r.json()),
      ]);

    // Add work of our own.
    const extraData = await fetchExtraData(parent.id);
    return { ...parent, extraData };
  },
};
```

See laiendus tegi viis HTTP-päringut iga tagastatud olemi kohta. Kui klient küsis lehekülje kahekümne olemiga, ajastas see ainus GraphQL-i päring **sada allavoolu HTTP-kõnet** enne algse lehe laadimise arvestamist.

Väljalaset tabas mälupuuduse tõrge, mistõttu võtsime samaaegsuse kontrollimiseks kasutusele `p-limit`i. Näitlik lahendaja sai need allavoolu kõned mähkida nii:

```js
// Väljaspool lahendajat, jagatud selles protsessis.
const limit = pLimit(5);

// Laienduslahendaja sees.
const results = await Promise.all(
  services.map((url) => limit(() => fetch(url).then((r) => r.json()))),
);
```

Väljakutsed toimuvad endiselt. See piirab samaaegselt töötavate mähitud operatsioonide arvu; see ei rühmita neid ega vähenda nende arvu. Ülempiiri jagavad seda piirajat kasutavad toimingud selles protsessis, mitte iga server klastris.[^7]

<mark>See ongi see, mis mind selle tehnoloogia juures nii väga frustreerib.</mark> Üheainsa välja mõistmiseks tuleb lahti harutada ülemine päring, kohandatud lahendaja ja HTTP-kõned viide eraldi teenusesse. Päring eesotsas ei ütle peaaegu midagi selle kohta, mis tegelikult toimub.

DataLoader on teine asi, mida samas seadistuses mõista. See saab laadimisi rühmitada ja tulemusi eksemplari sees vahemällu salvestada, kuid see *ei* tähenda, et iga allavoolu kõne rühmitatakse automaatselt. Selle dokumentatsioon soovitab eksemplare, mis on seotud üksikute päringutega.[^8]

Pean teadma, kus me seda kasutasime, samamoodi nagu pean teadma, kus me skeeme kokku õmblesime või laienduspunkte lisasime. Kui midagi läheb valesti, lakkavad need üksikasjad olemast taustal tehtud teostusvalikud.

## Ja oli ka teisi intsidente

Mäletan, et üks väli lekkis valeseadistuse tõttu teise päringusse. Samuti oli samade väärtuste, kuid erinevate nimedega enume, mis ei ilmunud enne, kui tegin midagi, mida kirjeldasin *tüüpide ümbervalamisena*.

Need on kogemused minu arvamuse taga. Minu meelest on kasulike olekute ja piisava filtreerimisega REST API-st lihtsam aru saada. Ka REST võib tööd peita, kuid ma ei tundnud, et vajan soovitud filtreerimise ja seoste saamiseks kogu seda delegeerimist.

Tunnen, et paremad teenused, vahemällu salvestamine ja võrgud on lahendanud paljud probleemid, mida GraphQL pidi lahendama. Samal ajal muutus selle seadistusega töötamine minu jaoks õudusunenäoks. **Ma tõesti ei armasta seda enam. Ma vihkan seda.**

Aastaid tagasi vaatasin Harry Wolffit selgitamas oma videos, miks ta astus maha GraphQL-i vaimustuse rongilt.[^9] Tollal ei saanud ma sellest päriselt aru. GraphQL tundus ikka veel geniaalse imerohuna. Kuid selle seadistuse läbielamine tõi iga tema välja toodud punkti kristallselgelt esile.

Istumise ajal oma keldris keset kolimiskaste selgitas Harry, kuidas <mark>kasutajaliidese lihtsuse lubadus peidab tegelikult tohutut taustaprogrammi keerukust</mark>. Klient saab hõlpsasti valida täpselt need kastid, mida soovib, kuid selle toimima saamine nõuab sarnast vaeva nagu kliimaseadme paigaldamine: termostaadi reguleerimine teisel korrusel näeb välja vaevatu, kuid ventilatsioonitorude ja torustiku vedamine nõuab tohutut nähtamatut tööd. Ta võttis kokku tõelised kitsaskohad: kuidas keerukus nihkub ebaühtlaselt taustaprogrammi, kuidas POST-i kaudu tehtavad päringud loobuvad veebilehitseja tavalisest HTTP vahemälust, kuidas naiivsed lahendajad tekitavad andmebaasidele märkamatuid N+1 ülekoormusi ning kuidas see loodi eelkõige Facebooki organisatsioonilise mastaabi lahendamiseks, mitte tavaliste meeskondade vajadusteks. Ta lõpetas tõdemusega, et *puhkab REST-iga märksa rahulikumalt*. Ma ei saaks rohkem nõustuda.

Selles on veel üks osa: meie majasisene Hasura-laadne tööriist. Ma vihkan ka seda ja see mõjutab tugevalt minu suhtumist GraphQL-i. Kuid see on lugu teiseks päevaks.

See tööriist oli põhjus, miks läksin ja vaatasin Hasurat ennast. Ma ei tea endiselt, kas see tuli minu kiindumusest LoopBacki filtrite vastu või sellest, kui lihtne nähtu oli, kuid pärast põgusat pilku *olin sellest vaimustuses*.

## Notes

[^1]: LoopBack 3: [andmete pärimine](https://loopback.io/doc/en/lb3/Querying-data.html) ning [seoste kaasamine ja sidumisväljade säilitamine](https://loopback.io/doc/en/lb3/Include-filter.html).
[^2]: [LoopBacki kaugkonnektor](https://github.com/strongloop/loopback-connector-remote), sealhulgas selle Strong Remotingi kasutus ja LoopBack 4 toe puudumine.
[^3]: [Fetch standard: vastuse `ok`](https://fetch.spec.whatwg.org/#dom-response-ok).
[^4]: [GraphQL-i spetsifikatsioon: vastus](https://spec.graphql.org/September2025/#sec-Response).
[^5]: [GraphQL over HTTP mustand](https://graphql.github.io/graphql-over-http/draft/): meetodid, vastuse meediatüübid ja olekukäsitlus.
[^6]: GraphQL Tools: [kaug-alamskeemid](https://the-guild.dev/graphql/stitching/docs/getting-started/remote-subschemas) ja [skeemilaiendused](https://the-guild.dev/graphql/stitching/docs/approaches/schema-extensions).
[^7]: [`p-limit`i dokumentatsioon](https://github.com/sindresorhus/p-limit).
[^8]: [DataLoader: rühmitamine ja päringupõhine vahemälu](https://github.com/graphql/dataloader).
[^9]: Harry Wolff: [Why I'm Off The GraphQL Hype Train](https://www.youtube.com/watch?v=S1wQ0WvJK64).
