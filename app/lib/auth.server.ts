import * as client from "openid-client";
import { env } from "~/lib/env";
import { type User } from "~/lib/user";

type AuthConfig =
  | {
      testUser: User;
      oidcConfig?: undefined;
    }
  | {
      testUser?: undefined;
      oidcConfig: client.Configuration;
    };

export const authConfig = env.OG_TEST_USER
  ? {
      testUser: env.OG_TEST_USER,
    }
  : {
      oidcConfig: await client.discovery(
        new URL(env.OG_OIDC_SERVER),
        env.OG_OIDC_CLIENT_ID,
        env.OG_OIDC_CLIENT_SECRET,
        undefined,
        env.OG_INSECURE
          ? {
              execute: [client.allowInsecureRequests],
            }
          : undefined,
      ),
    };
