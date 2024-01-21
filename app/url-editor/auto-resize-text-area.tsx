import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Textarea } from "../../components/textarea";
import { useLatest } from "../../lib/hooks";

export default forwardRef(function AutoResizeTextArea(
  {
    value,
    placeholder,
    onChange,
    onLoaded,
  }: {
    onLoaded: () => void;
  } & React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  ref
) {
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

  useImperativeHandle(
    ref,
    () => ({
      focus() {
        textareaRef.current?.focus();
      },
    }),
    []
  );

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
        visibility: isLoading ? "hidden" : "initial",
        overflowY: "hidden",
      }}
      rows={1}
      className="break-all"
    />
  );
});
