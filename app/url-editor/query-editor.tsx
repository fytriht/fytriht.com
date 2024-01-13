import { useEffect, useRef } from "react";
import { UrlEditor } from "./url-editor";
import { canParsed } from "./url-utils";
import { Input } from "../../components/input";
import * as q from "./query";
import { useLatest } from "../../lib/hooks";

function useQuerySizeChange(
  query: q.Query,
  onChange: (prev: number, curr: number) => void
) {
  const prevQueryRef = useRef(query);
  const onChangeRef = useLatest(onChange);
  useEffect(() => {
    const [prevSize, currSize] = [prevQueryRef.current, query].map((query) =>
      q.getSize(query)
    );
    if (prevSize !== currSize) {
      onChangeRef.current(prevSize, currSize);
    }
    prevQueryRef.current = query;
  }, [query]);
}

export function QueryEditor({
  query,
  onChange,
}: {
  query: q.Query;
  onChange?: (v: string) => void;
}) {
  const newlyAddedQueryItemKeyRef = useRef<string>(); // Based on the assumption that the newly added key is unique.
  const newlyAddedQueryItemKeyInputRef = useRef<HTMLInputElement>(null);
  const newQueryIndexRef = useRef(0);
  const prevScrollYRef = useRef(0);

  useQuerySizeChange(query, (prevSize, currSize) => {
    if (prevSize < currSize) {
      const elm = newlyAddedQueryItemKeyInputRef.current;
      if (elm) {
        elm.focus(); // Automatically focus on the newly added item

        // highlight
        if (prevSize !== 0 && elm.parentElement) {
          const itemElm = elm.parentElement;
          const oldBackgroundColor = itemElm.style.backgroundColor;
          itemElm.style.backgroundColor = "#faebd7a6";
          setTimeout(() => {
            itemElm.style.backgroundColor = oldBackgroundColor;
          }, 2000);
        }
      }
    }
  });

  useQuerySizeChange(query, () => {
    window.scroll({ top: prevScrollYRef.current }); // retain scroll position
  });

  if (!query) {
    return (
      <button
        onClick={() => {
          const [K, V] = ["key", "value"];
          onChange?.(new URLSearchParams({ [K]: V }).toString());
          newlyAddedQueryItemKeyRef.current = K;
        }}
      >
        Add
      </button>
    );
  }

  return (
    <div className="w-full space-y-1">
      {q.getEntries(query).map(([key, value], idx) => {
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
              ref={
                key === newlyAddedQueryItemKeyRef.current
                  ? newlyAddedQueryItemKeyInputRef
                  : null
              }
              value={key}
              onChange={(e) => {
                const { value } = e.target;
                onChange?.(q.setItemKey(query, idx, value));
              }}
            ></Input>
            {(() => {
              if (canParsed(value)) {
                return (
                  <UrlEditor
                    className="flex flex-col w-full"
                    url={value}
                    onChange={(v) => {
                      onChange?.(q.setItemValue(query, idx, v));
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
                    onChange?.(q.setItemValue(query, idx, e.target.value));
                  }}
                />
              );
            })()}
            <button
              onClick={() => {
                const [K, V] = ["key", "value"];
                while (true) {
                  const index = newQueryIndexRef.current;
                  let k = index > 0 ? `${K}${index}` : K;
                  let v = index > 0 ? `${V}${index}` : V;
                  if (q.hasItemKey(query, k)) {
                    newQueryIndexRef.current++;
                  } else {
                    prevScrollYRef.current = window.scrollY;
                    newlyAddedQueryItemKeyRef.current = k;
                    onChange?.(q.addItemNextTo(query, idx, k, v));
                    break;
                  }
                }
              }}
            >
              Add
            </button>
            <button
              onClick={() => {
                prevScrollYRef.current = window.scrollY;
                onChange?.(q.deleteItem(query, idx));
              }}
            >
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}
