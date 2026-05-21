import nodemailer from 'nodemailer';
import dns from 'dns';

// Force IPv4 globally
dns.setDefaultResultOrder('ipv4first');

// Create transporter ONCE (reuse connection pool)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // SSL direct connection (faster than STARTTLS on port 587)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  },
  family: 4,
  pool: true, // reuse connections (much faster after first email)
  maxConnections: 3,
  connectionTimeout: 120000, // 2 minutes to connect (Render is slow)
  greetingTimeout: 60000, // 1 minute for greeting
  socketTimeout: 120000 // 2 minutes socket timeout
});

export const sendEmail = async (options, retries = 2) => {
  const mailOptions = {
    from: `ImaginEx Security <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `
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
    `,
  };

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      console.log(`📧 Attempt ${attempt}: Sending email to ${options.email}...`);
      const info = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent successfully:", info.messageId);
      return info;
    } catch (error) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      if (attempt <= retries) {
        console.log(`⏳ Retrying in 3 seconds...`);
        await new Promise(resolve => setTimeout(resolve, 3000));
      } else {
        console.error("All attempts failed. Full error:", error);
        throw error;
      }
    }
  }
};
