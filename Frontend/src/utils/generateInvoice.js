import brandLogo from "../assets/Art_and_Culture_logo-removebg-preview.png";

/**
 * Convert number to Indian currency words
 */
function numberToWordsINR(amount) {
  const num = Math.round(Number(amount) || 0);
  if (num === 0) return "Zero Rupees Only";

  const a = [
    "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
    "Seventeen", "Eighteen", "Nineteen",
  ];
  const b = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety",
  ];

  function convertTwoDigits(n) {
    if (n < 20) return a[n];
    return `${b[Math.floor(n / 10)]}${n % 10 !== 0 ? ` ${a[n % 10]}` : ""}`;
  }

  function convertThreeDigits(n) {
    let str = "";
    if (Math.floor(n / 100) > 0) {
      str += `${a[Math.floor(n / 100)]} Hundred`;
      if (n % 100 !== 0) str += " and ";
    }
    if (n % 100 > 0) {
      str += convertTwoDigits(n % 100);
    }
    return str;
  }

  let crore = Math.floor(num / 10000000);
  let remainder = num % 10000000;
  let lakh = Math.floor(remainder / 100000);
  remainder = remainder % 100000;
  let thousand = Math.floor(remainder / 1000);
  remainder = remainder % 1000;
  let hundred = remainder;

  let words = "";
  if (crore > 0) words += `${convertTwoDigits(crore)} Crore `;
  if (lakh > 0) words += `${convertTwoDigits(lakh)} Lakh `;
  if (thousand > 0) words += `${convertTwoDigits(thousand)} Thousand `;
  if (hundred > 0) words += convertThreeDigits(hundred);

  return `${words.trim()} Rupees Only`;
}

/**
 * Load html2pdf dynamically if needed
 */
async function getHtml2Pdf() {
  if (typeof window !== "undefined" && window.html2pdf) {
    return window.html2pdf;
  }
  try {
    const mod = await import("html2pdf.js");
    return mod.default || mod;
  } catch (err) {
    console.warn("Failed to load bundled html2pdf, falling back to CDN script:", err);
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
      script.onload = () => resolve(window.html2pdf);
      script.onerror = () => reject(new Error("Unable to load html2pdf library."));
      document.body.appendChild(script);
    });
  }
}

/**
 * Generate and directly trigger download of the official Tax Invoice & Acquisition Certificate
 */
export async function downloadInvoicePdf(order) {
  if (!order) {
    throw new Error("Order details are required to download invoice.");
  }

  const html2pdf = await getHtml2Pdf();
  if (!html2pdf) {
    throw new Error("PDF generation module unavailable.");
  }

  const displayId =
    order.orderNumber ||
    order.id ||
    (order._id ? `AC-${order._id.slice(-8).toUpperCase()}` : `AC-${Date.now().toString().slice(-6)}`);

  const rawDate = order.createdAt || order.date || new Date().toISOString();
  const dateObj = new Date(rawDate);
  const formattedDate = !isNaN(dateObj.getTime())
    ? dateObj.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Recent";

  const items =
    order.items && order.items.length > 0
      ? order.items
      : order.products && order.products.length > 0
      ? order.products
      : [
          {
            title: "Original Handcrafted Artwork",
            artist: "Art & Culture Master Artisan",
            price: order.totalAmount || order.subtotal || 0,
            quantity: 1,
          },
        ];

  const subtotal = Number(order.subtotal || order.totalAmount || 0);
  const discount = Number(order.discount || 0);
  const grandTotal = Number(order.totalAmount || (subtotal - discount) || 0);
  const customerName = order.customer?.fullName || order.customer || "Art Collector";
  const customerEmail = order.customer?.email || order.email || "—";
  const customerPhone = order.customer?.phone || order.phone || "—";
  const customerAddress =
    order.shipment?.shippingAddress ||
    order.customer?.address ||
    order.address ||
    "Shipping address provided during acquisition";

  const paymentMethod = order.payment?.gateway || "Razorpay Secure";
  const paymentId = order.payment?.razorpayPaymentId || order.razorpayPaymentId || "Verified Online Payment";

  // Build temporary DOM container for PDF rendering
  const invoiceContainer = document.createElement("div");
  invoiceContainer.id = "invoice-pdf-render-container";
  invoiceContainer.style.position = "fixed";
  invoiceContainer.style.left = "-9999px";
  invoiceContainer.style.top = "0";
  invoiceContainer.style.width = "794px"; // A4 standard width at 96dpi
  invoiceContainer.style.minHeight = "1123px";
  invoiceContainer.style.background = "#ffffff";
  invoiceContainer.style.color = "#1f1b16";
  invoiceContainer.style.fontFamily = "'Cinzel Decorative', 'Georgia', 'Times New Roman', serif";
  invoiceContainer.style.boxSizing = "border-box";
  invoiceContainer.style.padding = "32px 38px";

  const rowsHtml = items
    .map((item, idx) => {
      const title = item.title || item.name || "Original Artwork";
      const artist = item.artist || item.artistName || "Master Artisan";
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 1);
      const rowTotal = price * qty;

      return `
        <tr style="border-bottom: 1px solid #ebd9c8;">
          <td style="padding: 12px 8px; font-size: 13px; color: #5a483a; text-align: center; font-family: sans-serif;">${idx + 1}</td>
          <td style="padding: 12px 8px;">
            <div style="font-weight: 700; font-size: 14px; color: #2d2116; margin-bottom: 3px;">${title}</div>
            <div style="font-size: 11.5px; color: #8a6a4b; font-style: italic; font-family: sans-serif;">Curated by: ${artist} · 100% Handcrafted</div>
          </td>
          <td style="padding: 12px 8px; font-size: 13px; color: #5a483a; text-align: center; font-family: sans-serif;">${qty}</td>
          <td style="padding: 12px 8px; font-size: 13px; color: #5a483a; text-align: right; font-family: sans-serif;">₹${price.toLocaleString("en-IN")}</td>
          <td style="padding: 12px 8px; font-size: 13.5px; font-weight: 700; color: #8a5524; text-align: right; font-family: sans-serif;">₹${rowTotal.toLocaleString("en-IN")}</td>
        </tr>
      `;
    })
    .join("");

  const couponHtml =
    discount > 0
      ? `
        <tr style="color: #16a34a; font-family: sans-serif; font-size: 13px;">
          <td colspan="4" style="padding: 6px 8px; text-align: right; font-weight: 600;">
            Coupon Discount ${order.couponCode ? `(${order.couponCode})` : ""}:
          </td>
          <td style="padding: 6px 8px; text-align: right; font-weight: 700;">- ₹${discount.toLocaleString("en-IN")}</td>
        </tr>
      `
      : "";

  invoiceContainer.innerHTML = `
    <div style="width: 100%; box-sizing: border-box; background: #ffffff; color: #2b221a;">
      
      <!-- Top Brand Header -->
      <table style="width: 100%; border-collapse: collapse; padding-bottom: 18px; border-bottom: 2px solid #b06f15;">
        <tr>
          <td style="vertical-align: middle; width: 60%;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <img src="${brandLogo}" alt="Art & Culture Logo" style="height: 68px; width: auto; object-fit: contain;" />
              <div>
                <div style="font-size: 22px; font-weight: 800; letter-spacing: 2px; color: #8a5524; text-transform: uppercase;">
                  Art &amp; Culture
                </div>
                <div style="font-size: 11px; letter-spacing: 1.5px; color: #a1774b; text-transform: uppercase; margin-top: 2px; font-family: sans-serif;">
                  Heritage Folk Art &amp; Sculptures
                </div>
              </div>
            </div>
          </td>
          <td style="vertical-align: middle; text-align: right; width: 40%;">
            <div style="font-size: 22px; font-weight: 800; color: #2b1f14; letter-spacing: 1px; text-transform: uppercase;">
              TAX INVOICE
            </div>
            <div style="font-size: 11.5px; color: #7d6b5c; margin-top: 4px; font-family: sans-serif;">
              Original Collector's Receipt
            </div>
            <div style="display: inline-block; background: #ecfdf5; border: 1px solid #10b981; color: #047857; font-weight: 700; font-size: 11px; padding: 3px 10px; border-radius: 999px; margin-top: 6px; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">
              ✓ Payment Paid &amp; Confirmed
            </div>
          </td>
        </tr>
      </table>

      <!-- Invoice Reference & Meta Details -->
      <div style="margin-top: 18px; padding: 14px 18px; background: #faf6f0; border-radius: 8px; border: 1px solid #ebd9c8;">
        <table style="width: 100%; border-collapse: collapse; font-family: sans-serif; font-size: 12.5px;">
          <tr>
            <td style="width: 25%; padding: 4px 0; color: #7d6b5c;">Invoice Number:</td>
            <td style="width: 25%; padding: 4px 0; font-weight: 700; color: #2b1f14;">INV-${displayId}</td>
            <td style="width: 25%; padding: 4px 0; color: #7d6b5c;">Invoice Date:</td>
            <td style="width: 25%; padding: 4px 0; font-weight: 700; color: #2b1f14;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="width: 25%; padding: 4px 0; color: #7d6b5c;">Order Reference:</td>
            <td style="width: 25%; padding: 4px 0; font-weight: 700; color: #8a5524;">#${displayId}</td>
            <td style="width: 25%; padding: 4px 0; color: #7d6b5c;">Payment Method:</td>
            <td style="width: 25%; padding: 4px 0; font-weight: 700; color: #2b1f14;">${paymentMethod}</td>
          </tr>
          <tr>
            <td style="width: 25%; padding: 4px 0; color: #7d6b5c;">Transaction Ref:</td>
            <td style="width: 25%; padding: 4px 0; font-family: monospace; font-size: 11px; color: #4a3e35;">${paymentId}</td>
            <td style="width: 25%; padding: 4px 0; color: #7d6b5c;">GSTIN / Reg No:</td>
            <td style="width: 25%; padding: 4px 0; font-weight: 600; color: #2b1f14;">21AAACA9876Q1Z0</td>
          </tr>
        </table>
      </div>

      <!-- Parties: Seller & Buyer Grid -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-family: sans-serif;">
        <tr>
          <!-- Seller Details -->
          <td style="width: 50%; vertical-align: top; padding-right: 15px;">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #8a5524; margin-bottom: 8px; border-bottom: 1px solid #ebd9c8; padding-bottom: 4px;">
              Sold By / Gallery Origin:
            </div>
            <div style="font-size: 13.5px; font-weight: 800; color: #2b1f14; margin-bottom: 4px;">Art &amp; Culture Heritage Pvt. Ltd.</div>
            <div style="font-size: 12px; color: #5a4b3f; line-height: 1.5;">
              Plot No. 42, Heritage Arts Corridor<br />
              Master Canteen Square, Bhubaneswar, Odisha 751001<br />
              Email: <strong>support@artandculture.com</strong><br />
              Phone: +91 98765 43210 / +91 674 2501234
            </div>
          </td>

          <!-- Buyer Details -->
          <td style="width: 50%; vertical-align: top; padding-left: 15px;">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #8a5524; margin-bottom: 8px; border-bottom: 1px solid #ebd9c8; padding-bottom: 4px;">
              Billed &amp; Shipped To:
            </div>
            <div style="font-size: 13.5px; font-weight: 800; color: #2b1f14; margin-bottom: 4px;">${customerName}</div>
            <div style="font-size: 12px; color: #5a4b3f; line-height: 1.5;">
              Address: ${customerAddress}<br />
              Phone: <strong>${customerPhone}</strong><br />
              Email: ${customerEmail}
            </div>
          </td>
        </tr>
      </table>

      <!-- Itemized Artworks Table -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 24px; border: 1px solid #ebd9c8; border-radius: 6px; overflow: hidden;">
        <thead>
          <tr style="background: #8a5524; color: #ffffff; font-family: sans-serif; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
            <th style="padding: 10px 8px; width: 6%; text-align: center;">#</th>
            <th style="padding: 10px 8px; width: 48%; text-align: left;">Artwork Description &amp; Provenance</th>
            <th style="padding: 10px 8px; width: 10%; text-align: center;">Qty</th>
            <th style="padding: 10px 8px; width: 18%; text-align: right;">Unit Price</th>
            <th style="padding: 10px 8px; width: 18%; text-align: right;">Total (INR)</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
        <tfoot>
          <!-- Subtotal -->
          <tr style="font-family: sans-serif; font-size: 13px; color: #5a483a;">
            <td colspan="4" style="padding: 8px 8px 4px; text-align: right; font-weight: 600;">Artworks Subtotal:</td>
            <td style="padding: 8px 8px 4px; text-align: right; font-weight: 700; color: #2d2116;">₹${subtotal.toLocaleString("en-IN")}</td>
          </tr>
          ${couponHtml}
          <tr style="font-family: sans-serif; font-size: 13px; color: #5a483a;">
            <td colspan="4" style="padding: 4px 8px; text-align: right;">Insured Express Courier:</td>
            <td style="padding: 4px 8px; text-align: right; font-weight: 700; color: #16a34a;">FREE</td>
          </tr>
          <tr style="font-family: sans-serif; font-size: 13px; color: #5a483a;">
            <td colspan="4" style="padding: 4px 8px; text-align: right;">Applicable GST (Taxes Included):</td>
            <td style="padding: 4px 8px; text-align: right; font-weight: 600;">₹0.00</td>
          </tr>
          <tr style="background: #faf6f0; font-family: sans-serif; border-top: 2px solid #b06f15; border-bottom: 2px solid #b06f15;">
            <td colspan="4" style="padding: 12px 8px; text-align: right; font-size: 15px; font-weight: 800; color: #8a5524; text-transform: uppercase;">
              Total Paid Amount:
            </td>
            <td style="padding: 12px 8px; text-align: right; font-size: 17px; font-weight: 900; color: #8a5524;">
              ₹${grandTotal.toLocaleString("en-IN")}
            </td>
          </tr>
        </tfoot>
      </table>

      <!-- Amount in Words -->
      <div style="margin-top: 10px; padding: 8px 12px; background: #fffcf8; border: 1px dashed #dfc2a6; font-family: sans-serif; font-size: 12px; color: #5c4736;">
        <strong>Amount in Words:</strong> ${numberToWordsINR(grandTotal)}
      </div>

      <!-- Authenticity Guarantee & Signature Seal -->
      <table style="width: 100%; border-collapse: collapse; margin-top: 24px;">
        <tr>
          <!-- Authenticity Box -->
          <td style="width: 62%; vertical-align: top; padding-right: 14px;">
            <div style="border: 1px solid #e2cfbd; border-radius: 6px; padding: 12px 14px; background: #fdfbf7;">
              <div style="font-size: 12px; font-weight: 800; color: #8a5524; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">
                ✦ Certificate of Folk Art Authenticity
              </div>
              <div style="font-size: 11px; line-height: 1.5; color: #6a5749; font-family: sans-serif;">
                Every creation listed on this invoice is unconditionally guaranteed authentic, handcrafted by certified hereditary Indian artisans, and safeguarded with tamper-evident transit packaging.
              </div>
            </div>
          </td>

          <!-- Signature & Seal -->
          <td style="width: 38%; vertical-align: top; text-align: center;">
            <div style="display: inline-block; text-align: center;">
              <div style="font-size: 16px; font-weight: 700; color: #8a5524; font-family: 'Cinzel Decorative', cursive; margin-bottom: 4px;">
                Art &amp; Culture Archives
              </div>
              <div style="height: 1px; width: 140px; background: #b06f15; margin: 4px auto 6px;"></div>
              <div style="font-size: 11px; font-weight: 700; color: #2b1f14; font-family: sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">
                Authorized Curatorial Seal
              </div>
              <div style="font-size: 10px; color: #8a6a4b; font-family: sans-serif;">
                Digitally Signed &amp; Stamped
              </div>
            </div>
          </td>
        </tr>
      </table>

      <!-- Bottom Disclaimer -->
      <div style="margin-top: 26px; border-top: 1px solid #ebd9c8; padding-top: 12px; text-align: center; font-family: sans-serif; font-size: 10.5px; color: #8d7b6c; line-height: 1.4;">
        This document is an electronically generated Tax Invoice and Certificate of Acquisition. No physical signature is required under Indian IT Act 2000.<br />
        For questions or returns within 7 days, reach out to <strong>concierge@artandculture.com</strong> or call our heritage desk at <strong>+91 98765 43210</strong>.
      </div>

    </div>
  `;

  document.body.appendChild(invoiceContainer);

  const cleanFilename = `Invoice-${displayId.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;

  const opt = {
    margin: [10, 10, 10, 10],
    filename: cleanFilename,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
      windowWidth: 794,
    },
    jsPDF: {
      unit: "mm",
      format: "a4",
      orientation: "portrait",
    },
  };

  try {
    await html2pdf().set(opt).from(invoiceContainer).save();
    return { success: true, filename: cleanFilename };
  } finally {
    if (invoiceContainer.parentNode) {
      invoiceContainer.parentNode.removeChild(invoiceContainer);
    }
  }
}

