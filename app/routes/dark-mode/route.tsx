import { redirect } from "react-router";
import { commitSession, getSession } from "~/lib/session";
import type { Route } from "./+types/route";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  let isInDarkMode: boolean | undefined = undefined;
  switch (formData.get("intent")) {
    case "dark":
      isInDarkMode = true;
      break;
    case "light":
      isInDarkMode = false;
      break;
    case "system":
      isInDarkMode = undefined;
      break;
    default:
      throw new Error("Invalid intent");
  }

  const referer = request.headers.get("referer");
  if (referer === null) {
    throw new Error("Missing referer");
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("isInDarkMode", isInDarkMode);
  return redirect(referer, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
