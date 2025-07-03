import createClient from "openapi-fetch";
import { env } from "~/lib/env";
import type { paths as JwtGeneratorApi } from "~/lib/external-api/jwt-generator";
import type { paths as ServiceManagerApi } from "~/lib/external-api/service-manager";
import type { paths as SystemManagerApi } from "~/lib/external-api/system-manager";

export const jwtGeneratorClient = createClient<JwtGeneratorApi>({
  baseUrl: env.OG_JWT_GENERATOR_BASE_URL,
});

export const systemManagerClient = createClient<SystemManagerApi>({
  baseUrl: env.OG_SYSTEM_MANAGER_BASE_URL,
});

export const serviceManagerClient = createClient<ServiceManagerApi>({
  baseUrl: env.OG_SERVICE_MANAGER_BASE_URL,
});
