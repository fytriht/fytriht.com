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
        if (canParsed(value)) {
          return (
            <div
              key={key + idx}
              className="flex"
              style={{
                backgroundColor: "#f1f5fa",
                borderRadius: "calc(var(--radius) - 2px)",
              }}
            >
              <Label className="w-32">{`${key}: `}</Label>
              <UrlEditor
                className="flex flex-col w-full"
                url={value}
                onChange={(v) => {
                  const searchObj = new URLSearchParams(searchParams);
                  searchObj.set(key, v);
                  onChange?.(searchObj.toString());
                }}
              />
            </div>
          );
        }

        return (
          <LabelWrap
            key={key + idx}
            label={key}
            style={{
              backgroundColor: "#f1f5fa",
              borderRadius: "calc(var(--radius) - 2px)",
            }}
          >
            <Input
              value={value}
              onChange={(e) => {
                const { value } = e.target;
                const searchObj = new URLSearchParams(searchParams);
                searchObj.set(key, value);
                onChange?.(searchObj.toString());
              }}
            />
          </LabelWrap>
        );
      })}
    </div>
  );
}
