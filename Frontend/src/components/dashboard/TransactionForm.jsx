import { Plus } from "lucide-react";
import { getCategoriesByType } from "./categories";

export default function TransactionForm({ form, categories, onChange, onSubmit }) {
  const categoryOptions = getCategoriesByType(categories, form.type);

  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-gray-950">Add transaction</h2>
        <p className="text-sm text-gray-500">Record income and expenses as they happen.</p>
      </div>

      <form onSubmit={onSubmit} className="grid gap-3 lg:grid-cols-7">
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={onChange}
          required
          className="h-10 rounded-md border border-gray-300 px-3 outline-none focus:border-gray-900 lg:col-span-2"
        />
        <input
          name="amount"
          type="number"
          min="0"
          placeholder="Amount"
          value={form.amount}
          onChange={onChange}
          required
          className="h-10 rounded-md border border-gray-300 px-3 outline-none focus:border-gray-900"
        />
        <select
          name="type"
          value={form.type}
          onChange={onChange}
          className="h-10 rounded-md border border-gray-300 px-3 outline-none focus:border-gray-900"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <select
          name="category"
          value={form.category}
          onChange={onChange}
          className="h-10 rounded-md border border-gray-300 px-3 outline-none focus:border-gray-900"
        >
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <input
          name="date"
          type="date"
          value={form.date}
          onChange={onChange}
          className="h-10 rounded-md border border-gray-300 px-3 outline-none focus:border-gray-900"
        />
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-gray-900 px-4 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          <Plus size={18} />
          Add
        </button>

        {/* Recurring transaction fields */}
        <div className="lg:col-span-7 flex items-center gap-3 border-t border-gray-200 pt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              name="isRecurring"
              type="checkbox"
              checked={form.isRecurring}
              onChange={onChange}
              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
            />
            <span className="text-sm text-gray-700">Make recurring</span>
          </label>
          {form.isRecurring && (
            <select
              name="frequency"
              value={form.frequency}
              onChange={onChange}
              className="h-10 rounded-md border border-gray-300 px-3 outline-none focus:border-gray-900 text-sm"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          )}
        </div>
      </form>
    </section>
  );
}
