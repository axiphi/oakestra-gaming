import { Outlet } from "react-router";

export default function Page() {
  return (
    <main className="flex grow items-center justify-center">
      <Outlet />
    </main>
  );
}
