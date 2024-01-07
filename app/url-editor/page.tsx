"use client";
import { useEffect, useMemo, useState } from "react";
import { toDataURL } from "qrcode";
import { UrlEditor } from "./url-editor";

const _testCase =
  "https://host.name/path/name?q1=a&url=https2%3A%2F%2Fpath%2Fname2%3Fq2%3Db%23hash2#hash1";

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
  const [url, setUrl] = useState(() => (searchParams.url as string) ?? "");
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
      setImgUrl("");
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
