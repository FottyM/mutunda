import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const contentRoot = new URL("../../src/content/writing/", import.meta.url);
async function snippets(locale = "") {
  const file = process.env.ARTICLE_EXAMPLE_FILE || new URL(`graphql-over-the-cliff${locale}.md`, contentRoot);
  const text = await readFile(file, "utf8");
  return [...text.matchAll(/^```js\n([\s\S]*?)^```/gm)]
    .map(match => match[1]);
}

// Local HTTP fixtures exercise the published snippets, not a real LoopBack or GraphQL deployment.
async function fixture(t, handler) {
  const server = createServer(handler);
  await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const origin = `http://127.0.0.1:${server.address().port}`;
  return (input, init) => fetch(new URL(input, origin), init);
}

function run(source, fetchImpl) {
  return runInNewContext(`${source}\ngetPosts();`, { fetch: fetchImpl, URLSearchParams });
}

const reply = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
};

test("all three articles publish the same three illustrative examples", async () => {
  const english = await snippets();
  assert.equal(english.length, 3);
  assert.deepEqual(await snippets(".fr"), english);
  assert.deepEqual(await snippets(".et"), english);
});

test("LoopBack example encodes the JSON filter and retains relation keys", async t => {
  let request;
  const fetchImpl = await fixture(t, (req, res) => {
    request = { method: req.method, url: new URL(req.url, "http://fixture.test") };
    reply(res, 200, [{ id: 1, title: "Fixture", categoryId: 2, category: { id: 2, name: "Test" } }]);
  });
  const [source] = await snippets();
  const data = await run(source, fetchImpl);
  assert.equal(request.method, "GET");
  assert.equal(request.url.pathname, "/api/posts");
  assert.deepEqual(JSON.parse(request.url.searchParams.get("filter")), {
    where: { published: true },
    fields: { id: true, title: true, categoryId: true },
    include: { relation: "category", scope: { fields: ["id", "name"] } },
    limit: 10,
  });
  assert.equal(data[0].category.name, "Test");
});

test("LoopBack example rejects non-2xx responses", async t => {
  const fetchImpl = await fixture(t, (_, res) => reply(res, 403, { error: "fixture denial" }));
  const [source] = await snippets();
  await assert.rejects(run(source, fetchImpl), /HTTP 403/);
});

test("GraphQL example posts its query and returns successful data", async t => {
  let request;
  const fetchImpl = await fixture(t, async (req, res) => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    request = { method: req.method, url: req.url, headers: req.headers, body: JSON.parse(Buffer.concat(chunks)) };
    reply(res, 200, { data: { posts: [] } });
  });
  const [, source] = await snippets();
  assert.deepEqual(await run(source, fetchImpl), { posts: [] });
  assert.equal(request.method, "POST");
  assert.equal(request.url, "/graphql");
  assert.equal(request.headers["content-type"], "application/json");
  assert.equal(request.headers.accept, "application/graphql-response+json, application/json");
  assert.deepEqual(request.body, { query: "{ posts { id title category { id name } } }" });
});

for (const scenario of [
  { name: "HTTP error", status: 503, body: { errors: [{ message: "unavailable" }] }, error: /HTTP 503/ },
  { name: "200 request errors", status: 200, body: { errors: [{ message: "invalid query" }] }, error: /invalid query/ },
  { name: "200 partial data", status: 200, body: { data: { posts: [{ id: 1, category: null }] }, errors: [{ message: "category unavailable" }] }, error: /category unavailable/ },
  { name: "200 null data with errors", status: 200, body: { data: null, errors: [{ message: "root failed" }] }, error: /root failed/ },
]) {
  test(`GraphQL example rejects ${scenario.name}`, async t => {
    const fetchImpl = await fixture(t, (_, res) => reply(res, scenario.status, scenario.body));
    const [, source] = await snippets();
    await assert.rejects(run(source, fetchImpl), scenario.error);
  });
}

test("GraphQL example propagates invalid JSON and network failures", async t => {
  const fetchImpl = await fixture(t, (_, res) => res.end("not JSON"));
  const [, source] = await snippets();
  await assert.rejects(run(source, fetchImpl), SyntaxError);
  await assert.rejects(run(source, () => Promise.reject(new TypeError("fixture network failure"))), /fixture network failure/);
});
