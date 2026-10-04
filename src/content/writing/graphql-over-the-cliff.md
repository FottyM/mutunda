---
title: How my love for GraphQL fell off a cliff
description: From a Net Ninja tutorial to LoopBack filters, debugging GraphQL at work, and a brief look at Hasura.
date: 2026-10-04
tags:
  - graphql
  - architecture
  - debugging
draft: false
cover:
  src: ../../assets/images/writing/graphql-over-the-cliff-cover.png
  alt: An abstract query sheet tipping over a cliff into a network of pipes and service nodes.
locale: en
---

I remember one stupid query: a page of about 20 entities, and each entity had an extension making something like five requests to another service. The release ran out of memory, and we had to fix it with p-limit. Gosh, I hate GraphQL.

Around 2018, when GraphQL was becoming a thing, I don't actually know when it became a thing, I took a tutorial from The Net Ninja and loved it. It was cool. Being able to query fields and nested data was really nice.

Then I got a job in 2018 where we were using LoopBack, the web framework from IBM/StrongLoop. I'm talking about LoopBack 3 and 4.

It had what you could call a query builder. You defined a model, a record, an entity attached to a database. From a request, you could pass a filter in the query string and get back the specific fields you wanted.

In my opinion, that already solved some of the problems GraphQL was trying to solve.

You could include relationships too. In the setup I worked with, we could even query and filter different models from different services. I remember strong-remoting being involved, although I'm not sure that's the right name for the part that made this work.

Recently, I moved back to GraphQL because of a new job where they use it fully.

The first thing I noticed in our setup was that the requests were POST requests. Errors weren't apparent from the HTTP status: you'd get a 200, then error objects in the response. Sometimes you'd get a partial success.

Then you have schema delegation, schema stitching, and DataLoader. To me, that's a lot.

The requests generally look harmless. You see a small request, but internally there can be more filtering, more fields, schema stitching, and schema delegation. It becomes a mess when you need to troubleshoot and figure out what is going where.

There was another incident where a field was leaking into another query because we hadn't set things up properly. And then there were enums with the same values but different names. The result wouldn't even show until I adjusted the enum typing/mapping. That's how I remember it; I don't have the exact fix here.

Sometimes that takes a long time compared with a proper REST API request that gives you a useful status. And if the filtering system is good enough, I don't feel I need all that magical delegation.

I feel like a lot of the problems GraphQL was trying to solve have already been addressed by better services, caching, and networking. Working with it has become a nightmare for me. I really don't love it anymore. I hate it.

### Technical note: filters and fields

LoopBack 3 accepts a JSON-encoded `filter` query parameter; `where` filters records, `fields` selects properties, and `include` loads defined relations.[^1][^2][^3] Selecting fields while including a relation can require keeping relation keys: the documentation's `belongsTo` example keeps `categoryId`.[^3] LoopBack 4 documents the same caveat.[^4]

This is an illustrative browser `fetch` example, not code from my job. It assumes a LoopBack 3 `Post` model with the shown fields and a configured `category` relation. The IDs are kept deliberately.

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

### Technical note: what strong-remoting does

The recollection is plausible: `strong-remoting` exposes JavaScript methods over transport adapters, and `loopback-connector-remote` explicitly uses it to call another LoopBack application's exposed model methods.[^5][^6] That is different from `loopback-connector-rest`, which wraps other REST APIs using resource operations or templates.[^7] These sources do not establish which connector our application used or how we composed its cross-service queries.

LoopBack 4's corresponding pieces are HTTP controllers, repositories for data access, and relation inclusion resolvers.[^8][^9][^10] That does not mean it shares LoopBack 3's remoting internals: the remote connector explicitly says it does not support LoopBack 4.[^6]

### Technical note: HTTP success and GraphQL success

The POST/200 account above describes our setup. The GraphQL-over-HTTP draft requires POST support and permits GET for queries, not mutations.[^11] GraphQL distinguishes request errors before execution (no `data`) from execution errors, which can accompany partial `data`.[^12] Not every error is a 200: HTTP status handling depends on the failure stage and response media type; the HTTP document is still a draft.[^11]

`fetch`'s `response.ok` only checks whether the HTTP status is 200–299; it does not inspect GraphQL's `errors`.[^13] This second illustrative browser example assumes the shown schema. It deliberately **rejects partial data** whenever `errors` is nonempty, even on HTTP success. A UI that accepts partial data needs a different policy: keep both `data` and `errors` and show which parts failed.[^12]

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

These snippets show request shape and error checks, not equivalent filtering or production-ready clients. The GraphQL query has no filtering or limit arguments; those would depend on the schema. Authentication and UI error handling are omitted. A non-2xx response is rejected before its body is read; a fuller client could also retain server diagnostics.

### Technical note: DataLoader's cache

DataLoader batches loads and memoizes results within an instance. Its documentation recommends creating instances per request, rather than sharing cached values between different users. That cache is not a replacement for a shared cache such as Redis.[^14]

### Technical note: concurrency is not request count

`p-limit` limits how many wrapped operations run at once; it does not batch or deduplicate those calls, so limiting concurrency alone does not remove N+1-style fan-out.[^15] The limit applies to work submitted to the same limiter: one created per incoming request caps that request's work, while one shared in a process caps the submitted work across requests in that process, not across every server.[^15] The numbers and out-of-memory incident above are my recollection, not a measured memory profile or a reconstruction of the root cause.

### Illustrative note: Hasura behind Hono

Hasura v2 has its own Remote Schemas feature.[^16] This example instead puts a **custom JavaScript gateway** in front of Hasura; it is not a claim that Hasura uses GraphQL Tools internally.

Here `hasura` is a configured `{ schema, executor }` subschema for a Hasura endpoint exposing an `entity` table. The schema can come from introspection or supplied SDL; the executor sends operations upstream.[^17] `stitchSchemas` adds `page` and `extras`; `delegateToSchema` forwards the selected entity fields, and `selectionSet` fetches the ID needed by the extension.[^18] Hono handles HTTP and `graphql()` executes the stitched schema.[^19][^20]

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

`extraClients` is an injected array of five async service clients, each returning a string. `{ page { extras } }` can therefore schedule 100 calls for 20 rows, while this module's limiter allows five active calls across requests in one process. It still queues the rest. This is an illustration, not a reconstruction of our incident. Only local fixtures were tested, not a live Hasura server. The excerpt omits upstream setup, authentication, timeouts, admission control and full GraphQL-over-HTTP handling; don't expose it as-is.

But then I looked at Hasura for just a second, and I loved it.

Now I'm not sure whether that's because of my love for LoopBack filters or just the simplicity of what I saw. I don't know yet why I like Hasura.

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
