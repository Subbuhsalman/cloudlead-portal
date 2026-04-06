import nodemailer, { Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

interface Mailbox {
    email_address: string;
    from_name?: string;
}

interface EmailOptions {
    html: string;
    fromName: string;
    subject: string;
    recipients: string[];
}

class SendEmail {
    private smtpConfig: {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    };
    private fromName: string;

    constructor(smtpConfig) {
        this.smtpConfig = smtpConfig
        this.fromName = process.env.SMTP_FROM_NAME || 'Default Sender';
    }



    private createTransporter(): Transporter {
        console.log("this.smtpConfig", this.smtpConfig)
        return nodemailer.createTransport(this.smtpConfig);
    }



    public async sendEmail(data: Mail.Options | any): Promise<void> {

        // console.log("datadatadatadatadata", data)
        const transporter = this.createTransporter();

        const mailOptions:Mail.Options = {
            from: `${data?.from || this.fromName} <${this.smtpConfig.auth.user}>`,
            to: data?.to,
            cc:data?.cc,
            bcc:data?.bcc,
            subject: data?.subject,
            html: data?.html,
        };

        try {
            const info:any = await transporter.sendMail(mailOptions);

            return info
            console.log('Email  sent info:', info);
            console.log('Email sent:', info.response);

            // https://www.mailersend.com/blog/smtp-codes
            const responseCodes = {
                214:{title:'Help message',message:'A response to the HELP command that usually includes a link or URL to the FAQ page.'},
                220:{title:'SMTP Service ready',message:'The receiving server is ready for the next command.'},
                221:{title:'Service closing transmission channel',message:'The receiving server is closing the SMTP connection.'},
                235:{title:'2.7.0 Authentication succeeded',message:'The sending server’s authentication is successful.'},
                250:{title:'Requested mail action okay, completed',message:'Success! The email was delivered.'},
                251:{title:'User not local; will forward to <forward-path>',message:'The receiving server doesn’t recognize the recipient but it will forward it to another email address.'},
                252:{title:'Cannot VRFY user, but will accept message and attempt delivery',message:'The receiving server doesn’t recognize the recipient but it will try to deliver the email anyway.'},
                334:{title:'Reponse to email authentication AUTH command when the authentication method is accepted',message:'Authentication has been successful.'},
                354:{title:'Start mail input',message:'The email “header” has been received, the server is now waiting for the “body” of the message.'},
                421:{title:'Service not available, closing transmission channel',message:'The receiving server or sending server is not reachable but another mail delivery will be attempted. If you are using a remote server like MailerSends SMTP relay to send emails, test that you can connect to it successfully. Otherwise, you may wish to check the receiving servers availability.'},
                
                
            }

            
        } catch (error: any) {
            console.error('Error sending email:', error);
            throw new Error(`Failed to send email: ${error.message}`);
        }
    }
    public async verifySMTP() {
        const transporter = this.createTransporter();
      
        try {
          await transporter.verify();
          console.log('SMTP connection verified successfully');
          return { success: true };
        } catch (error) {
          console.error('SMTP verification failed:', error);
          return { 
            success: false,
            error: error.message
          };
        }
      }
}

export default SendEmail;
