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
import type { Route } from "./+types/route";
import {
  NewInstanceDialog,
  NewInstanceServerSchema,
} from "./NewInstanceDialog";

interface Instance {
  id: string;
  name: string;
}

const instances: readonly Instance[] = [
  { id: "system-1", name: "System 1" },
  { id: "system-2", name: "System 2" },
  { id: "system-3", name: "System 3" },
  { id: "system-4", name: "System 4" },
  { id: "system-5", name: "System 5" },
  { id: "system-6", name: "System 6" },
  { id: "system-7", name: "System 7" },
];

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const submission = parseWithValibot(formData, {
    schema: NewInstanceServerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  console.log(
    "TODO - make request to Oakestra root manager with SLA",
    submission,
  );

  return redirect("/app/instances/");
}

export default function Page({ actionData }: Route.ComponentProps) {
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
              {instances.map((system) => (
                <InstanceCard key={system.id} instance={system} />
              ))}
            </NavigationCardList>
          </NavigationCardMenu>
        </ScrollArea>
        <NewInstanceDialog actionData={actionData} />
      </div>
      <Separator orientation="vertical" />
      <div className="flex basis-3/5 flex-col items-center justify-center gap-4">
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
