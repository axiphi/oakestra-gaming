import * as client from "openid-client";
import { redirect } from "react-router";
import { authConfig } from "~/lib/auth.server";
import { env } from "~/lib/env";

export async function loader() {
  if (authConfig.testUser) {
    return redirect("/log-out-complete");
  }

  return redirect(
    client.buildEndSessionUrl(authConfig.oidcConfig, {
      post_logout_redirect_uri: env.OG_BASE_URL + "/log-out-complete",
    }).href,
  );
}
