import { useContext } from "react";
import { UNSAFE_DataRouterStateContext } from "react-router";

export function useRouteActionData<T>(routeId: string): T | undefined {
  const state = useContext(UNSAFE_DataRouterStateContext);
  if (state === null) {
    throw new Error(
      `useRouteActionData must be used within a data router. See https://reactrouter.com/en/main/routers/picking-a-router.`,
    );
  }

  return state.actionData ? state.actionData[routeId] : undefined;
}
