import nodemailer from 'nodemailer';
import { EmailOptions } from './types';
import { basename } from 'path';
import fs from 'fs';
import mime from 'mime-types';
import { renderAsync } from "@react-email/render";

export class SMTPClient {
    private transporter: nodemailer.Transporter;

    constructor(apiKey: string) {
        this.transporter = nodemailer.createTransport({
            host: 'mail.shoutbox.net',
            port: 587,
            secure: false, // Use STARTTLS
            auth: {
                user: 'shoutbox',
                pass: apiKey
            },
            tls: {
                rejectUnauthorized: true
            }
        });
    }

    public async sendEmail(options: EmailOptions): Promise<void> {
        try {
            // Handle React components
            if (options.react) {
                options.html = await renderAsync(options.react);
            }

            // Process attachments
            const attachments = [];
            for (const attachment of options.attachments || []) {
                const content = attachment.content || await fs.promises.readFile(attachment.filepath);
                const filename = attachment.filename || basename(attachment.filepath);
                const contentType = attachment.contentType || mime.lookup(filename) || 'application/octet-stream';

                attachments.push({
                    filename,
                    content: typeof content === 'string' ? Buffer.from(content, 'base64') : content,
                    contentType
                });
            }

            // Prepare email data
            const mailOptions = {
                from: options.name ? `${options.name} <${options.from}>` : options.from,
                to: Array.isArray(options.to) ? options.to.join(', ') : options.to,
                cc: options.cc ? (Array.isArray(options.cc) ? options.cc.join(', ') : options.cc) : undefined,
                subject: options.subject,
                html: options.html,
                text: options.text || (options.html ? this.stripHtml(options.html) : undefined),
                replyTo: options.replyTo,
                attachments,
                headers: options.headers || {},
            };

            // Send email
            await this.transporter.sendMail(mailOptions);

        } catch (error) {
            console.error('SMTP Error:', error);
            throw error;
        }
    }

    public async sendEmails(options: EmailOptions[]): Promise<void[]> {
        return Promise.all(options.map(option => this.sendEmail(option)));
    }

    private stripHtml(html: string): string {
        return html.replace(/<[^>]*>/g, '');
    }

    public async verifyConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            return true;
        } catch (error) {
            console.error('SMTP Connection Error:', error);
            return false;
        }
    }
}
