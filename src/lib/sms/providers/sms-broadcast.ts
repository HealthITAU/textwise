import { env } from "~/env";
import type { SMSProvider } from "./../types";

export class SMSBroadcastProvider implements SMSProvider {
    async sendSms(contactNumber: string, message: string): Promise<void> {
        await fetch(
            `https://api.smsbroadcast.com.au/api.php?username=${env.SMSBROADCAST_USERNAME}&password=${env.SMSBROADCAST_PASSWORD}&from=${env.SMSBROADCAST_FROM}&to=${contactNumber}&message=${message}`,
            {
                method: "POST",
            }
        );
    }
}