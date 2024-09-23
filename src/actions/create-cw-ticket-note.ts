"use server";
import { z } from "zod";
import { cwPost } from "~/actions/cw";
import { log } from "~/lib/debug";
import { actionClient } from "~/lib/safe-action";

const ZCreateCwTicketNotePayload = z.object({
	ticketId: z.number(),
	note: z.string(),
	memberIdentifier: z.string(),
});

export const createCwTicketNote = actionClient
	.schema(ZCreateCwTicketNotePayload)
	.action(async ({ parsedInput, ctx }) => {
		const { ticketId, note, memberIdentifier } = parsedInput;

		log("Creating ticket note with params: ", {
			ticketId,
			text: note,
			internalAnalysisFlag: true,
			member: {
				identifier: memberIdentifier,
			},
		});

		await cwPost(
			`/service/tickets/${ticketId}/notes`,
			JSON.stringify({
				text: note,
				internalAnalysisFlag: true,
				member: {
					identifier: memberIdentifier,
				},
			}),
		);
	});
