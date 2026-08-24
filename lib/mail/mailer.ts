import nodemailer from "nodemailer";

const smtpHost = process.env.MAIL_HOST || "smtp.gmail.com";
const smtpPort = parseInt(process.env.MAIL_PORT || "587");
const smtpUser = process.env.MAIL_USERNAME || "truckmitrofficial@gmail.com";
const smtpPass = process.env.MAIL_PASSWORD || "hzxzbdyuunlmdpko";
const fromEmail = process.env.MAIL_FROM_ADDRESS || "truckmitrofficial@gmail.com";
const fromName = process.env.MAIL_FROM_NAME || "TruckMitr Exchange";

const transporter = nodemailer.createTransport({
  host: smtpHost,
  port: smtpPort,
  secure: false, // TLS
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * Sends Email Verification Magic Link after registration.
 */
export async function sendVerificationEmail(
  toEmail: string,
  userName: string,
  token: string,
): Promise<boolean> {
  const verifyUrl = `${APP_URL}/auth/verify-email?token=${token}&email=${encodeURIComponent(toEmail)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg: 8px;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">Welcome to TruckMitr Exchange, ${userName}!</h2>
      <p style="color: #475569; font-size: 15px; line-height: 1.5;">
        Thank you for creating an account. Please click the button below to verify your email address and complete your registration.
      </p>
      <div style="margin: 28px 0; text-align: center;">
        <a href="${verifyUrl}" style="background-color: #ea580c; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Verify Email & Sign In
        </a>
      </div>
      <p style="color: #64748b; font-size: 13px;">
        Or copy and paste this link into your browser: <br/>
        <a href="${verifyUrl}" style="color: #ea580c;">${verifyUrl}</a>
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject: "Verify your email address - TruckMitr Exchange",
      html,
    });
    return true;
  } catch (err) {
    console.error("Failed to send verification email:", err);
    return false;
  }
}

/**
 * Sends Login Magic Link to email.
 */
export async function sendMagicLinkEmail(
  toEmail: string,
  token: string,
): Promise<boolean> {
  const magicUrl = `${APP_URL}/auth/verify-email?token=${token}&type=magic&email=${encodeURIComponent(toEmail)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg: 8px;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">Sign in to TruckMitr Exchange</h2>
      <p style="color: #475569; font-size: 15px; line-height: 1.5;">
        Click the button below to log in directly to your account. This magic link expires in 15 minutes.
      </p>
      <div style="margin: 28px 0; text-align: center;">
        <a href="${magicUrl}" style="background-color: #ea580c; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Sign In Instantly
        </a>
      </div>
      <p style="color: #64748b; font-size: 13px;">
        Or copy and paste this link into your browser: <br/>
        <a href="${magicUrl}" style="color: #ea580c;">${magicUrl}</a>
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject: "Your Magic Sign In Link - TruckMitr Exchange",
      html,
    });
    return true;
  } catch (err) {
    console.error("Failed to send magic link email:", err);
    return false;
  }
}

/**
 * Sends Password Reset Magic Link to email.
 */
export async function sendForgotPasswordEmail(
  toEmail: string,
  token: string,
): Promise<boolean> {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}&email=${encodeURIComponent(toEmail)}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded-lg: 8px;">
      <h2 style="color: #0f172a; margin-bottom: 8px;">Reset Your Password</h2>
      <p style="color: #475569; font-size: 15px; line-height: 1.5;">
        We received a request to reset your password on TruckMitr Exchange. Click the button below to create a new password.
      </p>
      <div style="margin: 28px 0; text-align: center;">
        <a href="${resetUrl}" style="background-color: #ea580c; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #64748b; font-size: 13px;">
        Or copy and paste this link into your browser: <br/>
        <a href="${resetUrl}" style="color: #ea580c;">${resetUrl}</a>
      </p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to: toEmail,
      subject: "Reset your password - TruckMitr Exchange",
      html,
    });
    return true;
  } catch (err) {
    console.error("Failed to send forgot password email:", err);
    return false;
  }
}
