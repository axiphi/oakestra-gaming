import { createFormHook } from "@tanstack/react-form";
import { fieldContext, formContext } from "./form-context";
import { FieldContent } from "./FieldContent";
import { FieldInput } from "./FieldInput";
import { FieldError } from "./FieldError";
import { FieldLabel } from "./FieldLabel";
import { FieldDescription } from "./FieldDescription";
import { Form } from "~/components/ui/form/Form";

export const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FieldContent,
    FieldLabel,
    FieldInput,
    FieldDescription,
    FieldError,
  },
  formComponents: {
    Form,
  },
});
