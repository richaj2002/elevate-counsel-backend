import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const sendEmail = async (to, subject, templatePath, replacements) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        // Read the HTML template file
        const template = fs.readFileSync(path.join(templatePath), 'utf8');

        // Replace placeholders with actual values
        let html = template;
        for (const key in replacements) {
            html = html.replace(new RegExp(`{{${key}}}`, 'g'), replacements[key]);
        }

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Your Name" <your-email@example.com>',
            to,
            subject,
            html,
        });

        console.log('Message sent: %s', info.messageId);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export default sendEmail;
