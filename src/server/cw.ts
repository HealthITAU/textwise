import "server-only";

import { ManageAPI } from "connectwise-rest";
import { cookies } from "next/headers";
import { env } from "~/env";

export const getCwm = () => {
  if (!env.CW_COMPANY_NAME || !env.CW_COMPANY_URL || !env.CW_CLIENT_ID || !env.CW_PUBLIC_KEY || !env.CW_PRIVATE_KEY) {
    throw new Error("Missing CW credentials");
  }

  return new ManageAPI({
    companyId: env.CW_COMPANY_NAME,
    companyUrl: env.CW_COMPANY_URL,
    clientId: env.CW_CLIENT_ID,
    publicKey: env.CW_PUBLIC_KEY,
    privateKey: env.CW_PRIVATE_KEY,
    retry: true,
  });
}

export const cwGet = async <TReturnType>(url: string) => {
  return fetch(`https://${env.CW_COMPANY_URL}${url}`, {
    headers: {
      clientId: env.CW_CLIENT_ID,
      Cookie: cookies().toString(),
    },
  }).then((res) => res.json() as Promise<TReturnType>);
};
