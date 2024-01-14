import { CSSProperties, ReactElement, ReactNode } from "react";
import { Label } from "../../components/label";

export type LabelWrapProps = React.PropsWithChildren<{
  label: ReactNode;
  htmlFor?: string;
  style?: CSSProperties;
}>;

export function LabelWrap({ children, label, htmlFor, style }: LabelWrapProps) {
  return (
    <div className="flex items-center" style={style}>
      <Label className="w-32 flex-none" htmlFor={htmlFor}>{`${label}: `}</Label>
      {children}
    </div>
  );
}
