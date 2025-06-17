import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export function LandingHeader() {
  return (
    <header className="flex h-24 w-full flex-row items-center justify-between bg-secondary px-24">
      <div className="flex flex-row items-center justify-center text-3xl">
        <img alt="Oakestra Logo" src="/oakestra-logo.png" className="size-20" />
        <span>
          <span className="font-['Quicksand']  font-bold text-secondary-foreground">
            Oakestra
          </span>
          &nbsp;
          <span className="font-light text-foreground">Gaming</span>
        </span>
      </div>
      <div className="flex flex-row items-center justify-center gap-4">
        <Button
          variant="outline"
          render={<Link to="/auth/log-in" />}
          className="border-primary p-6 text-primary"
        >
          <div className="flex flex-row items-center justify-center gap-2 text-lg">
            Log In
          </div>
        </Button>
      </div>
    </header>
  );
}
