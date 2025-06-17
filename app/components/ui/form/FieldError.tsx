import { ComponentProps, ReactNode } from "react";
import { Field as BaseField } from "@base-ui-components/react";
import { cn } from "~/lib/cn";

export type FieldErrorProps = Omit<
  ComponentProps<typeof BaseField.Error>,
  "match" | "children"
>;

export function FieldError({
  className,
  ...props
}: FieldErrorProps): ReactNode {
  return (
    <BaseField.Error
      match={true}
      className={cn("text-sm text-destructive", className)}
      {...props}
    />
  );
}
