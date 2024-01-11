import { useEffect, useMemo, useRef } from "react";
import { UrlEditor } from "./url-editor";
import { canParsed } from "./url-utils";
import { Input } from "../../components/input";
import { LabelWrap } from "./label-wrap";
import { Label } from "../../components/label";
import { deleteQueryItem, getLastQueryItem, getQueryEntries, getQuerySize, setQueryItemKey, setQueryItemValue } from "./query";

export function QueryEditor({
  query,
  onChange,
}: {
  query: string;
  onChange?: (v: string) => void;
}) {
  // const searchParams = useMemo(() => new URLSearchParams(query), [query]);
  const newQueryIndexRef = useRef(0);

  // Automatically focus on the newly added item
  let previousQuerySizeRef = useRef<number>(getQuerySize(query));
  const querySize = getQuerySize(query)
  useEffect(() => {
    const previousSize = previousQuerySizeRef.current;
    const currentSize = querySize;
    if (currentSize > previousSize) {
      const lastItem = getLastQueryItem(query);
      if (lastItem) {
        const [key] = lastItem;
        document.getElementById(key)?.focus();
      }
    }
    previousQuerySizeRef.current = currentSize;
  }, [querySize]);

  return (
    <div className="w-full space-y-1">
      {getQueryEntries(query).map(([key, value], idx) => {
        return (
          <div
            key={idx}
            className="flex py-2"
            style={{
              backgroundColor: "#f1f5fa",
              borderRadius: "calc(var(--radius) - 2px)",
            }}
          >
            <Input
              className="w-32 mx-1 text-right border-t-0 border-l-0 border-r-0 rounded-none"
              style={{
                boxShadow: "none",
              }}
              id={key}
              value={key}
              onChange={(e) => {
                const { value } = e.target;
                onChange?.(setQueryItemKey(query, key, value))
              }}
            ></Input>
            {(() => {
              if (canParsed(value)) {
                return (
                  <UrlEditor
                    className="flex flex-col w-full"
                    url={value}
                    onChange={(v) => {
                      onChange?.(setQueryItemValue(query, key, v))
                    }}
                  />
                );
              }
              return (
                <Input
                  className="border-t-0 border-l-0 border-r-0 rounded-none"
                  style={{
                    boxShadow: "none",
                  }}
                  value={value}
                  onChange={(e) => {
                    // const { value } = e.target;
                    // const searchObj = new URLSearchParams(searchParams);
                    // searchObj.set(key, value);
                    // onChange?.(searchObj.toString());
                    onChange?.(setQueryItemValue(query, key, e.target.value))
                  }}
                />
              );
            })()}
            <button
              onClick={() => {
                onChange?.(deleteQueryItem(query, key))
              }}
            >
              Remove
            </button>
          </div>
        );
      })}
      <button
        onClick={() => {
          // const searchObj = new URLSearchParams(searchParams);
          // const [K, V] = ["key", "value"];
          // while (true) {
          //   const index = newQueryIndexRef.current;
          //   let k = index > 0 ? `${K}${index}` : K;
          //   let v = index > 0 ? `${V}${index}` : V;
          //   if (searchObj.has(k)) {
          //     newQueryIndexRef.current++;
          //   } else {
          //     searchObj.set(k, v);
          //     break;
          //   }
          // }
          // onChange?.(searchObj.toString());
        }}
      >
        Add
      </button>
    </div>
  );
}
