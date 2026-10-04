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

Mäletan üht lolli päringut: ühel lehel oli umbes 20 olemit ja igal olemil oli laiendus, mis tegi umbes viis päringut teise teenusesse. Väljalaskel sai mälu otsa ja pidime selle p-limitiga korda tegema. Pagan, ma vihkan GraphQL-i.

Umbes 2018. aastal, kui GraphQL hakkas levima,  ma tegelikult ei tea, millal see levima hakkas,, tegin läbi ühe The Net Ninja õpetuse ja olin vaimustuses. See oli lahe. Võimalus pärida välju ja pesastatud andmeid oli tõesti mõnus.

Siis sain 2018. aastal töökoha, kus kasutasime IBMi/StrongLoopi veebiraamistikku LoopBack. Pean silmas LoopBack 3 ja 4.

Seal oli midagi, mida võiks nimetada päringukoostajaks. Määratlesid mudeli, kirje, andmebaasiga seotud olemi. Päringu URL-i päringustringis sai kaasa anda filtri ja saada tagasi just need väljad, mida tahtsid.

Minu arvates lahendas see juba osa probleemidest, mida GraphQL püüdis lahendada.

Kaasata sai ka seoseid. Selles lahenduses, millega mina töötasin, saime isegi pärida ja filtreerida eri teenuste eri mudeleid. Mäletan, et strong-remoting oli sellega seotud, kuigi ma pole kindel, kas see on õige nimi sellele osale, mis selle võimalikuks tegi.

Hiljuti läksin tagasi GraphQL-i juurde, sest sain uue töökoha, kus seda kasutatakse läbivalt.

Esimene asi, mida meie lahenduse puhul märkasin, oli see, et päringud olid POST-päringud. HTTP olekukoodist polnud vigu näha: said 200 ja siis vastuses veaobjektid. Mõnikord õnnestus päring osaliselt.

Siis on veel skeemide delegeerimine, skeemide kokkuõmblemine ja DataLoader. Minu jaoks on seda palju.

Päringud näevad üldiselt süütud välja. Näed väikest päringut, aga sees võib olla rohkem filtreerimist, rohkem välju, skeemide kokkuõmblemist ja skeemide delegeerimist. Asi läheb segaseks, kui pead vigu otsima ja aru saama, mis kuhu läheb.

Oli veel üks juhtum, kus väli lekkis teise päringusse, sest me polnud asju korralikult seadistanud. Ja siis olid enum'id, millel olid samad väärtused, aga erinevad nimed. Tulemus ei ilmunudki enne, kui kohendasin enum'i tüübistust või vastendust. Nii ma seda mäletan; täpset parandust mul siin pole.

Mõnikord võtab see palju aega võrreldes korraliku REST API päringuga, mis annab kasuliku olekukoodi. Ja kui filtreerimissüsteem on piisavalt hea, siis ma ei tunne, et mul kogu seda maagilist delegeerimist vaja oleks.

Mulle tundub, et paljud probleemid, mida GraphQL püüdis lahendada, on paremate teenuste, vahemälu ja võrguühendustega juba lahendatud. Sellega töötamine on minu jaoks muutunud õudusunenäoks. Ma tõesti ei armasta seda enam. Ma vihkan seda.

### Tehniline märkus: filtrid ja väljad

LoopBack 3 võtab vastu JSON-kujul `filter`-päringuparameetri; `where` filtreerib kirjeid, `fields` valib omadused ja `include` laadib määratletud seosed.[^1][^2][^3] Väljade valimisel koos seose kaasamisega võib olla vaja alles jätta seose võtmed: dokumentatsiooni `belongsTo`-näites säilitatakse `categoryId`.[^3] LoopBack 4 dokumentatsioonis on sama hoiatus.[^4]

See on illustreeriv näide brauseri `fetch`-iga, mitte kood minu töökohast. See eeldab LoopBack 3 `Post`-mudelit näidatud väljade ja seadistatud `category`-seosega. ID-d on meelega alles jäetud.

```js
async function getPosts() {
  const filter = {
    where: { published: true },
    fields: { id: true, title: true, categoryId: true },
    include: { relation: "category", scope: { fields: ["id", "name"] } },
    limit: 10,
  };
  const params = new URLSearchParams({ filter: JSON.stringify(filter) });
  const response = await fetch(`/api/posts?${params}`);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
```

### Tehniline märkus: mida strong-remoting teeb

See mälestus on usutav: `strong-remoting` teeb JavaScripti meetodid transpordiadapterite kaudu kaugelt kutsutavaks ning `loopback-connector-remote` kasutab seda sõnaselgelt teise LoopBacki rakenduse avaldatud mudelimeetodite kutsumiseks.[^5][^6] See erineb `loopback-connector-rest`-ist, mis kasutab teiste REST API-dega suhtlemiseks ressursioperatsioone või päringumalle.[^7] Need allikad ei näita, millist konnektorit meie rakendus kasutas või kuidas me teenusteüleseid päringuid koostasime.

LoopBack 4 vastavad osad on HTTP-kontrollerid, andmetele ligipääsu repositories ning seoste kaasamise lahendajad ehk inclusion resolvers.[^8][^9][^10] See ei tähenda, et sellel oleksid LoopBack 3-ga samad remoting'u sisemised mehhanismid: remote-konnektor ütleb sõnaselgelt, et see ei toeta LoopBack 4.[^6]

### Tehniline märkus: HTTP edu ja GraphQL-i edu

Ülal kirjeldatud POST ja 200 puudutavad meie lahendust. GraphQL-over-HTTP mustand nõuab POST-i tuge ning lubab GET-i lugemispäringute, mitte mutatsioonide jaoks.[^11] GraphQL eristab enne täitmist tekkivaid päringuvigu (ilma `data`-ta) täitmisvigadest, millega võib kaasneda osaline `data`.[^12] Kõik vead ei anna 200: HTTP olekukoodide kasutus sõltub vea tekkimise etapist ja vastuse meediatüübist; HTTP dokument on endiselt mustand.[^11]

`fetch`-i `response.ok` kontrollib ainult seda, kas HTTP olekukood jääb vahemikku 200–299; see ei uuri GraphQL-i `errors`-välja.[^13] See teine illustreeriv brauserinäide eeldab näidatud skeemi. See **lükkab osalised andmed teadlikult tagasi**, kui `errors` pole tühi, isegi eduka HTTP vastuse korral. Osalisi andmeid aktsepteeriv kasutajaliides vajab teistsugust reeglit: säilitada nii `data` kui ka `errors` ning näidata, millised osad ebaõnnestusid.[^12]

```js
async function getPosts() {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/graphql-response+json, application/json",
    },
    body: JSON.stringify({ query: "{ posts { id title category { id name } } }" }),
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const result = await response.json();
  if (result.errors?.length) {
    throw new Error(result.errors.map(error => error.message).join("; "));
  }
  return result.data;
}
```

Need koodilõigud näitavad päringute kuju ja veakontrolle, mitte samaväärset filtreerimist ega tootmiskõlblikke kliente. GraphQL-i päringul pole filtreerimis- ega piiranguargumente; need sõltuksid skeemist. Autentimine ja kasutajaliidese veakäsitlus on välja jäetud. Mitte-2xx vastus lükatakse tagasi enne selle sisu lugemist; täielikum klient võiks säilitada ka serveri diagnostika.

### Tehniline märkus: DataLoaderi vahemälu

DataLoader koondab laadimised ning jätab tulemused ühe eksemplari piires meelde. Dokumentatsioon soovitab luua eksemplarid iga päringu jaoks eraldi, mitte jagada vahemällu salvestatud väärtusi eri kasutajate vahel. See vahemälu ei asenda jagatud vahemälu, näiteks Redist.[^14]

### Tehniline märkus: samaaegsus ei ole päringute arv

`p-limit` piirab korraga käivitatavate mähitud operatsioonide arvu; see ei koonda neid kutseid ega eemalda kordusi, seega ei kõrvalda pelgalt samaaegsuse piiramine N+1-laadset kutsete paljunemist.[^15] Piirang kehtib samale piirajale antud tööle: iga saabuva päringu jaoks loodud piiraja piirab selle päringu tööd, protsessis jagatud piiraja aga talle antud tööd selle protsessi päringute lõikes, mitte kõigis serverites.[^15] Ülaltoodud arvud ja mälu otsasaamine on minu mälestus, mitte mõõdetud mäluprofiil ega algpõhjuse rekonstruktsioon.

### Illustreeriv märkus: Hasura Hono taga

Hasura v2-l on oma Remote Schemas funktsioon.[^16] See näide paneb aga Hasura ette **kohandatud JavaScripti lüüsi**; see ei väida, et Hasura kasutaks sisemiselt GraphQL Toolsi.

Siin on `hasura` seadistatud `{ schema, executor }` alamskeem Hasura lõpp-punkti jaoks, mis avaldab `entity`-tabeli. Skeem võib tulla introspektsioonist või etteantud SDL-ist; executor saadab operatsioonid taustateenusele.[^17] `stitchSchemas` lisab `page` ja `extras`; `delegateToSchema` edastab valitud olemiväljad ning `selectionSet` hangib laiendusele vajaliku ID.[^18] Hono käsitleb HTTP-d ja `graphql()` täidab kokkuliidetud skeemi.[^19][^20]

```js
import { Hono } from "hono";
import { graphql } from "graphql";
import { stitchSchemas } from "@graphql-tools/stitch";
import { delegateToSchema } from "@graphql-tools/delegate";
import pLimit from "p-limit";

const limit = pLimit(5);
export function gateway(hasura, extraClients) {
  const schema = stitchSchemas({
    subschemas: [hasura],
    typeDefs: `
      extend type Query { page: [entity!] }
      extend type entity { extras: [String] }
    `,
    resolvers: {
      Query: {
        page: (_, args, context, info) => delegateToSchema({
          schema: hasura, operation: "query", fieldName: "entity",
          args: { limit: 20, order_by: [{ id: "asc" }] }, context, info,
        }),
      },
      entity: {
        extras: {
          selectionSet: "{ id }",
          resolve: (row, args, context) => extraClients.map(client =>
            limit(() => client(row.id, context))),
        },
      },
    },
  });
  const app = new Hono();
  app.post("/graphql", async c => {
    const { query, variables } = await c.req.json();
    return c.json(await graphql({
      schema, source: query, variableValues: variables, contextValue: {},
    }));
  });
  return app;
}
```

`extraClients` on etteantud massiiv viiest asünkroonsest teenusekliendist, millest igaüks tagastab stringi. `{ page { extras } }` võib seega 20 rea jaoks ajastada 100 kutset, kuigi selle mooduli piiraja lubab ühes protsessis päringute peale kokku viis aktiivset kutset. Ülejäänud jäävad järjekorda. See on illustratsioon, mitte meie juhtumi rekonstruktsioon. Testiti ainult kohalikke testteenuseid, mitte päris Hasura serverit. Näitest puuduvad taustateenuse seadistus, autentimine, ajalimiidid, koormuse vastuvõtu piiramine ja täielik GraphQL-over-HTTP käsitlus; ära avalda seda sellisel kujul.

Aga siis vaatasin korraks Hasurat ja olin vaimustuses.

Nüüd ma pole kindel, kas see tuleb mu armastusest LoopBacki filtrite vastu või lihtsalt sellest, kui lihtne nähtu oli. Ma ei tea veel, miks mulle Hasura meeldib.

## Notes

[^1]: [Querying data](https://loopback.io/doc/en/lb3/Querying-data.html).
[^2]: [Fields filter](https://loopback.io/doc/en/lb3/Fields-filter.html).
[^3]: [Include filter](https://loopback.io/doc/en/lb3/Include-filter.html).
[^4]: [Include filter](https://loopback.io/doc/en/lb4/Include-filter.html).
[^5]: [strong remoting documentation](https://raw.githubusercontent.com/strongloop/strong-remoting/master/README.md).
[^6]: [loopback connector remote documentation](https://raw.githubusercontent.com/strongloop/loopback-connector-remote/master/README.md).
[^7]: [REST connector](https://loopback.io/doc/en/lb3/REST-connector.html).
[^8]: [Controller](https://loopback.io/doc/en/lb4/Controller.html).
[^9]: [Repository](https://loopback.io/doc/en/lb4/Repository.html).
[^10]: [Relations](https://loopback.io/doc/en/lb4/Relations.html).
[^11]: [draft](https://graphql.github.io/graphql-over-http/draft).
[^12]: [September2025](https://spec.graphql.org/September2025).
[^13]: [fetch.spec.whatwg.org](https://fetch.spec.whatwg.org).
[^14]: [dataloader documentation](https://raw.githubusercontent.com/graphql/dataloader/main/README.md).
[^15]: [readme.md](https://raw.githubusercontent.com/sindresorhus/p-limit/main/readme.md).
[^16]: [overview](https://hasura.io/docs/2.0/remote-schemas/overview).
[^17]: [remote subschemas](https://the-guild.dev/graphql/stitching/docs/getting-started/remote-subschemas).
[^18]: [schema extensions](https://the-guild.dev/graphql/stitching/docs/approaches/schema-extensions).
[^19]: [basic](https://hono.dev/docs/getting-started/basic).
[^20]: [graphql](https://www.graphql-js.org/api-v16/graphql).
