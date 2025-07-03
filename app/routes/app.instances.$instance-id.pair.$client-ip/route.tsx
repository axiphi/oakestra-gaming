import type { Route } from "./+types/route";

import { parseWithValibot } from "@conform-to/valibot";
import type { ReactNode } from "react";
import { redirect } from "react-router";
import { sessionContext } from "~/lib/session";
import { PairServerSchema } from "~/routes/app.instances.$instance-id/PairDialog";
import { getInstance } from "~/routes/app.instances/internal-api.server/get-instance";
import { pairInstance } from "~/routes/app.instances/internal-api.server/pair-instance";

export async function action({ params, request, context }: Route.ActionArgs) {
  const session = context.get(sessionContext);

  if (!session.user) {
    return redirect("/");
  }

  const formData = await request.formData();
  const submission = parseWithValibot(formData, {
    schema: PairServerSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const instance = await getInstance(
    session.user.id,
    params["instance-id"],
    request.signal,
  );

  await pairInstance(
    instance,
    submission.value.pin,
    submission.value.secret,
    request.signal,
  );
  return redirect(`/app/instances/${params["instance-id"]}`);
}

export default function Page(): ReactNode {
  return <></>;
}
