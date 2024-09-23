"use server";

import { cookies } from "next/headers";
import { env } from "~/env";

export const cwGet = async <TReturnType,>(
	stub: string,
	conditions?: string,
) => {
	const base = `https://${env.CW_COMPANY_URL}/${env.CW_CODE_BASE}/apis/3.0`;
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

export const cwPost = async <TReturnType,>(
	stub: string,
	body: string,
) => {
	const base = `https://${env.CW_COMPANY_URL}/${env.CW_CODE_BASE}/apis/3.0`;
	return fetch(
		`${base}${stub}`,
		{
			headers: {
				clientId: env.CW_CLIENT_ID,
				Cookie: cookies().toString(),
				'Content-Type': 'application/json'
			},
			body,
			method: 'POST'
		},

	).then((res) => res.json() as Promise<TReturnType | undefined>);
};
