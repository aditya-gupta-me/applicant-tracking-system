import { Spinner } from "@repo/ui/components/spinner";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Spinner />
    </div>
  );
}

