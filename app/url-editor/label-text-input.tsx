import { Input } from "../../components/input";
import { Label } from "../../components/label";

export type LabelTextInputProps = {
  label: string;
} & Pick<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "className" | "id" | "placeholder"
>;

export function LabelTextInput({
  label,
  id,
  placeholder,
  value,
  onChange,
}: LabelTextInputProps) {
  return (
    <div className="flex items-center">
      <Label htmlFor="scheme" className="w-32">
        {`${label}: `}
      </Label>
      <Input
        className="w-full"
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
