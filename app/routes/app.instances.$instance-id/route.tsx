import { CheckIcon, ClipboardIcon } from "lucide-react";
import { type ComponentProps, useEffect, useState } from "react";
import { redirect } from "react-router";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { sessionContext } from "~/lib/session";
import { cn } from "~/lib/utils";
import {
  getInstance,
  getInstanceDetails,
} from "~/routes/app.instances/internal-api.server/get-instance";
import type { Route } from "./+types/route";
import { PairDialog } from "./PairDialog";

export async function loader({ context, request, params }: Route.LoaderArgs) {
  const session = context.get(sessionContext);

  if (!session.user) {
    return redirect("/");
  }

  const instance = await getInstance(
    session.user.id,
    params["instance-id"],
    request.signal,
  );
  const instanceDetails = await getInstanceDetails(instance, request.signal);

  return {
    instance: instanceDetails,
  };
}

export default function Page({
  loaderData: { instance },
}: Route.ComponentProps) {
  return (
    <div className="flex grow flex-col items-start justify-start gap-16 self-stretch px-4 py-8">
      <div className="flex flex-row items-center justify-between self-stretch">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold">{instance.name}</h1>
          <p className="text-lg text-muted-foreground">ID: {instance.id}</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="lg" variant="destructive">
              Delete Instance
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                instance and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              {/*<Form action="/app/instances" method="POST">*/}
              {/*  <input type="hidden" name="intent" value="delete" />*/}
              {/*  <Button type="submit" variant="destructive">*/}
              {/*    Continue*/}
              {/*  </Button>*/}
              {/*</Form>*/}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex flex-row flex-wrap gap-8 self-stretch">
        <div className="flex max-w-128 grow flex-col items-stretch gap-4 rounded-lg p-6 pl-6 ring-2 ring-muted">
          <h2 className="mb-4 text-lg font-semibold">Connection</h2>
          <dl className="flex flex-col items-stretch justify-start gap-4">
            <div className="flex flex-row items-center justify-between gap-16">
              <dt className="text-muted-foreground">IP & Port</dt>
              <div className="flex flex-row items-center gap-2">
                <dd>
                  {instance.ip
                    ? `${instance.ip}:${instance.ports.http}`
                    : "Starting..."}
                </dd>
                <CopyButton
                  disabled={!instance.ip}
                  value={`${instance.ip}:${instance.ports.http}`}
                />
              </div>
            </div>
          </dl>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client IP</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {instance.pairRequests.map((req) => (
                <TableRow key={req.clientIp}>
                  <TableCell className="font-medium">{req.clientIp}</TableCell>
                  <TableCell className="text-right">
                    <PairDialog instance={instance} pairRequest={req} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex max-w-128 grow flex-col items-stretch gap-8 rounded-lg p-6 pl-6 ring-2 ring-muted">
          <h2 className="text-lg font-semibold">Specifications</h2>
          <dl className="flex flex-col items-stretch justify-start gap-4">
            <div className="flex flex-row items-center justify-between gap-16">
              <dt className="text-muted-foreground">vCPUs</dt>
              <dd>{instance.vcpus}</dd>
            </div>
            <div className="flex flex-row items-center justify-between gap-16">
              <dt className="text-muted-foreground">Memory</dt>
              <dd>{instance.memory} MB</dd>
            </div>
            <div className="flex flex-row items-center justify-between gap-16">
              <dt className="text-muted-foreground">Storage</dt>
              <dd>{instance.storage} GB</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}

type CopyButtonProps = Omit<
  ComponentProps<typeof Button>,
  "size" | "onClick"
> & { value: string };

function CopyButton({
  value,
  className,
  variant = "ghost",
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  return (
    <Button
      size="icon"
      variant={variant}
      className={cn("relative z-10 h-6 w-6 [&_svg]:h-3 [&_svg]:w-3", className)}
      onClick={() => {
        navigator.clipboard.writeText(value);
        setHasCopied(true);
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? <CheckIcon /> : <ClipboardIcon />}
    </Button>
  );
}
