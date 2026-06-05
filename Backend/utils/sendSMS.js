// twilio

// backend/utils/sendSMS.js
let twilioClient = null;

// Lazy init — only when keys are present
const getClient = () => {
  if (
    !twilioClient &&
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN
  ) {
    const twilio = require("twilio");
    twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }
  return twilioClient;
};

// ── SMS Templates ────────────────────────────────────────
const smsTemplates = {
  newMessage: (senderName) =>
    `BBD: New message from ${senderName}. Open app to reply.`,
  paymentSuccess: (amount) =>
    `BBD: Payment of ₹${amount} confirmed! Booking successful.`,
  newListing: (area) =>
    `BBD: New listing added in ${area}! Check it out on the app.`,
  otp: (otp) => `BBD: Your OTP is ${otp}. Valid for 10 minutes. Do not share.`,
};

// ── Send SMS ─────────────────────────────────────────────
const sendSMS = async ({ to, templateName, templateData = [] }) => {
  try {
    const client = getClient();
    if (!client) {
      console.log(
        `[SMS skipped - no Twilio config] To: ${to}, Template: ${templateName}`,
      );
      return;
    }
    const body = smsTemplates[templateName]?.(...templateData);
    if (!body) throw new Error(`SMS template "${templateName}" not found`);

    // Ensure phone has country code
    const phone = to.startsWith("+") ? to : `+91${to}`;

    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });
    console.log(`✅ SMS sent to ${phone} — ${templateName}`);
  } catch (err) {
    console.error(`❌ SMS failed to ${to}:`, err.message);
    // Don't throw — SMS failure shouldn't break the main flow
  }
};

module.exports = sendSMS;
