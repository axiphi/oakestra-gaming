import * as React from "react";
import { Input as BaseInput } from "@base-ui-components/react";

import { cn } from "~/lib/cn";

export interface InputProps extends React.ComponentProps<typeof BaseInput> {
  children?: React.ReactNode;
  inputWrapperClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ children, className, inputWrapperClassName, ...props }, ref) => {
    const hasLeadingIcon = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        child.type === InputIcon &&
        typeof child.props === "object" &&
        child.props !== null &&
        "side" in child.props &&
        child.props.side === "leading",
    );
    const hasTrailingIcon = React.Children.toArray(children).some(
      (child) =>
        React.isValidElement(child) &&
        child.type === InputIcon &&
        typeof child.props === "object" &&
        child.props !== null &&
        "side" in child.props &&
        child.props.side === "trailing",
    );

    return (
      <div className={cn("relative", inputWrapperClassName)}>
        {children}
        <BaseInput
          ref={ref}
          className={cn(
            "h-9 w-full rounded-md border bg-input p-4 text-foreground placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:text-destructive aria-invalid:placeholder:text-destructive aria-invalid:focus:ring-destructive/50 md:text-sm",
            hasLeadingIcon && "pl-10",
            hasTrailingIcon && "pr-10",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

interface InputIconProps extends React.ComponentPropsWithoutRef<"div"> {
  side: "leading" | "trailing";
  children?: React.ReactNode;
}

const InputIcon = React.forwardRef<HTMLDivElement, InputIconProps>(
  ({ children, className, side, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "absolute top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4",
        side === "leading" && "left-3",
        side === "trailing" && "right-3",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  ),
);
InputIcon.displayName = "InputIcon";

export { Input, InputIcon };
