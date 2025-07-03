import { base32nopad } from "@scure/base";
import {
  humanId,
  maxLength as humanIdMaxLength,
  type Options as HumanIdOptions,
} from "human-id";
import { parse as uuidParse } from "uuid";
import { env } from "~/lib/env";
import type { Instance } from "~/routes/app.instances/internal-api.server/instance";
import {
  allInstancePorts,
  createOakestraEnvFromInstancePorts,
  createOakestraPortsFromInstancePorts,
  parseInstancePortsFromOakestraEnv,
} from "~/routes/app.instances/internal-api.server/instance-ports";
import { deployOakestraInstance } from "~/routes/app.instances/oakestra-api.server/instance";
import {
  createOakestraService,
  getAllOakestraServices,
} from "~/routes/app.instances/oakestra-api.server/service";
import { oakestraAppCache } from "../oakestra-api.server/app";
import { oakestraUserCache } from "../oakestra-api.server/user";

// make sure we will generate valid oakestra-ids at import time of this module instead of during service creation
const humanIdOptions = {} satisfies HumanIdOptions;
if (humanIdMaxLength(humanIdOptions) > 32) {
  throw new Error(
    "human-id library generates ids that are too long for Oakestra, options need to be adjusted",
  );
}
export async function createInstance(
  userId: string,
  instance: Pick<Instance, "memory" | "vcpus" | "storage">,
  signal?: AbortSignal,
): Promise<string> {
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

  const existingOakestraServices = await getAllOakestraServices(
    oakestraUser,
    signal,
  );

  const usedInstanceApiPorts: Set<number> = new Set(
    existingOakestraServices
      .map((service) => parseInstancePortsFromOakestraEnv(service.environment))
      .filter((ports) => ports !== undefined)
      .map((ports) => ports.api),
  );
  const availableInstancePorts = allInstancePorts.find(
    (instancePorts) => !usedInstanceApiPorts.has(instancePorts.api),
  );
  if (availableInstancePorts == undefined) {
    throw new Error("no port range is available in this Oakestra deployment");
  }

  const serviceName = humanId(humanIdOptions);

  const oakestraService = await createOakestraService(
    oakestraApp,
    oakestraUser,
    {
      microservice_name: serviceName,
      microservice_namespace: "default",
      memory: instance.memory,
      vcpus: instance.vcpus,
      storage: instance.storage,
      environment: createOakestraEnvFromInstancePorts(availableInstancePorts),
      port: createOakestraPortsFromInstancePorts(availableInstancePorts),
    },
    signal,
  );

  await deployOakestraInstance(oakestraUser, oakestraService.job_id, signal);
  return oakestraService.job_id;
}
