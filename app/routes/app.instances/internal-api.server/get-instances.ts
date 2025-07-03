import { base32nopad } from "@scure/base";
import { parse as uuidParse } from "uuid";
import { env } from "~/lib/env";
import type { Instance } from "~/routes/app.instances/internal-api.server/instance";
import { parseInstancePortsFromOakestraEnv } from "~/routes/app.instances/internal-api.server/instance-ports";
import { getOakestraServicesByApp } from "~/routes/app.instances/oakestra-api.server/service";
import { oakestraAppCache } from "../oakestra-api.server/app";
import { oakestraUserCache } from "../oakestra-api.server/user";

export async function getInstances(
  userId: string,
  signal?: AbortSignal,
): Promise<Instance[]> {
  const oakestraUser = await oakestraUserCache.fetch(
    {
      username: env.OG_OAKESTRA_USERNAME,
      password: env.OG_OAKESTRA_PASSWORD,
      organization: env.OG_OAKESTRA_ORGANIZATION,
    },
    { signal: signal },
  );
  if (oakestraUser === undefined) {
    throw new Error("failed to get oakestra user");
  }

  const oakestraApp = await oakestraAppCache.fetch(
    {
      name: "oakestragaming",
      namespace: base32nopad.encode(uuidParse(userId)),
    },
    { signal: signal, context: oakestraUser },
  );
  if (oakestraApp === undefined) {
    throw new Error("failed to get get oakestra app");
  }

  const oakestraServices = await getOakestraServicesByApp(
    oakestraApp,
    oakestraUser,
    signal,
  );

  return oakestraServices.map((service) => {
    const ports = parseInstancePortsFromOakestraEnv(service.environment);
    if (ports === undefined) {
      throw new Error("failed to parse wolf ports from service environment");
    }

    return {
      id: service.microserviceID,
      name: service.microservice_name,
      memory: service.memory,
      vcpus: service.vcpus,
      storage: service.storage,
      ip: service.addresses?.rr_ip,
      ports,
    };
  });
}
