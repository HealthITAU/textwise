"use client";

import { useMemo, useState } from "react";
import { setAuthCookies } from "~/actions/set-auth-cookies";
import type { MemberAuthenticationData } from "~/hooks/use-hosted-api";
import { log } from "~/lib/debug";

export const useAuth = () => {
	const [authData, setAuthData] = useState<MemberAuthenticationData | null>(
		null,
	);

	const setAuth = async (authData: MemberAuthenticationData) => {
		log("setting auth data", authData);
		setAuthData(authData);
		setAuthCookies(authData);
	};

	const isAuthed = useMemo(() => {
		return authData !== null;
	}, [authData]);

	return {
		auth: authData,
		setAuth,
		isAuthed,
	};
};
