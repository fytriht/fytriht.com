"use client";
import { useEffect, useRef, useState } from "react";
import { toDataURL } from "qrcode";
import Image from "next/image";
import { Copy, X } from "lucide-react";
import { UrlEditor } from "./url-editor";
import AutoResizeTextArea from "./auto-resize-text-area";
import { useEffectOnce } from "../../lib/hooks";
import { Button } from "../../components/button";
import { useToast } from "../../components/toast/use-toast";

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
  const [textAreaLoaded, setTextAreaLoaded] = useState(false);
  const { toast } = useToast();

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

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  useEffectOnce(() => {
    // Autofocus only when there is no inputs.
    // The assumption is in that case, people are intended to enter text.
    if (url.length === 0) {
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 100);
    }
  });

  return (
    <div className="flex">
      <div className="grow space-y-1 pr-0.5 py-2 pl-2">
        <div className="flex items-center">
          <AutoResizeTextArea
            ref={textAreaRef}
            value={url}
            placeholder="Enter URL"
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            onLoaded={() => {
              setTextAreaLoaded(true);
            }}
          />
          {textAreaLoaded && (
            <>
              <Button
                className="flex-none ml-1 w-9 h-9"
                variant="outline"
                size="icon"
                disabled={url === ""}
                onClick={async () => {
                  await navigator.clipboard.writeText(url);
                  toast({ description: "Copy successfully", duration: 2000 });
                }}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                className="flex-none ml-1 w-9 h-9"
                variant="outline"
                size="icon"
                disabled={url === ""}
                onClick={() => {
                  setUrl("");
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        {textAreaLoaded && (
          <UrlEditor url={url} onChange={(url) => setUrl(url)} />
        )}
      </div>
      {imgUrl ? (
        <Image
          className="w-60 h-60"
          src={imgUrl}
          alt="QRCode"
          width="240"
          height="240"
        />
      ) : (
        <div className="w-60 h-60" />
      )}
    </div>
  );
}
