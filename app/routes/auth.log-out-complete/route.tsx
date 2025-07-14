import { redirect } from "react-router";
import { commitSession, getSession } from "~/lib/session";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  session.unset("user");
  return redirect("/", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
