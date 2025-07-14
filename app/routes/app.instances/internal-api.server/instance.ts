import type { InstancePorts } from "~/routes/app.instances/internal-api.server/instance-ports";
import type { InstanceStatus } from "~/routes/app.instances/internal-api.server/instance-status";

export interface Instance {
  id: string; // microserviceID
  name: string; // microservice_name
  memory: number; // memory
  vcpus: number; // vcpus
  storage: number; // vcpus
  ip: string | undefined; // addresses.rr_ip
  status: InstanceStatus;
  ports: InstancePorts;
}

export interface InstancePairRequest {
  clientIp: string;
  secret: string;
}
