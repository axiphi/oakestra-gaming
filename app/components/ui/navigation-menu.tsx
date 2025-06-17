import * as React from "react";
import { NavigationMenu as BaseNavigationMenu } from "@base-ui-components/react/navigation-menu";

import { cn } from "~/lib/cn";

const NavigationMenu = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Root>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Root ref={ref} className={className} {...props} />
));
NavigationMenu.displayName = "NavigationMenu";

const NavigationList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.List>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.List
    ref={ref}
    className={cn("flex flex-row gap-4", className)}
    {...props}
  />
));
NavigationList.displayName = "NavigationList";

const NavigationItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Item>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Item ref={ref} className={className} {...props} />
));
NavigationItem.displayName = "NavigationItem";

const NavigationLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof BaseNavigationMenu.Link>
>(({ className, ...props }, ref) => (
  <BaseNavigationMenu.Link
    ref={ref}
    className={cn("text-base font-semibold", className)}
    {...props}
  />
));
NavigationLink.displayName = "NavigationLink";

export { NavigationMenu, NavigationList, NavigationItem, NavigationLink };
