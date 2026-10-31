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
 * Public hosted logo URL for 100% reliable Gmail & mobile client rendering
 */
const BRAND_LOGO_URL =
  process.env.BRAND_LOGO_URL || "https://files.catbox.moe/i3r6s6.png";

/**
 * Common inline logo attachment using CID (Content-ID) for Gmail
 */
const getLogoAttachment = () => {
  const logoPath = path.join(__dirname, "../assets/logo.png");
  if (fs.existsSync(logoPath)) {
    return [
      {
        filename: "art-and-culture-logo.png",
        path: logoPath,
        cid: "artCultureLogo",
        contentType: "image/png",
        contentDisposition: "inline",
      },
    ];
  }
  return [];
};

/**
 * Format currency in Indian Rupees
 */
const formatINR = (amount) => {
  const num = Number(amount) || 0;
  return `₹${num.toLocaleString("en-IN")}`;
};

/**
 * Base email layout wrapper with luxury styling & brand header
 */
const wrapEmailTemplate = ({
  title,
  preheader = "Art & Culture Heritage Collections",
  eyebrow = "HANDCRAFTED TREASURES OF INDIA",
  heading,
  subheading,
  bodyContent,
}) => {
  const year = new Date().getFullYear();
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${title}</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f7f3ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #2e261e; }
    @media screen and (max-width: 600px) {
      .email-container { width: 100% !important; margin: auto !important; }
      .fluid { max-width: 100% !important; height: auto !important; margin-left: auto !important; margin-right: auto !important; }
      .stack-column { display: block !important; width: 100% !important; max-width: 100% !important; direction: ltr !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f7f3ed; -webkit-font-smoothing: antialiased;">
  <!-- Hidden preheader text for preview -->
  <div style="display: none; font-size: 1px; color: #f7f3ed; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${preheader}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f7f3ed; padding: 35px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width: 600px; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 12px 36px rgba(59, 35, 16, 0.08); border: 1px solid #ebdcc8;">
          
          <!-- ================= HEADER WITH BRAND LOGO ================= -->
          <tr>
            <td align="center" style="padding: 36px 30px 30px; background: linear-gradient(135deg, #8a5524 0%, #523114 55%, #241407 100%); text-align: center;">
              <!-- Brand Logo (Direct HTTPS with luxury gold badge for 100% Gmail clarity) -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 16px;">
                <tr>
                  <td align="center" style="background-color: rgba(255, 255, 255, 0.08); padding: 8px 18px; border-radius: 14px; border: 1px solid rgba(232, 177, 85, 0.35); text-align: center;">
                    <a href="${clientUrl}" target="_blank" style="text-decoration: none; display: block;">
                      <img
                        src="${BRAND_LOGO_URL}"
                        alt="Art &amp; Culture"
                        width="120"
                        height="120"
                        border="0"
                        style="display: block; width: 120px; height: 120px; max-width: 120px; max-height: 120px; object-fit: contain; margin: 0 auto; border: 0; outline: none; text-decoration: none; color: #f5c87a; font-family: 'Georgia', serif; font-size: 16px; font-weight: bold;"
                      />
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin: 0; font-size: 10.5px; font-weight: 700; color: #e8b155; letter-spacing: 2px; text-transform: uppercase;">
                ${eyebrow}
              </p>
              ${
                heading
                  ? `<h1 style="margin: 10px 0 0; font-size: 23px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px; line-height: 1.35;">${heading}</h1>`
                  : ""
              }
              ${
                subheading
                  ? `<p style="margin: 6px 0 0; font-size: 13.5px; color: #f4ddbb; line-height: 1.45;">${subheading}</p>`
                  : ""
              }
            </td>
          </tr>

          <!-- Gold Accent Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #d08a24, #f5c87a, #d08a24); font-size: 1px; line-height: 1px;">&nbsp;</td>
          </tr>

          <!-- ================= BODY CONTENT ================= -->
          <tr>
            <td class="mobile-padding" style="padding: 36px 38px 30px; background-color: #ffffff;">
              ${bodyContent}
            </td>
          </tr>

          <!-- ================= FOOTER ================= -->
          <tr>
            <td style="padding: 26px 34px 30px; background-color: #faf5ee; border-top: 1px solid #ebdcc8; text-align: center;">
              <!-- Trust guarantees row -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 18px;">
                <tr>
                  <td align="center">
                    <span style="display: inline-block; margin: 3px 8px; font-size: 11.5px; color: #7a6e60; font-weight: 600;">
                      ✓ 100% Authentic Indian Craft
                    </span>
                    <span style="display: inline-block; margin: 3px 8px; font-size: 11.5px; color: #7a6e60; font-weight: 600;">
                      ✓ Free Insured Express Delivery
                    </span>
                    <span style="display: inline-block; margin: 3px 8px; font-size: 11.5px; color: #7a6e60; font-weight: 600;">
                      ✓ 7-Day Easy Returns
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Quick Links -->
              <p style="margin: 0 0 10px; font-size: 12px; color: #8c7f73;">
                <a href="${clientUrl}/shop" style="color: #b06f15; text-decoration: none; font-weight: 600; margin: 0 8px;">Explore Art</a>
                ·
                <a href="${clientUrl}/my-account" style="color: #b06f15; text-decoration: none; font-weight: 600; margin: 0 8px;">My Account</a>
                ·
                <a href="${clientUrl}/contact" style="color: #b06f15; text-decoration: none; font-weight: 600; margin: 0 8px;">Contact Support</a>
              </p>

              <p style="margin: 0 0 4px; font-size: 11.5px; color: #9a8d80;">
                Art &amp; Culture Collections · Preserving &amp; Celebrating Indian Heritage
              </p>
              <p style="margin: 0; font-size: 11px; color: #b3a79a;">
                &copy; ${year} Art &amp; Culture. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};

/**
 * 1. Account Creation / Welcome Email
 */
const sendWelcomeEmail = async ({ to, name = "Collector" }) => {
  const transporter = createTransporter();
  const fromName = process.env.SMTP_FROM_NAME || "Art & Culture";
  const fromEmail = process.env.SMTP_FROM_EMAIL || "sarojintermiles@gmail.com";
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const bodyContent = `
    <p style="margin: 0 0 16px; font-size: 16px; color: #2e261e; font-weight: 600;">
      Namaste <strong>${name}</strong>,
    </p>
    <p style="margin: 0 0 20px; font-size: 14.5px; line-height: 1.65; color: #5c4e41;">
      Welcome to the <strong>Art &amp; Culture</strong> family. Your account has been created successfully. You are now part of an exclusive circle of art patrons, connoisseurs, and collectors celebrating India's rich heritage crafts.
    </p>

    <!-- Welcome Feature Card -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fdfaf6; border: 1px solid #ebd9c4; border-radius: 12px; margin: 22px 0; padding: 18px 20px;">
      <tr>
        <td>
          <h3 style="margin: 0 0 12px; font-size: 14.5px; color: #8a5524; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">
            Your Collector Privileges Include:
          </h3>
          <p style="margin: 0 0 8px; font-size: 13.5px; color: #4e4033; line-height: 1.5;">
            🎨 <strong>Certified Authenticity:</strong> Each artwork is handcrafted by master artisans and ships with a certificate of authenticity.
          </p>
          <p style="margin: 0 0 8px; font-size: 13.5px; color: #4e4033; line-height: 1.5;">
            🚚 <strong>Complimentary Insured Shipping:</strong> Free express multi-point tracked delivery across India.
          </p>
          <p style="margin: 0; font-size: 13.5px; color: #4e4033; line-height: 1.5;">
            🏷️ <strong>Exclusive Collector Offers:</strong> Enjoy seasonal promo coupons and early access to rare heritage series.
          </p>
        </td>
      </tr>
    </table>

    <p style="margin: 0 0 26px; font-size: 14.5px; line-height: 1.6; color: #5c4e41;">
      Ready to start your collection? Explore our curated gallery of Madhubani, Pattachitra, Warli, Pichwai, and contemporary Indian fine art.
    </p>

    <!-- Call to action button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 24px auto;">
      <tr>
        <td align="center" style="border-radius: 999px; background: linear-gradient(135deg, #c98623, #a5630f);">
          <a href="${clientUrl}/shop" style="display: inline-block; padding: 14px 34px; font-size: 13.5px; font-weight: 700; color: #ffffff; text-decoration: none; letter-spacing: 0.5px;">
            Explore Heritage Collection &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = wrapEmailTemplate({
    title: `Welcome to Art & Culture, ${name}`,
    preheader: "Your account is ready. Discover authentic handcrafted Indian art.",
    heading: "Welcome to Art &amp; Culture",
    subheading: "Where Tradition Meets Masterpiece",
    bodyContent,
  });

  return await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject: `✨ Welcome to Art & Culture, ${name} — Your Heritage Journey Begins`,
    html,
    attachments: getLogoAttachment(),
  });
};

/**
 * 2. Password Reset OTP Email
 */
const sendOtpEmail = async ({ to, code, name = "Collector" }) => {
  const transporter = createTransporter();
  const fromName = process.env.SMTP_FROM_NAME || "Art & Culture";
  const fromEmail = process.env.SMTP_FROM_EMAIL || "sarojintermiles@gmail.com";

  const bodyContent = `
    <p style="margin: 0 0 16px; font-size: 15.5px; color: #2e261e; font-weight: 600;">
      Namaste <strong>${name}</strong>,
    </p>
    <p style="margin: 0 0 20px; font-size: 14.5px; line-height: 1.6; color: #5a4b3d;">
      We received a request to reset the password for your Art &amp; Culture account. Please use the following 6-digit verification code:
    </p>

    <!-- OTP Code Badge -->
    <div style="text-align: center; margin: 26px 0;">
      <div style="display: inline-block; padding: 16px 36px; background-color: #fff9f0; border: 2px dashed #d08a24; border-radius: 14px;">
        <span style="font-size: 34px; font-weight: 800; color: #b06f15; letter-spacing: 9px; font-family: 'Courier New', Courier, monospace;">
          ${code}
        </span>
      </div>
    </div>

    <p style="margin: 0 0 14px; font-size: 13px; line-height: 1.5; color: #8c7662; text-align: center;">
      ⏳ This verification code will expire in <strong>10 minutes</strong>.
    </p>
    <div style="background-color: #fdf5f5; border: 1px solid #f8d7da; border-radius: 8px; padding: 11px 16px; margin: 18px 0; text-align: center;">
      <p style="margin: 0; font-size: 12.5px; color: #991b1b; line-height: 1.5;">
        <strong>Security Notice:</strong> If you did not initiate this password reset, please ignore this email. Your account remains completely secure.
      </p>
    </div>
  `;

  const html = wrapEmailTemplate({
    title: "Password Reset Verification Code",
    preheader: `Your verification code is ${code}. Valid for 10 minutes.`,
    heading: "Password Reset Verification",
    subheading: "Secure Your Account Access",
    bodyContent,
  });

  return await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject: `🔒 ${code} is your Art & Culture verification code`,
    html,
    attachments: getLogoAttachment(),
  });
};

/**
 * 2b. Password Reset Success Confirmation
 */
const sendPasswordResetSuccessEmail = async ({ to, name = "Collector" }) => {
  const transporter = createTransporter();
  const fromName = process.env.SMTP_FROM_NAME || "Art & Culture";
  const fromEmail = process.env.SMTP_FROM_EMAIL || "sarojintermiles@gmail.com";
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const bodyContent = `
    <p style="margin: 0 0 16px; font-size: 15.5px; color: #2e261e; font-weight: 600;">
      Namaste <strong>${name}</strong>,
    </p>
    <p style="margin: 0 0 20px; font-size: 14.5px; line-height: 1.6; color: #5a4b3d;">
      The password for your Art &amp; Culture account has been successfully updated. You can now sign in with your new password.
    </p>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 22px auto;">
      <tr>
        <td align="center" style="border-radius: 999px; background: linear-gradient(135deg, #c98623, #a5630f);">
          <a href="${clientUrl}/my-account" style="display: inline-block; padding: 12px 30px; font-size: 13.5px; font-weight: 700; color: #ffffff; text-decoration: none;">
            Sign In to My Account &rarr;
          </a>
        </td>
      </tr>
    </table>
    <p style="margin: 18px 0 0; font-size: 12.5px; color: #948679; text-align: center;">
      If you did not perform this change, please contact support immediately at support@artandculture.com.
    </p>
  `;

  const html = wrapEmailTemplate({
    title: "Password Updated Successfully",
    preheader: "Your account password has been updated securely.",
    heading: "Password Changed Successfully",
    subheading: "Your Account Security is Confirmed",
    bodyContent,
  });

  return await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to,
    subject: `🔐 Password Updated Successfully — Art & Culture`,
    html,
    attachments: getLogoAttachment(),
  });
};

/**
 * 3. Order Placed / Confirmation Email
 */
const sendOrderConfirmationEmail = async ({ to, order }) => {
  const transporter = createTransporter();
  const fromName = process.env.SMTP_FROM_NAME || "Art & Culture";
  const fromEmail = process.env.SMTP_FROM_EMAIL || "sarojintermiles@gmail.com";
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const customerName = order.customer?.fullName || "Art Collector";
  const displayId = order.orderNumber || order.id || "ORD";
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const itemsRows = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 8px; border-bottom: 1px solid #f1e4d3; font-size: 13.5px; color: #2c2219;">
          <strong>${item.name || item.title || "Artwork"}</strong>
          ${item.artist ? `<br><small style="color: #8c7662;">By ${item.artist}</small>` : ""}
        </td>
        <td align="center" style="padding: 12px 8px; border-bottom: 1px solid #f1e4d3; font-size: 13px; color: #5a4b3d;">
          ${item.quantity || 1}
        </td>
        <td align="right" style="padding: 12px 8px; border-bottom: 1px solid #f1e4d3; font-size: 13.5px; color: #2c2219; font-weight: 700;">
          ${formatINR((item.price || 0) * (item.quantity || 1))}
        </td>
      </tr>
    `
    )
    .join("");

  const bodyContent = `
    <p style="margin: 0 0 16px; font-size: 16px; color: #2e261e; font-weight: 600;">
      Namaste <strong>${customerName}</strong>,
    </p>
    <p style="margin: 0 0 20px; font-size: 14.5px; line-height: 1.6; color: #5a4b3d;">
      Thank you for your art acquisition. We have received your payment online and your order <strong>#${displayId}</strong> is officially confirmed. Our master curatorial team is preparing your artwork with museum-grade protective packaging.
    </p>

    <!-- Order Meta Box -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fdfaf6; border: 1.5px solid #ebd9c4; border-radius: 12px; margin: 18px 0; padding: 16px 18px;">
      <tr>
        <td style="font-size: 13px; color: #6e5f52; line-height: 1.6;">
          <strong>Order Reference:</strong> <span style="color: #b06f15; font-weight: 700;">#${displayId}</span><br>
          <strong>Date:</strong> ${orderDate}<br>
          <strong>Payment Status:</strong> <span style="color: #15803d; font-weight: 700;">✓ Paid (Prepaid Online)</span>
          ${order.payment?.razorpayPaymentId ? `<br><strong>Payment Reference ID:</strong> ${order.payment.razorpayPaymentId}` : ""}
        </td>
      </tr>
    </table>

    <!-- Itemized Artworks Table -->
    <h3 style="margin: 22px 0 10px; font-size: 15px; color: #2c2219; font-weight: 700;">Acquired Artworks</h3>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse; margin-bottom: 16px;">
      <thead>
        <tr style="background-color: #faf4ec;">
          <th align="left" style="padding: 9px 8px; font-size: 11.5px; color: #8a5524; text-transform: uppercase; letter-spacing: 0.5px;">Artwork</th>
          <th align="center" style="padding: 9px 8px; font-size: 11.5px; color: #8a5524; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
          <th align="right" style="padding: 9px 8px; font-size: 11.5px; color: #8a5524; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <!-- Price Breakdown Table -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 22px;">
      <tr>
        <td style="padding: 4px 8px; font-size: 13px; color: #6e5f52;">Artwork Subtotal:</td>
        <td align="right" style="padding: 4px 8px; font-size: 13px; color: #2c2219; font-weight: 600;">${formatINR(order.subtotal || order.totalAmount)}</td>
      </tr>
      ${
        order.discount > 0
          ? `<tr>
              <td style="padding: 4px 8px; font-size: 13px; color: #15803d; font-weight: 600;">
                Coupon Discount ${order.couponCode ? `(${order.couponCode})` : ""}:
              </td>
              <td align="right" style="padding: 4px 8px; font-size: 13.5px; color: #15803d; font-weight: 700;">
                - ${formatINR(order.discount)}
              </td>
            </tr>`
          : ""
      }
      <tr>
        <td style="padding: 4px 8px; font-size: 13px; color: #6e5f52;">Express Insured Shipping:</td>
        <td align="right" style="padding: 4px 8px; font-size: 13px; color: #15803d; font-weight: 600;">FREE</td>
      </tr>
      <tr>
        <td style="padding: 4px 8px; font-size: 13px; color: #6e5f52;">Estimated Tax (GST):</td>
        <td align="right" style="padding: 4px 8px; font-size: 13px; color: #6e5f52;">Included (₹0)</td>
      </tr>
      <tr>
        <td colspan="2"><hr style="border: none; border-top: 1.5px solid #ebd9c4; margin: 8px 0;"></td>
      </tr>
      <tr>
        <td style="padding: 6px 8px; font-size: 15.5px; color: #2c2219; font-weight: 700;">Total Amount Paid:</td>
        <td align="right" style="padding: 6px 8px; font-size: 19px; color: #b06f15; font-weight: 800;">${formatINR(order.totalAmount)}</td>
      </tr>
    </table>

    <!-- Destination Address -->
    <div style="background-color: #faf6f0; border-radius: 10px; padding: 14px 18px; margin-bottom: 22px;">
      <h4 style="margin: 0 0 6px; font-size: 12.5px; color: #8a5524; text-transform: uppercase; letter-spacing: 0.5px;">Delivery Destination</h4>
      <p style="margin: 0; font-size: 13.5px; color: #4e4033; line-height: 1.5;">
        ${order.customer?.address || order.shipment?.shippingAddress || "As specified during checkout"}
      </p>
    </div>

    <!-- CTA Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 24px auto;">
      <tr>
        <td align="center" style="border-radius: 999px; background: linear-gradient(135deg, #c98623, #a5630f);">
          <a href="${clientUrl}/order-details/${displayId}" style="display: inline-block; padding: 13px 32px; font-size: 13.5px; font-weight: 700; color: #ffffff; text-decoration: none; letter-spacing: 0.4px;">
            Track Order Details &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = wrapEmailTemplate({
    title: `Order #${displayId} Confirmed — Art & Culture`,
    preheader: `Thank you for your acquisition. Order #${displayId} is confirmed.`,
    heading: "Acquisition Confirmed",
    subheading: `Order #${displayId} · Payment Received`,
    bodyContent,
  });

  return await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: to || order.customer?.email,
    subject: `🎨 Acquisition Confirmed: #${displayId} — Art & Culture`,
    html,
    attachments: getLogoAttachment(),
  });
};

/**
 * 4. Order Shipped Email
 */
const sendOrderShippedEmail = async ({ to, order }) => {
  const transporter = createTransporter();
  const fromName = process.env.SMTP_FROM_NAME || "Art & Culture";
  const fromEmail = process.env.SMTP_FROM_EMAIL || "sarojintermiles@gmail.com";
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const customerName = order.customer?.fullName || "Art Collector";
  const displayId = order.orderNumber || order.id || "ORD";
  const carrier = order.shipment?.carrier || "India Post (Speed Post)";
  const trackingNumber = order.shipment?.trackingNumber || "Assigned on Dispatch";
  const estimatedDelivery = order.shipment?.estimatedDelivery || order.shipment?.deliveryDate || "2 to 4 business days";
  const currentHub = order.shipment?.currentHub || order.shipment?.currentLocation || "";

  const bodyContent = `
    <p style="margin: 0 0 16px; font-size: 16px; color: #2e261e; font-weight: 600;">
      Namaste <strong>${customerName}</strong>,
    </p>
    <p style="margin: 0 0 20px; font-size: 14.5px; line-height: 1.6; color: #5a4b3d;">
      Great news! Your handcrafted artwork for order <strong>#${displayId}</strong> has been carefully inspected, packaged in custom shock-absorbing museum-grade casing, and dispatched with our delivery partner.
    </p>

    <!-- Shipment Tracking Card -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fcf9f2; border: 1.5px solid #ebd9c4; border-radius: 12px; margin: 20px 0; padding: 18px 20px;">
      <tr>
        <td style="font-size: 13.5px; color: #4e4033; line-height: 1.8;">
          <strong style="color: #8a5524;">Logistics Courier:</strong> ${carrier}<br>
          <strong style="color: #8a5524;">Tracking ID / Consignment:</strong> <span style="font-family: monospace; font-size: 14.5px; color: #b06f15; font-weight: 700;">${trackingNumber}</span><br>
          ${currentHub ? `<strong style="color: #8a5524;">Current Courier Hub:</strong> 📍 ${currentHub}<br>` : ""}
          <strong style="color: #8a5524;">Expected Delivery Date:</strong> <span style="color: #15803d; font-weight: 700;">${estimatedDelivery}</span>
        </td>
      </tr>
    </table>

    <div style="background-color: #faf6f0; border-radius: 10px; padding: 14px 18px; margin: 18px 0;">
      <h4 style="margin: 0 0 6px; font-size: 12px; color: #8a5524; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Destination:</h4>
      <p style="margin: 0; font-size: 13.5px; color: #55483b;">
        ${order.shipment?.shippingAddress || order.customer?.address || "As provided at checkout"}
      </p>
    </div>

    <!-- CTA Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 26px auto;">
      <tr>
        <td align="center" style="border-radius: 999px; background: linear-gradient(135deg, #c98623, #a5630f);">
          <a href="${clientUrl}/order-details/${displayId}" style="display: inline-block; padding: 13px 32px; font-size: 13.5px; font-weight: 700; color: #ffffff; text-decoration: none; letter-spacing: 0.4px;">
            Track Live Shipment Progress &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = wrapEmailTemplate({
    title: `Order #${displayId} Has Shipped — Art & Culture`,
    preheader: `Your artwork has shipped with ${carrier}. Tracking: ${trackingNumber}`,
    heading: "Your Artwork is on the Way",
    subheading: `Order #${displayId} Dispatched &amp; In Transit`,
    bodyContent,
  });

  return await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: to || order.customer?.email,
    subject: `🚚 Your Artwork is in Transit: Order #${displayId} has Shipped`,
    html,
    attachments: getLogoAttachment(),
  });
};

/**
 * 5. Order Out for Delivery Email
 */
const sendOrderOutForDeliveryEmail = async ({ to, order }) => {
  const transporter = createTransporter();
  const fromName = process.env.SMTP_FROM_NAME || "Art & Culture";
  const fromEmail = process.env.SMTP_FROM_EMAIL || "sarojintermiles@gmail.com";
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const customerName = order.customer?.fullName || "Art Collector";
  const displayId = order.orderNumber || order.id || "ORD";
  const agent = order.shipment?.deliveryAgent || {};

  const bodyContent = `
    <p style="margin: 0 0 16px; font-size: 16px; color: #2e261e; font-weight: 600;">
      Namaste <strong>${customerName}</strong>,
    </p>
    <p style="margin: 0 0 20px; font-size: 14.5px; line-height: 1.6; color: #5a4b3d;">
      Exciting news! Your Art &amp; Culture package for order <strong>#${displayId}</strong> is <strong>Out for Delivery</strong> today. The dedicated delivery executive has received your parcel and will arrive at your address shortly.
    </p>

    <!-- Delivery Executive Card -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fbf7ee; border: 1.5px solid #ebd9c4; border-radius: 12px; margin: 20px 0; padding: 18px 20px;">
      <tr>
        <td>
          <h3 style="margin: 0 0 10px; font-size: 13.5px; color: #8a5524; text-transform: uppercase; letter-spacing: 0.5px;">
            Delivery Executive &amp; Hub Details:
          </h3>
          <p style="margin: 0 0 6px; font-size: 14px; color: #33271d;">
            <strong>Agent Name:</strong> ${agent.name || "Specialist Art Courier Agent"}
          </p>
          ${
            agent.phone
              ? `<p style="margin: 0 0 6px; font-size: 14px; color: #33271d;">
                  <strong>Agent Contact (Phone):</strong> <a href="tel:${agent.phone}" style="color: #ea580c; font-weight: 700; text-decoration: none;">${agent.phone}</a>
                </p>`
              : ""
          }
          ${
            order.shipment?.currentHub || order.shipment?.currentLocation
              ? `<p style="margin: 0 0 6px; font-size: 14px; color: #33271d;">
                  <strong>Current Hub (Local Center):</strong> 📍 ${order.shipment.currentHub || order.shipment.currentLocation}
                </p>`
              : ""
          }
          ${
            order.shipment?.deliveryDate || order.shipment?.estimatedDelivery
              ? `<p style="margin: 0 0 6px; font-size: 14px; color: #33271d;">
                  <strong>Date of Delivery:</strong> <span style="color: #15803d; font-weight: 700;">${order.shipment.deliveryDate || order.shipment.estimatedDelivery}</span>
                </p>`
              : ""
          }
          ${
            agent.vehicleNumber
              ? `<p style="margin: 0; font-size: 14px; color: #33271d;">
                  <strong>Vehicle No:</strong> ${agent.vehicleNumber}
                </p>`
              : ""
          }
        </td>
      </tr>
    </table>

    <div style="background-color: #faf6f0; border-radius: 10px; padding: 14px 18px; margin: 18px 0;">
      <h4 style="margin: 0 0 6px; font-size: 12px; color: #8a5524; text-transform: uppercase; letter-spacing: 0.5px;">Destination Address:</h4>
      <p style="margin: 0; font-size: 13.5px; color: #55483b;">
        ${order.shipment?.shippingAddress || order.customer?.address || "As provided at checkout"}
      </p>
    </div>

    <!-- Instructions Notice -->
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin: 18px 0;">
      <p style="margin: 0; font-size: 12.5px; color: #166534; line-height: 1.5;">
        🛡️ <strong>Collector Tip:</strong> Please verify the tamper-evident Art &amp; Culture security seal before accepting delivery.
      </p>
    </div>

    <!-- CTA Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 24px auto;">
      <tr>
        <td align="center" style="border-radius: 999px; background: linear-gradient(135deg, #c98623, #a5630f);">
          <a href="${clientUrl}/order-details/${displayId}" style="display: inline-block; padding: 13px 32px; font-size: 13.5px; font-weight: 700; color: #ffffff; text-decoration: none;">
            View Order Status &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = wrapEmailTemplate({
    title: `Order #${displayId} is Out for Delivery Today — Art & Culture`,
    preheader: `Your artwork is arriving today. Delivery executive: ${agent.name || "Art Courier"}`,
    heading: "Arriving Today!",
    subheading: `Order #${displayId} is Out for Delivery`,
    bodyContent,
  });

  return await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: to || order.customer?.email,
    subject: `📦 Arriving Today: Order #${displayId} is Out for Delivery`,
    html,
    attachments: getLogoAttachment(),
  });
};

/**
 * 6. Order Delivered Email
 */
const sendOrderDeliveredEmail = async ({ to, order }) => {
  const transporter = createTransporter();
  const fromName = process.env.SMTP_FROM_NAME || "Art & Culture";
  const fromEmail = process.env.SMTP_FROM_EMAIL || "sarojintermiles@gmail.com";
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

  const customerName = order.customer?.fullName || "Art Collector";
  const displayId = order.orderNumber || order.id || "ORD";
  const deliveredTime = new Date(order.shipment?.deliveredAt || Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const bodyContent = `
    <p style="margin: 0 0 16px; font-size: 16px; color: #2e261e; font-weight: 600;">
      Namaste <strong>${customerName}</strong>,
    </p>
    <p style="margin: 0 0 20px; font-size: 14.5px; line-height: 1.65; color: #5a4b3d;">
      We are delighted to confirm that your order <strong>#${displayId}</strong> was safely delivered on <strong>${deliveredTime}</strong>. We hope this authentic masterpiece brings cultural elegance, warmth, and inspiration into your space.
    </p>

    <!-- Certificate Card -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fdfaf6; border: 1.5px solid #ebd9c4; border-radius: 12px; margin: 20px 0; padding: 18px 20px;">
      <tr>
        <td>
          <h3 style="margin: 0 0 8px; font-size: 14px; color: #8a5524; font-weight: 700; text-transform: uppercase;">
            📜 Certificate of Authenticity Enclosed
          </h3>
          <p style="margin: 0; font-size: 13.5px; color: #5a4b3d; line-height: 1.55;">
            Your package includes the official embossed Art &amp; Culture Certificate of Authenticity certifying the provenance, artisan heritage, and original craftsmanship of your artwork.
          </p>
        </td>
      </tr>
    </table>

    <!-- Care Instructions -->
    <div style="background-color: #faf6f0; border-radius: 10px; padding: 16px 20px; margin: 18px 0;">
      <h4 style="margin: 0 0 8px; font-size: 13px; color: #8a5524; text-transform: uppercase; letter-spacing: 0.5px;">
        Curatorial Care Instructions:
      </h4>
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #5c4e41; line-height: 1.6;">
        <li>Display away from direct continuous harsh sunlight to protect organic natural pigments.</li>
        <li>Dust gently with a clean, dry, ultra-soft microfiber cloth.</li>
        <li>Avoid exposure to heavy moisture, steam, or liquid cleaning agents.</li>
      </ul>
    </div>

    <!-- CTA Button -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 26px auto;">
      <tr>
        <td align="center" style="border-radius: 999px; background: linear-gradient(135deg, #c98623, #a5630f);">
          <a href="${clientUrl}/order-details/${displayId}" style="display: inline-block; padding: 13px 34px; font-size: 13.5px; font-weight: 700; color: #ffffff; text-decoration: none;">
            View Order &amp; Invoice &rarr;
          </a>
        </td>
      </tr>
    </table>
  `;

  const html = wrapEmailTemplate({
    title: `Delivered: Order #${displayId} — Art & Culture`,
    preheader: `Your artwork for order #${displayId} has been successfully delivered.`,
    heading: "Artwork Successfully Delivered",
    subheading: `Congratulations on Your Heritage Acquisition`,
    bodyContent,
  });

  return await transporter.sendMail({
    from: `"${fromName}" <${fromEmail}>`,
    to: to || order.customer?.email,
    subject: `🎉 Delivered: Your Art & Culture Collection has Arrived!`,
    html,
    attachments: getLogoAttachment(),
  });
};

module.exports = {
  createTransporter,
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordResetSuccessEmail,
  sendOrderConfirmationEmail,
  sendOrderShippedEmail,
  sendOrderOutForDeliveryEmail,
  sendOrderDeliveredEmail,
};
