---
title: Why actionable alerts matter
description: How a single pod restart alert exposed a silent four-hour crash loop, a misconfigured NestJS cache, and months of invisible failures in a legacy graph service.
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
  alt: A framed geometric dashboard panel showing a repeating sawtooth line graph with a glowing yellow beacon at its peak, flanked by two horizontal gauge bars and a circular dial.
locale: en
---

When we added a single **pod restart alert** to a legacy backend service, it did not take long to fire. A pod was restarting *every four hours*, every single day.

Looking back through the graphs, that rhythm had been running for months. Nobody had noticed, not because the problem was subtle, but because nothing had been wired up to tell us.

## The quiet cost of a service with no alerts

I have been looking after this legacy service for a while, and the hardest part has never been fixing individual bugs. It has been discovering how many problems can pile up in plain sight when no alerts exist.

The service is a graph API built with NestJS. Not long ago, it received a round of performance updates meant to speed up slow requests: caching was added alongside DataLoaders to reduce repeated work across resolvers. On paper, the change made sense. Requests should have become faster and lighter on downstream dependencies.

In practice, we only started seeing how unhealthy the service really was when we sat down to define new **Service Level Objectives (SLOs)**.[^1] Pulling up the numbers revealed far more errors than anyone expected.

That was the moment we decided to stop flying blind and add a basic, actionable alert: tell us whenever a container in this service restarts.

Here is an illustrative Prometheus alert expression, not our production rule, showing the kind of signal we wanted:

```yaml
# Illustrative Prometheus alert rule
alert: GraphApiPodRestarted
expr: |
  sum by (namespace, pod) (
    increase(kube_pod_container_status_restarts_total{namespace="graph-api"}[15m])
  ) > 0
```

It is a simple counter exposed by `kube-state-metrics`.[^2] Unlike a vague CPU warning that people learn to mute, a container restarting in production always asks a concrete question: *why did that process die?*

## A four-hour heartbeat

Once the alert was live, the pattern was impossible to ignore. Every four hours, almost like a metronome, a pod would fall over and Kubernetes would bring a fresh one back up.

Because Kubernetes quietly replaced the crashed pod each time, traffic kept flowing and nobody got paged. <mark>An orchestrator that hides crashes without alerting on them does not make a service reliable; it just makes failures quiet.</mark>

Seeing the restart alert fire gave us two immediate things we had lacked for months: proof that something was actively leaking or crashing, and a clean four-hour window to inspect.

## Tracing the leak with `@datadog/pprof`, metrics, and AI

To find out what was filling up the process, we turned on **`@datadog/pprof`** to capture heap profiles and observe where memory was actually going.[^4] We combined those profiles with good old **Grafana and Prometheus** metrics to line up memory growth, restart timestamps, and deployment history.

The metrics timeline did half the work. The sawtooth memory climb started right after the caching and DataLoader update had shipped, which immediately narrowed the search to that release. The heap profiles then pointed to what was actually piling up inside Node.js: retained cached payloads alongside expiration timers that were never being released before the pod died.

From there, we used AI alongside the `@datadog/pprof` output and the codebase to trace those allocations back to the exact NestJS caching layer and separate plausible suspects from the real cause. AI sped up the code path tracing, while Grafana and Prometheus kept us honest about when the behaviour started and whether the hypothesis matched production.

What we found was almost funny in hindsight.

## Writes to the heap, reads from Redis

The team had intended to back the new cache with Redis. What had actually happened was more subtle and far worse: **reads were going to Redis, while writes were going to local process memory**, with a **one-week TTL** set via the NestJS caching layer.[^3]

It is easy to see how a bug like that slips through review. Neither path throws an error. A service can hold a working Redis client for reads while a NestJS `CacheModule` or decorator quietly falls back to its default in-memory store for writes. Everything compiles, tests pass, and Redis looks healthy because it is barely being touched.

Here is an illustrative NestJS setup, not our production code, showing how easily a split between a custom Redis client and a default in-memory `CacheModule` can leave reads and writes talking to two different places:

```ts
import { CacheInterceptor, CacheModule, CacheTTL } from "@nestjs/cache-manager";
import { Controller, Get, Module, UseInterceptors } from "@nestjs/common";

@Module({
  // Without an explicit external store, CacheModule defaults to process memory.
  imports: [CacheModule.register()],
})
export class AppModule {}

@Controller("items")
@UseInterceptors(CacheInterceptor)
export class ItemsController {
  // Writes land in the pod's local heap with a 7-day TTL,
  // while the service's read path queries Redis and misses every time.
  @Get()
  @CacheTTL(7 * 24 * 60 * 60 * 1000)
  findAll() {
    return this.loadItemsFromRedisOrDb();
  }
}
```

Every request therefore paid the worst of both worlds. The read checked Redis and missed, because nothing was being written there. The response then wrote the payload into the pod's local heap along with an expiration timer waiting a full week to clear it.

The pod never came close to lasting a week. Every four hours, the heap hit its ceiling, the container died, and the freshly started pod began filling its empty memory all over again. <mark>Because reads went to Redis and writes went to local memory, the cache never hit once, yet still crashed the pod every four hours.</mark>

## Fixing the store and watching the graphs settle

Once the root cause was clear, the fix was straightforward: align reads and writes on the same Redis store so cached entries and TTL expirations live in Redis rather than accumulating inside the pod's RAM.

In illustrative terms, moving the store configuration explicitly to an external backend looks like this:

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

After we released the fix, the sawtooth curve flattened out. The pod restart alert stopped firing completely. Better still, with the cache finally living in Redis and surviving across requests and restarts, our **p95 latency** dropped well below where it had been before.

## What makes an alert worth keeping

Working through a legacy service taught me to be picky about what earns an alert. Adding twenty noisy rules is almost as bad as having none, because people quickly stop reading them.[^1]

An alert is worth wiring up when it points to a concrete failure mode that demands an investigation: a container restarting in production, an out-of-memory kill, or a sustained burn against an SLO error budget. Metrics that fluctuate normally on their own, like brief CPU spikes or raw cache hit ratios, belong on a dashboard where you can inspect them during debugging rather than in an alert channel.

Starting with one unmistakable signal beat trying to instrument everything at once. None of this got fixed because we suddenly became better at guessing what was wrong with a legacy service. It got fixed because one small, actionable alert finally forced a four-hour failure into the open.

## Notes

[^1]: Google SRE Book: [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/).
[^2]: `kube-state-metrics`: [Pod metrics (`kube_pod_container_status_restarts_total`)](https://github.com/kubernetes/kube-state-metrics/blob/main/docs/metrics/workload/pod-metrics.md).
[^3]: NestJS Documentation: [Caching (`@nestjs/cache-manager`)](https://docs.nestjs.com/techniques/caching).
[^4]: Datadog `pprof` for Node.js: [`@datadog/pprof` (`DataDog/pprof-nodejs`)](https://github.com/DataDog/pprof-nodejs).
