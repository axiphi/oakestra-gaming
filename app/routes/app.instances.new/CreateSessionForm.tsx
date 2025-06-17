// import { FC } from "react";
// import {
//   createFormServerMiddleware,
//   getFormClientArgs,
//   ServerFormState,
// } from "~/lib/form";
// import { z } from "zod";
// import { useAppForm } from "~/components/ui/form/app-form";
// import { createServerFn } from "@tanstack/react-start";
// import { redirect } from "@tanstack/react-router";
// import { mergeForm, useTransform } from "@tanstack/react-form";
//
// const FormSchema = z.object({
//   vcpu: z.coerce.number().min(1, "You need at least 1 vcpu"),
//   memory: z.coerce.number().min(128, "You need at least 128mb of memory"),
// });
//
// const handleForm = createServerFn({
//   method: "POST",
//   response: "raw",
// })
//   .middleware([createFormServerMiddleware(FormSchema)])
//   .handler(async ({ context: { data } }) => {
//     console.debug("Got form data on server: ", data);
//     throw redirect({ to: "/" });
//   });
//
// export interface CreateSessionFormProps {
//   state: ServerFormState;
// }
//
// export const CreateSessionForm: FC<CreateSessionFormProps> = ({ state }) => {
//   const form = useAppForm({
//     transform: useTransform((baseForm) => mergeForm(baseForm, state), [state]),
//     validators: {
//       onChange: FormSchema,
//     },
//     defaultValues: {
//       vcpu: 4,
//       memory: "",
//     },
//   });
//
//   return (
//     <form.AppForm>
//       <form.Form
//         action={handleForm.url}
//         method="post"
//         encType="multipart/form-data"
//       >
//         <form.AppField name="vcpu">
//           {(field) => (
//             <field.FieldContent>
//               <field.FieldLabel>vcpu</field.FieldLabel>
//               <field.FieldInput />
//               <field.FieldDescription>
//                 the number of virtual cpu cores available to the VM
//               </field.FieldDescription>
//               <field.FieldError />
//             </field.FieldContent>
//           )}
//         </form.AppField>
//         <form.AppField name="memory">
//           {(field) => (
//             <field.FieldContent>
//               <field.FieldLabel>memory</field.FieldLabel>
//               <field.FieldInput />
//               <field.FieldDescription>
//                 the amount of memory available to the VM
//               </field.FieldDescription>
//               <field.FieldError />
//             </field.FieldContent>
//           )}
//         </form.AppField>
//         <form.Subscribe
//           selector={(formState) => [
//             formState.canSubmit,
//             formState.isSubmitting,
//           ]}
//         >
//           {([canSubmit, isSubmitting]) => (
//             <button type="submit" disabled={!canSubmit}>
//               {isSubmitting ? "..." : "Submit"}
//             </button>
//           )}
//         </form.Subscribe>
//       </form.Form>
//     </form.AppForm>
//   );
// };
