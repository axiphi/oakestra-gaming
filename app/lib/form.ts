// import { UnknownKeysParam, ZodObject, ZodRawShape, ZodTypeAny } from "zod";
// import {
//   createServerValidate,
//   getFormData,
//   ServerFormState as BaseServerFormState,
//   ServerValidateError,
// } from "@tanstack/react-form/start";
// import { createMiddleware, createServerFn } from "@tanstack/react-start";
// import type { FormOptions, StandardSchemaV1 } from "@tanstack/form-core";
// import { OptionalFetcher, ServerFnBuilder } from "@tanstack/start-client-core";
// import { mergeForm, useTransform } from "@tanstack/react-form";
// import { getHeader } from "@tanstack/react-start/server";
//
// export function createFormServerValidate<T extends Record<string, unknown>>(
//   schema: ZodObject<ZodRawShape, UnknownKeysParam, ZodTypeAny, T, T>,
// ) {
//   return createServerValidate<
//     T,
//     undefined,
//     undefined,
//     undefined,
//     undefined,
//     undefined,
//     undefined,
//     undefined,
//     StandardSchemaV1<T, unknown>,
//     never
//   >({
//     onServerValidate: schema,
//   });
// }
//
// export type FormResponse = ReturnType<
//   Exclude<Parameters<ServerFnBuilder<"POST", "raw">["handler"]>[0], undefined>
// >;
//
// export const FormServerFnOptions = {
//   method: "POST",
//   response: "raw",
// } as const;
//
// export function refreshPage(body?: BodyInit | null) {
//   const referer = getHeader("referer");
//   if (!referer) {
//     return new Response("internal error while trying to redirect", {
//       status: 500,
//     });
//   }
//
//   return new Response(body, {
//     headers: {
//       Location: referer,
//     },
//     status: 302,
//   });
// }
//
// export function createFormServerMiddleware<T extends Record<string, unknown>>(
//   schema: ZodObject<ZodRawShape, UnknownKeysParam, ZodTypeAny, T, T>,
// ) {
//   const serverValidate = createServerValidate<
//     T,
//     undefined,
//     undefined,
//     undefined,
//     undefined,
//     undefined,
//     undefined,
//     undefined,
//     StandardSchemaV1<T, unknown>,
//     never
//   >({
//     onServerValidate: schema,
//   });
//
//   return createMiddleware().server(async ({ next, data }) => {
//     if (!((data as unknown) instanceof FormData)) {
//       throw new Response("expected form data but got other request format", {
//         status: 400,
//       });
//     }
//
//     let validatedData: T;
//     try {
//       validatedData = await serverValidate(data as unknown as FormData);
//     } catch (e) {
//       if (e instanceof ServerValidateError) {
//         throw refreshPage("invalid form data");
//       }
//
//       throw new Response(
//         "encountered an internal error while validating form data",
//         {
//           status: 500,
//         },
//       );
//     }
//
//     return next({
//       context: {
//         data: validatedData,
//       },
//     });
//   });
// }
//
// export type ServerFormState =
//   | BaseServerFormState<unknown, undefined>
//   | {
//       errorMap: { onServer: undefined };
//       errors: never[];
//     };
//
// export function getFormClientArgs<T extends Record<string, unknown>>(
//   schema: ZodObject<ZodRawShape, UnknownKeysParam, ZodTypeAny, T, T>,
//   state: ServerFormState,
// ): FormOptions<
//   T,
//   undefined,
//   StandardSchemaV1<T, unknown>,
//   undefined,
//   undefined,
//   undefined,
//   undefined,
//   undefined,
//   undefined,
//   undefined
// > {
//   return {
//     transform: useTransform((baseForm) => mergeForm(baseForm, state), [state]),
//     validators: {
//       onChange: schema,
//     },
//   };
// }
//
// export const getFormState: OptionalFetcher<
//   undefined,
//   undefined,
//   ServerFormState,
//   "data"
// > = createServerFn({ method: "GET" }).handler(async () => {
//   return await getFormData();
// });
