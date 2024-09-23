"use client";

import { RefreshCcw } from "lucide-react";
import { useEffect } from "react";
import { CwButton } from "~/components/ui/cw-button";
import { log } from "~/lib/debug";

export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		log(error);
	}, [error]);

	return (
		<div className="flex h-full w-full flex-col items-center justify-center gap-x-1">
			<h2>Something went wrong!</h2>
			<CwButton onClick={() => reset()} className="w-1/2">
				<RefreshCcw className="size-3" />
				Try again
			</CwButton>
		</div>
	);
}
