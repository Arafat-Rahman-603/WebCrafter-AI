import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendVerificationEmail = async (email, verificationCode) => {
    try {
        const mailOptions = {
            from: `"Webcrafter AI" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Verify your email address",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Email Verification</h2>
                    <p>Thank you for signing up! Please use the following code to verify your email address. This code is valid for 15 minutes.</p>
                    <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
                        ${verificationCode}
                    </div>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Verification email sent:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Could not send verification email");
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        const mailOptions = {
            from: `"Webcrafter AI" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Welcome to Webcrafter AI!",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Welcome, ${name}!</h2>
                    <p>We are thrilled to have you on board. Get ready to explore all the features we have to offer.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
};

export const sendPasswordResetEmail = async (email, resetUrl) => {
    try {
        const mailOptions = {
            from: `"Webcrafter AI" <${process.env.SMTP_USER}>`,
            to: email,
            subject: "Reset your password",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Password Reset Request</h2>
                    <p>We received a request to reset your password. Click the button below to choose a new one:</p>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    </div>
                    <p style="margin-top: 20px; font-size: 12px; color: #777;">If you didn't request a password reset, you can safely ignore this email.</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending password reset email:", error);
        throw new Error("Could not send password reset email");
    }
};
