import { ComponentProps, ReactNode } from "react";
import { Field as BaseField } from "@base-ui-components/react";
import { cn } from "~/lib/cn";

export type FieldDescriptionProps = ComponentProps<
  typeof BaseField.Description
>;

export function FieldDescription({
  className,
  ...props
}: FieldDescriptionProps): ReactNode {
  return (
    <BaseField.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}
