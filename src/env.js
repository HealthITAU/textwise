import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		NODE_ENV: z
			.enum(["development", "test", "production"])
			.default("development"),
		POST_BACK_TO_CW: z
			.string()
			.transform((s) => s !== "false" && s !== "0")
			.default("false"),
		CW_COMPANY_NAME: z.string().optional().nullish(),
		CW_CLIENT_ID: z.string(),
		CW_COMPANY_URL: z.string().optional().nullish(),
		CW_PUBLIC_KEY: z.string().optional().nullish(),
		CW_PRIVATE_KEY: z.string().optional().nullish(),
		CW_CODE_BASE: z.string().optional().nullish(),
		SMS_AUTH_MSG: z.string(),
		SMS_PROVIDER: z.enum(["twilio", "smsbroadcast"]).default("smsbroadcast"),
		TWILIO_ACCOUNT_SID: z.string().optional().nullish(),
		TWILIO_AUTH_TOKEN: z.string().optional().nullish(),
		TWILIO_PHONE_NUMBER: z.string().optional().nullish(),
		SMSBROADCAST_USERNAME: z.string().optional().nullish(),
		SMSBROADCAST_PASSWORD: z.string().optional().nullish(),
		SMSBROADCAST_FROM: z.string().optional().nullish(),
	},
	client: {
		NEXT_PUBLIC_DEBUG_LOGGING: z
			.string()
			.transform((s) => s !== "false" && s !== "0")
			.default("false"),
		NEXT_PUBLIC_DISABLE_COOLDOWNS: z
			.string()
			.transform((s) => s !== "false" && s !== "0")
			.default("false"),
		NEXT_PUBLIC_COOLDOWN_TIMER: z
			.string()
			// transform to number
			.transform((s) => Number.parseInt(s, 10))
			// make sure transform worked
			.pipe(z.number()),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_DEBUG_LOGGING: process.env.NEXT_PUBLIC_DEBUG,
		NEXT_PUBLIC_DISABLE_COOLDOWNS: process.env.NEXT_PUBLIC_DISABLE_COOLDOWNS,
		NEXT_PUBLIC_COOLDOWN_TIMER: process.env.NEXT_PUBLIC_COOLDOWN_TIMER,
	},
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	emptyStringAsUndefined: true,
});
