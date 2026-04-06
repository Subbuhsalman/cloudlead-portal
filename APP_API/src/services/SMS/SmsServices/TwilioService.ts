const twilio = require('twilio');

interface TwilioData {
    accountSid: string,
    authToken: string,
    serviceSid: string
}


export class TwilioService {
    private client: any;
    private serviceSid: string;
    constructor({ accountSid, authToken, serviceSid }: TwilioData) {
        this.client = twilio(accountSid, authToken);
        this.serviceSid = serviceSid;
    }

    /**
     * Sends an SMS verification
     * @param {string} to - The recipient's phone number.
     * @returns {Promise<object>} - The verification response.
     */
    async sendVerification(to:string, code:number, channel: string = "sms"): Promise<any> {
        try {
            console.log("to", to)
            console.log("this.serviceSid", this.serviceSid)
            console.log("channel", channel)
            const verification = await this.client.verify.v2.services(this.serviceSid)
                .verifications
                .create({ to: to, channel: channel, code: code })
            return verification;
        } catch (error) {
            console.log("error", error)
            throw `Failed to send SMS verification: ${error.message}`;
        }
    }

    async validateOtp(to: string, code: number): Promise<any> {
        try {
            console.log("to", to);
            console.log("code", code)
            console.log("this.serviceSid", this.serviceSid);

            const verificationCheck = await this.client.verify.v2.services(this.serviceSid)
                .verificationChecks
                .create({ to, code: code.toString() });

            return verificationCheck;
        } catch (error) {
            console.log("error", error)
            throw new Error(`Failed to validate OTP: ${error.message}`);
        }
    }
}

