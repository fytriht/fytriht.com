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

  const res5 = fromUrlString("aweme://webview?url=http%3A%2F%2F10.71.192.13%3A5566%2Fhtml%2Ftask_nsr%3F_pia_%3D1%26_pia_mock_%3D%257B%2522features%2522%253A%255B%2522streaming%2522%255D%252C%2522streaming%2522%253A%2522http%253A%252F%252F10.71.192.13%253A5566%252Fresource%252Fjs%252Ftask_nsr.pia.streaming.js%2522%257D%26__status_bar%3Dtrue%26_pia_%3D1%26campaign%3DZA_Referral%26campaign_name%3Dza%26disable_ttnet_proxy%3D0%26enter_from%3Dfloating_badge%26hide_nav_bar%3D1%26lng%3Den%26should_full_screen%3D1%26touch_point_id%3D1%26type%3DNormalPendant-ZA%26use_mutable_context%3D1%26device_id%3D7261896084237420075%26carrier_region%3DZA%26status_bar_height%3D49&use_spark=1&use_forest=0&bdhm_bid=incentive_campaign")
  expect(res5).toMatchInlineSnapshot(`
    {
      "hash": undefined,
      "hostname": "webview",
      "pathname": undefined,
      "port": undefined,
      "query": "url=http%3A%2F%2F10.71.192.13%3A5566%2Fhtml%2Ftask_nsr%3F_pia_%3D1%26_pia_mock_%3D%257B%2522features%2522%253A%255B%2522streaming%2522%255D%252C%2522streaming%2522%253A%2522http%253A%252F%252F10.71.192.13%253A5566%252Fresource%252Fjs%252Ftask_nsr.pia.streaming.js%2522%257D%26__status_bar%3Dtrue%26_pia_%3D1%26campaign%3DZA_Referral%26campaign_name%3Dza%26disable_ttnet_proxy%3D0%26enter_from%3Dfloating_badge%26hide_nav_bar%3D1%26lng%3Den%26should_full_screen%3D1%26touch_point_id%3D1%26type%3DNormalPendant-ZA%26use_mutable_context%3D1%26device_id%3D7261896084237420075%26carrier_region%3DZA%26status_bar_height%3D49&use_spark=1&use_forest=0&bdhm_bid=incentive_campaign",
      "scheme": "aweme",
    }
  `)
});
