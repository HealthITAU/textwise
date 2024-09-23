import twilio from 'twilio'
import { env } from "~/env";
import type { SMSProvider } from "./../types";

export class TwilioProvider implements SMSProvider {
    async sendSms(contactNumber: string, message: string): Promise<void> {
        if (
            !env.TWILIO_ACCOUNT_SID ||
            !env.TWILIO_AUTH_TOKEN ||
            !env.TWILIO_PHONE_NUMBER
        ) {
            throw new Error('Twilio credentials are not set');
        }

        const twilioClient = twilio(
            env.TWILIO_ACCOUNT_SID!,
            env.TWILIO_AUTH_TOKEN!,
        );
        await twilioClient.messages.create({
            body: message,
            from: env.TWILIO_PHONE_NUMBER!,
            to: contactNumber,
        });
    }
}
