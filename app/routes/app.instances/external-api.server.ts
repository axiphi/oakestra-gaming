import createClient from "openapi-fetch";
import { env } from "~/lib/env";
import type { paths } from "~/lib/external-api/service-manager";

const client = createClient<paths>({
  baseUrl: env.OG_SERVICE_MANAGER_BASE_URL,
});

async function createApplication(customerId: string) {
  return client.POST("/api/application/", {
    body: {
      sla_version: "v2.0",
      customerID: customerId,
      applications: [
        {
          application_namespace: "default",
          application_name: "oakestragaming",
          microservices: [],
        },
      ],
    },
  });
}

export async function createService(
  customerId: string,
  applicationId: string,
  ogUserId: string,
  ogInstanceId: string,
  memory: number,
  vcpus: number,
  storage: number,
) {
  return client.POST("/api/service/", {
    body: {
      sla_version: "v2.0",
      customerID: customerId,
      applications: [
        {
          applicationID: applicationId,
          application_namespace: "default",
          application_name: "oakestragaming",
          microservices: [
            {
              microserviceID: "",
              microservice_name: ogUserId,
              microservice_namespace: ogInstanceId,
              virtualization: "crosvm",
              description: "",
              memory: memory,
              vcpus: vcpus,
              vgpus: 1,
              vtpus: 0,
              bandwidth_in: 0,
              bandwidth_out: 0,
              storage: storage,
              port: "47984/tcp,47989/tcp,47999/udp,48010/tcp,48100/udp,48200/udp",
              code: "containers-docker://ghcr.io/axiphi/oakestra-vm/wolf:latest",
              state: "",
              added_files: [],
              args: [],
              environment: [],
              constraints: [],
              connectivity: [],
            },
          ],
        },
      ],
    },
  });
}

export async function deployInstance(serviceId: string) {
  return client.POST("/api/service/{serviceid}/instance", {
    params: {
      path: {
        serviceid: serviceId,
      },
    },
  });
}
