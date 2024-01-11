export type Query = string
export type QueryItemKey = string
export type QueryItemValue = string

export function setQueryItemKey(q: Query, k: QueryItemKey, newKey: QueryItemKey): Query {
    const obj = new URLSearchParams(q);
    return new URLSearchParams(
        [...obj.entries()].map(([key, value]) => [
            key === k ? newKey : key,
            value,
        ])
    ).toString()

}

export function setQueryItemValue(q: Query, k: QueryItemKey, newValue: QueryItemValue): Query {
    const obj = new URLSearchParams(q);
    obj.set(k, newValue);
    return obj.toString()
}

export function deleteQueryItem(q: Query, k: QueryItemKey): Query {
    const obj = new URLSearchParams(q);
    obj.delete(k);
    return obj.toString()
}

export function addQueryItemNextTo(q: Query, newKey: QueryItemKey, newValue: QueryItemValue): Query {

}

export function getLastQueryItem(q: Query): [QueryItemKey, QueryItemValue] | undefined {
    const obj = new URLSearchParams(q);
    return [...obj.entries()].at(-1);
}

export function getQuerySize(q: Query): number {
    const obj = new URLSearchParams(q);
    return obj.size
}

export function getQueryEntries(q: Query): [QueryItemKey, QueryItemValue][] {
    const obj = new URLSearchParams(q);
    return [...obj.entries()]
}

