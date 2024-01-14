import { useRef, useState, useCallback, useEffect } from "react";
import { Textarea } from "../../components/textarea";
import { useLatest } from "../../lib/hooks";

export function AutoResizeTextArea({
  value,
  placeholder,
  onChange,
  onLoaded,
}: {
  onLoaded: () => void;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isLoading, setLoading] = useState(true);

  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, []);

  const onLoadedRef = useLatest(onLoaded);
  useEffect(() => {
    onLoadedRef.current();
    setLoading(false);
  }, [onLoadedRef]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [value, adjustTextareaHeight]);

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      placeholder={placeholder}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
      onChange={onChange}
      style={{
        resize: "none",
        boxShadow: "none",
        visibility: isLoading ? "hidden" : "initial",
        overflowY: "hidden",
      }}
      rows={1}
      className="break-all w-full border-t-0 border-l-0 border-r-0 rounded-none"
    />
  );
}
