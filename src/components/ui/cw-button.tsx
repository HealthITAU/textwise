import { ButtonHTMLAttributes } from "react";
import { cn } from "~/lib/utils";

type CwButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const CwButton = ({ children, ...props }: CwButtonProps) => {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex w-full items-center gap-x-4 rounded-[4px] bg-primary px-[4px] py-[1px] text-[11px] uppercase text-white hover:bg-[#0792fa] disabled:pointer-events-none disabled:opacity-50",
        props.className,
      )}
    >
      {children}
    </button>
  );
};
