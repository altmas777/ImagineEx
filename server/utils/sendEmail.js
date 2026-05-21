import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // use TLS (STARTTLS)
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false // allows self-signed certificates
      },
      connectionTimeout: 10000, // 10 seconds to connect
      greetingTimeout: 10000, // 10 seconds for greeting
      socketTimeout: 15000 // 15 seconds max
    });

    // Removed transporter.verify() to speed up and avoid hangs on cloud hosting (Render)

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

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    console.error("Full error:", error);
    throw error;
  }
};
