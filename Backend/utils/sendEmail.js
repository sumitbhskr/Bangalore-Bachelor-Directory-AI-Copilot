// nodemailer

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ── Email Templates ──────────────────────────────────────
const templates = {
  welcome: (name) => ({
    subject: "🏠 Welcome to Bangalore Bachelor Directory!",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#e8a45a">Welcome, ${name}!</h2>
        <p>You've successfully joined <strong>Bangalore Bachelor Directory</strong> — the easiest way to find PG, tiffin, and cook in Bangalore.</p>
        <a href="${process.env.FRONTEND_URL}" style="background:#e8a45a;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">Browse Listings →</a>
        <p style="color:#999;font-size:12px;margin-top:32px">Bangalore Bachelor Directory · Bangalore, India</p>
      </div>
    `,
  }),

  newMessage: (recipientName, senderName, preview) => ({
    subject: `💬 New message from ${senderName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#e8a45a">New Message</h2>
        <p>Hi ${recipientName}, you have a new message from <strong>${senderName}</strong>:</p>
        <div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:16px 0">
          "${preview}"
        </div>
        <a href="${process.env.FRONTEND_URL}/messages" style="background:#e8a45a;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">View Message →</a>
      </div>
    `,
  }),

  paymentSuccess: (name, listingTitle, amount) => ({
    subject: "✅ Booking Confirmed — Bangalore Bachelor Directory",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#50a080">Booking Confirmed!</h2>
        <p>Hi ${name}, your booking for <strong>${listingTitle}</strong> has been confirmed.</p>
        <div style="background:#f5f5f5;padding:16px;border-radius:8px">
          <p><strong>Amount Paid:</strong> ₹${(amount / 100).toLocaleString()}</p>
        </div>
        <p style="color:#999;font-size:12px;margin-top:32px">Bangalore Bachelor Directory</p>
      </div>
    `,
  }),

  listingVerified: (ownerName, listingTitle) => ({
    subject: "🏅 Your listing has been verified!",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#e8a45a">Listing Verified!</h2>
        <p>Hi ${ownerName}, your listing <strong>"${listingTitle}"</strong> has been verified and now shows a trust badge.</p>
        <a href="${process.env.FRONTEND_URL}/dashboard" style="background:#e8a45a;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold">View Dashboard →</a>
      </div>
    `,
  }),
};

// ── Send email function ──────────────────────────────────
const sendEmail = async ({ to, templateName, templateData = [] }) => {
  try {
    if (!process.env.EMAIL_USER) {
      console.log(
        `[Email skipped - no config] To: ${to}, Template: ${templateName}`,
      );
      return;
    }
    const template = templates[templateName]?.(...templateData);
    if (!template)
      throw new Error(`Email template "${templateName}" not found`);

    await transporter.sendMail({
      from: `"Bangalore Bachelor Directory" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      html: template.html,
    });
    console.log(`✅ Email sent to ${to} — ${templateName}`);
  } catch (err) {
    console.error(`❌ Email failed to ${to}:`, err.message);
    // Don't throw — email failure shouldn't break the main flow
  }
};

module.exports = sendEmail;
