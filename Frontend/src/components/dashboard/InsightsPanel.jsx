import { CalendarDays, TrendingDown, TrendingUp } from "lucide-react";
import { formatCurrency } from "./formatters";

export default function InsightsPanel({ highestExpense, latestTransaction, savingsRate }) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500">
          <TrendingDown size={18} />
          Biggest expense
        </div>
        <p className="text-lg font-semibold text-gray-950">
          {highestExpense ? highestExpense.title : "No expense yet"}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {highestExpense ? formatCurrency(highestExpense.amount) : "Start tracking expenses"}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500">
          <CalendarDays size={18} />
          Latest activity
        </div>
        <p className="text-lg font-semibold text-gray-950">
          {latestTransaction ? latestTransaction.title : "No activity"}
        </p>
        <p className="mt-1 text-sm text-gray-500">
          {latestTransaction ? formatCurrency(latestTransaction.amount) : "Add your first transaction"}
        </p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500">
          <TrendingUp size={18} />
          Savings rate
        </div>
        <p className="text-lg font-semibold text-gray-950">{savingsRate}%</p>
        <p className="mt-1 text-sm text-gray-500">Income left after expenses</p>
      </div>
    </section>
  );
}
