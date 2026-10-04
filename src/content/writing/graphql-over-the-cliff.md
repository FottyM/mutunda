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
  src: /images/writing/graphql-over-the-cliff-cover.png
  alt: An abstract query sheet tipping over a cliff into a network of pipes and service nodes.
locale: en
---

![An abstract query sheet tipping over a cliff into a network of pipes and service nodes.](/images/writing/graphql-over-the-cliff-cover.png)

Let's see how my love for GraphQL fell off a cliff.

Around 2018, when GraphQL was becoming a thing—I don't actually know when it became a thing—I took a tutorial from The Net Ninja and loved it. It was cool. Being able to query fields and nested data was really nice.

Then I got a job in 2018 where we were using LoopBack, the web framework from IBM/StrongLoop. I'm talking about LoopBack 3 and 4.

It had what you could call a query builder. You defined a model, a record, an entity attached to a database. From a request, you could pass a filter in the query string and get back the specific fields you wanted.

In my opinion, that already solved some of the problems GraphQL was trying to solve.

You could include relationships too. In the setup I worked with, we could even query and filter different models from different services. I remember strong-remoting being involved, although I'm not sure that's the right name for the part that made this work.

Recently, I moved back to GraphQL because of a new job where they use it fully.

The first thing I noticed in our setup was that the requests were POST requests. Errors weren't apparent from the HTTP status: you'd get a 200, then error objects in the response. Sometimes you'd get a partial success.

Then you have schema delegation, schema stitching, and DataLoader. To me, that's a lot.

The requests generally look harmless. You see a small request, but internally there can be more filtering, more fields, schema stitching, and schema delegation. It becomes a mess when you need to troubleshoot and figure out what is going where.

Sometimes that takes a long time compared with a proper REST API request that gives you a useful status. And if the filtering system is good enough, I don't feel I need all that magical delegation.

I feel like a lot of the problems GraphQL was trying to solve have already been addressed by better services, caching, and networking. Working with it has become a nightmare for me. I really don't love it anymore. I hate it.

But then I looked at Hasura for just a second, and I loved it.

Now I'm not sure whether that's because of my love for LoopBack filters or just the simplicity of what I saw. I don't know yet why I like Hasura.
