import { SMSBroadcastProvider, TwilioProvider } from "~/lib/sms/providers";

import { env } from "~/env";
import type { SMSProvider } from "~/lib/sms/types";

export const getSMSProvider = (): SMSProvider => {
    switch (env.SMS_PROVIDER) {
        case "twilio":
            return new TwilioProvider();
        case "smsbroadcast":
            return new SMSBroadcastProvider();
        default:
            throw new Error("Invalid SMS provider in environment variables");
    }
}
