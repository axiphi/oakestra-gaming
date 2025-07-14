import { MoonIcon, Settings2Icon, SunIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Form, useRouteLoaderData } from "react-router";
import { Button } from "~/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";

export function DarkModeForm(): ReactNode {
  const { isInDarkMode } = useRouteLoaderData("root") as {
    isInDarkMode: boolean | undefined;
  };

  return (
    <Form action="/dark-mode" method="POST" replace>
      <ToggleGroup
        type="single"
        variant="outline"
        value={
          isInDarkMode === undefined
            ? "system"
            : isInDarkMode
              ? "dark"
              : "light"
        }
      >
        <ToggleGroupItem value="dark" asChild>
          <Button
            className="hover:bg-muted-foreground hover:text-muted data-[state=on]:bg-input hover:dark:bg-secondary-foreground hover:dark:text-secondary"
            type="submit"
            name="intent"
            value="dark"
            variant="ghost"
          >
            <MoonIcon />
          </Button>
        </ToggleGroupItem>
        <ToggleGroupItem value="light" asChild>
          <Button
            className="hover:bg-muted-foreground hover:text-muted data-[state=on]:bg-input hover:dark:bg-secondary-foreground hover:dark:text-secondary"
            type="submit"
            name="intent"
            value="light"
            variant="ghost"
          >
            <SunIcon />
          </Button>
        </ToggleGroupItem>
        <ToggleGroupItem value="system" asChild>
          <Button
            className="hover:bg-muted-foreground hover:text-muted data-[state=on]:bg-input hover:dark:bg-secondary-foreground hover:dark:text-secondary"
            type="submit"
            name="intent"
            value="system"
            variant="ghost"
          >
            <Settings2Icon />
          </Button>
        </ToggleGroupItem>
      </ToggleGroup>
    </Form>
  );
}
