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
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #0a0f1e; color: #e2e8f0; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);">
            <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">WebCrafter <span style="color: rgba(255,255,255,0.8);">AI</span></h1>
            </div>
            <div style="padding: 40px 30px; text-align: left;">
              <h2 style="color: #ffffff; margin-top: 0; font-size: 22px;">Verify Your Email</h2>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Thank you for joining WebCrafter AI! To complete your registration, please use the verification code below. This code will expire in 15 minutes.</p>
              <div style="background-color: #0a0f1e; border: 1px solid #3b82f6; border-radius: 12px; padding: 24px; text-align: center;">
                <span style="font-family: monospace; font-size: 36px; font-weight: bold; color: #60a5fa; letter-spacing: 12px; display: inline-block; margin-left: 12px;">${verificationCode}</span>
              </div>
            </div>
            <div style="padding: 20px 30px; background-color: #0d1117; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">© ${new Date().getFullYear()} WebCrafter AI. All rights reserved.</p>
            </div>
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
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #0a0f1e; color: #e2e8f0; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);">
            <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">WebCrafter <span style="color: rgba(255,255,255,0.8);">AI</span></h1>
            </div>
            <div style="padding: 40px 30px; text-align: left;">
              <h2 style="color: #ffffff; margin-top: 0; font-size: 22px;">Welcome aboard, ${name}! 🚀</h2>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">We are thrilled to have you on board. You're now ready to craft stunning, AI-generated websites in seconds.</p>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">Get started by describing your dream website and watch the magic happen.</p>
              <div style="text-align: center;">
                <a href="https://webcrafter-ai.vercel.app/generate" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #7c3aed); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">Start Crafting</a>
              </div>
            </div>
            <div style="padding: 20px 30px; background-color: #0d1117; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">© ${new Date().getFullYear()} WebCrafter AI. All rights reserved.</p>
            </div>
          </div>
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
        <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #0a0f1e; color: #e2e8f0; padding: 40px 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #0f172a; border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);">
            <div style="background: linear-gradient(135deg, #2563eb, #7c3aed); padding: 30px 20px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">WebCrafter <span style="color: rgba(255,255,255,0.8);">AI</span></h1>
            </div>
            <div style="padding: 40px 30px; text-align: left;">
              <h2 style="color: #ffffff; margin-top: 0; font-size: 22px;">Reset Your Password</h2>
              <p style="color: #94a3b8; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">We received a request to reset your WebCrafter AI password. Click the button below to choose a new one:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #7c3aed); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px;">Reset Password</a>
              </div>
              <p style="margin-top: 30px; font-size: 13px; color: #64748b;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
            </div>
            <div style="padding: 20px 30px; background-color: #0d1117; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b;">© ${new Date().getFullYear()} WebCrafter AI. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Could not send password reset email");
  }
};
