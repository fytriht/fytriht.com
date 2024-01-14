"use client";
import { useEffect, useMemo, useState } from "react";
import { toDataURL } from "qrcode";
import Image from "next/image";
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
    <div className="flex">
      <UrlEditor className="grow" url={url} onChange={(url) => setUrl(url)} />
      <Image
        className="w-60 h-60"
        src={imgUrl}
        alt="QRCode"
        width="240"
        height="240"
      />
    </div>
  );
}
