import * as client from "openid-client";
import { redirect } from "react-router";
import { authConfig } from "~/lib/auth.server";
import { env } from "~/lib/env";

export async function loader() {
  if (authConfig.testUser) {
    return redirect(env.OG_BASE_URL + "/auth/log-in-complete");
  }

  return redirect(
    client.buildAuthorizationUrl(authConfig.oidcConfig, {
      redirect_uri: env.OG_BASE_URL + "/auth/log-in-complete",
      scope: "openid profile email",
    }).href,
  );
}
