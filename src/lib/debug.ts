import { env } from "~/env";

export const log = (...args: any[]) => {
  if (env.NEXT_PUBLIC_DEBUG_LOGGING) {
    console.log("[TextWise] DEBUG: ", ...args);
  }
};
