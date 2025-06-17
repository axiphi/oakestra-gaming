import { Outlet } from "react-router";
import { Separator } from "~/components/ui/separator";
import { LandingFooter } from "~/routes/_landing/LandingFooter";
import { LandingHeader } from "~/routes/_landing/LandingHeader";

export default function Page() {
  return (
    <>
      <LandingHeader />
      <Separator orientation="horizontal" />
      <main className="flex grow flex-col">
        <Outlet />
      </main>
      <LandingFooter />
    </>
  );
}
