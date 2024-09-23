"use server";

import { cookies } from "next/headers";
import { env } from "~/env";

export const cwGet = async <TReturnType,>(
	stub: string,
	conditions?: string,
) => {
	const base = `https://${env.CW_COMPANY_URL}/v4_6_release/apis/3.0`;
	return fetch(
		conditions ? `${base}${stub}?conditions=${conditions}` : `${base}${stub}`,
		{
			headers: {
				clientId: env.CW_CLIENT_ID,
				Cookie: cookies().toString(),
			},
		},
	).then((res) => res.json() as Promise<TReturnType | undefined>);
};
