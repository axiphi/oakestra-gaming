import { Outlet, redirect } from "react-router";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { Separator } from "~/components/ui/separator";
import { sessionContext } from "~/lib/session";
import { AccountDropdown } from "~/routes/app/AccountDropdown";
import type { Route } from "./+types/route";

export function loader({ context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);

  if (!session.user) {
    return redirect("/");
  }
}

export default function Page() {
  return (
    <>
      <Header
        actions={
          <div className="flex flex-row items-center justify-center gap-4">
            <AccountDropdown />
          </div>
        }
      />
      <Separator orientation="horizontal" />
      <main className="flex grow flex-col">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
