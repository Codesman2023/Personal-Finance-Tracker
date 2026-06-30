import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../components/dashboard/formatters";

const COLORS = ["#059669", "#e11d48", "#d97706", "#4f46e5", "#0891b2", "#7c3aed", "#475569"];

export default function ChartSection({ transactions }) {
  const categoryTotals = transactions.reduce((acc, tx) => {
    const category = tx.category || "General";
    acc[category] = (acc[category] || 0) + Number(tx.amount);
    return acc;
  }, {});

  const categoryData = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 7);

  const monthlyData = transactions.reduce((acc, tx) => {
    const date = new Date(tx.date || tx.createdAt);
    const month = date.toLocaleDateString("en-IN", { month: "short" });

    if (!acc[month]) {
      acc[month] = { month, income: 0, expense: 0 };
    }

    acc[month][tx.type] += Number(tx.amount);
    return acc;
  }, {});

  const cashflowData = Object.values(monthlyData).slice(-6);

  if (!transactions.length) {
    return (
      <section className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
        <p className="text-base font-semibold text-gray-950">Charts will appear here</p>
        <p className="mt-1 text-sm text-gray-500">Add transactions to see category and cashflow insights.</p>
      </section>
    );
  }

  return (
    <section className="grid gap-4 xl:grid-cols-1">
      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-950">Category breakdown</h2>
          <p className="text-sm text-gray-500">Where your money is grouped.</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={62} outerRadius={104}>
                {categoryData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-950">Monthly cashflow</h2>
          <p className="text-sm text-gray-500">Income against expenses by month.</p>
        </div>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cashflowData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `INR ${value}`} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="income" fill="#059669" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expense" fill="#e11d48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
