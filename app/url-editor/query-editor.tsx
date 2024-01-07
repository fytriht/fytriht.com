import { useMemo } from "react";
import { UrlEditor } from "./url-editor";
import { canParsed } from "./url-utils";
import { Input } from "../../components/input";
import { Label } from "../../components/label";
import { LabelTextInput } from "./label-text-input";

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
        if (canParsed(value)) {
          return (
            <div key={key + idx} className="flex items-center">
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
          <LabelTextInput
            key={key + idx}
            label={key}
            value={value}
            onChange={(e) => {
              const { value } = e.target;
              const searchObj = new URLSearchParams(searchParams);
              searchObj.set(key, value);
              onChange?.(searchObj.toString());
            }}
          />
        );
      })}
    </>
  );
}
