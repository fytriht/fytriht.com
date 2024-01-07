import { useMemo } from "react";
import { fromUrlString, toUrlString } from "./url-utils";
import { QueryEditor } from "./query-editor";

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
      <input
        type="text"
        value={url}
        onChange={(e) => {
          onChange?.(e.target.value);
        }}
        style={{ width: "100%" }}
      />

      <label style={{ display: "flex" }}>
        Scheme:{" "}
        <input
          type="text"
          style={{ flex: 1 }}
          value={scheme ?? ""}
          onChange={(e) => {
            const { value } = e.target;
            if (value) {
              const newUrl = toUrlString({ ...customUrl, scheme: value });
              onChange?.(newUrl);
            }
          }}
        />
      </label>

      <label style={{ display: "flex" }}>
        Hostname:{" "}
        <input
          type="text"
          style={{ flex: 1 }}
          value={hostname ?? ""}
          onChange={(e) => {
            const { value } = e.target;
            if (value) {
              const newUrl = toUrlString({ ...customUrl, hostname: value });
              onChange?.(newUrl);
            }
          }}
        />
      </label>

      <label style={{ display: "flex" }}>
        Port:{" "}
        <input
          type="text"
          style={{ flex: 1 }}
          value={port ?? ""}
          onChange={(e) => {
            const { value } = e.target;
            // if (value) {
            const newUrl = toUrlString({ ...customUrl, port: value });
            onChange?.(newUrl);
            // }
          }}
        />
      </label>

      <label style={{ display: "flex" }}>
        Pathname: {pathname && "/"}
        <input
          type="text"
          style={{ flex: 1 }}
          value={pathname?.slice(1) ?? ""}
          onChange={(e) => {
            const { value } = e.target;
            const newUrl = toUrlString({
              ...customUrl,
              pathname: value ? `/${value}` : undefined,
            });
            onChange?.(newUrl);
          }}
        />
      </label>

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

      <label style={{ display: "flex" }}>
        Hash: {hash && "#"}
        <input
          type="text"
          style={{ flex: 1 }}
          value={hash?.slice(1) ?? ""}
          onChange={(e) => {
            const { value } = e.target;
            const newUrl = toUrlString({
              ...customUrl,
              hash: value ? `#${value}` : undefined,
            });
            onChange?.(newUrl);
          }}
        />
      </label>
    </>
  );
}
