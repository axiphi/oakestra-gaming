import { parseWithValibot } from "@conform-to/valibot";
import { useId } from "react";
import { Link, Outlet, redirect, useLocation } from "react-router";
import {
  NavigationCard,
  NavigationCardContent,
  NavigationCardDescription,
  NavigationCardFooter,
  NavigationCardHeader,
  NavigationCardItem,
  NavigationCardLink,
  NavigationCardList,
  NavigationCardMenu,
  NavigationCardTitle,
} from "~/components/ui/navigation-card";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { sessionContext } from "~/lib/session";
import { createInstance } from "~/routes/app.instances/internal-api.server/create-instance";
import { getInstances } from "~/routes/app.instances/internal-api.server/get-instances";
import type { Route } from "./+types/route";
import {
  NewInstanceDialog,
  NewInstanceServerSchema,
} from "./NewInstanceDialog";

interface Instance {
  id: string;
  name: string;
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const session = context.get(sessionContext);

  if (!session.user) {
    return redirect("/");
  }

  return {
    instances: await getInstances(session.user.id, request.signal),
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
  return redirect("/app/instances/");
}

export default function Page({ actionData, loaderData }: Route.ComponentProps) {
  const titleId = useId();

  return (
    <div className="flex h-0 grow flex-row justify-start gap-8 p-8">
      <div className="flex basis-2/5 flex-col justify-start gap-4">
        <h1 id={titleId} className="p-8 text-3xl font-medium">
          Gaming Instances
        </h1>
        <ScrollArea className="h-0 flex-auto border-y-2">
          <NavigationCardMenu aria-labelledby={titleId} orientation="vertical">
            <NavigationCardList className="p-4">
              {loaderData.instances.map((instance) => (
                <InstanceCard key={instance.id} instance={instance} />
              ))}
            </NavigationCardList>
          </NavigationCardMenu>
        </ScrollArea>
        <NewInstanceDialog actionData={actionData} />
      </div>
      <Separator orientation="vertical" />
      <div className="flex basis-3/5 flex-col">
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
        <Link to={target} replace={true}>
          <NavigationCard>
            <NavigationCardHeader>
              <NavigationCardTitle>{instance.name}</NavigationCardTitle>
              <NavigationCardDescription>
                Card Description
              </NavigationCardDescription>
            </NavigationCardHeader>
            <NavigationCardContent>Card Content</NavigationCardContent>
            <NavigationCardFooter>Card Footer</NavigationCardFooter>
          </NavigationCard>
        </Link>
      </NavigationCardLink>
    </NavigationCardItem>
  );
}
