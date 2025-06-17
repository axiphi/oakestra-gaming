import { Outlet, redirect } from "react-router";
import { Separator } from "~/components/ui/separator";
import { sessionContext } from "~/lib/session";
import type { Route } from "./+types/route";
import { AppFooter } from "./AppFooter";
import { AppHeader } from "./AppHeader";

export function loader({ context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);

  if (!session.user) {
    return redirect("/");
  }
}

export default function Page() {
  return (
    <>
      <AppHeader />
      <Separator orientation="horizontal" />
      <main className="flex grow flex-col">
        <Outlet />
      </main>
      <AppFooter />
    </>
  );
}
