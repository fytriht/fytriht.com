import { CSSProperties, useMemo } from "react";
import { fromUrlString, toUrlString } from "./url-utils";
import { QueryEditor } from "./query-editor";
import { cn } from "../../lib/utils";
import { LabelWrap } from "./label-wrap";
import { Input } from "../../components/input";
import { RequiredInput } from "./required-input";

export function UrlEditor({
  url,
  onChange,
  className,
  style,
}: {
  url: string;
  onChange?: (url: string) => void;
  className?: string;
  style?: CSSProperties;
}) {
  const customUrl = useMemo(() => fromUrlString(url), [url]);

  const { scheme, hostname, port, pathname, query, hash } = customUrl;

  return (
    <div className={cn(className, "space-y-1")} style={style}>
      <LabelWrap label="Scheme">
        <RequiredInput
          className="w-full"
          type="text"
          placeholder="-"
          value={scheme ?? ""}
          onChange={(value) => {
            if (value) {
              const newUrl = toUrlString({ ...customUrl, scheme: value });
              onChange?.(newUrl);
            }
          }}
        />
      </LabelWrap>

      <LabelWrap label="Hostname">
        <RequiredInput
          placeholder="-"
          value={hostname ?? ""}
          onChange={(value) => {
            if (value) {
              const newUrl = toUrlString({ ...customUrl, hostname: value });
              onChange?.(newUrl);
            }
          }}
        />
      </LabelWrap>

      <LabelWrap label="Port">
        <Input
          placeholder="-"
          value={port ?? ""}
          onChange={(e) => {
            let { value } = e.target;
            value = value.replace(/[^0-9]/g, ""); // Numbers only
            const newUrl = toUrlString({
              ...customUrl,
              port: value,
            });
            onChange?.(newUrl);
          }}
        />
      </LabelWrap>

      <LabelWrap label="Pathname">
        <Input
          placeholder="-"
          value={pathname ?? ""}
          onChange={(e) => {
            const { value } = e.target;
            const newUrl = toUrlString({
              ...customUrl,
              pathname:
                value.length === 1 && value.at(0) !== "/" ? "/" + value : value,
            });
            onChange?.(newUrl);
          }}
        />
      </LabelWrap>

      <LabelWrap label="Query">
        <QueryEditor
          query={query ?? ""}
          onChange={(value) => {
            const newUrl = toUrlString({ ...customUrl, query: value });
            onChange?.(newUrl);
          }}
        />
      </LabelWrap>

      <LabelWrap label="Hash">
        <Input
          placeholder="-"
          value={hash ?? ""}
          onChange={(e) => {
            const { value } = e.target;
            const newUrl = toUrlString({
              ...customUrl,
              hash:
                value.length === 1 && value.at(0) !== "#" ? "#" + value : value,
            });
            onChange?.(newUrl);
          }}
        />
      </LabelWrap>
    </div>
  );
}
