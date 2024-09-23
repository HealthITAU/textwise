import { Loader2, MessageCircle } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createCwTicketNote } from "~/actions/create-cw-ticket-note";
import { sendSms } from "~/actions/send-sms";
import { SectionWrapper } from "~/components/section-wrapper";
import { CwButton } from "~/components/ui/cw-button";
import { Textarea } from "~/components/ui/textarea";
import { env } from "~/env";
import useCooldown from "~/hooks/use-cooldown";
import type { MemberAuthenticationData } from "~/hooks/use-hosted-api";
import type { ContactInfo } from "~/lib/types";
import { cn } from "~/lib/utils";

type MessageBoxProps = {
	ticketId: number;
	contact: ContactInfo;
	onMadeDirty: () => void;
	auth: MemberAuthenticationData | null;
};

export const MessageBox = ({
	ticketId,
	contact,
	onMadeDirty,
	auth,
}: MessageBoxProps) => {
	const [message, setMessage] = useState("");
	const { timeRemaining, isCoolingDown, startCooldown } = useCooldown();
	const [remainingCharacterCount, setRemainingCharacterCount] = useState(160);
	const [isSending, startSending] = useTransition();

	const sendMessage = () => {
		startSending(async () => {
			const resp = await sendSms({
				ticketId,
				contactName: contact.name!,
				contactNumber: contact.number!,
				message,
				type: "msg",
			});

			if (resp?.serverError) {
				toast.error("Error sending message!", {
					duration: 2000,
					dismissible: true,
					classNames: {
						icon: "text-destructive",
					},
				});
			} else {
				toast.success("Message sent!", {
					duration: 2000,
					dismissible: true,
					classNames: {
						icon: "text-[#0792fa]",
					},
				});
				setMessage("");
				setRemainingCharacterCount(160);
				if (env.NEXT_PUBLIC_ENABLE_COOLDOWNS) {
					startCooldown(env.NEXT_PUBLIC_COOLDOWN_TIMER);
				}
				void createCwTicketNote({
					ticketId,
					note: `**[TextWise]** I sent the following message to ${contact.name} (${contact.number}):\r\n${message}`,
					memberIdentifier: auth?.memberid ?? "",
				});
			}
		});
	};

	return (
		<SectionWrapper doubleSize>
			<div className="relative grow">
				<Textarea
					placeholder="Type your message here"
					className="h-full resize-none rounded-[2px] border-[#bbb] p-[5px] placeholder:text-[#ccc] focus-visible:ring-0"
					value={message}
					onChange={(e) => {
						setMessage(e.target.value);
						setRemainingCharacterCount(160 - e.target.value.length);
						onMadeDirty();
					}}
				/>
				<span
					className={cn(
						"absolute bottom-2 right-2 text-xs font-light text-muted-foreground",
						{
							"text-destructive": remainingCharacterCount < 0,
						},
					)}
				>
					{remainingCharacterCount}
				</span>
			</div>
			<CwButton
				type="submit"
				disabled={
					message.length > 160 ||
					message.length <= 0 ||
					!contact.name ||
					!contact.number ||
					isSending ||
					isCoolingDown
				}
				onClick={() => {
					sendMessage();
				}}
			>
				{isSending ? (
					<Loader2 className="size-3 animate-spin" />
				) : (
					<MessageCircle className="size-3" />
				)}
				{isCoolingDown ? `Please wait (${timeRemaining})` : "Send Message"}
			</CwButton>
		</SectionWrapper>
	);
};
