"use server";
import { z } from "zod";
import { env } from "~/env";
import { log } from "~/lib/debug";
import { actionClient } from "~/lib/safe-action";
import { getCwm } from "~/server/cw";

const ZCreateCwTicketNotePayload = z.object({
	ticketId: z.number(),
	note: z.string(),
	memberIdentifier: z.string(),
});

export const createCwTicketNote = actionClient
	.schema(ZCreateCwTicketNotePayload)
	.action(async ({ parsedInput, ctx }) => {
		if (!env.POST_BACK_TO_CW) {
			log("Skipping createCwTicketNote because POST_BACK_TO_CW is false");
			return;
		}
		const { ticketId, note, memberIdentifier } = parsedInput;

		const cwm = getCwm();

		log("Creating ticket note with params: ", {
			ticketId,
			text: note,
			internalAnalysisFlag: true,
			member: {
				identifier: memberIdentifier,
			},
		});

		await cwm.ServiceAPI.postServiceTicketsByParentIdNotes(ticketId, {
			ticketId,
			text: note,
			internalAnalysisFlag: true,
			member: {
				identifier: memberIdentifier,
			},
		});
	});
