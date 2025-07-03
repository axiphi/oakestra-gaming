import type { InstancePorts } from "~/routes/app.instances/internal-api.server/instance-ports";

export interface Instance {
  id: string; // microserviceID
  name: string; // microservice_name
  memory: number; // memory
  vcpus: number; // vcpus
  storage: number; // vcpus
  ip: string | undefined; // addresses.rr_ip
  ports: InstancePorts;
}

export interface InstanceDetails extends Instance {
  pairRequests: InstancePairRequest[];
}

export interface InstancePairRequest {
  clientIp: string;
  secret: string;
}
