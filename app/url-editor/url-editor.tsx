import { useMemo } from "react";
import { fromUrlString, toUrlString } from "./url-utils";
import { QueryEditor } from "./query-editor";
import { Input } from "../../components/input";
import { LabelTextInput } from "./label-text-input";

export function UrlEditor({
  url,
  onChange,
}: {
  url: string;
  onChange?: (url: string) => void;
}) {
  const customUrl = useMemo(() => fromUrlString(url), [url]);

  const { scheme, hostname, port, pathname, query, hash } = customUrl;

  return (
    <>
      <Input
        type="text"
        value={url}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        style={{ width: "100%" }}
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

      <label style={{ display: "flex", flexDirection: "column" }}>
        Query:{" "}
        <div style={{ flex: 1, marginLeft: 60 }}>
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
      </label>

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
    </>
  );
}
