import { useMemo } from "react";
import { UrlEditor } from "./url-editor";
import { canParsed } from "./url-utils";
import { Input } from "../../components/input";
import { LabelWrap } from "./label-wrap";

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
          <LabelWrap key={key + idx} label={key}>
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
          </LabelWrap>
        );
      })}
    </div>
  );
}
