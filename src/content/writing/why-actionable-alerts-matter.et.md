---
title: Miks teostatavad hoiatused loevad
description: Kuidas üksainus podi taaskäivituse hoiatus paljastas vaikse neljatunnise krahhi tsükli, valesti seadistatud NestJS-i vahemälu ja kuude kaupa nähtamatuid vigu pärand-graafiteenuses.
date: 2026-11-19
tags:
  - observability
  - alerting
  - nestjs
  - debugging
  - kubernetes
  - pprof
draft: false
cover:
  src: ../../assets/images/writing/why-actionable-alerts-matter-cover.png
  alt: Raamitud geomeetriline juhtpaneel korduva saehambagraafiku ja selle tipus helendava kollase majakaga, mida ääristavad kaks horisontaalset mõõtuririba ja ümmargune sihverplaat.
locale: et
slug: why-actionable-alerts-matter
---

Kui lisasime ühele pärand-taustateenusele lihtsa **podi taaskäivituse hoiatuse**, ei läinud kaua, kuni see märku andis. Üks pod käivitus uuesti *iga nelja tunni järel*, absoluutselt iga päev.

Graafikuid tagasi vaadates oli sama rütm kestnud juba kuid. Keegi polnud seda märganud mitte seepärast, et viga oleks olnud peen, vaid seepärast, et miski polnud seadistatud meile sellest teada andma.

## Hoiatusteta teenuse vaikne hind

Olen seda pärandteenust juba mõnda aega haldanud ja kõige raskem osa pole kunagi olnud üksikute vigade parandamine. Kõige raskem on olnud avastada, kui palju probleeme võib täiesti silme all koguneda, kui ühtegi hoiatust ei ole.

Tegu on NestJS-iga ehitatud graafi-API-ga. Hiljuti tehti seal jõudlusuuendus, et aeglaseid protsesse kiirendada: lisati vahemälu ja DataLoaderid, et vähendada korduvat tööd resolverites. Paberil tundus muudatus igati mõistlik. Päringud oleksid pidanud muutuma kiiremaks ja koormama allavoolu teenuseid vähem.

Tegelikult hakkasime teenuse kehva seisu nägema alles siis, kui asusime seadma uusi **teenusetaseme eesmärke (SLO)**.[^1] Numbreid üle vaadates paistis vigu palju rohkem, kui keegi oli arvanud.

Just siis otsustasime pimesi töötamise lõpetada ja seadistasime ühe lihtsa, teostatava hoiatuse: anna meile teada alati, kui selle teenuse konteiner taaskäivitub.

Siin on näitlik Prometheuse hoiatusreegel, mitte meie tootmiskood, mis näitab, millist signaali me otsisime:

```yaml
# Näitlik Prometheuse hoiatusreegel
alert: GraphApiPodRestarted
expr: |
  sum by (namespace, pod) (
    increase(kube_pod_container_status_restarts_total{namespace="graph-api"}[15m])
  ) > 0
```

See on tavaline loendur, mida pakub `kube-state-metrics`.[^2] Erinevalt ebamäärasest protsessorihoiatusest, mille inimesed õpivad vaigistama, esitab toodangus taaskäivituv konteiner alati konkreetse küsimuse: *miks see protsess suri?*

## Neljatunnine metronoom

Niipea kui hoiatus tööle hakkas, ei saanud mustrit enam eirata. Iga nelja tunni järel, peaaegu nagu metronoom, kukkus pod kokku ja Kubernetes pani asemele värske koopia.

Kuna Kubernetes vahetas kokku kukkunud podi iga kord vaikselt välja, liikus liiklus edasi ja kedagi ei aetud jalule. <mark>Orkestraator, mis peidab krahhid ilma neist teada andmata, ei tee teenust töökindlaks; see teeb vead lihtsalt vaikseks.</mark>

Taaskäivituse hoiatus andis meile korraga kaks asja, millest olime kuid puudust tundnud: kindla tõendi, et midagi lekib või kukub aktiivselt kokku, ning selge neljatunnise akna, mida uurida.

## Lekke jälil pprofi, meetrikate ja AI abil

Et näha, mis protsessi mälu täitis, lülitasime sisse **`pprof`-i**, et koguda mäluhunniku profiile ja näha, kuhu mälu tegelikult läheb.[^4] Kõrvutasime need profiilid vanade heade **Grafana ja Prometheuse** meetrikatega, et panna ühele ajajoonele mälukasv, taaskäivituste ajad ja väljalasete ajalugu.

See ajajoon tegi ära poole tööst. Saehambakujuline mälukasv algas täpselt pärast vahemälu ja DataLoaderite uuenduse avaldamist. Sealt edasi kasutasime AI-d koos `pprof`-i väljundi ja koodibaasiga, et jälitada täpset mälujaotuse teekonda ning eristada tõenäolised kahtlusalused tegelikust põhjusest.

See, mille leidsime, oli tagantjärele peaaegu koomiline.

## Kirjutamised mäluhunnikusse, lugemised Redisesse

Meeskond oli arvanud, et uus vahemälu töötab Redise peal. Tegelik olukord oli peenem ja palju hullem: **lugemised läksid Redisesse, samal ajal kui kirjutamised läksid protsessi kohalikku sisemällu**, ning NestJS-i vahemälukihis oli määratud **ühe nädala pikkune TTL**.[^3]

Siin on näitlik NestJS-i seadistus, mitte meie tootmiskood, mis näitab, kuidas eraldi Redise kliendi ja vaikimisi sisemälus töötava `CacheModule`-i lahknevus paneb lugemised ja kirjutamised rääkima kahe eri kohaga:

```ts
import { CacheInterceptor, CacheModule, CacheTTL } from "@nestjs/cache-manager";
import { Controller, Get, Module, UseInterceptors } from "@nestjs/common";

@Module({
  // Ilma selge välise salvestita kasutab CacheModule protsessi sisemälu.
  imports: [CacheModule.register()],
})
export class AppModule {}

@Controller("items")
@UseInterceptors(CacheInterceptor)
export class ItemsController {
  // Kirjutamised lähevad podi kohalikku mäluhunnikusse 7-päevase TTL-iga,
  // samal ajal kui lugemine pärib Redise käest ja läheb iga kord mööda.
  @Get()
  @CacheTTL(7 * 24 * 60 * 60 * 1000)
  findAll() {
    return this.loadItemsFromRedisOrDb();
  }
}
```

Iga päring maksis seega mõlema maailma halvima hinna. Lugemine küsis Redisest ja jäi tühjade kätega, sest sinna ei kirjutatud midagi. Vastus kirjutas seejärel sisu podi kohalikku mäluhunnikusse koos aegumistaimeriga, mis ootas terve nädala, enne kui selle eemaldada.

Pod ei kestnud kunagi nädalani välja. Iga nelja tunni järel sai mälulagi täis, konteiner suri ja värskelt käivitunud pod hakkas tühja mälu uuesti otsast peale täitma. <mark>Kuna lugemised läksid Redisesse ja kirjutamised kohalikku mällu, ei tabanud vahemälu kordagi, kuid kukutas podi ikkagi iga nelja tunni järel kokku.</mark>

## Salvesti parandamine ja graafikute rahunemine

Kui juurpõhjus oli selge, oli parandus lihtne: suunata nii lugemised kui ka kirjutamised samasse Redise salvestisse, nii et vahemälu kirjed ja nende aegumised elaksid Redises ega koguneks podi muutmällu.

Näitlikult näeb välise salvesti selge seadistamine välja nii:

```ts
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";
import KeyvRedis from "@keyv/redis";

@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        stores: [new KeyvRedis(process.env.REDIS_URL)],
        ttl: 7 * 24 * 60 * 60 * 1000,
      }),
    }),
  ],
})
export class AppModule {}
```

Pärast paranduse avaldamist muutus saehambakõver sirgeks. Podi taaskäivituse hoiatus lakkas täielikult käivitumast. Veel parem, kuna vahemälu elab nüüd päriselt Redises ja jääb alles üle päringute ning taaskäivituste, langes meie **p95 latentsus** märgatavalt madalamale kui varem.

Miski sellest ei juhtunud seepärast, et oleksime äkki osanud pärandteenuse vigu paremini ära arvata. See juhtus seepärast, et üks väike ja teostatav hoiatus tõi neljatunnise tõrke lõpuks päevavalgele.

## Notes

[^1]: Google SRE Book: [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).
[^2]: `kube-state-metrics`: [Podi meetrikad (`kube_pod_container_status_restarts_total`)](https://github.com/kubernetes/kube-state-metrics/blob/main/docs/metrics/workload/pod-metrics.md).
[^3]: NestJS-i dokumentatsioon: [Caching (`@nestjs/cache-manager`)](https://docs.nestjs.com/techniques/caching).
[^4]: Google `pprof` Node.js-ile: [`google/pprof-nodejs`](https://github.com/google/pprof-nodejs).
