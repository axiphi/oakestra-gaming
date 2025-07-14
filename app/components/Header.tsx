import type { ReactNode } from "react";

export interface HeaderProps {
  actions: ReactNode;
}

export function Header({ actions }: HeaderProps): ReactNode {
  return (
    <header className="flex h-16 w-full flex-row items-center justify-between bg-secondary px-6 md:h-24 md:px-24">
      <div className="flex flex-row items-center justify-center text-2xl md:text-3xl">
        <img
          alt="Oakestra Logo"
          src="/oakestra-logo.png"
          className="size-12 md:size-20"
        />
        <div className="text-center">
          <span className="hidden font-['Quicksand'] font-bold text-secondary-foreground sm:inline">
            Oakestra{" "}
          </span>
          <span className="font-light text-primary">Gaming</span>
        </div>
      </div>
      {actions}
    </header>
  );
}
