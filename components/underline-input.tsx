import * as React from "react";

import { cn } from "@/lib/utils";

export interface UnderlineInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const UnderlineInput = React.forwardRef<HTMLInputElement, UnderlineInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full border-input bg-transparent px-3 py-1 text-sm transition-colors placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:rounded-md focus-visible:shadow-sm",
          "border-b",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
UnderlineInput.displayName = "UnderlineInput";

export { UnderlineInput };
