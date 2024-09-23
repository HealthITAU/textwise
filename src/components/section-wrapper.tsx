import { cn } from "~/lib/utils";

export const SectionWrapper = ({
  children,
  doubleSize = false,
}: {
  children: React.ReactNode;
  doubleSize?: boolean;
}) => {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-y-[5px] rounded-none border bg-background p-[5px] shadow-cw",
        {
          "col-span-2": doubleSize,
        },
      )}
    >
      {children}
    </div>
  );
};
