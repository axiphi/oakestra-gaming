import { LogInIcon } from "lucide-react";
import { Link, Outlet } from "react-router";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";

export default function Page() {
  return (
    <>
      <Header
        actions={
          <div className="flex flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/auth/log-in">
                <LogInIcon />
                Log In
              </Link>
            </Button>
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
