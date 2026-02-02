const nodemailer = require("nodemailer");
const { env } = require("../config/env");

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass
  }
});

const sendEmailChangeConfirmation = async ({ to, confirmUrl }) => {
  const from = env.smtp.from || "no-reply@smartworkshop.local";
  const subject = "Confirm your new email";
  const text = `Please confirm your new email by visiting: ${confirmUrl}`;
  const html = `
    <p>Please confirm your new email by clicking the link below:</p>
    <p><a href="${confirmUrl}">${confirmUrl}</a></p>
  `;

  await transporter.sendMail({ from, to, subject, text, html });
};

module.exports = { sendEmailChangeConfirmation };
