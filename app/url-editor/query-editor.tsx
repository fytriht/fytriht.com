import { useMemo } from "react";
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
  return (
    <div className="w-full space-y-1">
      {[...searchParams.entries()].map(([key, value], idx) => {
        return (
          <div
            key={key + idx}
            className="flex py-2"
            style={{
              backgroundColor: "#f1f5fa",
              borderRadius: "calc(var(--radius) - 2px)",
            }}
          >
            {(() => {
              if (canParsed(value)) {
                return (
                  <>
                    <Input
                      className="w-32 mx-1 text-right border-t-0 border-l-0 border-r-0 rounded-none"
                      style={{
                        boxShadow: "none",
                      }}
                      value={key}
                    ></Input>
                    <UrlEditor
                      className="flex flex-col w-full"
                      url={value}
                      onChange={(v) => {
                        const searchObj = new URLSearchParams(searchParams);
                        searchObj.set(key, v);
                        onChange?.(searchObj.toString());
                      }}
                    />
                  </>
                );
              }
              return (
                <>
                  <Input
                    className="w-32 mx-1 text-right border-t-0 border-l-0 border-r-0 rounded-none"
                    style={{
                      boxShadow: "none",
                    }}
                    value={key}
                  ></Input>
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
                </>
              );
            })()}
          </div>
        );
      })}
    </div>
  );
}
