import {
  createCookieSessionStorage,
  unstable_createContext,
} from "react-router";
import { env } from "~/lib/env";
import { type User } from "~/lib/user";

type SessionData = {
  user?: User | undefined;
};

type SessionFlashData = object;

export const { getSession, commitSession, destroySession } =
  createCookieSessionStorage<SessionData, SessionFlashData>({
    cookie: {
      name: "__session",
      maxAge: 5256000, // two months
      httpOnly: true,
      secure: true,
      domain: new URL(env.OG_BASE_URL).hostname,
      secrets: [env.OG_SESSION_SECRET],
    },
  });

export const sessionContext = unstable_createContext<SessionData>();
