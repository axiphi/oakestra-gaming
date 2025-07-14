import type { OakestraService } from "~/routes/app.instances/oakestra-api.server/service";

export type InstanceStatus =
  | "UNKNOWN"
  | "ERROR"
  | "STARTING"
  | "RUNNING"
  | "STOPPING";

const NEGATIVE_SCHEDULING_STATUSES = new Set([
  "TargetClusterNotFound",
  "TargetClusterNotActive",
  "TargetClusterNoCapacity",
  "NoActiveClusterWithCapacity",
  "NO_WORKER_CAPACITY",
  "NO_QUALIFIED_WORKER_FOUND",
  "NO_NODE_FOUND",
]);

export function calculateCombinedInstanceStatus(
  service: OakestraService,
): InstanceStatus {
  if (
    service.status !== undefined &&
    NEGATIVE_SCHEDULING_STATUSES.has(service.status)
  ) {
    return "ERROR";
  }

  const allInstanceStatuses = new Set(
    service.instance_list
      .map((instance) => instance.status)
      .filter((status) => status !== undefined),
  );

  if (allInstanceStatuses.has("RUNNING")) {
    return "RUNNING";
  }

  if (
    allInstanceStatuses.has("CREATING") ||
    allInstanceStatuses.has("CREATED") ||
    allInstanceStatuses.has("REQUESTED") ||
    allInstanceStatuses.has("NODE_SCHEDULED") ||
    allInstanceStatuses.has("CLUSTER_SCHEDULED")
  ) {
    return "STARTING";
  }

  if (
    allInstanceStatuses.has("COMPLETED") ||
    allInstanceStatuses.has("UNDEPLOYED")
  ) {
    return "STOPPING";
  }

  if (allInstanceStatuses.has("FAILED") || allInstanceStatuses.has("DEAD")) {
    return "ERROR";
  }

  return "UNKNOWN";
}
