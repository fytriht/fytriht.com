import { useMemo } from "react";
import { UrlEditor } from "./url-editor";
import { canParsed } from "./url-utils";

export function QueryEditor({
  query,
  onChange,
}: {
  query: string;
  onChange?: (v: string) => void;
}) {
  const searchParams = useMemo(() => new URLSearchParams(query), [query]);
  return (
    <>
      {[...searchParams.entries()].map(([key, value], idx) => {
        return (
          <label key={key + idx} style={{ display: "flex" }}>
            {key}: {/* TODO: JSON Editor */}
            {canParsed(value) ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <UrlEditor
                  url={value}
                  onChange={(v) => {
                    const searchObj = new URLSearchParams(searchParams);
                    searchObj.set(key, v);
                    onChange?.(searchObj.toString());
                  }}
                />
              </div>
            ) : (
              <input
                type="text"
                style={{ flex: 1 }}
                value={value}
                onChange={(e) => {
                  const { value } = e.target;
                  const searchObj = new URLSearchParams(searchParams);
                  searchObj.set(key, value);
                  onChange?.(searchObj.toString());
                }}
              />
            )}
          </label>
        );
      })}
    </>
  );
}
