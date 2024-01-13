export type Query = string;
export type QueryItemKey = string;
export type QueryItemValue = string;

export function setItemKey(
  q: Query,
  index: number,
  value: QueryItemKey
): Query {
  const obj = new URLSearchParams(q);
  const entries = [...obj.entries()];
  entries[index][0] = value;
  return new URLSearchParams(entries).toString();
}

export function setItemValue(
  q: Query,
  index: number,
  value: QueryItemValue
): Query {
  const obj = new URLSearchParams(q);
  const entries = [...obj.entries()];
  entries[index][1] = value;
  return new URLSearchParams(entries).toString();
}

export function deleteItem(q: Query, index: number): Query {
  const obj = new URLSearchParams(q);
  const entries = [...obj.entries()];
  entries.splice(index, 1);
  return new URLSearchParams(entries).toString();
}

export function addItemNextTo(
  q: Query,
  index: number,
  k: QueryItemKey,
  v: QueryItemValue
): Query {
  const obj = new URLSearchParams(q);
  const entries = [...obj.entries()];
  entries.splice(index + 1, 0, [k, v]);
  return new URLSearchParams(entries).toString();
}

export function getSize(q: Query): number {
  const obj = new URLSearchParams(q);
  return obj.size;
}

export function getEntries(q: Query): [QueryItemKey, QueryItemValue][] {
  const obj = new URLSearchParams(q);
  return [...obj.entries()];
}

export function hasItemKey(q: Query, k: QueryItemKey): boolean {
  const obj = new URLSearchParams(q);
  return obj.has(k);
}
