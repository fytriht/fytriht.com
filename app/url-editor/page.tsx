"use client";
import { useEffect, useMemo, useState } from "react";
import { toDataURL } from "qrcode";
import { UrlEditor } from "./url-editor";

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
      <img src={imgUrl} width={200} alt="" />
      <UrlEditor url={url} onChange={(url) => setUrl(url)} />
    </>
  );
}
