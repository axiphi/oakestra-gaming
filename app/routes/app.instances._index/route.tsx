import { Gamepad2Icon } from "lucide-react";

export default function Page() {
  return (
    <span className="mx-8 flex grow flex-col items-center justify-center gap-4 self-center text-center text-2xl text-muted-foreground">
      <Gamepad2Icon size={128} />
      Select an instance to see more details
    </span>
  );
}
