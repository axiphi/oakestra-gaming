import {
  CheckIcon,
  ClipboardIcon,
  TrashIcon,
  TriangleAlertIcon,
} from "lucide-react";
import {
  type ComponentProps,
  type ReactNode,
  Suspense,
  useEffect,
  useState,
} from "react";
import {
  Await,
  Form,
  redirect,
  useLocation,
  useNavigation,
} from "react-router";
import { AsyncError } from "~/components/AsyncError";
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
import { ScrollArea } from "~/components/ui/scroll-area";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { catchAbort } from "~/lib/catch-abort";
import { sessionContext } from "~/lib/session";
import { cn } from "~/lib/utils";
import { deleteInstance } from "~/routes/app.instances/internal-api.server/delete-instance";
import {
  getInstance,
  getInstancePairRequests,
} from "~/routes/app.instances/internal-api.server/get-instance";
import type { InstancePairRequest } from "../app.instances/internal-api.server/instance";
import type { Route } from "./+types/route";
import { PairDialog } from "./PairDialog";

export async function loader({ context, request, params }: Route.LoaderArgs) {
  const session = context.get(sessionContext);

  if (!session.user) {
    return redirect("/");
  }

  const instance = getInstance(
    session.user.id,
    params["instance-id"],
    request.signal,
  );

  const pairRequests: Promise<InstancePairRequest[]> = instance.then(
    async (inst) => await getInstancePairRequests(inst, request.signal),
  );

  return {
    instance: catchAbort(instance),
    pairRequests: catchAbort(pairRequests),
  };
}

export async function action({ context, params, request }: Route.ActionArgs) {
  const session = context.get(sessionContext);

  if (!session.user) {
    return redirect("/");
  }

  await deleteInstance(session.user.id, params["instance-id"], request.signal);

  return redirect("/app/instances");
}

export default function Page({ loaderData }: Route.ComponentProps) {
  const location = useLocation();
  const { state } = useNavigation();

  return (
    <div className="flex grow flex-col items-start justify-start gap-16 self-stretch px-4">
      <Suspense fallback={<SkeletonDetails />} key={location.key}>
        <Await
          resolve={loaderData.instance}
          errorElement={
            <AsyncError message="Failed to fetch instance details" />
          }
        >
          {(instance) => {
            return (
              <>
                <div className="flex flex-row flex-wrap items-center justify-between gap-4 self-stretch px-4 md:px-8">
                  <div className="flex flex-col gap-2">
                    <h1 className="text-4xl font-semibold">{instance.name}</h1>
                    <p className="truncate text-lg text-muted-foreground">
                      ID: {instance.id}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="lg" variant="destructive">
                        <TrashIcon />
                        Delete Instance
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Instance</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your instance and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <Form
                          action={`/app/instances/${instance.id}`}
                          method="DELETE"
                        >
                          <Button
                            disabled={state === "submitting"}
                            type="submit"
                            variant="destructive"
                          >
                            Continue
                          </Button>
                        </Form>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <ScrollArea className="h-0 flex-auto border-y-2">
                  <div className="flex flex-row flex-wrap content-center justify-center gap-8 self-stretch px-4 py-2">
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
                      <Suspense fallback={<SkeletonTable />} key={location.key}>
                        <Await
                          resolve={loaderData.pairRequests}
                          errorElement={
                            <span className="mt-6 flex flex-col justify-center self-center text-muted-foreground">
                              Instance not reachable yet...
                            </span>
                          }
                        >
                          {(pairRequests) => (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Client IP</TableHead>
                                  <TableHead className="text-right">
                                    Action
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {pairRequests.map((req) => (
                                  <TableRow key={req.clientIp}>
                                    <TableCell className="font-medium">
                                      {req.clientIp}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      <PairDialog
                                        instance={instance}
                                        pairRequest={req}
                                      />
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </Await>
                      </Suspense>
                    </div>
                    <div className="flex max-w-128 grow flex-col items-stretch gap-8 rounded-lg p-6 ring-2 ring-muted">
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
                </ScrollArea>
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}

type CopyStatus = "idle" | "success" | "error";

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
  const [status, setStatus] = useState<CopyStatus>("idle");
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (status === "success") {
        setStatus("idle");
      }
    }, 2000);

    return () => clearTimeout(timeout);
  }, [status]);

  return (
    <Button
      size="icon"
      variant={variant}
      className={cn("relative z-10 h-6 w-6 [&_svg]:h-3 [&_svg]:w-3", className)}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setStatus("success");
        } catch (_) {
          setStatus("error");
        }
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      <CopyIcon status={status} />
    </Button>
  );
}

interface CopyIconProps {
  status: CopyStatus;
}

function CopyIcon({ status }: CopyIconProps): ReactNode {
  if (status === "success") {
    return <CheckIcon />;
  }

  if (status === "error") {
    return <TriangleAlertIcon />;
  }

  return <ClipboardIcon />;
}

function SkeletonDetails(): ReactNode {
  return (
    <>
      <div className="flex flex-row items-center justify-between self-stretch px-8">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-[13ch] rounded-xl text-4xl" />
          <Skeleton className="h-4 w-[27ch] rounded-xl text-lg" />
        </div>
        <Skeleton className="h-10 w-38 rounded-lg" />
      </div>
      <div className="flex flex-row flex-wrap gap-9 self-stretch">
        <div className="flex max-w-128 grow flex-col gap-9 p-6">
          <Skeleton className="h-6 w-[11ch] rounded-xl" />
          <div className="flex flex-col items-stretch justify-start gap-8">
            <div className="flex flex-row items-center justify-between gap-16">
              <Skeleton className="h-4 w-[8ch] rounded-xl" />
              <Skeleton className="h-4 w-[16ch] rounded-xl" />
            </div>
            <SkeletonTable />
          </div>
        </div>
        <div className="flex max-w-128 grow flex-col gap-9 p-6">
          <Skeleton className="h-6 w-[14ch] rounded-xl" />
          <div className="flex flex-col items-stretch justify-start gap-4">
            <div className="flex flex-row items-center justify-between gap-16">
              <Skeleton className="h-5 w-[8ch] rounded-xl" />
              <Skeleton className="h-5 w-[4ch] rounded-xl" />
            </div>
            <div className="flex flex-row items-center justify-between gap-16">
              <Skeleton className="h-5 w-[10ch] rounded-xl" />
              <Skeleton className="h-5 w-[6ch] rounded-xl" />
            </div>
            <div className="flex flex-row items-center justify-between gap-16">
              <Skeleton className="h-5 w-[9ch] rounded-xl" />
              <Skeleton className="h-5 w-[8ch] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SkeletonTable(): ReactNode {
  return (
    <div className="mx-2 flex flex-col items-center gap-4 self-stretch">
      <Skeleton className="flex h-5 self-stretch rounded-xl" />
      <div className="flex flex-row items-center justify-between gap-16 self-stretch">
        <Skeleton className="h-4 w-[8ch] rounded-xl" />
        <Skeleton className="h-8 w-36 rounded-lg" />
      </div>
    </div>
  );
}
