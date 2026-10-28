const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");

/**
 * Create Nodemailer SMTP transporter for Gmail
 */
const createTransporter = () => {
  const user = process.env.SMTP_USER || "sarojintermiles@gmail.com";
  const pass = (process.env.SMTP_PASS || "ksgunttlmvlcsyvf").replace(/\s+/g, "");

  return nodemailer.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 465,
    secure: true,
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Send 6-digit OTP verification email
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} options.code - 6-digit OTP
 * @param {string} [options.name] - User's first name
 */
const sendOtpEmail = async ({ to, code, name = "Collector" }) => {
  const transporter = createTransporter();
  const fromName = process.env.SMTP_FROM_NAME || "Art & Culture";
  const fromEmail = process.env.SMTP_FROM_EMAIL || "sarojintermiles@gmail.com";

  const logoPath = path.join(__dirname, "../assets/logo.png");
  const hasLogo = fs.existsSync(logoPath);

  const attachments = [];
  if (hasLogo) {
    attachments.push({
      filename: "art-and-culture-logo.png",
      path: logoPath,
      cid: "artCultureLogo",
    });
  }

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Verification Code</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f8f4ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2c2219;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8f4ee; padding: 40px 15px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width: 560px; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(74, 40, 14, 0.08); border: 1px solid #ebd9c4;">
            <!-- Header with Attached Logo -->
            <tr>
              <td style="padding: 30px 40px 24px; text-align: center; background: linear-gradient(135deg, #8a5524 0%, #5a3516 45%, #2b1708 100%);">
                ${
                  hasLogo
                    ? `<img src="cid:artCultureLogo" alt="Art &amp; Culture Logo" style="max-height: 72px; width: auto; max-width: 220px; display: block; margin: 0 auto 12px;" />`
                    : ""
                }
                <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Art &amp; Culture</h1>
                <p style="margin: 6px 0 0; color: #e8b155; font-size: 12.5px; letter-spacing: 1px; text-transform: uppercase;">Discover Art. Celebrate Culture.</p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding: 36px 40px 30px;">
                <h2 style="margin: 0 0 16px; font-size: 20px; color: #2e261e; font-weight: 700;">Password Reset Verification</h2>
                <p style="margin: 0 0 18px; font-size: 15px; line-height: 1.6; color: #5a4b3d;">
                  Namaste <strong>${name}</strong>,
                </p>
                <p style="margin: 0 0 24px; font-size: 14.5px; line-height: 1.6; color: #5a4b3d;">
                  We received a request to reset the password for your Art &amp; Culture account. Use the following 6-digit verification code to complete your password reset:
                </p>

                <!-- OTP Box -->
                <div style="text-align: center; margin: 28px 0;">
                  <div style="display: inline-block; padding: 18px 36px; background: #fffaf2; border: 2px dashed #d08a24; border-radius: 14px;">
                    <span style="font-size: 34px; font-weight: 800; color: #d08a24; letter-spacing: 10px; font-family: 'Courier New', Courier, monospace;">${code}</span>
                  </div>
                </div>

                <p style="margin: 0 0 12px; font-size: 13.5px; line-height: 1.5; color: #8c7662; text-align: center;">
                  ⏳ This verification code will expire in <strong>10 minutes</strong>.
                </p>
                <p style="margin: 0 0 24px; font-size: 13px; line-height: 1.5; color: #a43a2a; text-align: center; background: #fdf5f5; padding: 10px; border-radius: 8px; border: 1px solid #f9dede;">
                  If you did not request this code, you can safely ignore this email. Your account remains secure.
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding: 0 40px;">
                <hr style="border: none; border-top: 1px solid #f1e4d3; margin: 0;">
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding: 24px 40px 30px; text-align: center; background-color: #faf6f0;">
                <p style="margin: 0 0 6px; font-size: 12.5px; color: #7b6f63;">
                  Art &amp; Culture Heritage Portal · Handcrafted Treasures of India
                </p>
                <p style="margin: 0; font-size: 11.5px; color: #9c8e80;">
                  &copy; ${new Date().getFullYear()} Art &amp; Culture. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject: `${code} is your Art & Culture verification code`,
    text: `Namaste ${name},\n\nYour 6-digit verification code to reset your Art & Culture account password is: ${code}\n\nThis code is valid for 10 minutes.\n\nIf you did not request this, please ignore this email.`,
    html: htmlContent,
    attachments,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  createTransporter,
  sendOtpEmail,
};
