"use server";

import { z } from "zod";
import { env } from "~/env";
import { actionClient } from "~/lib/safe-action";
import { getSMSProvider } from "~/lib/sms/utils";

const ZBaseSmsPayload = z.object({
	ticketId: z.number(),
	contactName: z.string(),
	contactNumber: z.string(),
});

const ZSmsPayload = z.discriminatedUnion("type", [
	ZBaseSmsPayload.extend({
		type: z.literal("auth"),
		message: z
			.string()
			.transform((code) => env.SMS_AUTH_MSG.replace("{code}", code)),
	}),
	ZBaseSmsPayload.extend({
		type: z.literal("msg"),
		message: z.string(),
	}),
]);

export const sendSms = actionClient
	.schema(ZSmsPayload)
	.action(async ({ parsedInput, ctx }) => {
		const { contactNumber, message, ticketId, contactName } = parsedInput;
		const provider = getSMSProvider();
		await provider.sendSms(contactNumber, message);
	});
