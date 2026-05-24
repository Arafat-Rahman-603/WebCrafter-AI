import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// ==========================
// TRANSPORTER
// ==========================
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4, // Force IPv4 — fixes ENETUNREACH on Render
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  // Prevent timeout issues on Render
  connectionTimeout: 60000,
  greetingTimeout: 30000,
  socketTimeout: 60000,

  tls: {
    rejectUnauthorized: false,
  },
});

// Check SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP ERROR:", error);
  } else {
    console.log("SMTP SERVER READY");
  }
});

// ==========================
// SEND VERIFICATION EMAIL
// ==========================
export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const mailOptions = {
      from: `"WebCrafter AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email address",

      html: `
        <div style="font-family: Inter, Arial, sans-serif; background:#0a0f1e; padding:40px 20px; color:#e2e8f0;">
          <div style="max-width:600px; margin:auto; background:#0f172a; border-radius:20px; overflow:hidden; border:1px solid rgba(255,255,255,0.1);">
            
            <div style="padding:30px; text-align:center; background:linear-gradient(135deg,#2563eb,#7c3aed);">
              <h1 style="margin:0; color:white;">
                WebCrafter AI
              </h1>
            </div>

            <div style="padding:40px 30px;">
              <h2 style="color:white;">
                Verify Your Email
              </h2>

              <p style="color:#94a3b8; line-height:1.7;">
                Thanks for joining WebCrafter AI.
                Use the verification code below to verify your account.
              </p>

              <div style="margin:30px 0; text-align:center;">
                <div style="
                  display:inline-block;
                  padding:20px 30px;
                  border-radius:12px;
                  background:#0a0f1e;
                  border:1px solid #3b82f6;
                  font-size:36px;
                  letter-spacing:10px;
                  font-weight:bold;
                  color:#60a5fa;
                  font-family:monospace;
                ">
                  ${verificationCode}
                </div>
              </div>

              <p style="color:#64748b; font-size:13px;">
                This code will expire in 15 minutes.
              </p>
            </div>

            <div style="
              padding:20px;
              text-align:center;
              border-top:1px solid rgba(255,255,255,0.05);
              background:#0d1117;
            ">
              <p style="margin:0; font-size:12px; color:#64748b;">
                © ${new Date().getFullYear()} WebCrafter AI
              </p>
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

// ==========================
// SEND WELCOME EMAIL
// ==========================
export const sendWelcomeEmail = async (email, name) => {
  try {
    const mailOptions = {
      from: `"WebCrafter AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to WebCrafter AI!",

      html: `
        <div style="font-family: Inter, Arial, sans-serif; background:#0a0f1e; padding:40px 20px; color:#e2e8f0;">
          <div style="max-width:600px; margin:auto; background:#0f172a; border-radius:20px; overflow:hidden; border:1px solid rgba(255,255,255,0.1);">

            <div style="padding:30px; text-align:center; background:linear-gradient(135deg,#2563eb,#7c3aed);">
              <h1 style="margin:0; color:white;">
                Welcome to WebCrafter AI 🚀
              </h1>
            </div>

            <div style="padding:40px 30px;">
              <h2 style="color:white;">
                Hello ${name},
              </h2>

              <p style="color:#94a3b8; line-height:1.7;">
                Your account has been successfully verified.
              </p>

              <p style="color:#94a3b8; line-height:1.7;">
                Start building beautiful AI-powered websites now.
              </p>

              <div style="margin-top:30px;">
                <a
                  href="https://webcrafter-ai.vercel.app/generate"
                  style="
                    display:inline-block;
                    padding:14px 28px;
                    border-radius:10px;
                    background:linear-gradient(135deg,#2563eb,#7c3aed);
                    color:white;
                    text-decoration:none;
                    font-weight:bold;
                  "
                >
                  Start Crafting
                </a>
              </div>
            </div>

            <div style="
              padding:20px;
              text-align:center;
              border-top:1px solid rgba(255,255,255,0.05);
              background:#0d1117;
            ">
              <p style="margin:0; font-size:12px; color:#64748b;">
                © ${new Date().getFullYear()} WebCrafter AI
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    throw new Error("Could not send welcome email");
  }
};

// ==========================
// PASSWORD RESET EMAIL
// ==========================
export const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const mailOptions = {
      from: `"WebCrafter AI" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Reset your password",

      html: `
        <div style="font-family: Inter, Arial, sans-serif; background:#0a0f1e; padding:40px 20px; color:#e2e8f0;">
          <div style="max-width:600px; margin:auto; background:#0f172a; border-radius:20px; overflow:hidden; border:1px solid rgba(255,255,255,0.1);">

            <div style="padding:30px; text-align:center; background:linear-gradient(135deg,#2563eb,#7c3aed);">
              <h1 style="margin:0; color:white;">
                Reset Password
              </h1>
            </div>

            <div style="padding:40px 30px;">
              <h2 style="color:white;">
                Password Reset Request
              </h2>

              <p style="color:#94a3b8; line-height:1.7;">
                We received a request to reset your WebCrafter AI password.
                Click the button below to set a new password.
              </p>

              <div style="margin-top:30px;">
                <a
                  href="${resetUrl}"
                  style="
                    display:inline-block;
                    padding:14px 28px;
                    border-radius:10px;
                    background:linear-gradient(135deg,#2563eb,#7c3aed);
                    color:white;
                    text-decoration:none;
                    font-weight:bold;
                  "
                >
                  Reset Password
                </a>
              </div>

              <p style="color:#64748b; font-size:13px; margin-top:30px;">
                This link will expire in 1 hour. If you did not request a password reset, please ignore this email.
              </p>
            </div>

            <div style="
              padding:20px;
              text-align:center;
              border-top:1px solid rgba(255,255,255,0.05);
              background:#0d1117;
            ">
              <p style="margin:0; font-size:12px; color:#64748b;">
                © ${new Date().getFullYear()} WebCrafter AI
              </p>
            </div>
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Could not send password reset email");
  }
};
