import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { getSession, sessionContext } from "~/lib/session";
import { cn } from "~/lib/utils";
import type { Route } from "./+types/root";
import appCss from "./app.css?url";

export const unstable_middleware: Route.unstable_MiddlewareFunction[] = [
  async ({ context, request }) => {
    const session = await getSession(request.headers.get("Cookie"));
    context.set(sessionContext, session.data);
  },
];

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: appCss },
  { rel: "icon", href: "/favicon.svg" },
];

export const meta: Route.MetaFunction = () => [
  {
    charSet: "utf-8",
  },
  {
    name: "viewport",
    content: "width=device-width, initial-scale=1",
  },
];

export function loader({ context }: Route.LoaderArgs) {
  const session = context.get(sessionContext);

  return {
    isInDarkMode: session.isInDarkMode,
  };
}

export function Layout({ children }: { children: ReactNode }) {
  const loaderData = useRouteLoaderData("root") as ReturnType<typeof loader>;

  const htmlRef = useRef<HTMLHtmlElement>(null);
  const [isSystemInDarkMode, setIsSystemInDarkMode] = useState<
    boolean | undefined
  >(() =>
    import.meta.env.SSR
      ? false
      : window.matchMedia("(prefers-color-scheme: dark)").matches,
  );
  useEffect(() => {
    const controller = new AbortController();
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener(
      "change",
      (event) => {
        setIsSystemInDarkMode(event.matches);
      },
      { signal: controller.signal },
    );
    return () => controller.abort();
  }, []);

  const isInDarkMode = loaderData.isInDarkMode ?? isSystemInDarkMode ?? false;
  useEffect(() => {
    if (
      !isInDarkMode &&
      (htmlRef.current?.classList.contains("dark") ?? false)
    ) {
      htmlRef.current?.classList.remove("dark");
    }
  }, [isInDarkMode]);

  return (
    <html
      ref={htmlRef}
      lang="en"
      className={cn("h-full", {
        dark: loaderData.isInDarkMode ?? isSystemInDarkMode ?? false,
      })}
    >
      <head>
        <Meta />
        <Links />
        {loaderData.isInDarkMode === undefined && (
          <script
            dangerouslySetInnerHTML={{
              __html:
                'if (window.matchMedia("(prefers-color-scheme: dark)").matches) document.documentElement.classList.add("dark");',
            }}
          />
        )}
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
