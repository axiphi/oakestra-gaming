import { AlertTriangleIcon } from "lucide-react";
import { Link } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

export default function RouteComponent() {
  return (
    <div className="m-6 flex flex-col items-center gap-6">
      <Alert variant="destructive" className="max-w-lg">
        <AlertTriangleIcon />
        <AlertTitle>Authentication Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again later.
        </AlertDescription>
      </Alert>
      <Link
        to="/"
        className="text-primary underline transition-colors hover:text-primary/80"
      >
        Go back home
      </Link>
    </div>
  );
}
