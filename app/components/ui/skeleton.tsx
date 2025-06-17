import * as React from "react";

import { cn } from "~/lib/cn";

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("bg-muted animate-pulse rounded-md", className)}
    {...props}
  />
);
Skeleton.displayName = "Skeleton";

export { Skeleton };
