import { ComponentProps, ReactNode } from "react";
import { Field as BaseField } from "@base-ui-components/react";
import { cn } from "~/lib/cn";
import { useFieldContext } from "~/components/ui/form/form-context";

export type FieldContentProps = Omit<
  ComponentProps<typeof BaseField.Root>,
  "name" | "invalid" | "validate" | "validationMode" | "validationDebounceTime"
>;

export function FieldContent({
  className,
  ...props
}: FieldContentProps): ReactNode {
  const { name, state } = useFieldContext();

  return (
    <BaseField.Root
      name={name}
      invalid={!state.meta.isValid}
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}
