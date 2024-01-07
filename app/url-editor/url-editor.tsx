import { useMemo } from "react";
import { fromUrlString, toUrlString } from "./url-utils";
import { QueryEditor } from "./query-editor";
import { LabelTextInput } from "./label-text-input";
import { Label } from "../../components/label";
import { Textarea } from "../../components/textarea";
import { cn } from "../../lib/utils";

export function UrlEditor({
  url,
  onChange,
  className,
}: {
  url: string;
  onChange?: (url: string) => void;
  className?: string;
}) {
  const customUrl = useMemo(() => fromUrlString(url), [url]);

  const { scheme, hostname, port, pathname, query, hash } = customUrl;

  return (
    <div className={cn(className, "space-y-1")}>
      <Textarea
        value={url}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        style={{ width: "100%", resize: "none" }}
        rows={3}
        className="break-all"
      />

      <LabelTextInput
        label="Scheme"
        id="scheme"
        placeholder="Scheme"
        value={scheme ?? ""}
        onChange={(e) => {
          const { value } = e.target;
          if (value) {
            const newUrl = toUrlString({ ...customUrl, scheme: value });
            onChange?.(newUrl);
          }
        }}
      />

      <LabelTextInput
        label="Hostname"
        id="hostname"
        placeholder="Hostname"
        value={hostname ?? ""}
        onChange={(e) => {
          const { value } = e.target;
          if (value) {
            const newUrl = toUrlString({ ...customUrl, hostname: value });
            onChange?.(newUrl);
          }
        }}
      />

      <LabelTextInput
        label="Port"
        id="port"
        placeholder="Port"
        value={port ?? ""}
        onChange={(e) => {
          const { value } = e.target;
          // if (value) {
          const newUrl = toUrlString({ ...customUrl, port: value });
          onChange?.(newUrl);
          // }
        }}
      />

      <LabelTextInput
        label="Pathname"
        id="pathname"
        placeholder="Pathname"
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

      <div className="flex items-center">
        <Label className="w-32">Query: </Label>
        <div className="w-full space-y-1">
          {query && (
            <QueryEditor
              query={query ?? ""}
              onChange={(value) => {
                if (value) {
                  const newUrl = toUrlString({ ...customUrl, query: value });
                  onChange?.(newUrl);
                }
              }}
            />
          )}
        </div>
      </div>

      <LabelTextInput
        label="Hash"
        id="hash"
        placeholder="Hash"
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
    </div>
  );
}
