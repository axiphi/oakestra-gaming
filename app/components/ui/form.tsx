import {
  type FieldMetadata,
  type FormMetadata,
  getFormProps,
  getInputProps,
} from "@conform-to/react";
import * as React from "react";
import {
  type ComponentProps,
  createContext,
  type ReactNode,
  useContext,
} from "react";
import { Form as RouterForm } from "react-router";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import { Input } from "./input";

interface FieldContext {
  metadata: FieldMetadata<unknown, Record<string, unknown>, string[]>;
}

const FieldContext = createContext<FieldContext | undefined>(undefined);

function useFieldContext(): FieldContext {
  const context = useContext(FieldContext);
  if (context === undefined) {
    throw new Error("useFormFieldContext must be used within a FormField");
  }
  return context;
}

export interface FormProps<S extends Record<string, unknown>>
  extends ComponentProps<typeof RouterForm> {
  metadata: FormMetadata<S>;
}

export function Form<S extends Record<string, unknown>>({
  metadata,
  className,
  ...props
}: FormProps<S>) {
  return (
    <RouterForm
      {...getFormProps(metadata, {
        ariaAttributes: false,
      })}
      className={cn("flex flex-1 flex-col items-stretch gap-4", className)}
      {...props}
    />
  );
}

export interface FieldProps extends ComponentProps<"div"> {
  metadata: FieldMetadata<unknown, Record<string, unknown>, string[]>;
}

export function Field({ metadata, ...props }: FieldProps): ReactNode {
  return (
    <FieldContext.Provider value={{ metadata }}>
      <div
        data-slot="field"
        data-valid={metadata.valid || undefined}
        data-invalid={!metadata.valid || undefined}
        className="group grid gap-2"
        {...props}
      />
    </FieldContext.Provider>
  );
}

export type FieldLabel = ComponentProps<typeof Label>;

export function FieldLabel({ className, ...props }: FieldLabel): ReactNode {
  const { metadata } = useFieldContext();

  return (
    <Label
      data-slot="field-label"
      className={cn("group-data-[invalid]:text-destructive", className)}
      htmlFor={metadata?.id}
      {...props}
    />
  );
}

export type FieldDescriptionProps = React.ComponentProps<"p">;

export function FieldDescription({
  className,
  ...props
}: FieldDescriptionProps): ReactNode {
  const { metadata } = useFieldContext();

  return (
    <p
      data-slot="field-description"
      id={metadata.descriptionId}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export type FieldErrorsProps = Omit<React.ComponentProps<"ul">, "children">;

export function FieldErrors({
  className,
  ...props
}: FieldErrorsProps): ReactNode {
  const { metadata } = useFieldContext();

  return (
    metadata.errors &&
    metadata.errors.length > 0 && (
      <ul
        data-slot="field-errors"
        role="status"
        id={metadata.errorId}
        className={cn(
          "ml-4 list-disc text-sm text-destructive [&:not(:last-child)]:mt-1",
          className,
        )}
        {...props}
      >
        {metadata.errors.map((error, index) => (
          <li key={index}>{error}</li>
        ))}
      </ul>
    )
  );
}

export type FieldInputProps = Omit<
  ComponentProps<typeof Input>,
  "defaultValue" | "type"
> & {
  type:
    | "checkbox"
    | "color"
    | "date"
    | "datetime-local"
    | "email"
    | "file"
    | "hidden"
    | "month"
    | "number"
    | "password"
    | "radio"
    | "range"
    | "search"
    | "tel"
    | "text"
    | "time"
    | "url"
    | "week";
  controlled?: boolean;
};

export function FieldInput({
  type,
  controlled,
  ...props
}: FieldInputProps): ReactNode {
  const { metadata } = useFieldContext();

  // this if branch is just to make the type-checker happy
  let options: Parameters<typeof getInputProps>[1];
  if (type === "radio" || type === "checkbox") {
    options = {
      ariaAttributes: false,
      type: type,
      value: controlled ? false : undefined,
    };
  } else {
    options = {
      ariaAttributes: false,
      type: type,
      value: controlled ? false : undefined,
    };
  }

  return (
    <Input
      {...getInputProps(metadata, options)}
      aria-describedby={[
        metadata.descriptionId,
        ...(metadata.valid ? [] : [metadata.errorId]),
      ].join(" ")}
      aria-invalid={!metadata.valid}
      aria-errormessage={metadata.valid ? undefined : metadata.errorId}
      {...props}
    />
  );
}
