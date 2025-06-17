import { ComponentProps, ReactNode, useEffect } from "react";
import { Form as BaseForm } from "@base-ui-components/react";
import { useFormContext } from "~/components/ui/form/form-context";
import { AnyFieldMeta, useStore } from "@tanstack/react-form";

export type FormProps = Omit<
  ComponentProps<typeof BaseForm>,
  "errors" | "onClearErrors"
>;

export function Form(props: FormProps): ReactNode {
  const form = useFormContext();

  const errors = useStore(form.store, (state) =>
    Object.fromEntries(
      Object.entries(state.fieldMeta as Record<string, AnyFieldMeta>)
        .map(([fieldName, fieldMeta]) => [
          fieldName,
          Object.values(fieldMeta.errorMap)
            .flat()
            .map(extractErrorMessage)
            .filter((message) => message !== undefined),
        ])
        .filter(([, messages]) => messages.length > 0),
    ),
  );

  // useEffect(() => {
  //   console.debug("errors", errors, form.state);
  // }, [errors]);

  return <BaseForm errors={errors} {...props} />;
}

function extractErrorMessage(error: unknown): string | undefined {
  if (typeof error === "string") {
    return error;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return undefined;
}
