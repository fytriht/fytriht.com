import { ReactNode, useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { UrlEditor } from "./url-editor";
import { canParsed } from "./url-utils";
import * as q from "./query";
import { useLatest } from "../../lib/hooks";
import { Button } from "../../components/button";
import { UnderlineInput } from "../../components/underline-input";

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
  }, [query, onChangeRef]);
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
      <Button
        className="flex-none"
        variant="outline"
        size="icon"
        onClick={() => {
          const [K, V] = ["key", "value"];
          onChange?.(new URLSearchParams({ [K]: V }).toString());
          newlyAddedQueryItemKeyRef.current = K;
        }}
      >
        <Plus className="h-3 w-3" />
      </Button>
    );
  }

  return (
    <div className="w-full">
      {q.getEntries(query).map(([key, value], idx) => {
        return (
          <div key={idx} className="flex py-2">
            <UnderlineInput
              className="w-32 mx-1 text-right"
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
            />
            <div className="grow space-y-1">
              <div className="flex space-y-1">
                <UnderlineInput
                  value={value}
                  onChange={(e) => {
                    onChange?.(q.setItemValue(query, idx, e.target.value));
                  }}
                />
                <Button
                  className="flex-none ml-1"
                  variant="outline"
                  size="icon"
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
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  className="flex-none ml-1"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    prevScrollYRef.current = window.scrollY;
                    onChange?.(q.deleteItem(query, idx));
                  }}
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
              {canParsed(value) && (
                <UrlEditor
                  className="flex flex-col w-full p-2"
                  style={{
                    backgroundColor: "#f1f5fa",
                    borderRadius: "calc(var(--radius) - 2px)",
                  }}
                  url={value}
                  onChange={(v) => {
                    onChange?.(q.setItemValue(query, idx, v));
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
