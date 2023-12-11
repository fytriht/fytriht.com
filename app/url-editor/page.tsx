"use client";
import { useEffect, useMemo, useState } from "react";
import { toDataURL } from "qrcode";

const _testCase =
  "https://host.name/path/name?q1=a&url=https2%3A%2F%2Fpath%2Fname2%3Fq2%3Db%23hash2#hash1";

interface CustomURL {
  scheme?: string;
  hostname?: string;
  port?: string;
  pathname?: string;
  query?: string;
  hash?: string;
}

// TODO: test case
function fromUrlString(u: string): CustomURL {
  let scheme: string | undefined = undefined;
  let hostname: string | undefined = undefined;
  let port: string | undefined = undefined;
  let pathname: string | undefined = undefined;
  let query: string | undefined = undefined;
  let hash: string | undefined = undefined;
  let url = u;
  if (url.includes("#")) {
    const res = url.split("#");
    url = res[0];
    hash = `#${res[1]}`;
  }
  [url, query] = url.split("?");
  // TODO: match port
  const matched = url.match(/^(\w+?):\/\/(\S+?)(:\d+?)?(\/\S+?)?$/);
  if (matched !== null) {
    [, scheme, hostname, port, pathname] = matched;
    if (port !== undefined) {
      port = port.slice(1);
    }
  }

  return {
    scheme,
    hostname,
    port,
    pathname,
    query,
    hash,
  };
}

function canParsed(u: string): boolean {
  try {
    const customUrl = fromUrlString(u);
    return customUrl.scheme !== undefined && customUrl.hostname !== undefined;
  } catch {
    return false;
  }
}

function toUrlString(u: CustomURL): string {
  let str = "";
  str += `${u.scheme}://${u.hostname}`;
  if (u.port) {
    str += `:${u.port}`;
  }
  if (u.pathname) {
    str += u.pathname;
  }
  if (u.query) {
    str += `?${u.query}`;
  }
  if (u.hash) {
    str += u.hash;
  }
  return str;
}

function updateLocationUrlQuery(v: string) {
  const queryParams = new URLSearchParams(window.location.search);
  queryParams.set("url", v);
  const newUrl = `${window.location.origin}${
    window.location.pathname
  }?${queryParams.toString()}`;
  window.history.pushState({}, "", newUrl);
}

export default function Page({
  params: _,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [url, setUrl] = useState(() =>
    (searchParams.url as string) ?? ""
  );
  const [imgUrl, setImgUrl] = useState("");
  console.log({ searchParams });

  // TODO: debounce
  // TODO: cancel
  useEffect(() => {
    if (url) {
      toDataURL(url, { width: 200 }).then((imgUrl) => {
        setImgUrl(imgUrl);
      });
    } else {
      setImgUrl("")
    }
    updateLocationUrlQuery(url);
  }, [url]);

  return (
    <>
      <input
        type="text"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
        }}
        style={{ width: "100%" }}
      />
      <img src={imgUrl} width={200} alt="" />

      <UrlEditor url={url} onChange={(url) => setUrl(url)} />
    </>
  );
}

function UrlEditor({
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
        Pathname: {pathname && '/'}
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
        Hash: {hash && '#'}
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

function QueryEditor({
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
            {key}:{" "}
            {/* TODO: JSON Editor */}
            {canParsed(value) ? (
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* TODO: make it editable */}
                <input type="text" style={{ flex: 1 }} value={value} disabled />
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
