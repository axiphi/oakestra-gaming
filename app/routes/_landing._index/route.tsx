import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export default function Page() {
  return (
    <div className="flex grow flex-row items-stretch max-md:bg-[url(/landing-bg.png)]">
      <div className="hidden basis-3/5 bg-[url(/landing-bg.png)] bg-cover inset-shadow-sm inset-shadow-primary md:flex"></div>
      <div className="m-4 flex flex-col items-center justify-center gap-2 rounded-2xl bg-background/80 max-md:grow max-md:backdrop-blur-lg md:mx-0 md:basis-2/5 md:rounded-none md:bg-background">
        <span className="mx-8 text-center text-3xl font-extrabold text-primary drop-shadow-2xl drop-shadow-primary/60 sm:text-5xl">
          Start playing today on Oakestra Gaming
        </span>
        <span className="mx-18 text-center text-xl font-semibold text-muted-foreground sm:text-2xl">
          Enjoy high-end hardware with minimal latency on the Oakestra network.
        </span>
        <Button
          className="mt-16 h-12 w-64 text-lg font-semibold drop-shadow-lg drop-shadow-muted-foreground backdrop-blur-md sm:text-xl"
          size="lg"
          asChild
        >
          <Link to="/auth/log-in">
            Get Started
            <ArrowRightIcon className="size-6" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
