import { ComponentProps, ReactNode } from "react";
import { Field as BaseField } from "@base-ui-components/react";
import { cn } from "~/lib/cn";

export type FieldLabelProps = ComponentProps<typeof BaseField.Label>;

export function FieldLabel({
  className,
  ...props
}: FieldLabelProps): ReactNode {
  return (
    <BaseField.Label
      className={cn("data-invalid:text-destructive", className)}
      {...props}
    />
  );
}
