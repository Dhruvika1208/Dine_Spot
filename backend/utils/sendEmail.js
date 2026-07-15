const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {
    try {
        console.log(`Email Service: Attempting to send to ${options.email}`);

        const host = process.env.SMTP_HOST;
        const port = parseInt(process.env.SMTP_PORT || '587', 10);
        const user = process.env.SMTP_USER || process.env.SMTP_EMAIL || process.env.EMAIL_USER;
        const pass = process.env.SMTP_PASS || process.env.SMTP_PASSWORD || process.env.EMAIL_PASS;
        const fromEmail = process.env.FROM_EMAIL || process.env.EMAIL_FROM || user;
        const fromName = process.env.FROM_NAME || "DineSpot Reservations";

        if (user === 'your_email' || pass === 'your_password' || !user || !pass) {
            const warnMsg = 'Email settings in backend/.env are configured with default placeholders ("your_email", "your_password"). Please replace them with actual SMTP/Gmail credentials to enable email delivery.';
            console.warn(`Email Service CONFIG WARNING: ${warnMsg}`);
            throw new Error(warnMsg);
        }

        let transportConfig;
        if (host) {
            transportConfig = {
                host,
                port,
                secure: port === 465,
                auth: { user, pass },
                tls: {
                    rejectUnauthorized: false
                }
            };
        } else {
            transportConfig = {
                service: "gmail",
                auth: { user, pass }
            };
        }

        const transporter = nodemailer.createTransport(transportConfig);

        const message = {
            from: `"${fromName}" <${fromEmail}>`,
            to: options.email,
            subject: options.subject,
            html: options.message,
            attachments: options.attachments || []
        };

        const info = await transporter.sendMail(message);
        console.log(`Email Service: SUCCESS. MessageId: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Email Service Error Details:', error);
        throw new Error(`Email failed: ${error.message}`);
    }
};

