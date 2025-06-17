import { createEnv } from "@t3-oss/env-core";
import * as v from "valibot";
import { loadEnv } from "vite";
import { serverOnly$ } from "vite-env-only/macros";
import { UserSchema } from "~/lib/user";

const loadServerEnv = serverOnly$(() => {
  return {
    ...loadEnv(import.meta.env.MODE, process.cwd(), ""),
    ...process.env,
  };
});

export const env = createEnv({
  server: {
    OG_BASE_URL: v.pipe(v.string(), v.url()),
    OG_OIDC_SERVER: v.pipe(v.string(), v.url()),
    OG_OIDC_CLIENT_ID: v.pipe(v.string(), v.nonEmpty()),
    OG_OIDC_CLIENT_SECRET: v.pipe(v.string(), v.nonEmpty()),
    OG_SESSION_SECRET: v.pipe(v.string(), v.minLength(32)),
    OG_TEST_USER: v.optional(v.pipe(v.string(), v.parseJson(), UserSchema)),
  },
  client: {},

  clientPrefix: "VITE_",
  emptyStringAsUndefined: true,
  isServer: import.meta.env.SSR,
  runtimeEnv: import.meta.env.SSR ? loadServerEnv!() : import.meta.env,
});
