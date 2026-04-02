const nodemailer = require("nodemailer");
const { env } = require("../../config/env");

const transporter = nodemailer.createTransport({
  host: env.smtp.host,
  port: env.smtp.port,
  secure: env.smtp.port === 465,
  auth: {
    user: env.smtp.user,
    pass: env.smtp.pass
  }
});

const renderEmailLayout = ({ title, intro, ctaLabel, ctaUrl, footerNote }) => `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>
    <body style="margin:0; padding:0; background-color:#5b5b5b; font-family:Arial, Helvetica, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#5b5b5b; margin:0; padding:32px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:770px; background:#232326; border:1px solid #c7c7c7;">
              <tr>
                <td style="padding:38px 32px 12px; text-align:center;">
                  <div style="display:inline-block; color:#0aa06e; font-size:24px; font-weight:700; letter-spacing:0.01em;">
                    SmartWorkshop
                  </div>
                </td>
              </tr>
              <tr>
                <td style="padding:48px 66px 0; text-align:center;">
                  <h1 style="margin:0; color:#e9eef6; font-size:24px; line-height:1.3; font-weight:700;">
                    ${title}
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="padding:54px 66px 0; color:#d8e1ec; font-size:18px; line-height:1.9;">
                  ${intro}
                </td>
              </tr>
              <tr>
                <td align="center" style="padding:44px 66px 0;">
                  <a
                    href="${ctaUrl}"
                    style="display:inline-block; background:#047857; color:#ffffff; text-decoration:none; font-size:22px; line-height:1; padding:18px 38px; border-radius:3px; border:1px solid #0a8f63;"
                  >
                    ${ctaLabel}
                  </a>
                </td>
              </tr>
              <tr>
                <td style="padding:54px 66px 0; color:#d8e1ec; font-size:18px; line-height:1.9;">
                  ${footerNote}
                </td>
              </tr>
              <tr>
                <td style="padding:22px 66px 14px; color:#8e949d; font-size:12px; line-height:1.6; word-break:break-all;">
                  If the button does not work, copy and paste this link into your browser:<br />
                  <a href="${ctaUrl}" style="color:#8db4ff; text-decoration:underline;">${ctaUrl}</a>
                </td>
              </tr>
              <tr>
                <td style="padding:14px 20px 10px; text-align:center; color:#a7acb4; font-size:12px; line-height:1.6;">
                  &copy; SmartWorkshop. Secure vehicle service access.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`;

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

const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  const from = env.smtp.from || "no-reply@smartworkshop.local";
  const subject = "Reset your password";
  const text = `Reset your password by visiting: ${resetUrl}`;
  const html = renderEmailLayout({
    title: "Password Reset Request",
    intro: `
      <p style="margin:0 0 14px;">Hello,</p>
      <p style="margin:0;">
        We received a request to reset your SmartWorkshop password. Click the button below to
        choose a new password and recover access to your account.
      </p>
    `,
    ctaLabel: "Reset Password",
    ctaUrl: resetUrl,
    footerNote: `
      <p style="margin:0;">
        This reset link will expire after 2 hours. If you did not request a password reset,
        you can safely ignore this email and no changes will be made to your account.
      </p>
    `
  });

  await transporter.sendMail({ from, to, subject, text, html });
};

module.exports = { sendEmailChangeConfirmation, sendPasswordResetEmail };

