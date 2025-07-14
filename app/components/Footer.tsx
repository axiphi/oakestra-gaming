import type { ReactNode } from "react";
import { DarkModeForm } from "~/components/DarkModeForm";

export function Footer(): ReactNode {
  return (
    <footer className="m-h-16 flex w-full flex-col items-center justify-center gap-4 bg-secondary px-6 py-4 sm:px-12 md:flex-row md:justify-between lg:px-24">
      <span className="text-center text-pretty text-muted-foreground">
        &copy; {new Date().getFullYear()} The Oakestra Authors. All rights
        reserved.
      </span>
      <div className="flex flex-row items-center justify-center gap-8">
        <DarkModeForm />
        <div className="flex flex-row items-center justify-center gap-6">
          <a href="https://github.com/oakestra">
            <img
              alt="GitHub"
              aria-hidden="true"
              src="/github-logo.svg"
              className="size-6 hover:invert-30 dark:invert-70 dark:hover:invert"
            />
          </a>
          <a href="https://discord.gg/7F8EhYCJDf">
            <img
              alt="Discord"
              aria-hidden="true"
              src="/discord-logo.svg"
              className="size-6 hover:invert-30 dark:invert-70 dark:hover:invert"
            />
          </a>
          <a href="https://x.com/oakestra">
            <img
              alt="X"
              aria-hidden="true"
              src="/x-logo.svg"
              className="size-6 hover:invert-30 dark:invert-70 dark:hover:invert"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
