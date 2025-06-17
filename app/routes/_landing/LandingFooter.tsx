export function LandingFooter() {
  return (
    <footer className="flex h-16 w-full flex-row items-center justify-between bg-secondary px-24">
      <span className="text-muted-foreground">
        &copy; {new Date().getFullYear()} The Oakestra Authors. All rights
        reserved.
      </span>
      <div className="flex flex-row items-center justify-center gap-6">
        <a href="https://github.com/oakestra">
          <img
            alt="GitHub"
            aria-hidden="true"
            src="/github-logo.svg"
            className="size-6"
          />
          <span className="sr-only">GitHub</span>
        </a>
        <a href="https://discord.gg/7F8EhYCJDf">
          <img
            alt="Discord"
            aria-hidden="true"
            src="/discord-logo.svg"
            className="size-6"
          />
          <span className="sr-only">Discord</span>
        </a>
        <a href="https://x.com/oakestra">
          <img
            alt="X"
            aria-hidden="true"
            src="/x-logo.svg"
            className="size-6"
          />
          <span className="sr-only">X</span>
        </a>
      </div>
    </footer>
  );
}
