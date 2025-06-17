import * as v from "valibot";

export const UserSchema = v.object({
  email: v.pipe(v.string(), v.email()),
  accessToken: v.pipe(v.string(), v.nonEmpty()),
  refreshToken: v.optional(v.pipe(v.string(), v.nonEmpty())),
});

export type User = v.InferOutput<typeof UserSchema>;

// const fetchUser = createServerFn({ method: "GET" }).handler(async () => {
//   const session = await useAppSession();
//   if (!session.data.user) {
//     return null;
//   }
//
//   return session.data.user;
// });
