"use client";

import { useState } from "react";
import { getTicketInfo } from "~/actions/get-ticket-info";
import { AuthBox } from "~/components/auth-box";
import { DetailsBox } from "~/components/details-box";
import { MessageBox } from "~/components/message-box";
import { Loader } from "~/components/ui/loader";
import { useAuth } from "~/hooks/use-auth";
import { useHostedApi } from "~/hooks/use-hosted-api";
import { log } from "~/lib/debug";
import type { ContactInfo } from "~/lib/types";

type ComponentGridProps = {
	ticketId: number;
};

export const ComponentGrid = ({ ticketId }: ComponentGridProps) => {
	const [contactInfo, setContactInfo] = useState<ContactInfo | undefined>();
	log("contactInfo", contactInfo);
	const { auth, setAuth, isAuthed } = useAuth();

	const { requestMemberAuthentication, requestRefresh, markDirty } =
		useHostedApi({
			onLoad: () => {
				log("onLoad event received");

				// Nilear will auth in onLoad
				if (!isAuthed) {
					requestMemberAuthentication();
				}
			},

			onGetMemberAuthentication: async (authData) => {
				log("onGetMemberAuthentication event received", authData);
				await setAuth(authData).then(() => {
					getTicketInfo(ticketId).then((data) => setContactInfo(data));
				});
			},
			onReady: async () => {
				log("onReady event received");

				// CW will auth in onReady
				if (!isAuthed) {
					requestMemberAuthentication();
				}
			},
		});

	if (!contactInfo || !isAuthed) return <Loader />;

	return (
		<div className="grid h-full w-full grid-cols-2 gap-x-[10px] gap-y-[5px] bg-[#F5F5F5] p-2">
			<DetailsBox
				ticketId={ticketId}
				contact={contactInfo}
				onContactInfoChange={setContactInfo}
				onRefreshRequested={() => {}}
			/>
			<AuthBox
				onMadeDirty={() => {
					markDirty();
				}}
				contact={contactInfo}
				ticketId={ticketId}
				auth={auth}
			/>
			<MessageBox
				onMadeDirty={() => {
					markDirty();
				}}
				auth={auth}
				contact={contactInfo}
				ticketId={ticketId}
			/>
		</div>
	);
};
