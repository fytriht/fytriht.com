import { expect, test } from "vitest";
import { fromUrlString } from "./url-utils";

test("fromUrlString", () => {
  const res1 = fromUrlString("https://google.com");
  expect(res1).toMatchInlineSnapshot(`
    {
      "hash": undefined,
      "hostname": "google.com",
      "pathname": undefined,
      "port": undefined,
      "query": undefined,
      "scheme": "https",
    }
  `);

  const res2 = fromUrlString("https://google.com#1");
  expect(res2).toMatchInlineSnapshot(`
    {
      "hash": "#1",
      "hostname": "google.com",
      "pathname": undefined,
      "port": undefined,
      "query": undefined,
      "scheme": "https",
    }
  `);

  const res3 = fromUrlString("https://google.com/sub#1");
  expect(res3).toMatchInlineSnapshot(`
    {
      "hash": "#1",
      "hostname": "google.com",
      "pathname": "/sub",
      "port": undefined,
      "query": undefined,
      "scheme": "https",
    }
  `);

  const res4 = fromUrlString("https://google.com:443/sub#1");
  expect(res4).toMatchInlineSnapshot(`
    {
      "hash": "#1",
      "hostname": "google.com",
      "pathname": "/sub",
      "port": "443",
      "query": undefined,
      "scheme": "https",
    }
  `);

  const res5 = fromUrlString("https://google.com:443/sub?q=mdn#1");
  expect(res5).toMatchInlineSnapshot(`
    {
      "hash": "#1",
      "hostname": "google.com",
      "pathname": "/sub",
      "port": "443",
      "query": "q=mdn",
      "scheme": "https",
    }
  `);
});

test("fromUrlString nesting", () => {
  const res1 = fromUrlString(
    "https://google.com:443/sub?q=mdn&to=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FURLSearchParams%23instance_methods#1"
  );
  expect(res1).toMatchInlineSnapshot(`
    {
      "hash": "#1",
      "hostname": "google.com",
      "pathname": "/sub",
      "port": "443",
      "query": "q=mdn&to=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FURLSearchParams%23instance_methods",
      "scheme": "https",
    }
  `);
});

test("custom protocol", () => {
  const res1 = fromUrlString(
    "aweme://webview?url=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FURLSearchParams%23instance_methods&use_spark=1"
  );
  expect(res1).toMatchInlineSnapshot(`
    {
      "hash": undefined,
      "hostname": "webview",
      "pathname": undefined,
      "port": undefined,
      "query": "url=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FURLSearchParams%23instance_methods&use_spark=1",
      "scheme": "aweme",
    }
  `);

  const res2 = fromUrlString("aweme://webview");
  expect(res2).toMatchInlineSnapshot(`
    {
      "hash": undefined,
      "hostname": "webview",
      "pathname": undefined,
      "port": undefined,
      "query": undefined,
      "scheme": "aweme",
    }
  `);

  const res3 = fromUrlString("aweme://webview/");
  expect(res3).toMatchInlineSnapshot(`
    {
      "hash": undefined,
      "hostname": "webview",
      "pathname": "/",
      "port": undefined,
      "query": undefined,
      "scheme": "aweme",
    }
  `);

  const res4 = fromUrlString("aweme://webview/sub");
  expect(res4).toMatchInlineSnapshot(`
    {
      "hash": undefined,
      "hostname": "webview",
      "pathname": "/sub",
      "port": undefined,
      "query": undefined,
      "scheme": "aweme",
    }
  `);
});
