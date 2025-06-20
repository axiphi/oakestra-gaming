import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";
import * as React from "react";
import { createContext, useContext, useId } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

const NavigationCardLinkContext = createContext<{
  titleId: string | undefined;
  descriptionId: string | undefined;
}>({
  titleId: undefined,
  descriptionId: undefined,
});

export function NavigationCardMenu({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root>) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-card-menu"
      className={cn(
        "flex flex-1 items-center justify-center [&>div]:flex [&>div]:flex-1",
        className,
      )}
      {...props}
    />
  );
}

export function NavigationCardList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-card-list"
      className={cn(
        "flex flex-1 list-none items-stretch justify-center gap-2 data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

export function NavigationCardItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-card-item"
      className={cn("flex, flex-1", className)}
      {...props}
    />
  );
}

export function NavigationCardLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  const titleId = useId();
  const descriptionId = useId();
  // data-highlighted:ring-1 data-highlighted:ring-ring
  return (
    <NavigationCardLinkContext.Provider
      value={{
        titleId,
        descriptionId,
      }}
    >
      <NavigationMenuPrimitive.Link
        data-slot="navigation-card-link"
        className={cn("group flex flex-1", className)}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        {...props}
      />
    </NavigationCardLinkContext.Provider>
  );
}

export function NavigationCard({
  className,
  ...props
}: React.ComponentProps<typeof Card>) {
  return (
    <Card
      data-slot="navigation-card"
      className={cn(
        "flex-1 outline-none group-focus:bg-accent group-focus-visible:ring-[3px] group-focus-visible:ring-ring/50 group-focus-visible:outline-1 group-data-[active]:border-primary group-data-[active]:bg-accent/50 group-data-[active]:group-focus:bg-accent hover:bg-accent group-data-[active]:hover:bg-accent",
        className,
      )}
      {...props}
    />
  );
}

export function NavigationCardHeader(
  props: React.ComponentProps<typeof CardHeader>,
) {
  return <CardHeader data-slot="navigation-card-header" {...props} />;
}

export function NavigationCardTitle({
  className,
  ...props
}: React.ComponentProps<typeof CardTitle>) {
  const { titleId } = useContext(NavigationCardLinkContext);

  return (
    <CardTitle
      id={titleId}
      data-slot="navigation-card-title"
      className={cn(
        "group-focus:text-accent-foreground group-data-[active]:text-accent-foreground hover:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function NavigationCardDescription(
  props: React.ComponentProps<typeof CardDescription>,
) {
  const { descriptionId } = useContext(NavigationCardLinkContext);

  return (
    <CardDescription
      id={descriptionId}
      data-slot="navigation-card-description"
      {...props}
    />
  );
}

export function NavigationCardContent(
  props: React.ComponentProps<typeof CardContent>,
) {
  return <CardContent data-slot="navigation-card-content" {...props} />;
}

export function NavigationCardFooter(
  props: React.ComponentProps<typeof CardFooter>,
) {
  return <CardFooter data-slot="navigation-card-footer" {...props} />;
}

//  rounded-sm p-2 text-sm transition-all outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground  data-[active=true]:bg-accent/50 data-[active=true]:text-accent-foreground data-[active=true]:hover:bg-accent data-[active=true]:focus:bg-accent [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground
