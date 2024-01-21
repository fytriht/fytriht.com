import { useEffect, useRef, useState } from "react";
import { Input } from "../../components/input";

export type RequiredInputProps = {
  onChange: (value: string) => void;
  value: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">;

export function RequiredInput({
  value,
  onChange,
  placeholder,
  ...otherProps
}: RequiredInputProps) {
  const [isFocus, setFocus] = useState(false);
  const [valueEmptied, setValueEmptied] = useState(false);

  return (
    <Input
      onFocus={() => {
        setFocus(true);
      }}
      onBlur={() => {
        setFocus(false);
        if (valueEmptied) {
          setValueEmptied(false);
        }
      }}
      onChange={(e) => {
        const value = e.target.value;
        setValueEmptied(value === "");
        if (value !== "") {
          onChange(value);
        }
      }}
      value={valueEmptied ? "" : value}
      placeholder={isFocus ? undefined : placeholder}
      {...otherProps}
    />
  );
}
