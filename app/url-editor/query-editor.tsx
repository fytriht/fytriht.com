import {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { Minus, Plus } from "lucide-react";
import { UrlEditor } from "./url-editor";
import { canParsed } from "./url-utils";
import { Input } from "../../components/input";
import * as q from "./query";
import { useLatest } from "../../lib/hooks";
import { Button } from "../../components/button";

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

function Hover({
  className,
  children,
}: {
  children: (isHovered: boolean) => ReactNode;
} & Omit<React.BaseHTMLAttributes<HTMLDivElement>, "children">) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children(isHovered)}
    </div>
  );
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
          <Hover key={idx} className="flex py-2">
            {(isHover) => (
              <>
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
                <div className="grow space-y-1">
                  <div className="flex space-y-1">
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
                    {isHover && (
                      <>
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
                      </>
                    )}
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
              </>
            )}
          </Hover>
        );
      })}
    </div>
  );
}
