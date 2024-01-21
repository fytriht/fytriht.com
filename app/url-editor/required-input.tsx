import { useEffect, useRef, useState } from "react";
import { Input } from "../../components/input";

export type RequiredInputProps = {
  onChange: (value: string) => void;
  value: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">;

export function RequiredInput({
  value: outerValue,
  onChange,
  placeholder,
  ...otherProps
}: RequiredInputProps) {
  const [isFocus, setFocus] = useState(false);
  const [value, setValue] = useState(outerValue);
  const originValueRef = useRef<string>(outerValue);

  useEffect(() => {
    if (outerValue === "") {
      setValue(outerValue);
    }
  }, [outerValue]);

  return (
    <Input
      onFocus={() => {
        setFocus(true);
      }}
      onBlur={() => {
        setFocus(false);
        if (value === "") {
          const originValue = originValueRef.current;
          setValue(originValue);
          onChange(originValue);
        }
      }}
      onChange={(e) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (newValue === "") {
          originValueRef.current = value;
        }
        if (newValue !== "") {
          onChange(newValue);
        }
      }}
      value={value}
      placeholder={isFocus ? undefined : placeholder}
      {...otherProps}
    />
  );
}
