import { useForm } from "@conform-to/react";
import {
  parseWithValibot,
  unstable_coerceFormValue,
} from "@conform-to/valibot";
import { RouteIcon } from "lucide-react";
import { type ReactNode } from "react";
import { Link, useLocation, useNavigate, useNavigation } from "react-router";
import * as v from "valibot";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  HiddenField,
} from "~/components/ui/form";
import { useRouteActionData } from "~/lib/action";
import type {
  InstanceDetails,
  InstancePairRequest,
} from "~/routes/app.instances/internal-api.server/instance";
import type { Route as PairRoute } from "../app.instances.$instance-id.pair.$client-ip/+types/route";

export interface PairRequestListProps {
  instance: InstanceDetails;
}

export function PairRequests({ instance }: PairRequestListProps): ReactNode {
  if (instance.pairRequests.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 rounded-md border">
      <h3 className="text-xl font-semibold">Pending Pair Requests</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        The following clients are requesting to be paired with this instance.
      </p>
    </div>
  );
}

interface PairDialogProps {
  instance: InstanceDetails;
  pairRequest: InstancePairRequest;
}

export function PairDialog({
  instance,
  pairRequest,
}: PairDialogProps): ReactNode {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { state } = useNavigation();

  const actionData = useRouteActionData<PairRoute.ComponentProps["actionData"]>(
    "app.instances.$instance-id.pair.$client-ip",
  );

  const [form, fields] = useForm({
    lastResult: actionData,
    onValidate({ formData }) {
      return parseWithValibot(formData, { schema: PairClientSchema });
    },
    shouldValidate: "onInput",
    shouldRevalidate: "onInput",
  });

  return (
    <Dialog
      open={
        pathname == `/app/instances/${instance.id}/pair/${pairRequest.clientIp}`
      }
      onOpenChange={(open) => {
        if (open) {
          navigate(
            `/app/instances/${instance.id}/pair/${pairRequest.clientIp}`,
          );
        } else {
          navigate(-1);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2" asChild>
          <Link
            to={`/app/instances/${instance.id}/pair/${pairRequest.clientIp}`}
          >
            Pair Client
            <RouteIcon />
          </Link>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <Form
          metadata={form}
          action={`/app/instances/${instance.id}/pair/${pairRequest.clientIp}`}
          method="POST"
        >
          <DialogHeader className="mb-2">
            <DialogTitle>Pair Client: {pairRequest?.clientIp}</DialogTitle>
            <DialogDescription>
              Enter the PIN displayed on the client device to complete the
              pairing process.
            </DialogDescription>
          </DialogHeader>
          <Field metadata={fields.pin}>
            <FieldLabel>Pin</FieldLabel>
            <FieldInput type="text" />
            <FieldDescription>
              the PIN displayed on the client device
            </FieldDescription>
            <FieldErrors />
          </Field>
          <HiddenField metadata={fields.secret} value={pairRequest.secret} />
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

export const PairServerSchema = v.object({
  pin: v.pipe(
    v.string("This is a required field"),
    v.nonEmpty("This is a required field"),
  ),
  secret: v.pipe(v.string(), v.nonEmpty()),
});

const PairClientSchema = unstable_coerceFormValue(
  PairServerSchema,
) as unknown as typeof PairServerSchema;
