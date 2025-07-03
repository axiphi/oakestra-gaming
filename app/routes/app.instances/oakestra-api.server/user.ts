import { LRUCache } from "lru-cache";
import * as v from "valibot";
import { systemManagerClient } from "~/routes/app.instances/oakestra-api.server/client";

export interface OakestraUserKey {
  username: string;
  password: string;
  organization: string;
}

export interface OakestraUser {
  id: string;
  accessToken: string;
}

const oakestraLoginSchema = v.object({
  token: v.pipe(v.string(), v.nonEmpty()),
});

const oakestraUserSchema = v.object({
  _id: v.object({
    $oid: v.pipe(v.string(), v.nonEmpty()),
  }),
});

export const oakestraUserCache = new LRUCache<OakestraUserKey, OakestraUser>({
  ttl: 480000, // 8min
  ttlAutopurge: false,
  fetchMethod: async (key, _, { signal }) => {
    const { data: loginData, error: loginError } =
      await systemManagerClient.POST("/api/auth/login", {
        body: {
          username: key.username,
          password: key.password,
          organization: key.organization,
        },
        signal: signal,
      });
    if (loginError !== undefined) {
      throw new Error("failed to login with oakestra user", {
        cause: loginError,
      });
    }

    const fixedLoginData = v.parse(oakestraLoginSchema, loginData);

    const { data: userData, error: userError } = await systemManagerClient.GET(
      "/api/user/{username}",
      {
        params: {
          path: {
            username: key.username,
          },
        },
        headers: {
          Authorization: "Bearer " + fixedLoginData.token,
        },
        signal: signal,
      },
    );
    if (userError !== undefined) {
      throw new Error("failed to get oakestra user", { cause: userError });
    }

    const fixedUserData = v.parse(oakestraUserSchema, userData);

    return {
      id: fixedUserData._id.$oid,
      accessToken: fixedLoginData.token,
    };
  },
});
