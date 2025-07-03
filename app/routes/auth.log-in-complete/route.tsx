import * as client from "openid-client";
import { redirect } from "react-router";
import * as v from "valibot";
import { authConfig } from "~/lib/auth.server";
import { commitSession, getSession } from "~/lib/session";
import { userSchema } from "~/lib/user";
import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  if (authConfig.testUser) {
    const session = await getSession();
    session.set("user", authConfig.testUser);
    return redirect("/app/instances", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  const tokens = await client.authorizationCodeGrant(
    authConfig.oidcConfig,
    new URL(request.url),
  );
  const id = v.parse(userSchema.entries.id, tokens.claims()?.["sub"]);
  const email = v.parse(userSchema.entries.email, tokens.claims()?.["email"]);

  const session = await getSession();
  session.set("user", {
    id: id,
    email: email,
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token,
  });
  return redirect("/app/instances");
}
