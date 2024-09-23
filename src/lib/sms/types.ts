

export interface SMSProvider {
    sendSms(contactNumber: string, message: string): Promise<void>;
}