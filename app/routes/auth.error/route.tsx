import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "~/components/ui/alert";
import { AlertTriangleIcon } from "lucide-react";
import { Link } from "react-router";

export default function RouteComponent() {
  return (
    <div className="m-6 flex flex-col items-center gap-6">
      <Alert variant="danger" className="max-w-lg">
        <AlertIcon>
          <AlertTriangleIcon />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>Authentication Error</AlertTitle>
          <AlertDescription>
            Something went wrong. Please try again later.
          </AlertDescription>
        </AlertContent>
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
