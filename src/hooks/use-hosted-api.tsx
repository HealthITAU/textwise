import { useEffect, useState } from "react";
import { z } from "zod";
import { useOnMount } from "~/hooks/use-on-mount";
import { log } from "~/lib/debug";

const ZHostedAs = z.enum(["pod", "tab"]);
const ZScreens = z.enum(["ticket", "company", "contact", "salesorder"]);
const ZMemberAuthenticationData = z.object({
	// nilear won't include codeBase, but connectwise will
	codeBase: z.string().optional(),
	companyid: z.string(),
	memberContext: z.string(),
	memberEmail: z.string(),
	memberid: z.string(),
	memberHash: z.string(),
	site: z.string(),
	ssoAccessToken: z.string(),
	ssoIdToken: z.string(),
});
const ZScreenObject = z.object({
	hostedAs: ZHostedAs,
	id: z.string().or(z.number()),
	screen: ZScreens,
});
const ZEventData = z.object({
	screenObject: ZScreenObject,
});
const ZEventCallbackData = z.object({
	event: z.enum(["beforeSave", "onLoad"]),
	data: ZEventData,
	_id: z.string(),
});
const ZMessageFrameCallbackData = z.object({
	MessageFrameID: z.string(),
});
const ZResponseCallbackData = z.object({
	response: z.enum(["getmemberauthentication"]),
	data: ZMemberAuthenticationData,
	// nilear won't include _id, but connectwise will
	_id: z.string().optional(),
});
const ZAmbiguousConnectWiseResponse = z.union([
	ZEventCallbackData,
	ZResponseCallbackData,
	ZMessageFrameCallbackData,
]);

type HostedAs = z.infer<typeof ZHostedAs>;
type Screens = z.infer<typeof ZScreens>;
export type MemberAuthenticationData = z.infer<
	typeof ZMemberAuthenticationData
>;
type ScreenObject = z.infer<typeof ZScreenObject>;
type EventCallbackData = z.infer<typeof ZEventCallbackData>;

type MessageFrameCallbackData = z.infer<typeof ZMessageFrameCallbackData>;

type ResponseCallbackData = z.infer<typeof ZResponseCallbackData>;

type AmbiguousConnectWiseResponse = z.infer<
	typeof ZAmbiguousConnectWiseResponse
>;

type useHostedApiProps = {
	onLoad?: () => void;
	onBeforeSave?: () => void;
	onGetMemberAuthentication?: (data: MemberAuthenticationData) => void;
	onReady?: () => void;
};

export const useHostedApi = ({
	onLoad,
	onBeforeSave,
	onGetMemberAuthentication,
	onReady,
}: useHostedApiProps) => {
	const [frameId, setFrameId] = useState<string | null>(null);
	const [ready, setReady] = useState(false);

	const eventHandler = (data: EventCallbackData) => {
		log("eventHandler: ", data);
		if (data.event === "beforeSave") {
			onBeforeSave?.();
		} else if (data.event === "onLoad") {
			onLoad?.();
		}
	};

	const responseHandler = (data: ResponseCallbackData) => {
		log("responseHandler: ", data);
		if (data.response === "getmemberauthentication") {
			onGetMemberAuthentication?.(data.data);
		}
	};

	const requestMemberAuthentication = () => {
		log("Requesting getMemberAuthentication - frameId: ", frameId);
		// 2 messages - one is for Nilear compatibility
		// Nilear expects a message with just the request, but ConnectWise expects a message with the frameID
		window.parent.postMessage(
			JSON.stringify({
				hosted_request: "getMemberAuthentication",
				frameID: frameId,
			}),
			"*",
		);

		window.parent.postMessage(
			JSON.stringify({
				hosted_request: "getMemberAuthentication",
			}),
			"*",
		);
	};

	const requestRefresh = () => {
		window.parent.postMessage(
			JSON.stringify({ hosted_request: "refreshScreen" }),
			"*",
		);
	};

	const markDirty = () => {
		window.parent.postMessage(
			JSON.stringify({
				hosted_request: "setDirty",
				args: { dirty: true },
				frameID: frameId,
			}),
			"*",
		);
	};

	useOnMount(() => {
		log("useOnMount: Adding event listener");
		window.addEventListener("message", (e) => {
			log("data", e.data);
			const json = JSON.parse(e.data);

			log("Received message from cw: ", json);

			if (json.response) {
				responseHandler(ZResponseCallbackData.parse(json));
			} else if (json.event) {
				eventHandler(ZEventCallbackData.parse(json));
			} else if (json.MessageFrameID) {
				setFrameId(json.MessageFrameID);
				setReady(true);
			}
		});

		log("useOnMount: Sending ready message");
		window.parent.postMessage(JSON.stringify({ message: "ready" }), "*");
	});

	useEffect(() => {
		if (frameId && ready) {
			onReady?.();
			setReady(false);
		}
	}, [frameId, ready]);

	return {
		requestMemberAuthentication,
		requestRefresh,
		markDirty,
	};
};
