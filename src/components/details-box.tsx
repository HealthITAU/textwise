import { RefreshCcw } from "lucide-react";
import { useTransition } from "react";
import { SectionWrapper } from "~/components/section-wrapper";
import { CwButton } from "~/components/ui/cw-button";
import { CwInput } from "~/components/ui/cw-input";
import type { ContactInfo } from "~/lib/types";
import { cn } from "~/lib/utils";

type DetailsBoxProps = {
	ticketId: number;
	contact: ContactInfo;
	onContactInfoChange: (contact: ContactInfo) => void;
	onRefreshRequested: () => void;
};

export const DetailsBox = ({
	ticketId,
	contact,
	onContactInfoChange,
	onRefreshRequested,
}: DetailsBoxProps) => {
	const [syncing, startSyncTransition] = useTransition();

	return (
		<SectionWrapper>
			<CwInput
				id="name"
				value={contact.name ?? ""}
				onChange={(value) => onContactInfoChange({ ...contact, name: value })}
				label="Name:"
			/>
			<CwInput
				id="number"
				value={contact.number ?? ""}
				onChange={(value) => onContactInfoChange({ ...contact, number: value })}
				label="Number:"
			/>
			<CwButton
				disabled={syncing}
				onClick={() => {
					startSyncTransition(() => {
						onRefreshRequested();
					});
				}}
			>
				<RefreshCcw
					className={cn("size-3", {
						"animate-spin": syncing,
					})}
				/>
				Sync with PSA
			</CwButton>
		</SectionWrapper>
	);
};
