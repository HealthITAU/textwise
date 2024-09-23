import "server-only";

import { cookies } from "next/headers";
import { env } from "~/env";

export const cwGet = async <TReturnType>(url: string) => {
  return fetch(`https://${env.CW_COMPANY_URL}${url}`, {
    headers: {
      clientId: env.CW_CLIENT_ID,
      Cookie: cookies().toString(),
    },
  }).then((res) => res.json() as Promise<TReturnType>);
};
