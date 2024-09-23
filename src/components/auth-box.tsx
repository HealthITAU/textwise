import { Key, Loader2, Lock } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createCwTicketNote } from "~/actions/create-cw-ticket-note";
import { sendSms } from "~/actions/send-sms";
import { SectionWrapper } from "~/components/section-wrapper";
import { CwButton } from "~/components/ui/cw-button";
import { CwInput } from "~/components/ui/cw-input";
import type { MemberAuthenticationData } from "~/hooks/use-hosted-api";
import type { ContactInfo } from "~/lib/types";
import { generateRandomCode } from "~/lib/utils";

type AuthBoxProps = {
	ticketId: number;
	contact: ContactInfo;
	onMadeDirty: () => void;
	auth: MemberAuthenticationData | null;
};

export const AuthBox = ({
	ticketId,
	contact,
	onMadeDirty,
	auth,
}: AuthBoxProps) => {
	const [authCode, setAuthCode] = useState("....");
	const [userEnteredCode, setUserEnteredCode] = useState("");
	const [authCodeSent, setAuthCodeSent] = useState(false);
	const [isSending, startSending] = useTransition();

	const sendCode = (code: string) => {
		startSending(async () => {
			const resp = await sendSms({
				ticketId,
				contactName: contact.name!,
				contactNumber: contact.number!,
				message: code,
				type: "auth",
			});

			if (resp?.serverError) {
				toast.error("Error sending auth code!", {
					duration: 2000,
					dismissible: true,
					classNames: {
						icon: "text-destructive",
					},
				});
			} else {
				toast.success("Auth code sent!", {
					duration: 2000,
					dismissible: true,
					classNames: {
						icon: "text-[#0792fa]",
					},
				});
				setAuthCodeSent(true);
				onMadeDirty();
				void createCwTicketNote({
					ticketId,
					note: `**[TextWise]** I have sent an authentication code to ${contact.name} (${contact.number})`,
					memberIdentifier: auth?.memberid ?? "",
				});
			}
		});
	};

	const checkCode = () => {
		if (userEnteredCode === authCode) {
			setAuthCodeSent(false);
			setAuthCode("");
			toast.success("Code confirmed", {
				duration: 3000,
				dismissible: true,
				classNames: {
					icon: "text-[#0792fa]",
				},
			});
			void createCwTicketNote({
				ticketId,
				note: `**[TextWise]** I have authenticated ${contact.name} (${contact.number}) via the pod.`,
				memberIdentifier: auth?.memberid ?? "",
			});
		} else {
			toast.error("Incorrect code", {
				duration: 3000,
				dismissible: true,
				classNames: {
					icon: "text-destructive",
				},
			});
		}
	};

	return (
		<SectionWrapper>
			<CwInput
				id="code"
				label="Code:"
				disabled={!authCodeSent}
				value={userEnteredCode}
				onChange={(value) => setUserEnteredCode(value)}
			/>
			<div className="flex w-full flex-col gap-[5px]">
				<CwButton disabled={!authCodeSent} onClick={() => checkCode()}>
					<Key className="size-3" />
					Check Code
				</CwButton>
				<CwButton
					disabled={!contact.name || !contact.number || isSending}
					onClick={() => {
						const code = generateRandomCode();
						setAuthCode(code);
						sendCode(code);
					}}
				>
					{isSending ? (
						<Loader2 className="size-3 animate-spin" />
					) : (
						<Lock className="size-3" />
					)}
					Send Auth Code
				</CwButton>
			</div>
		</SectionWrapper>
	);
};
