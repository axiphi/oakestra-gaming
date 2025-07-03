import { pairWolfClient } from "~/routes/app.instances/wolf-api.server/pin";
import type { Instance } from "./instance";

export async function pairInstance(
  instance: Instance,
  pin: string,
  secret: string,
  signal?: AbortSignal,
): Promise<void> {
  await pairWolfClient(
    `https://${instance.ip}:${instance.ports.api}`,
    pin,
    secret,
    signal,
  );
}
