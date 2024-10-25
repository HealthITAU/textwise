import { env } from "~/env";
import type { SMSProvider } from "./../types";

export class ClicksendProvider implements SMSProvider {
    async sendSms(contactNumber: string, message: string): Promise<void> {
        const apiUsername = env.CLICKSEND_USERNAME;
        const apiPassword = env.CLICKSEND_PASSWORD;
        const fromNumber = env.CLICKSEND_FROM|| "";

        const messagePayload: any = {
            body: message,
            to: contactNumber,
            source: "TextWise"
        };

        if (fromNumber) {
            messagePayload.from = fromNumber;
        }

        const body = JSON.stringify({
            messages: [messagePayload]
        });

        const response = await fetch('https://rest.clicksend.com/v3/sms/send', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${btoa(`${apiUsername}:${apiPassword}`)}`,
                'Content-Type': 'application/json'
            },
            body: body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
}