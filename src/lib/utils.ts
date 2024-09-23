import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateRandomCode = (digits = 4) => {
  const code = Math.floor(Math.random() * 10 ** digits);
  return code.toString().padStart(digits, "0");
};
