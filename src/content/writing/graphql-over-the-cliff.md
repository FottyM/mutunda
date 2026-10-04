---
title: How my love for GraphQL fell off a cliff
description: From a Net Ninja tutorial to LoopBack filters, debugging GraphQL at work, and a brief look at Hasura.
date: 2026-10-04
tags:
  - graphql
  - architecture
  - debugging
  - hasura
  - loopback
  - p-limit
draft: false
cover:
  src: ../../assets/images/writing/graphql-over-the-cliff-cover.png
  alt: An abstract query sheet tipping over a cliff into a network of pipes and service nodes.
locale: en
---

I remember one *seemingly harmless* query that brought down production with an **out-of-memory crash (OOMKill)**. On the surface it looked like a clean, innocent page of data, but the machinery underneath turned into a runaway fan-out.

By then, I already found the production setup odd. There was **schema stitching**, **delegation**, **extension points**, **fragments**, and **DataLoader**. A small query could give me quite a lot to follow before I understood what was happening.

That was a long way from what had first attracted me to GraphQL.

## Before all that, I loved it

Around 2018, I followed a [Net Ninja](https://www.youtube.com/watch?v=Y0lDGjwRYKw&list=PL4cUxeGkcC9iK6Qhn-QLcXCXPQUov1U7f) tutorial and *loved* GraphQL. Choosing fields and querying nested data felt really nice. I could describe what I wanted and get that shape back.

Then I got a job using LoopBack, the framework from IBM/StrongLoop. It let us define models attached to a database and pass filters in the query string. We could choose fields and include relationships too.

Here is an illustrative LoopBack 3 request, not code from that job. Assume a `Post` model with a configured `category` relation:

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

The filter selects published posts, asks for specific fields, and includes the category. I have kept `categoryId` because loading a relation can require its linking key.[^1]

That already covered some of what had impressed me about GraphQL. It was a filter on an HTTP request, and for those needs I found it *good enough*.

In our setup, we could also query and filter models across services. I remember Strong Remoting (`strong-remoting`) being involved. LoopBack's remote connector uses it to call exposed model methods in another application, though that connector belonged strictly to LoopBack 3 and explicitly did not support LoopBack 4.[^2]

## Back in a production setup

When I returned to GraphQL in another job, we paired Apollo on the client with GraphQL Yoga on the backend. Right away, verifying whether a request had actually succeeded became an ordeal. In our setup, requests were POSTs, and an HTTP 200 could contain errors or only part of the requested data.

With `fetch`, checking `response.ok` only checks the HTTP status. It does not inspect GraphQL errors.[^3] After that check, a client that refuses partial results needs something like this:

```js
const result = await response.json();

if (result.errors?.length) {
  throw new Error(result.errors.map((error) => error.message).join("; "));
}

return result.data;
```

That is one policy, not the only policy. A screen might still show the successful parts, in which case it needs to keep both the data and the errors. GraphQL permits execution errors alongside partial data.[^4]

A GraphQL server can technically return a 400 or 500 for validation errors or gateway crashes, and queries can technically run over GET.[^5] But in our setup, every query was a POST, and execution errors regularly arrived wrapped inside an HTTP 200. <mark>The HTTP status alone told me nothing.</mark> I had to unpack the body just to know whether a request had failed.

Then I still had to find *where* it had failed.

## Following the seemingly harmless query

This is where that seemingly harmless query comes back into the story. It was asking for a page of twenty entities, but the work behind its extension fields was completely hidden from the caller.

In our setup, we extended the schema with custom resolvers.[^6] Inside those resolvers, a field could delegate to another schema, run a GraphQL query over HTTP, or make plain HTTP requests to downstream services.

In our case, the resolver was making plain HTTP requests to **five other services** for each entity.

To illustrate what that indirection looked like, here is a simplified resolver. This is not our production code, but it shows how those calls were wired inside:

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

That extension was running five HTTP requests for each returned entity. When a client asked for a page of twenty entities, that single GraphQL query scheduled a **hundred downstream HTTP calls**, before counting whatever work fetched the original page.

The release hit an out-of-memory failure, which is why we turned to `p-limit` to control concurrency. An illustrative resolver could wrap those downstream calls like this:

```js
// Outside the resolver, shared within this process.
const limit = pLimit(5);

// Inside the extension resolver.
const results = await Promise.all(
  services.map((url) => limit(() => fetch(url).then((r) => r.json()))),
);
```

The calls still happen. This limits how many wrapped operations run at once; it does not batch them or reduce their number. The cap is shared by work using this limiter in this process, not by every server in a deployment.[^7]

<mark>That is the heart of what frustrates me with this tech.</mark> To understand a single field, you are tracing an upstream query, a custom resolver, and HTTP requests to five different services. The query at the front tells you almost nothing about what is actually happening.

DataLoader is another thing to understand in the same setup. It can batch loads and cache results within an instance, but that does *not* mean every downstream call is automatically batched. Its documentation recommends instances scoped to individual requests.[^8]

I have to know where we used it, just as I have to know where we stitched schemas or added extension points. When something goes wrong, those details stop being background implementation choices.

## And there were other incidents

I remember a field leaking into another query because we had misconfigured things. There were also enums with the same values but different names that would not show until I *“retypecast”* them.

These are the experiences behind my opinion. I find a REST API with useful statuses and sufficient filtering easier to reason about. REST can hide work too, but I did not feel I needed all this delegation to get the filtering and relationships I wanted.

I feel that better services, caching, and networking have addressed a lot of the problems GraphQL was meant to solve. Meanwhile, working with this setup became a nightmare for me. **I really don't love it anymore. I hate it.**

Years ago, I watched Harry Wolff's video on getting off the GraphQL hype train.[^9] Back then, I did not really understand it. GraphQL still seemed like a clever panacea. But living through this setup brought every point he made into sharp focus.

Sitting in his basement surrounded by moving boxes, Harry explained how <mark>the promise of frontend simplicity hides a deep well of backend complexity</mark>. The client can easily ask for whatever box it wants, but getting that to work performantly is like installing air conditioning: adjusting the thermostat upstairs looks effortless, but running the vents, pipes, and plumbing downstairs takes an enormous amount of unseen work. He went through the real trade-offs: how GraphQL moves complexity unevenly to the backend, how queries forced over POST discard built-in HTTP browser caching, how naive resolvers trigger silent N+1 stampedes on databases, and how it was ultimately engineered to solve Facebook's internal organizational scale rather than the needs of everyday teams. He concluded that he simply *rests easier with REST*. I could not agree more.

There is another part of this: our in-house Hasura-like tool. I hate that too, and it contributes to how I feel about GraphQL. But that is a story for another day.

That tool was why I went and looked at Hasura itself. I still do not know whether it was my fondness for LoopBack filters or the clean simplicity of what I saw, but after a brief look, *I loved it*.

## Notes

[^1]: LoopBack 3: [querying data](https://loopback.io/doc/en/lb3/Querying-data.html) and [including relations and retaining linking fields](https://loopback.io/doc/en/lb3/Include-filter.html).
[^2]: [LoopBack remote connector](https://github.com/strongloop/loopback-connector-remote), including its use of Strong Remoting and lack of LoopBack 4 support.
[^3]: [Fetch standard: response `ok`](https://fetch.spec.whatwg.org/#dom-response-ok).
[^4]: [GraphQL specification: response](https://spec.graphql.org/September2025/#sec-Response).
[^5]: [GraphQL over HTTP draft](https://graphql.github.io/graphql-over-http/draft/): methods, response media types, and status handling.
[^6]: GraphQL Tools: [remote subschemas](https://the-guild.dev/graphql/stitching/docs/getting-started/remote-subschemas) and [schema extensions](https://the-guild.dev/graphql/stitching/docs/approaches/schema-extensions).
[^7]: [`p-limit` documentation](https://github.com/sindresorhus/p-limit).
[^8]: [DataLoader: batching and per-request caching](https://github.com/graphql/dataloader).
[^9]: Harry Wolff: [Why I'm Off The GraphQL Hype Train](https://www.youtube.com/watch?v=S1wQ0WvJK64).
