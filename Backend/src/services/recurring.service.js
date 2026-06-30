const cron = require("node-cron");
const Transaction = require("../models/user.transaction");

const scheduledJobs = new Map();

const getNextCronTime = (frequency) => {
  switch (frequency) {
    case "daily":
      return "0 0 * * *"; // Every day at 00:00
    case "weekly":
      return "0 0 * * 0"; // Every Sunday at 00:00
    case "monthly":
      return "0 0 1 * *"; // First day of every month at 00:00
    case "yearly":
      return "0 0 1 1 *"; // January 1st at 00:00
    default:
      return "0 0 * * *";
  }
};

const getNextExecutionDate = (date, frequency) => {
  const nextDate = new Date(date);

  switch (frequency) {
    case "daily":
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case "weekly":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "yearly":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }

  return nextDate;
};

const createRecurringInstance = async (template) => {
  try {
    const newTransaction = await Transaction.create({
      user: template.user,
      title: template.title,
      amount: template.amount,
      type: template.type,
      category: template.category,
      date: new Date(),
      isRecurring: false,
      recurringTemplate: template._id,
    });

    template.nextExecutionDate = getNextExecutionDate(
      new Date(),
      template.frequency
    );
    await template.save();

    console.log(
      `[RECURRING] Created transaction: ${newTransaction.title} for user ${template.user}`
    );
    return newTransaction;
  } catch (error) {
    console.error(
      `[RECURRING] Error creating recurring instance for template ${template._id}:`,
      error.message
    );
  }
};

const scheduleRecurringTransaction = (template) => {
  const jobId = `recurring_${template._id}`;

  if (scheduledJobs.has(jobId)) {
    const existingJob = scheduledJobs.get(jobId);
    existingJob.stop();
  }

  const cronTime = getNextCronTime(template.frequency);

  const job = cron.schedule(cronTime, async () => {
    await createRecurringInstance(template);
  });

  scheduledJobs.set(jobId, job);
  console.log(`[CRON] Scheduled recurring transaction: ${template.title} (${cronTime})`);
};

const initializeRecurringTransactions = async () => {
  try {
    const recurringTemplates = await Transaction.find({
      isRecurring: true,
      recurringTemplate: { $exists: false },
    });

    console.log(
      `[CRON] Initializing ${recurringTemplates.length} recurring transactions`
    );

    recurringTemplates.forEach((template) => {
      scheduleRecurringTransaction(template);
    });
  } catch (error) {
    console.error(
      "[CRON] Error initializing recurring transactions:",
      error.message
    );
  }
};

const stopRecurringTransaction = (templateId) => {
  const jobId = `recurring_${templateId}`;
  if (scheduledJobs.has(jobId)) {
    const job = scheduledJobs.get(jobId);
    job.stop();
    scheduledJobs.delete(jobId);
    console.log(`[CRON] Stopped recurring transaction: ${jobId}`);
  }
};

const stopAllRecurringTransactions = () => {
  scheduledJobs.forEach((job) => job.stop());
  scheduledJobs.clear();
  console.log("[CRON] All recurring transactions stopped");
};

module.exports = {
  initializeRecurringTransactions,
  scheduleRecurringTransaction,
  stopRecurringTransaction,
  stopAllRecurringTransactions,
  getNextExecutionDate,
};
