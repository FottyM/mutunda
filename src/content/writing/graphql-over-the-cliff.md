---
title: I loved GraphQL until I had to debug it
description: A note on GraphQL's pleasant surface, LoopBack filters, and the cost of following a request through a composed system.
date: 2026-10-04
tags:
  - graphql
  - architecture
  - debugging
draft: false
cover:
  src: /images/writing/graphql-over-the-cliff-cover.png
  alt: An abstract query sheet tipping over a cliff into a network of pipes and service nodes.
locale: en
---

![An abstract query sheet tipping over a cliff into a network of pipes and service nodes.](/images/writing/graphql-over-the-cliff-cover.png)

Around 2018, I took one of The Net Ninja's GraphQL tutorials and loved it straight away. I could ask for the fields I wanted, follow relationships, and receive a neat, nested answer in one request. It felt precise. It felt modern. It felt like the API had finally stopped arguing with the client.

At the time, I was taken with the query itself. A small shape on the screen seemed to promise a small amount of work behind it.

That was a mistake, although a very understandable one.

## The less fashionable thing that worked

My first job put me in front of LoopBack 3, then later LoopBack 4.[^1] It came from StrongLoop and IBM rather than the exciting new corner of the JavaScript world, but it gave us useful things: models, relations, and filters.

An endpoint could expose a model and accept a filter. I could choose fields, constrain a result, and include a related model. It was not as elegant as a GraphQL query, but much of the useful part was already there.

```text
GET /customers?filter={
  "fields": ["id", "name"],
  "where": {"active": true},
  "include": ["orders"]
}
```

LoopBack documents field selection, filters, and related-model inclusion plainly.[^2] The syntax can become clumsy, especially once a query string must carry encoded JSON, but the work remains visible. I can see the resource, the condition, and the relation I asked for.

That changed my first impression of GraphQL. I no longer thought, “GraphQL is the only way to avoid wasteful APIs.” A thoughtful REST API with filtering and relationships can answer a surprisingly large share of the same needs.

## The simple request that was not simple

Years later, I joined a team that used GraphQL throughout. I was pleased at first. Here was the thing I had admired, now in serious use.

Then I had to find out why a request was slow, incomplete, or wrong.

From the outside, a query can be wonderfully small:

```graphql
query CustomerOrder {
  customer(id: "42") {
    name
    orders { id total }
  }
}
```

But that shape tells me very little about the path beneath it. `customer` may be a resolver. `orders` may call another service. A gateway may delegate part of the selection to a second schema. A DataLoader may batch one set of lookups, while another resolver still makes a separate call for every record. The request looks calmer than the machinery carrying it.

None of these ideas is foolish. DataLoader exists to batch and cache request-scoped loads.[^3] Schema stitching can present several services through one schema, and schema delegation is the mechanism that forwards part of a query to the service that can answer it.[^4] Those are real answers to real problems.

They are also more places to look when the answer is late.

The difficulty for me was not that GraphQL made the system complicated. The system already was complicated. GraphQL made it easier for that complexity to hide behind a request that looked harmless.

## A green status code can still be a long afternoon

The other surprise was failure. In the system I worked with, many operations arrived over POST and returned HTTP 200 even when part of the requested work had failed. The useful answer could sit beside an `errors` array, or disappear behind a partial result.

```json
{
  "data": { "customer": { "name": "Ada", "orders": null } },
  "errors": [{ "message": "Orders service timed out" }]
}
```

That response is valid GraphQL behaviour, not a flaw in itself. The GraphQL-over-HTTP specification distinguishes a well-formed GraphQL response from the success of every field within it.[^5] But it changed my first move while troubleshooting. A 200 was no longer enough to tell me that the operation had gone well. I had to inspect the response, then trace the fields, then learn which service had actually done the failing work.

REST can hide a mess behind an endpoint too. It is perfectly possible to build a REST service with vague routes, poor status codes and a trail of internal calls nobody can follow. The protocol does not save anyone from bad boundaries.

Still, I find a well-designed REST request easier to hold in my head. I know the operation I am investigating. I have a resource, a method, a status, and usually a shorter list of places to begin. Filtering does not make the endpoint magical. It merely makes it more useful.

For my work, that kind of boredom has become a virtue.

## The exception that made me pause

Then I looked briefly at Hasura.[^6] I liked it almost immediately, which was awkward after all this complaining.

I have not used it deeply enough to claim it solves the problems above. What caught my attention was familiar: a direct relationship between the data model and the API, with filtering and relationships already available. Its relationship model reminded me of the practical part I had liked in LoopBack.[^7]

Perhaps I do not dislike GraphQL as much as I dislike excavating an execution path to understand one innocent-looking request. Hasura has not earned a verdict from me. It has earned a second look.

## Notes

[^1]: [LoopBack 3 documentation](https://loopback.io/doc/en/lb3/) and [LoopBack 4 documentation](https://loopback.io/doc/en/lb4/).
[^2]: [LoopBack 4 fields filter](https://loopback.io/doc/en/lb4/Fields-filter.html), [query filters](https://loopback.io/doc/en/lb4/Querying-data.html), and [include filter](https://loopback.io/doc/en/lb4/Include-filter.html).
[^3]: [DataLoader](https://github.com/graphql/dataloader).
[^4]: [GraphQL Tools schema stitching and delegation](https://the-guild.dev/graphql/stitching/docs).
[^5]: [GraphQL over HTTP specification](https://http-spec.graphql.org/draft/).
[^6]: [Hasura](https://hasura.io/).
[^7]: [Hasura relationships](https://hasura.io/learn/graphql/hasura/relationships/).
