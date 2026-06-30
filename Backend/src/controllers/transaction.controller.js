const Transaction = require("../models/user.transaction");
const { Parser } = require("json2csv");
const {
  sendMonthlyReportEmail,
  sendBudgetAlertEmail,
} = require("../services/email.service");
const {
  scheduleRecurringTransaction,
  stopRecurringTransaction,
  getNextExecutionDate,
} = require("../services/recurring.service");


const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const getMonthBounds = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth();

  return {
    monthKey: `${year}-${String(month + 1).padStart(2, "0")}`,
    monthLabel: date.toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
    }),
    start: new Date(year, month, 1),
    end: new Date(year, month + 1, 1),
  };
};

const getMonthlySummary = async (userId, date = new Date()) => {
  const { monthKey, monthLabel, start, end } = getMonthBounds(date);
  const transactions = await Transaction.find({
    user: userId,
    date: { $gte: start, $lt: end },
  }).lean();

  const categoryTotals = {};
  const totals = transactions.reduce(
    (summary, tx) => {
      const amount = Number(tx.amount) || 0;

      if (tx.type === "income") {
        summary.income += amount;
      }

      if (tx.type === "expense") {
        summary.expense += amount;
        const category = tx.category || "General";
        categoryTotals[category] = (categoryTotals[category] || 0) + amount;
      }

      return summary;
    },
    { income: 0, expense: 0 },
  );

  return {
    monthKey,
    monthLabel,
    categoryBreakdown: Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount),
    income: totals.income,
    expense: totals.expense,
    balance: totals.income - totals.expense,
  };
};

const sendBudgetAlertIfNeeded = async (user) => {
  const budgetLimit = Number(user.monthlyBudgetLimit) || 0;
  if (!user.email || budgetLimit <= 0) return;

  const summary = await getMonthlySummary(user._id);
  if (
    summary.expense <= budgetLimit ||
    user.lastBudgetAlertMonth === summary.monthKey
  ) {
    return;
  }

  await sendBudgetAlertEmail(user.email, {
    limit: formatCurrency(budgetLimit),
    spent: formatCurrency(summary.expense),
    overBy: formatCurrency(summary.expense - budgetLimit),
  });

  user.lastBudgetAlertMonth = summary.monthKey;
  await user.save();
};

exports.createTransaction = async (req, res) => {
  const { title, amount, type, category, date, isRecurring, frequency } = req.body;
  try {
    if (isRecurring && !frequency) {
      return res
        .status(400)
        .json({ message: "Recurring transactions must include a frequency." });
    }

    const nextExecutionDate =
      isRecurring && frequency
        ? getNextExecutionDate(date ? new Date(date) : new Date(), frequency)
        : undefined;

    const transaction = await Transaction.create({
      user: req.user._id,
      title,
      amount,
      type,
      category,
      date,
      isRecurring: Boolean(isRecurring),
      frequency: isRecurring ? frequency : undefined,
      nextExecutionDate,
    });

    if (isRecurring) {
      scheduleRecurringTransaction(transaction);
    }

    if (transaction.type === "expense") {
      sendBudgetAlertIfNeeded(req.user).catch((error) => {
        console.error("Failed to send budget alert email:", error.message);
      });
    }

    res.status(201).json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create transaction", error: error.message });
  }
};
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(transactions);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch transactions", error: error.message });
  }
};
exports.updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { isRecurring, frequency } = req.body;
  try {
    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (isRecurring && !frequency) {
      return res
        .status(400)
        .json({ message: "Recurring transactions must include a frequency." });
    }

    const wasRecurring = transaction.isRecurring;

    Object.assign(transaction, req.body);

    if (isRecurring && frequency) {
      transaction.nextExecutionDate = getNextExecutionDate(
        transaction.date || new Date(),
        frequency
      );
      if (!wasRecurring) {
        scheduleRecurringTransaction(transaction);
      }
    } else if (wasRecurring && !isRecurring) {
      stopRecurringTransaction(id);
      transaction.nextExecutionDate = undefined;
    }

    await transaction.save();

    if (transaction.type === "expense") {
      sendBudgetAlertIfNeeded(req.user).catch((error) => {
        console.error("Failed to send budget alert email:", error.message);
      });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update transaction", error: error.message });
  }
};
exports.deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });
    if (!transaction)
      return res.status(404).json({ message: "Transaction not found" });

    if (transaction.isRecurring) {
      stopRecurringTransaction(id);
    }

    res.status(200).json({ message: "Transaction deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete transaction", error: error.message });
  }
};

module.exports.sendMonthlyReport = async (req, res) => {
  try {
    const summary = await getMonthlySummary(req.user._id);
    const budgetLimit = Number(req.user.monthlyBudgetLimit) || 0;
    const overBudget = budgetLimit > 0 && summary.expense > budgetLimit;

    await sendMonthlyReportEmail(req.user.email, {
      monthLabel: summary.monthLabel,
      income: formatCurrency(summary.income),
      expense: formatCurrency(summary.expense),
      balance: formatCurrency(summary.balance),
      budgetLimit: budgetLimit > 0 ? formatCurrency(budgetLimit) : "Not set",
      budgetStatus:
        budgetLimit > 0
          ? overBudget
            ? `${formatCurrency(summary.expense - budgetLimit)} over budget`
            : `${formatCurrency(budgetLimit - summary.expense)} remaining`
          : "No monthly budget configured",
      categoryBreakdown: summary.categoryBreakdown.map((item) => ({
        category: item.category,
        amount: formatCurrency(item.amount),
      })),
    });

    res.status(200).json({ message: "Monthly report sent to your email." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send monthly report", error: error.message });
  }
};

module.exports.exportTransactions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ user: userId }).lean();

    const fields = ["date", "title", "category", "type", "amount"];

    const parser = new Parser({ fields });
    const csv = parser.parse(transactions);

    res.header("Content-Type", "text/csv");
    res.attachment("transactions.csv");
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
