const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT), // ✅ fix
      secure: false, // ✅ required for port 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AlumniConnect" <${process.env.SMTP_USER}>`, // ✅ better format
      to,
      subject,
      html,
    });

    console.log("✅ Email sent successfully");
  } catch (err) {
    console.error("❌ Email error:", err.message);
    throw err; // important so you see error in controller
  }
};

module.exports = { sendEmail };