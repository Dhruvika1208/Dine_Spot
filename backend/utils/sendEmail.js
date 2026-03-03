const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {
    try {
        console.log(`Email Service: Attempting to send to ${options.email}`);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const message = {
            from: `"DineSpot Reservations" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.message,
            attachments: options.attachments || []
        };

        const info = await transporter.sendMail(message);
        console.log(`Email Service: SUCCESS. MessageId: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error(`Email Service: FAILURE. Detail: ${error.message}`);
        // Instead of returning false, throw so controller handles it
        throw new Error(`Email failed: ${error.message}`);
    }
};

