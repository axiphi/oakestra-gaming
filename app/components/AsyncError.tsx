import { useAsyncError } from "react-router";

export interface AsyncErrorProps {
  message: string;
}

export function AsyncError({ message }: AsyncErrorProps) {
  const error = useAsyncError();
  return (
    <div className="flex grow flex-col items-center justify-center gap-2 self-center pb-[30%]">
      <span className="text-center text-2xl font-bold text-destructive">
        Oops!
        <br />
        Something went wrong.
      </span>
      <span className="text-center text-lg text-destructive/60">
        {message}:
        <br />
        <pre className="text-base text-ellipsis">
          {error instanceof Error ? error.message : error?.toString()}
        </pre>
      </span>
    </div>
  );
}
