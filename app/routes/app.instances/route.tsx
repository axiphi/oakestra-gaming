import { parseWithValibot } from "@conform-to/valibot";
import { ChevronRightIcon } from "lucide-react";
import { type ReactNode, Suspense, useId } from "react";
import { Await, Link, Outlet, redirect, useLocation } from "react-router";
import { AsyncError } from "~/components/AsyncError";
import {
  NavigationCard,
  NavigationCardContent,
  NavigationCardDescription,
  NavigationCardHeader,
  NavigationCardItem,
  NavigationCardLink,
  NavigationCardList,
  NavigationCardMenu,
  NavigationCardTitle,
} from "~/components/ui/navigation-card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { catchAbort } from "~/lib/catch-abort";
import { sessionContext } from "~/lib/session";
import { useLastResolved } from "~/lib/use-last-resolved";
import { cn } from "~/lib/utils";
import { createInstance } from "~/routes/app.instances/internal-api.server/create-instance";
import { getInstances } from "~/routes/app.instances/internal-api.server/get-instances";
import type { Instance } from "~/routes/app.instances/internal-api.server/instance";
import type { InstanceStatus } from "~/routes/app.instances/internal-api.server/instance-status";
import type { Route } from "./+types/route";
import {
  NewInstanceDialog,
  NewInstanceServerSchema,
} from "./NewInstanceDialog";

const STATUS_COLOR_MAP = new Map<InstanceStatus, string>([
  ["UNKNOWN", "bg-gray-500"],
  ["ERROR", "bg-red-500"],
  ["STARTING", "bg-blue-500"],
  ["RUNNING", "bg-green-500"],
  ["STOPPING", "bg-orange-500"],
]);

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = context.get(sessionContext);

  if (!session.user) {
    return redirect("/");
  }

  return {
    // don't await
    instances: catchAbort(getInstances(session.user.id, request.signal)),
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const session = context.get(sessionContext);

  if (!session.user) {
    return redirect("/");
  }

  const formData = await request.formData();
  const submission = parseWithValibot(formData, {
    schema: NewInstanceServerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  await createInstance(session.user.id, submission.value, request.signal);
  return redirect("/app/instances");
}

export default function Page({ actionData, loaderData }: Route.ComponentProps) {
  const titleId = useId();
  const location = useLocation();

  const instances = useLastResolved(loaderData.instances);

  const isInListView =
    location.pathname === "/app/instances/" ||
    location.pathname === "/app/instances";
  const isInItemView =
    !isInListView && location.pathname !== "/app/instances/new";

  return (
    <div className="flex h-0 grow flex-row justify-start gap-8 p-8">
      <div
        className={cn("basis-2/5 flex-col justify-start gap-4", {
          "flex max-md:grow": isInListView,
          "hidden md:flex": !isInListView,
        })}
      >
        <h1 id={titleId} className="p-8 text-3xl font-medium">
          Gaming Instances
        </h1>
        <Suspense
          fallback={
            <div className="flex grow flex-col gap-8 self-stretch border-y-2 p-8">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          }
          key={location.key}
        >
          <Await
            resolve={instances}
            errorElement={<AsyncError message="Failed to fetch instances" />}
          >
            {(instances) =>
              instances.length > 0 ? (
                <ScrollArea className="h-0 flex-auto border-y-2">
                  <NavigationCardMenu
                    aria-labelledby={titleId}
                    orientation="vertical"
                  >
                    <NavigationCardList className="p-4">
                      {instances.map((instance) => (
                        <InstanceCard key={instance.id} instance={instance} />
                      ))}
                    </NavigationCardList>
                  </NavigationCardMenu>
                </ScrollArea>
              ) : (
                <div className="flex grow flex-col items-center justify-center gap-2 self-center pb-[30%] text-center text-2xl text-muted-foreground">
                  Create an instance
                </div>
              )
            }
          </Await>
        </Suspense>
        <NewInstanceDialog actionData={actionData} />
      </div>
      <Separator orientation="vertical" className={cn("max-md:hidden")} />
      <div
        className={cn("basis-3/5 flex-col", {
          "hidden md:flex": !isInItemView,
          "flex max-md:grow": isInItemView,
        })}
      >
        <Outlet />
      </div>
    </div>
  );
}

function InstanceCard({ instance }: { instance: Instance }) {
  const { pathname } = useLocation();
  const target = `/app/instances/${instance.id}`;

  return (
    <NavigationCardItem>
      <NavigationCardLink active={pathname == target} asChild>
        <Link
          to={target}
          replace={
            pathname !== "/app/instances" && pathname !== "/app/instances/"
          }
        >
          <NavigationCard>
            <NavigationCardHeader>
              <NavigationCardTitle>{instance.name}</NavigationCardTitle>
              <NavigationCardDescription className="truncate">
                ID: {instance.id}
              </NavigationCardDescription>
            </NavigationCardHeader>
            <NavigationCardContent className="flex flex-row items-center justify-between gap-4">
              <div className="flex flex-row items-center gap-2">
                <div
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    STATUS_COLOR_MAP.get(instance.status),
                  )}
                />
                {instance.status[0] +
                  instance.status.substring(1).toLowerCase()}
              </div>
              <div className="flex flex-row items-center gap-1 text-muted-foreground">
                Details
                <ChevronRightIcon />
              </div>
            </NavigationCardContent>
          </NavigationCard>
        </Link>
      </NavigationCardLink>
    </NavigationCardItem>
  );
}

function SkeletonCard(): ReactNode {
  return (
    <div className="flex flex-col rounded-xl">
      <Skeleton className="h-6 w-[14ch] rounded-xl" />
      <Skeleton className="mt-2 h-4 w-[22ch] rounded-xl" />
      <div className="mt-8 flex flex-row items-center justify-between">
        <Skeleton className="h-5 w-[8ch] rounded-xl" />
        <Skeleton className="h-5 w-[10ch] rounded-xl" />
      </div>
    </div>
  );
}
