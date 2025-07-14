import { base32nopad } from "@scure/base";
import { parse as uuidParse } from "uuid";
import { env } from "~/lib/env";
import { deleteOakestraService } from "~/routes/app.instances/oakestra-api.server/service";
import { oakestraAppCache } from "../oakestra-api.server/app";
import { oakestraUserCache } from "../oakestra-api.server/user";

export async function deleteInstance(
  userId: string,
  instanceId: string,
  signal?: AbortSignal,
): Promise<void> {
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

  await deleteOakestraService(oakestraUser, instanceId, signal);
}
