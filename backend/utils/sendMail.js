import nodemailer from "nodemailer"

export const sendMail = async (options) => {
    try {
        console.log("Creating transporter with config:", {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: process.env.SMTP_SERVICE,
            user: process.env.SMTP_MAIL
        });

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            secure: true // Add this for SSL
        });

        // Verify transporter configuration
        await transporter.verify();
        console.log("Transporter verified successfully");

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">New Contact Form Submission</h2>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                        <p><strong>Message:</strong></p>
                        <p>${options.message}</p>
                        <p><strong>From:</strong> ${options.userEmail}</p>
                    </div>
                </div>
            `
        };

        console.log("Attempting to send email with options:", {
            from: mailOptions.from,
            to: mailOptions.to,
            subject: mailOptions.subject
        });

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("Detailed error sending email:", {
            message: error.message,
            stack: error.stack,
            code: error.code
        });
        throw error;
    }
}