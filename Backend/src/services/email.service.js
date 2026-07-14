const axios = require("axios");

const sendBrevoEmail = async ({ to, subject, text, html }) => {
  const fromName = process.env.BREVO_FROM_NAME || "Finance Tracker";
  const fromEmail = process.env.BREVO_FROM_EMAIL;

  if (!process.env.BREVO_API_KEY) {
    throw new Error("BREVO_API_KEY is not set");
  }
  if (!fromEmail) {
    throw new Error("BREVO_FROM_EMAIL is not set");
  }

  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: fromName, email: fromEmail },
        to: [{ email: to }],
        subject,
        textContent: text,
        htmlContent: html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
        timeout: 10000, // fail fast instead of hanging
      }
    );
  } catch (err) {
    const brevoMessage = err.response?.data?.message;
    const status = err.response?.status;
    throw new Error(
      `Brevo API error${status ? ` (${status})` : ""}: ${brevoMessage || err.message}`
    );
  }
};

module.exports.sendOtpEmail = async (email, otp) => {
  await sendBrevoEmail({
    to: email,
    subject: "Verify your Personal Finance Tracker account",
    text: `Your OTP is ${otp}. It expires in 10 minutes.`,
    html: `
        <h1>Verify your account</h1>
        <p>Use this OTP to verify your Personal Finance Tracker account:</p>
        <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px;">${otp}</p>
        <p>This OTP expires in 10 minutes.</p>
        <p>If you did not create this account, you can ignore this email.</p>
        `,
  });
};

module.exports.sendBudgetAlertEmail = async (email, budget) => {
  await sendBrevoEmail({
    to: email,
    subject: "Budget Alert: You have exceeded your monthly budget",
    text: `You have exceeded your monthly budget of ${budget}. Please review your expenses.`,
    html: `
                <h1>Budget Alert</h1>
        <p>You have spent <strong>${budget.spent}</strong> this month.</p>
        <p>Your monthly budget is <strong>${budget.limit}</strong>, so you are over by <strong>${budget.overBy}</strong>.</p>
        <p>Please review your expenses.</p>
        `,
  });
};

module.exports.sendMonthlyReportEmail = async (email, report) => {
  const categories = report.categoryBreakdown
    .map((item) => `<li><strong>${item.category}</strong>: ${item.amount}</li>`)
    .join("");

  await sendBrevoEmail({
    to: email,
    subject: `Monthly Finance Report - ${report.monthLabel}`,
    text: [
      `Monthly Finance Report - ${report.monthLabel}`,
      `Income: ${report.income}`,
      `Expense: ${report.expense}`,
      `Balance: ${report.balance}`,
      `Budget: ${report.budgetLimit}`,
      `Budget status: ${report.budgetStatus}`,
    ].join("\n"),
    html: `
        <h1>Monthly Finance Report - ${report.monthLabel}</h1>
        <p><strong>Income:</strong> ${report.income}</p>
        <p><strong>Expense:</strong> ${report.expense}</p>
        <p><strong>Balance:</strong> ${report.balance}</p>
        <p><strong>Budget:</strong> ${report.budgetLimit}</p>
        <p><strong>Budget status:</strong> ${report.budgetStatus}</p>
        <h2>Expense by category</h2>
        <ul>${categories || "<li>No expenses recorded this month.</li>"}</ul>
        `,
  });
};

module.exports.sendWelcomeEmail = async (email, fullName) => {
  await sendBrevoEmail({
    to: email,
    subject: "Welcome to Finance Tracker 🎉",
    html: `
        <!DOCTYPE html>
        <html>
        <body>
            <h2>Welcome ${fullName}</h2>
            <p>Your account has been created successfully.</p>

            <a href="http://localhost:5173/dashboard"
               style="
                    background:#e0531f;
                    color:white;
                    padding:10px 20px;
                    text-decoration:none;
                    border-radius:5px;">
                Go to Dashboard
            </a>

            <p>Thank you for joining us.</p>
        </body>
        </html>
    `,
  });
};

module.exports.sendForgotPasswordEmail = async (email, resetLink) => {
  await sendBrevoEmail({
    to: email,
    subject: "Password Reset Request",
    html: `
        <h1>Password Reset Request</h1>
        <p>We received a request to reset your password. Click the link below to set a new password:</p>
        <a href="${resetLink}"
           style="
                background:#e0531f;
                color:white;
                padding:10px 20px;
                text-decoration:none;
                border-radius:5px;">
            Reset Password
        </a>
        <p>If you did not request a password reset, please ignore this email.</p>
    `,
  });
};
