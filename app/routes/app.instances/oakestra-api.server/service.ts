import * as v from "valibot";
import { env } from "~/lib/env";
import type { OakestraApp } from "~/routes/app.instances/oakestra-api.server/app";
import { systemManagerClient } from "~/routes/app.instances/oakestra-api.server/client";
import type { OakestraUser } from "~/routes/app.instances/oakestra-api.server/user";

const serviceSchema = v.object({
  microserviceID: v.pipe(v.string(), v.nonEmpty()),
  microservice_name: v.pipe(v.string(), v.nonEmpty()),
  microservice_namespace: v.pipe(v.string(), v.nonEmpty()),
  memory: v.number(),
  vcpus: v.number(),
  storage: v.number(),
  environment: v.array(v.string()),
  port: v.string(),
  status: v.optional(v.string()),
  addresses: v.optional(
    v.object({
      rr_ip: v.optional(v.pipe(v.string(), v.ipv4())),
    }),
  ),
  instance_list: v.array(
    v.object({
      status: v.optional(v.string()),
    }),
  ),
});

const getServicesResponseSchema = v.pipe(
  v.string(),
  v.parseJson(),
  v.array(serviceSchema),
);

export type OakestraService = v.InferOutput<typeof serviceSchema>;

export async function getOakestraServicesByApp(
  app: OakestraApp,
  user: OakestraUser,
  signal?: AbortSignal,
): Promise<OakestraService[]> {
  const { data: servicesData, error: servicesError } =
    await systemManagerClient.GET("/api/services/{appid}", {
      params: {
        path: {
          appid: app.id,
        },
      },
      headers: {
        Authorization: "Bearer " + user.accessToken,
      },
      signal: signal,
    });
  if (servicesError !== undefined) {
    throw new Error("failed to get oakestra services", {
      cause: servicesError,
    });
  }

  return v.parse(getServicesResponseSchema, servicesData);
}

export async function getAllOakestraServices(
  user: OakestraUser,
  signal?: AbortSignal,
): Promise<OakestraService[]> {
  const { data: servicesData, error: servicesError } =
    await systemManagerClient.GET("/api/services/", {
      params: {},
      headers: {
        Authorization: "Bearer " + user.accessToken,
      },
      signal: signal,
    });
  if (servicesError !== undefined) {
    throw new Error("failed to get oakestra services", {
      cause: servicesError,
    });
  }

  return v.parse(getServicesResponseSchema, servicesData);
}

const getServiceResponseSchema = v.pipe(
  v.string(),
  v.parseJson(),
  serviceSchema,
);

export async function getOakestraService(
  user: OakestraUser,
  serviceId: string,
  signal?: AbortSignal,
): Promise<OakestraService> {
  const { data: serviceData, error: serviceError } =
    await systemManagerClient.GET("/api/service/{serviceid}", {
      params: {
        path: {
          serviceid: serviceId,
        },
      },
      headers: {
        Authorization: "Bearer " + user.accessToken,
      },
      signal: signal,
    });
  if (serviceError !== undefined) {
    throw new Error("failed to get oakestra service", {
      cause: serviceError,
    });
  }

  return {
    ...v.parse(getServiceResponseSchema, serviceData),
    addresses: {
      rr_ip: "10.44.64.2",
    },
  };
}

const createServicesResponseSchema = v.object({
  job_id: v.string(),
});

export async function createOakestraService(
  app: OakestraApp,
  user: OakestraUser,
  service: Pick<
    OakestraService,
    | "microservice_name"
    | "microservice_namespace"
    | "memory"
    | "vcpus"
    | "storage"
    | "environment"
    | "port"
  >,
  signal?: AbortSignal,
): Promise<{ job_id: string }> {
  const { data: serviceData, error: serviceError } =
    await systemManagerClient.POST("/api/service/", {
      body: {
        sla_version: "v2.0",
        customerID: user.id,
        applications: [
          {
            applicationID: app.id,
            application_name: app.name,
            application_namespace: app.namespace,
            microservices: [
              {
                microserviceID: "",
                microservice_name: service.microservice_name,
                microservice_namespace: service.microservice_namespace,
                virtualization: "crosvm",
                description: "",
                memory: service.memory,
                vcpus: service.vcpus,
                vgpus: 1,
                vtpus: service.storage, // TODO(axiphi): fix in backend
                bandwidth_in: 0,
                bandwidth_out: 0,
                storage: service.storage,
                port: service.port,
                code: "containers-docker://10.44.128.2:10500/oakestra/vm-wolf:0.0.1",
                state: "",
                added_files: [],
                args: [],
                environment: [
                  ...service.environment,
                  `WOLF_API_KEY=${env.OG_WOLF_API_KEY}`,
                ],
                constraints: [],
                connectivity: [],
              },
            ],
          },
        ],
      },
      headers: {
        Authorization: "Bearer " + user.accessToken,
      },
      signal: signal,
    });
  if (serviceError !== undefined) {
    throw new Error("failed to create oakestra service", {
      cause: serviceError,
    });
  }

  return v.parse(createServicesResponseSchema, serviceData);
}

export async function deleteOakestraService(
  user: OakestraUser,
  serviceId: string,
  signal?: AbortSignal,
): Promise<void> {
  const { error: serviceError } = await systemManagerClient.DELETE(
    "/api/service/{serviceid}",
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
  if (serviceError !== undefined) {
    throw new Error("failed to delete oakestra service", {
      cause: serviceError,
    });
  }
}
