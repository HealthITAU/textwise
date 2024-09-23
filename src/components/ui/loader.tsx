import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <Loader2 className="size-16 animate-spin text-primary" />
    </div>
  );
};
