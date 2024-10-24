import { env } from "~/env";
import type { SMSProvider } from "../types";

export class CellcastProvider implements SMSProvider {
    async sendSms(contactNumber: string, message: string): Promise<void> {
        await fetch(
            `https://cellcast.com.au/api/v3/send-sms`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "APPKEY": `${env.CELLCAST_APPKEY}`
                },
                body: JSON.stringify({
                    "sms_text": `${message}`,
                    "numbers": [`${contactNumber}`]
                    
                })
            }
        )
    }
}