import { useForm } from "@conform-to/react";
import {
  parseWithValibot,
  unstable_coerceFormValue,
} from "@conform-to/valibot";
import { PlusIcon } from "lucide-react";
import { type ReactNode } from "react";
import { Link, useLocation, useNavigate, useNavigation } from "react-router";
import * as v from "valibot";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldErrors,
  FieldInput,
  FieldLabel,
  Form,
} from "~/components/ui/form";
import type { Route } from "./+types/route";

export const NewInstanceServerSchema = v.object({
  vcpus: v.pipe(
    v.number("This is a required field"),
    v.integer("Only whole numbers are allowed"),
    v.minValue(1, "You need at least 1 vcpu"),
  ),
  memory: v.pipe(
    v.number("This is a required field"),
    v.integer("Only whole numbers are allowed"),
    v.minValue(128, "You need at least 128MiB of memory"),
  ),
  storage: v.pipe(
    v.number("This is a required field"),
    v.integer("Only whole numbers are allowed"),
    v.minValue(8192, "You need at least 8192MiB of disk space"),
  ),
});

const NewInstanceClientSchema = unstable_coerceFormValue(
  NewInstanceServerSchema,
) as unknown as typeof NewInstanceServerSchema;

export function NewInstanceDialog({
  actionData,
}: {
  actionData: Route.ComponentProps["actionData"];
}): ReactNode {
  const { pathname } = useLocation();
  const { state } = useNavigation();
  const navigate = useNavigate();

  const [form, fields] = useForm({
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithValibot(formData, { schema: NewInstanceClientSchema });
    },
    shouldValidate: "onInput",
    shouldRevalidate: "onInput",
    defaultValue: {
      vcpus: 8,
      memory: 8192,
      storage: 16384,
    },
  });

  return (
    <Dialog
      open={pathname == "/app/instances/new"}
      onOpenChange={(open) => {
        if (open) {
          navigate("/app/instances/new");
        } else {
          navigate(-1);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2" asChild>
          <Link to="/app/instances/new">
            <PlusIcon />
            New Instance
          </Link>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form metadata={form} action="/app/instances" method="POST" replace>
          <DialogHeader className="mb-2">
            <DialogTitle>New Instance</DialogTitle>
          </DialogHeader>
          <Field metadata={fields.vcpus}>
            <FieldLabel>vCPUs</FieldLabel>
            <FieldInput type="number" />
            <FieldDescription>
              the number of virtual cpu cores available to the VM
            </FieldDescription>
            <FieldErrors />
          </Field>
          <Field metadata={fields.memory}>
            <FieldLabel>Memory</FieldLabel>
            <FieldInput type="number" />
            <FieldDescription>
              the amount of memory available to the VM in MiB
            </FieldDescription>
            <FieldErrors />
          </Field>
          <Field metadata={fields.storage}>
            <FieldLabel>Disk Space</FieldLabel>
            <FieldInput type="number" />
            <FieldDescription>
              the amount of disk space available to the VM in MiB
            </FieldDescription>
            <FieldErrors />
          </Field>
          <DialogFooter>
            <Button disabled={state === "submitting" || !form.valid}>
              Submit
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
