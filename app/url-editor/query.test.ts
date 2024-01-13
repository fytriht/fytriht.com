import { expect, test } from "vitest";
import {
  addItemNextTo,
  deleteItem,
  getEntries,
  getSize,
  hasItemKey,
  setItemKey,
  setItemValue,
} from "./query";

const createQueryString = (init: [string, string][]) =>
  new URLSearchParams(init).toString();

test("setItemKey", () => {
  const before = createQueryString([
    ["a", "1"],
    ["b", "2"],
  ]);
  const after = setItemKey(before, 1, "hey");
  expect(before).toMatchInlineSnapshot(`"a=1&b=2"`);
  expect(after).toMatchInlineSnapshot(`"a=1&hey=2"`);
});

test("setItemValue", () => {
  const before = createQueryString([
    ["a", "1"],
    ["b", "2"],
  ]);
  const after = setItemValue(before, 1, "hey");
  expect(before).toMatchInlineSnapshot(`"a=1&b=2"`);
  expect(after).toMatchInlineSnapshot(`"a=1&b=hey"`);
});

test("deleteItem", () => {
  const before = createQueryString([
    ["a", "1"],
    ["b", "2"],
  ]);
  const after = deleteItem(before, 1);
  expect(before).toMatchInlineSnapshot(`"a=1&b=2"`);
  expect(after).toMatchInlineSnapshot(`"a=1"`);
});

test("addItemNextTo", () => {
  const before = createQueryString([
    ["a", "1"],
    ["b", "2"],
  ]);
  const after = addItemNextTo(before, 0, "hello", "hi");
  expect(before).toMatchInlineSnapshot(`"a=1&b=2"`);
  expect(after).toMatchInlineSnapshot(`"a=1&hello=hi&b=2"`);
});

test("getSize", () => {
  expect(getSize(createQueryString([]))).toBe(0);

  expect(
    getSize(
      createQueryString([
        ["a", "1"],
        ["b", "2"],
      ])
    )
  ).toBe(2);

  expect(
    getSize(
      createQueryString([
        ["a", "1"],
        ["b", "2"],
        ["b", "22"],
      ])
    )
  ).toBe(3);
});

test("getEntries", () => {
  expect(
    getEntries(
      createQueryString([
        ["a", "1"],
        ["b", "2"],
      ])
    )
  ).toMatchObject([
    ["a", "1"],
    ["b", "2"],
  ]);
});

test("hasItemKey", () => {
  const qs = createQueryString([
    ["a", "1"],
    ["b", "2"],
  ]);
  expect(hasItemKey(qs, "a")).toBe(true);
  expect(hasItemKey(qs, "c")).toBe(false);
});
