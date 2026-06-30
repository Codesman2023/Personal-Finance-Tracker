import { AlertTriangle, Mail, Save, Target } from "lucide-react";
import { formatCurrency } from "./formatters";

export default function BudgetPanel({
  budgetLimit,
  monthlyExpense,
  onBudgetChange,
  onBudgetSave,
  onMonthlyReportEmail,
  isBudgetSaving,
  isReportSending,
  message,
}) {
  const percentUsed = budgetLimit > 0 ? Math.min((monthlyExpense / budgetLimit) * 100, 100) : 0;
  const isOverBudget = budgetLimit > 0 && monthlyExpense > budgetLimit;
  const remaining = budgetLimit - monthlyExpense;

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-50 text-amber-600">
            <Target size={20} />
          </span>
          <div>
            <h2 className="text-base font-semibold text-gray-950">Monthly budget</h2>
            <p className="text-sm text-gray-500">
              {isOverBudget
                ? `${formatCurrency(Math.abs(remaining))} over this month's limit`
                : `${formatCurrency(Math.max(remaining, 0))} left for this month`}
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 md:w-56">
          <label className="flex flex-col gap-1 text-sm font-medium text-gray-600">
            Budget limit
            <input
              type="number"
              min="0"
              value={budgetLimit}
              onChange={(e) => onBudgetChange(Number(e.target.value))}
              className="h-10 rounded-md border border-gray-300 px-3 text-gray-900 outline-none focus:border-gray-900"
            />
          </label>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onBudgetSave}
              disabled={isBudgetSaving}
              title="Save budget"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-gray-950 px-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={16} />
              {isBudgetSaving ? "Saving" : "Save"}
            </button>
            <button
              type="button"
              onClick={onMonthlyReportEmail}
              disabled={isReportSending}
              title="Email monthly report"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-300 px-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Mail size={16} />
              {isReportSending ? "Sending" : "Report"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full ${isOverBudget ? "bg-rose-500" : "bg-emerald-500"}`}
          style={{ width: `${percentUsed}%` }}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <span>{formatCurrency(monthlyExpense)} spent</span>
        <span>{Math.round(percentUsed)}% used</span>
      </div>

      {isOverBudget && (
        <div className="mt-4 flex items-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          <AlertTriangle size={18} />
          You have crossed your monthly budget.
        </div>
      )}

      {message && (
        <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          {message}
        </div>
      )}
    </section>
  );
}