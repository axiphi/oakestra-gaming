import { Link, Outlet } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import {
  NavigationItem,
  NavigationLink,
  NavigationList,
  NavigationMenu,
} from "~/components/ui/navigation-menu";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

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

export default function Page() {
  return (
    <div className="flex grow flex-row items-stretch justify-start gap-8 p-8">
      <div className="flex basis-2/5 flex-col justify-start gap-4">
        <h1 id="sessions-nav" className="p-8 text-3xl font-medium">
          Gaming Instances
        </h1>
        <ScrollArea className="-mr-2 grow border-y pr-4">
          <NavigationMenu aria-labelledby="sessions-nav" orientation="vertical">
            <NavigationList className="flex-col gap-4 self-stretch py-2">
              {instances.map((system) => (
                <InstanceCard key={system.id} instance={system} />
              ))}
            </NavigationList>
          </NavigationMenu>
        </ScrollArea>
      </div>
      <Separator orientation="vertical" />
      <div className="flex basis-3/5 flex-col items-center justify-center gap-4">
        <Outlet />
      </div>
    </div>
  );
}

// function CreateSessionDialog({ state }: { state: ServerFormState }) {
//   return (
//     <Dialog>
//       <DialogTrigger
//         render={(dialogTriggerProps) => (
//           <Button size="lg" className="gap-2" {...dialogTriggerProps}>
//             Create Session
//             <ArrowUpRightIcon />
//           </Button>
//         )}
//       />
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Create a new session</DialogTitle>
//         </DialogHeader>
//         <CreateSessionForm state={state} />
//         <DialogFooter>
//           <Button className="w-full">Submit</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

function InstanceCard({ instance }: { instance: Instance }) {
  return (
    <NavigationItem>
      <NavigationLink
        aria-labelledby={instance.id}
        className="block disabled:cursor-not-allowed disabled:opacity-50 data-[status=active]:border-primary data-highlighted:ring-1 data-highlighted:ring-ring"
        render={(navigationLinkProps) => (
          <Card
            render={(cardProps) => (
              <Link
                to={`/app/instances/${instance.id}`}
                replace={true}
                {...cardProps}
              />
            )}
            {...navigationLinkProps}
          />
        )}
      >
        <CardHeader>
          <label id={instance.id} className="text-base font-semibold">
            {instance.name}
          </label>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>Card Content</CardContent>
        <CardFooter>Card Footer</CardFooter>
      </NavigationLink>
    </NavigationItem>
  );
}
