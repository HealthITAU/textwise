import { cn } from "~/lib/utils";

type CwInputProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export const CwInput = ({
  id,
  label,
  value,
  onChange,
  disabled,
}: CwInputProps) => {
  return (
    <div className="flex w-full flex-row items-center gap-x-4">
      <label
        htmlFor={id}
        className={cn(
          "basis-[43px] translate-y-[4px] text-[11px] text-[#7d7d7d] has-[+.input-group_.input:focus-visible]:text-primary",
          {
            "opacity-50": disabled,
          },
        )}
      >
        {label}
      </label>
      <div className="input-group relative grow">
        <input
          id={id}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="input peer h-[18px] rounded-none border-0 p-1 text-[11px] focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
        />
        <div
          className={cn(
            "pointer-events-none absolute inset-0 border-b border-[#7d7d7d] peer-focus-visible:bottom-[-1px] peer-focus-visible:border-b-2 peer-focus-visible:border-primary",
            {
              "opacity-50": disabled,
            },
          )}
        />
      </div>
    </div>
  );
};
