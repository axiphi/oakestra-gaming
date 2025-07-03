import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";
import { serverOnly$ } from "vite-env-only/macros";
import { userSchema } from "~/lib/user";

const loadServerEnv = serverOnly$(async () => ({
  ...(await import("vite")).loadEnv(import.meta.env.MODE, process.cwd(), ""),
  ...process.env,
}));

export const env = createEnv({
  server: {
    OG_BASE_URL: v.pipe(v.string(), v.url()),
    OG_OIDC_SERVER: v.pipe(v.string(), v.url()),
    OG_OIDC_CLIENT_ID: v.pipe(v.string(), v.nonEmpty()),
    OG_OIDC_CLIENT_SECRET: v.pipe(v.string(), v.nonEmpty()),
    OG_SESSION_SECRET: v.pipe(v.string(), v.minLength(32)),
    OG_TEST_USER: v.optional(v.pipe(v.string(), v.parseJson(), userSchema)),
    OG_OAKESTRA_USERNAME: v.pipe(v.string(), v.nonEmpty()),
    OG_OAKESTRA_PASSWORD: v.pipe(v.string(), v.nonEmpty()),
    OG_OAKESTRA_ORGANIZATION: v.pipe(v.string(), v.nonEmpty()),
    OG_JWT_GENERATOR_BASE_URL: v.pipe(v.string(), v.url()),
    OG_SYSTEM_MANAGER_BASE_URL: v.pipe(v.string(), v.url()),
    OG_SERVICE_MANAGER_BASE_URL: v.pipe(v.string(), v.url()),
    OG_WOLF_API_KEY: v.pipe(v.string(), v.nonEmpty()),
  },
  client: {},

  clientPrefix: "VITE_",
  emptyStringAsUndefined: true,
  isServer: import.meta.env.SSR,
  runtimeEnv: import.meta.env.SSR ? await loadServerEnv!() : import.meta.env,
});
