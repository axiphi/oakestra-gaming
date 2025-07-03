import { systemManagerClient } from "~/routes/app.instances/oakestra-api.server/client";
import type { OakestraUser } from "~/routes/app.instances/oakestra-api.server/user";

export async function deployOakestraInstance(
  user: OakestraUser,
  serviceId: string,
  signal?: AbortSignal,
): Promise<void> {
  const { error: instanceError } = await systemManagerClient.POST(
    "/api/service/{serviceid}/instance",
    {
      params: {
        path: {
          serviceid: serviceId,
        },
      },
      headers: {
        Authorization: "Bearer " + user.accessToken,
      },
      signal: signal,
    },
  );
  if (instanceError !== undefined) {
    throw new Error("failed to deploy oakestra instance", {
      cause: instanceError,
    });
  }
}
