import { Download, Search } from "lucide-react";
import { downloadTransactionsCsv } from "../../utils/api.transaction.jsx";

const handleExport = async () => {
  try {
    const response = await downloadTransactionsCsv();
    const contentType = response.headers["content-type"] || "";

    if (!contentType.includes("text/csv")) {
      throw new Error("Export endpoint did not return CSV.");
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));

    const link = document.createElement("a");

    link.href = url;

    link.setAttribute("download", "transactions.csv");

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  }
};

export default function TransactionFilters({
  filter,
  categoryFilter,
  categoryOptions,
  search,
  onFilterChange,
  onCategoryFilterChange,
  onSearchChange,
}) {
  return (
    <section className="flex flex-col gap-3 border-b border-gray-200 bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-base font-semibold text-gray-950">Transactions</h2>
        <p className="text-sm text-gray-500">
          Review, filter, edit, and remove entries.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={17}
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search title or category"
            className="h-10 w-full rounded-md border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-gray-900 sm:w-64"
          />
        </label>
        <select
          value={filter}
          onChange={(e) => onFilterChange(e.target.value)}
          className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
        >
          <option value="all">All transactions</option>
          <option value="income">Income only</option>
          <option value="expense">Expense only</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
        >
          <option value="all">All categories</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleExport}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-gray-900 px-4 text-sm font-medium text-white transition hover:bg-gray-700"
          title="Download CSV"
        >
          <Download size={17} />
          CSV
        </button>
      </div>
    </section>
  );
}
