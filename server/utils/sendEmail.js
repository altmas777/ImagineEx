import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // using Gmail as requested
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `ImaginEx Security <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};
