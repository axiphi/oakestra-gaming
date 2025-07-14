import { base32nopad } from "@scure/base";
import { parse as uuidParse } from "uuid";
import { env } from "~/lib/env";
import type {
  Instance,
  InstancePairRequest,
} from "~/routes/app.instances/internal-api.server/instance";
import { parseInstancePortsFromOakestraEnv } from "~/routes/app.instances/internal-api.server/instance-ports";
import { calculateCombinedInstanceStatus } from "~/routes/app.instances/internal-api.server/instance-status";
import { getOakestraService } from "~/routes/app.instances/oakestra-api.server/service";
import { getWolfPairRequests } from "~/routes/app.instances/wolf-api.server/pin";
import { oakestraAppCache } from "../oakestra-api.server/app";
import { oakestraUserCache } from "../oakestra-api.server/user";

export async function getInstance(
  userId: string,
  instanceId: string,
  signal?: AbortSignal,
): Promise<Instance> {
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

  const service = await getOakestraService(oakestraUser, instanceId, signal);

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
    status: calculateCombinedInstanceStatus(service),
    ports,
  };
}

export async function getInstancePairRequests(
  instance: Instance,
  signal?: AbortSignal,
): Promise<InstancePairRequest[]> {
  if (!instance.ip) {
    return [];
  }

  const pairRequests = instance.ip
    ? await getWolfPairRequests(
        `https://${instance.ip}:${instance.ports.api}`,
        signal,
      )
    : [];

  return pairRequests.map((req) => ({
    clientIp: req.client_ip,
    secret: req.pair_secret,
  }));
}
