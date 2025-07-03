import { LRUCache } from "lru-cache";
import * as v from "valibot";
import { systemManagerClient } from "~/routes/app.instances/oakestra-api.server/client";
import type { OakestraUser } from "~/routes/app.instances/oakestra-api.server/user";

export interface OakestraAppKey {
  name: string;
  namespace: string;
}

export interface OakestraApp {
  id: string;
  name: string;
  namespace: string;
}

const oakestraApplicationsSchema = v.pipe(
  v.string(),
  v.parseJson(),
  v.array(
    v.object({
      application_name: v.pipe(v.string(), v.nonEmpty()),
      application_namespace: v.pipe(v.string(), v.nonEmpty()),
      applicationID: v.pipe(v.string(), v.nonEmpty()),
    }),
  ),
);

export const oakestraAppCache = new LRUCache<
  OakestraAppKey,
  OakestraApp,
  OakestraUser
>({
  maxSize: 100,
  sizeCalculation: () => 1,
  fetchMethod: async (key, _, { signal, context: oakestraUser }) => {
    const { data: applicationsData, error: applicationsError } =
      await systemManagerClient.GET("/api/applications/{userid}", {
        params: {
          path: {
            userid: oakestraUser.id,
          },
        },
        headers: {
          Authorization: "Bearer " + oakestraUser.accessToken,
        },
        signal: signal,
      });
    if (applicationsError !== undefined) {
      throw new Error("failed to get oakestra applications", {
        cause: applicationsError,
      });
    }

    const fixedApplicationsData = v.parse(
      oakestraApplicationsSchema,
      applicationsData,
    );
    const existingAppId = fixedApplicationsData.find(
      (entry) =>
        entry.application_name === key.name &&
        entry.application_namespace === key.namespace,
    )?.applicationID;
    if (existingAppId !== undefined) {
      return {
        id: existingAppId,
        name: key.name,
        namespace: key.namespace,
      };
    }

    const { data: applicationData, error: applicationError } =
      await systemManagerClient.POST("/api/application/", {
        body: {
          sla_version: "v2.0",
          customerID: oakestraUser.id,
          applications: [
            {
              application_name: key.name,
              application_namespace: key.namespace,
              microservices: [],
            },
          ],
        },

        headers: {
          Authorization: "Bearer " + oakestraUser.accessToken,
        },
        signal: signal,
      });
    if (applicationError !== undefined) {
      throw new Error("failed to get create oakestra application", {
        cause: applicationError,
      });
    }

    const fixedApplicationData = v.parse(
      oakestraApplicationsSchema,
      applicationData,
    );
    const createdAppId = fixedApplicationData.find(
      (entry) =>
        entry.application_name === key.name &&
        entry.application_namespace === key.namespace,
    )?.applicationID;
    if (createdAppId === undefined || createdAppId.length == 0) {
      throw new Error("failed to create oakestra application");
    }

    return {
      id: createdAppId,
      name: key.name,
      namespace: key.namespace,
    };
  },
});
