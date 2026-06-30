import { ArrowDownCircle, ArrowUpCircle, Landmark } from "lucide-react";
import { formatCurrency } from "./formatters";

const cards = [
  {
    key: "income",
    label: "Total Income",
    icon: ArrowUpCircle,
    tone: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "expense",
    label: "Total Expense",
    icon: ArrowDownCircle,
    tone: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    key: "balance",
    label: "Available Balance",
    icon: Landmark,
    tone: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

export default function SummaryCards({ income, expense, balance }) {
  const values = { income, expense, balance };

  return (
    <section className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.key}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <span className={`rounded-md p-2 ${card.bg} ${card.tone}`}>
                <Icon size={20} />
              </span>
            </div>
            <p className={`mt-4 text-2xl font-bold ${card.tone}`}>
              {formatCurrency(values[card.key])}
            </p>
          </div>
        );
      })}
    </section>
  );
}
