import nodemailer from "nodemailer";

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

export const sendPasswordResetEmail = async ({ to, name, resetUrl }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn("Brevo SMTP is not configured. Skipping password reset email send.");
    return false;
  }

  const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
  const fromName = process.env.SMTP_FROM_NAME || "Trendify";

  await transporter.sendMail({
    from: `\"${fromName}\" <${fromEmail}>`,
    to,
    subject: "Reset your Trendify password",
    text: `Hi ${name || "there"},\n\nWe received a request to reset your password for Trendify. Use this link to set a new password:\n${resetUrl}\n\nThis link will expire in 1 hour. If you did not request a password reset, you can ignore this email.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #2f2f2f; background: #fff8f0; padding: 24px; border-radius: 16px;">
        <h2 style="margin: 0 0 16px; color: #ef6d6d;">Reset your Trendify password</h2>
        <p>Hi ${name || "there"},</p>
        <p>We received a request to reset the password for your Trendify account.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; background: #ef6d6d; color: #ffffff; text-decoration: none; padding: 12px 20px; border-radius: 999px; font-weight: 700;">
            Reset Password
          </a>
        </p>
        <p>If the button does not work, paste this URL into your browser:</p>
        <p style="word-break: break-all; color: #8a6f61;">${resetUrl}</p>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request this change, you can ignore this email.</p>
      </div>
    `,
  });

  return true;
};

export default sendPasswordResetEmail;
