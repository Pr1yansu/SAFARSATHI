const nodemailer = require("nodemailer");

const sendMail = async (email, subject, text, html) => {
  try {
    const port = Number(process.env.EMAIL_PORT) || 587;
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp-relay.brevo.com",
      port: port,
      secure: port === 465, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000, // 10 sec timeout
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"SAFARSATHI" <no-reply@safarsathi.com>',
      to: email,
      subject,
      text,
      html,
    });

    console.log("Email sent via SMTP: %s", info.messageId);
    return info;
  } catch (smtpError) {
    console.warn("SMTP attempt failed, trying Brevo HTTP API fallback...", smtpError.message);

    // Fallback: Use Brevo HTTP REST API (Works on 443 HTTPS on Render & Vercel)
    try {
      if (process.env.EMAIL_PASS) {
        const response = await fetch("https://api.brevo.com/v3/smtp/email", {
          method: "POST",
          headers: {
            "accept": "application/json",
            "api-key": process.env.EMAIL_PASS,
            "content-type": "application/json"
          },
          body: JSON.stringify({
            sender: {
              name: "SAFARSATHI",
              email: process.env.EMAIL_FROM || "priyansuchowdhury.official@gmail.com"
            },
            to: [{ email: email }],
            subject: subject,
            htmlContent: html || text,
            textContent: text
          })
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Email sent successfully via Brevo HTTP API:", data.messageId || "Success");
          return data;
        } else {
          const errData = await response.json();
          console.error("Brevo HTTP API failed:", errData);
        }
      }
    } catch (httpError) {
      console.error("Brevo HTTP API fallback error:", httpError);
    }

    // Return gracefully or log instead of throwing unhandled server crash
    console.error("Failed to send email to:", email);
  }
};

module.exports = { sendMail };

