import type { Route } from "./+types/route";

export default function Page({ params }: Route.ComponentProps) {
  return <div>Hello &#34;${params["instance-id"]}&#34;!</div>;
}
