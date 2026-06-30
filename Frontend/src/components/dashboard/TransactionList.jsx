import { Check, Pencil, Trash2, X } from "lucide-react";
import { getCategoriesByType } from "./categories";
import { formatCurrency, formatDate } from "./formatters";

export default function TransactionList({
  transactions,
  editId,
  editForm,
  categories,
  onEditClick,
  onEditChange,
  onUpdate,
  onCancelEdit,
  onDelete,
}) {
  if (!transactions.length) {
    return (
      <div className="bg-white px-5 py-12 text-center">
        <p className="text-base font-semibold text-gray-900">No transactions found</p>
        <p className="mt-1 text-sm text-gray-500">Add a transaction or change your filters.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs uppercase text-gray-500">
            <th className="px-5 py-3 font-semibold">Transaction</th>
            <th className="px-5 py-3 font-semibold">Category</th>
            <th className="px-5 py-3 font-semibold">Date</th>
            <th className="px-5 py-3 font-semibold">Type</th>
            <th className="px-5 py-3 font-semibold">Recurring</th>
            <th className="px-5 py-3 text-right font-semibold">Amount</th>
            <th className="px-5 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => {
            const isEditing = editId === tx._id;
            const isIncome = tx.type === "income";
            const categoryOptions = getCategoriesByType(categories, editForm.type || tx.type);

            return (
              <tr key={tx._id} className="border-b border-gray-100 last:border-0">
                <td className="px-5 py-4">
                  {isEditing ? (
                    <input
                      name="title"
                      value={editForm.title}
                      onChange={onEditChange}
                      className="h-9 w-full rounded-md border border-gray-300 px-3 outline-none focus:border-gray-900"
                    />
                  ) : (
                    <p className="font-medium text-gray-950">{tx.title}</p>
                  )}
                </td>
                <td className="px-5 py-4">
                  {isEditing ? (
                    <select
                      name="category"
                      value={editForm.category}
                      onChange={onEditChange}
                      className="h-9 w-full rounded-md border border-gray-300 px-3 outline-none focus:border-gray-900"
                    >
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-gray-600">{tx.category || "General"}</span>
                  )}
                </td>
                <td className="px-5 py-4 text-gray-600">
                  {isEditing ? (
                    <input
                      name="date"
                      type="date"
                      value={editForm.date?.slice(0, 10)}
                      onChange={onEditChange}
                      className="h-9 rounded-md border border-gray-300 px-3 outline-none focus:border-gray-900"
                    />
                  ) : (
                    formatDate(tx.date || tx.createdAt)
                  )}
                </td>
                <td className="px-5 py-4">
                  {isEditing ? (
                    <select
                      name="type"
                      value={editForm.type}
                      onChange={onEditChange}
                      className="h-9 rounded-md border border-gray-300 px-3 outline-none focus:border-gray-900"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  ) : (
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isIncome
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {tx.type}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          name="isRecurring"
                          type="checkbox"
                          checked={editForm.isRecurring}
                          onChange={onEditChange}
                          className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                        />
                        <span className="text-xs">Recurring</span>
                      </label>
                      {editForm.isRecurring && (
                        <select
                          name="frequency"
                          value={editForm.frequency}
                          onChange={onEditChange}
                          className="h-9 rounded-md border border-gray-300 px-2 outline-none focus:border-gray-900 text-xs"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      )}
                    </div>
                  ) : (
                    <>
                      {tx.isRecurring ? (
                        <span className="inline-block rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          {tx.frequency?.charAt(0).toUpperCase() + tx.frequency?.slice(1)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">-</span>
                      )}
                    </>
                  )}
                </td>
                <td className="px-5 py-4 text-right">
                  {isEditing ? (
                    <input
                      name="amount"
                      type="number"
                      min="0"
                      value={editForm.amount}
                      onChange={onEditChange}
                      className="h-9 w-28 rounded-md border border-gray-300 px-3 text-right outline-none focus:border-gray-900"
                    />
                  ) : (
                    <span className={`font-semibold ${isIncome ? "text-emerald-600" : "text-rose-600"}`}>
                      {isIncome ? "+" : "-"}
                      {formatCurrency(tx.amount)}
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => onUpdate(tx._id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gray-900 text-white hover:bg-gray-700"
                          title="Save transaction"
                        >
                          <Check size={17} />
                        </button>
                        <button
                          type="button"
                          onClick={onCancelEdit}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                          title="Cancel edit"
                        >
                          <X size={17} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onEditClick(tx)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100"
                          title="Edit transaction"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(tx._id)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50"
                          title="Delete transaction"
                        >
                          <Trash2 size={16} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
