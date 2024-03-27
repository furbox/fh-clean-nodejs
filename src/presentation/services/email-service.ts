import nodemailer, { Transporter } from 'nodemailer';

interface SendMailOptions {
    to: string | string[];
    subject: string;
    htmlBody: string;
    attachments?: Attachment[]
}

interface Attachment {
    filename: string;
    path: string;
}

export class EmailService {
    private transporter: Transporter;

    constructor(
        mailerService: string,
        mailerEmail: string,
        mailerSecretKey: string
    ) {
        this.transporter = nodemailer.createTransport({
            service: mailerService,
            auth: {
                user: mailerEmail,
                pass: mailerSecretKey
            }
        });
    }

    public async sendEmail(options: SendMailOptions) {
        const { to, subject, htmlBody, attachments } = options;
       try {
            const info = await this.transporter.sendMail({
                to,
                subject,
                html: htmlBody,
                attachments
            });
            console.log(`Email sent: ${info.response}`);
            return true;
        } catch (error) {
            console.error(`Failed to send email: ${error}`);
            return false;
        }
    }
}