import { useEffect, useMemo, useRef } from "react";
import { UrlEditor } from "./url-editor";
import { canParsed } from "./url-utils";
import { Input } from "../../components/input";
import { LabelWrap } from "./label-wrap";
import { Label } from "../../components/label";

export function QueryEditor({
  query,
  onChange,
}: {
  query: string;
  onChange?: (v: string) => void;
}) {
  const searchParams = useMemo(() => new URLSearchParams(query), [query]);
  const newQueryIndexRef = useRef(0);

  // Automatically focus on the newly added item
  let previousQuerySizeRef = useRef<number>(searchParams.size);
  useEffect(() => {
    const previousSize = previousQuerySizeRef.current;
    const currentSize = searchParams.size;
    if (currentSize > previousSize) {
      const lastItem = [...searchParams.entries()].at(-1);
      if (lastItem) {
        const [key] = lastItem;
        document.getElementById(key)?.focus();
      }
    }
    previousQuerySizeRef.current = currentSize;
  }, [searchParams.size]);

  return (
    <div className="w-full space-y-1">
      {[...searchParams.entries()].map(([key, value], idx) => {
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
                onChange?.(
                  new URLSearchParams(
                    [...searchParams].map(([k, v]) => [
                      k === key ? value : k,
                      v,
                    ])
                  ).toString()
                );
              }}
            ></Input>
            {(() => {
              if (canParsed(value)) {
                return (
                  <UrlEditor
                    className="flex flex-col w-full"
                    url={value}
                    onChange={(v) => {
                      const searchObj = new URLSearchParams(searchParams);
                      searchObj.set(key, v);
                      onChange?.(searchObj.toString());
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
                    const { value } = e.target;
                    const searchObj = new URLSearchParams(searchParams);
                    searchObj.set(key, value);
                    onChange?.(searchObj.toString());
                  }}
                />
              );
            })()}
            <button
              onClick={() => {
                const searchObj = new URLSearchParams(searchParams);
                searchObj.delete(key);
                console.log(searchObj, searchObj.toString());
                onChange?.(searchObj.toString());
              }}
            >
              Remove
            </button>
          </div>
        );
      })}
      <button
        onClick={() => {
          const searchObj = new URLSearchParams(searchParams);
          const [K, V] = ["key", "value"];
          while (true) {
            const index = newQueryIndexRef.current;
            let k = index > 0 ? `${K}${index}` : K;
            let v = index > 0 ? `${V}${index}` : V;
            if (searchObj.has(k)) {
              newQueryIndexRef.current++;
            } else {
              searchObj.set(k, v);
              break;
            }
          }
          onChange?.(searchObj.toString());
        }}
      >
        Add
      </button>
    </div>
  );
}
