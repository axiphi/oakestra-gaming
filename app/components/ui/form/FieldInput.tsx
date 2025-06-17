import { Input, InputProps } from "~/components/ui/input";
import { ReactNode } from "react";
import { useFieldContext } from "~/components/ui/form/form-context";

export type FieldInputProps = Omit<
  InputProps,
  "defaultValue" | "onValueChange"
>;

export function FieldInput(props: FieldInputProps): ReactNode {
  const { state, handleChange, handleBlur } = useFieldContext<
    string | number | readonly string[] | undefined
  >();

  return (
    <Input
      value={state.value}
      onValueChange={(v, e) => {
        console.debug("onValueChange", v, e);
        handleChange(v);
      }}
      onBlur={handleBlur}
      {...props}
    />
  );
}
