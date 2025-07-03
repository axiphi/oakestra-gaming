import * as v from "valibot";

export const userSchema = v.object({
  id: v.pipe(v.string(), v.uuid()),
  email: v.pipe(v.string(), v.email()),
  accessToken: v.pipe(v.string(), v.nonEmpty()),
  refreshToken: v.optional(v.pipe(v.string(), v.nonEmpty())),
});

export type User = v.InferOutput<typeof userSchema>;

// const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
//   const session = await useAppSession();
//   if (!session.data.user) {
//     return null;
//   }
//
//   return session.data.user;
// });
