import { ReactElement, ReactNode } from "react";
import { Label } from "../../components/label";

export type LabelWrapProps = React.PropsWithChildren<{
  label: ReactNode;
  htmlFor?: string;
}>;

export function LabelWrap({ children, label, htmlFor }: LabelWrapProps) {
  return (
    <div className="flex items-center">
      <Label className="w-32" htmlFor={htmlFor}>{`${label}: `}</Label>
      {children}
    </div>
  );
}
