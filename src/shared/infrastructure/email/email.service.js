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

const resolveFromAddress = () => {
  const fromAddress = env.smtp.from || "no-reply@smartworkshop.local";
  const fromName = String(env.smtp.fromName || "").trim();
  return fromName ? { name: fromName, address: fromAddress } : fromAddress;
};

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
  const from = resolveFromAddress();
  const subject = "Confirm your new email";
  const text = [
    "We received a request to update your SmartWorkshop email address.",
    `Please confirm the change by visiting: ${confirmUrl}`,
    "If you did not request this change, you can ignore this message and no updates will be made."
  ].join("\n");
  const html = renderEmailLayout({
    title: "Confirm your new email",
    intro: `
      <p style="margin:0 0 14px;">Hello,</p>
      <p style="margin:0;">
        We received a request to update your SmartWorkshop email address. Click the button below to confirm the new email before any changes are applied.
      </p>
    `,
    ctaLabel: "Confirm Email",
    ctaUrl: confirmUrl,
    footerNote: `
      <p style="margin:0 0 12px;">Changed fields:</p>
      <ul style="margin:0 0 18px; padding:0 0 0 18px; color:#e9eef6; font-size:16px; line-height:1.8;">
        <li style="margin:0 0 10px;">Email address</li>
      </ul>
      <p style="margin:0;">
        If you did not request this change, you can safely ignore this email and your current address will remain unchanged.
      </p>
    `
  });

  await transporter.sendMail({ from, to, subject, text, html, replyTo: from });
};

const sendPasswordResetEmail = async ({ to, resetUrl }) => {
  const from = resolveFromAddress();
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

  await transporter.sendMail({ from, to, subject, text, html, replyTo: from });
};

const sendLoginTwoFactorEmail = async ({ to, code, expiresMinutes = 10 }) => {
  const from = resolveFromAddress();
  const subject = "Your SmartWorkshop sign-in code";
  const text = `Your SmartWorkshop verification code is ${code}. It expires in ${expiresMinutes} minutes.`;
  const html = `
    <div style="margin:0; padding:32px; background:#232326; color:#e9eef6; font-family:Arial, Helvetica, sans-serif;">
      <div style="max-width:680px; margin:0 auto; background:#1b1d22; border:1px solid #3b4049; border-radius:12px; padding:32px;">
        <h1 style="margin:0 0 16px; font-size:28px; line-height:1.2;">SmartWorkshop verification code</h1>
        <p style="margin:0 0 24px; font-size:16px; line-height:1.6; color:#cfd6e2;">
          Use the code below to complete your sign in. It expires in ${expiresMinutes} minutes.
        </p>
        <div style="display:inline-block; min-width:180px; padding:18px 24px; border-radius:10px; background:#0f172a; border:1px solid #334155; font-size:34px; font-weight:700; letter-spacing:0.2em; text-align:center;">
          ${code}
        </div>
        <p style="margin:24px 0 0; font-size:14px; line-height:1.6; color:#9ca3af;">
          If you did not try to sign in, you can ignore this email.
        </p>
      </div>
    </div>
  `;

  console.info("[email] sending login 2fa code", { to, subject, from, smtpHost: env.smtp.host });
  const info = await transporter.sendMail({ from, to, subject, text, html, replyTo: from });
  console.info("[email] login 2fa code sent", {
    to,
    subject,
    from,
    messageId: info?.messageId,
    response: info?.response
  });
};

const sendMechanicAccountReadyEmail = async ({ to, homeUrl }) => {
  const from = resolveFromAddress();
  const subject = "Your SmartWorkshop mechanic account is ready";
  const safeHomeUrl = homeUrl || `${env.appBaseUrl || "http://localhost:3000"}/`;
  const text = [
    "Your SmartWorkshop mechanic account has been activated.",
    "You can return to the home page to continue with your setup and start using the platform.",
    `Home: ${safeHomeUrl}`
  ].join("\n");
  console.info("[email] sending mechanic account ready email", { to, subject, from, smtpHost: env.smtp.host });
  const html = renderEmailLayout({
    title: "Account Ready",
    intro: `
      <p style="margin:0 0 14px;">Hello,</p>
      <p style="margin:0 0 14px;">
        Your SmartWorkshop mechanic account is now ready. Your password has been set and you can continue from the home page.
      </p>
      <p style="margin:0;">
        We sent this message as confirmation so you can verify the account setup was completed successfully.
      </p>
    `,
    ctaLabel: "Go to Home",
    ctaUrl: safeHomeUrl,
    footerNote: `
      <p style="margin:0;">
        If you did not expect this email, please contact support before using the account.
      </p>
    `
  });

  const info = await transporter.sendMail({ from, to, subject, text, html, replyTo: from });
  console.info("[email] mechanic account ready email sent", {
    to,
    subject,
    from,
    messageId: info?.messageId,
    response: info?.response
  });
};

const sendMechanicSetupCodeEmail = async ({ to, code, expiresMinutes = 10 }) => {
  const from = resolveFromAddress();
  const subject = "Your SmartWorkshop setup verification code";
  const text = `Your SmartWorkshop verification code is ${code}. It expires in ${expiresMinutes} minutes.`;
  console.info("[email] sending mechanic setup code", { to, subject, from, smtpHost: env.smtp.host });
  const html = `
    <div style="margin:0; padding:32px; background:#232326; color:#e9eef6; font-family:Arial, Helvetica, sans-serif;">
      <div style="max-width:680px; margin:0 auto; background:#1b1d22; border:1px solid #3b4049; border-radius:12px; padding:32px;">
        <h1 style="margin:0 0 16px; font-size:28px; line-height:1.2;">Verify your SmartWorkshop account</h1>
        <p style="margin:0 0 24px; font-size:16px; line-height:1.6; color:#cfd6e2;">
          Use the code below to confirm your password setup. It expires in ${expiresMinutes} minutes.
        </p>
        <div style="display:inline-block; min-width:180px; padding:18px 24px; border-radius:10px; background:#0f172a; border:1px solid #334155; font-size:34px; font-weight:700; letter-spacing:0.2em; text-align:center;">
          ${code}
        </div>
        <p style="margin:24px 0 0; font-size:14px; line-height:1.6; color:#9ca3af;">
          If you did not request this setup step, you can ignore this email.
        </p>
      </div>
    </div>
  `;

  const info = await transporter.sendMail({ from, to, subject, text, html, replyTo: from });
  console.info("[email] mechanic setup code sent", {
    to,
    subject,
    from,
    messageId: info?.messageId,
    response: info?.response
  });
};

const sendAccountChangeNotification = async ({ to, title, changes = [] }) => {
  const from = resolveFromAddress();
  const safeChanges = Array.isArray(changes) ? changes.filter(Boolean) : [];
  const subject = title || "Your SmartWorkshop account was updated";
  const normalizedChanges = safeChanges.map((line) => String(line).toLowerCase());
  const isPasswordChange = normalizedChanges.some((line) => line.includes("password"));
  const isMechanicProfileChange = normalizedChanges.some(
    (line) =>
      line.includes("years of experience") ||
      line.includes("work history") ||
      line.includes("travel radius") ||
      line.includes("mobile service") ||
      line.includes("contact address") ||
      line.includes("premises address") ||
      line.includes("services offered")
  );
  const isProfileChange = normalizedChanges.some(
    (line) =>
      line.includes("full name") ||
      line.includes("phone") ||
      line.includes("username") ||
      line.includes("address") ||
      line.includes("role") ||
      line.includes("status") ||
      line.includes("application status")
  );
  const changeContext = isPasswordChange
    ? {
        heading: "Password updated",
        intro: "We wanted to let you know that your SmartWorkshop password was changed.",
        footer:
          "If you did not change your password, contact support immediately and review your account security."
      }
    : isMechanicProfileChange
      ? {
          heading: "Mechanic profile updated",
          intro: "We wanted to let you know that your mechanic profile details were updated.",
          footer:
            "If you did not make this change, contact support immediately and review your mechanic profile settings."
        }
      : isProfileChange
        ? {
            heading: "Account details updated",
            intro: "We wanted to let you know that your account details were updated.",
            footer:
              "If you did not make this change, contact support immediately and review your account settings."
          }
        : {
            heading: "Account updated",
            intro: "We wanted to let you know that a change was made to your SmartWorkshop account.",
        footer:
            "If you did not make this change, contact support immediately and review your account settings."
        };
  const subjectPrefix = "SmartWorkshop - ";
  const subjectByType = isPasswordChange
    ? `${subjectPrefix}Password changed`
    : isMechanicProfileChange
      ? `${subjectPrefix}Mechanic profile changed`
      : isProfileChange
        ? `${subjectPrefix}Account details changed`
        : `${subjectPrefix}Account updated`;
  const text = [
    changeContext.intro,
    ...safeChanges.map((line) => `- ${line}`)
  ].join("\n");
  const items = safeChanges.length
    ? safeChanges.map((line) => `<li style="margin:0 0 10px;">${line}</li>`).join("")
    : "<li style=\"margin:0 0 10px;\">An account change was recorded.</li>";
  const html = renderEmailLayout({
    title: changeContext.heading,
    intro: `
        <p style="margin:0 0 14px;">Hello,</p>
        <p style="margin:0;">
          ${changeContext.intro}
        </p>
      `,
    ctaLabel: "Open SmartWorkshop",
    ctaUrl: `${env.appBaseUrl || "http://localhost:3000"}/`,
    footerNote: `
        <p style="margin:0 0 12px;">Changed fields:</p>
        <ul style="margin:0; padding:0 0 0 18px; color:#e9eef6; font-size:16px; line-height:1.8;">
          ${items}
        </ul>
        <p style="margin:18px 0 0;">
          ${changeContext.footer}
        </p>
      `
  });

  await transporter.sendMail({ from, to, subject: subjectByType, text, html, replyTo: from });
};

module.exports = {
  sendEmailChangeConfirmation,
  sendPasswordResetEmail,
  sendLoginTwoFactorEmail,
  sendMechanicAccountReadyEmail,
  sendMechanicSetupCodeEmail,
  sendAccountChangeNotification
};

