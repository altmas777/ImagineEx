// Dual email support:
// - If RESEND_API_KEY is set → use Resend HTTP API (for Render/production)
// - Otherwise → use Nodemailer Gmail SMTP (for localhost/development)

import nodemailer from 'nodemailer';
import fetch from 'node-fetch';

// ============ RESEND (HTTP API - works on Render) ============
const sendViaResend = async (options, htmlContent) => {
  const apiKey = process.env.RESEND_API_KEY;

  console.log(`📧 Sending email to ${options.email} via Resend API...`);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'ImaginEx <onboarding@resend.dev>',
      to: [options.email],
      subject: options.subject,
      text: options.message,
      html: htmlContent
    })
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ Resend API error:", data);
    throw new Error(data.message || 'Failed to send email');
  }

  console.log("✅ Email sent via Resend! ID:", data.id);
  return data;
};

// ============ NODEMAILER (SMTP - works on localhost) ============
const sendViaNodemailer = async (options, htmlContent) => {
  console.log(`📧 Sending email to ${options.email} via Gmail SMTP...`);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  const info = await transporter.sendMail({
    from: `ImaginEx Security <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: htmlContent
  });

  console.log("✅ Email sent via Gmail! ID:", info.messageId);
  return info;
};

// ============ MAIN EXPORT ============
export const sendEmail = async (options) => {
  const htmlContent = options.html || `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; background: #0A0A0F; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
      <div style="background: linear-gradient(135deg, #EC4899, #7C3AED); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 28px;">✨ ImaginEx</h1>
      </div>
      <div style="padding: 30px; color: #e0e0e0;">
        <p style="font-size: 16px; line-height: 1.6;">${options.message}</p>
      </div>
      <div style="padding: 15px 30px; background: rgba(255,255,255,0.05); text-align: center;">
        <p style="color: #888; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} ImaginEx. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    if (process.env.RESEND_API_KEY) {
      // Production (Render) → Resend HTTP API
      return await sendViaResend(options, htmlContent);
    } else {
      // Local development → Gmail SMTP
      return await sendViaNodemailer(options, htmlContent);
    }
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    throw error;
  }
};
