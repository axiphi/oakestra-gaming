import { Agent } from "undici";
import { env } from "~/lib/env";
import { wolfClient } from "./client";

const ignoreCertAgent = new Agent({ connect: { rejectUnauthorized: false } });

export async function getWolfPairRequests(
  baseUrl: string,
  signal?: AbortSignal,
) {
  const { data, error } = await wolfClient.GET("/api/v1/pair/pending", {
    baseUrl: baseUrl,
    headers: {
      "X-Api-Key": env.OG_WOLF_API_KEY,
    },
    signal: signal,
    dispatcher: ignoreCertAgent,
  });
  if (error !== undefined) {
    throw new Error("failed to get pending wolf pairings", {
      cause: error,
    });
  }

  if (!data.success) {
    throw new Error("failed to get pending wolf pairings");
  }

  console.debug("REQUESTS", data.requests);
  return data.requests;
}

export async function pairWolfClient(
  baseUrl: string,
  pin: string,
  secret: string,
  signal?: AbortSignal,
): Promise<void> {
  console.debug("SENT", secret, pin);
  const { data, error } = await wolfClient.POST("/api/v1/pair/client", {
    body: {
      pin: pin,
      pair_secret: secret,
    },
    baseUrl: baseUrl,
    headers: {
      "X-Api-Key": env.OG_WOLF_API_KEY,
    },
    signal: signal,
    dispatcher: ignoreCertAgent,
  });
  if (error !== undefined) {
    throw new Error("failed to pair wolf client", {
      cause: error,
    });
  }

  if (!data.success) {
    throw new Error("failed to pair wolf client");
  }
}
