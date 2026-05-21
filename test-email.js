import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

async function testEmail() {
  console.log("Testing email with user:", process.env.EMAIL_USER);
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000
    });

    console.log("Verifying connection...");
    await transporter.verify();
    console.log("Connection verified!");

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // send to self
      subject: "ImaginEx Test Email",
      text: "This is a test email to verify credentials work."
    });

    console.log("Email sent successfully! Message ID:", info.messageId);
  } catch (error) {
    console.error("FAILED TO SEND EMAIL. EXACT ERROR:");
    console.error(error);
  }
}

testEmail();
