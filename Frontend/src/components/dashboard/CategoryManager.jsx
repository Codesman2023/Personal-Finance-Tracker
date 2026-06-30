import { FolderPlus } from "lucide-react";
import { getCategoriesByType } from "./categories";

export default function CategoryManager({
  categories,
  newCategory,
  onNewCategoryChange,
  onAddCategory,
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan-50 text-cyan-700">
          <FolderPlus size={20} />
        </span>
        <div>
          <h2 className="text-base font-semibold text-gray-950">Transaction categories</h2>
          <p className="text-sm text-gray-500">Create categories for cleaner reports and filtering.</p>
        </div>
      </div>

      <form onSubmit={onAddCategory} className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
          <select
            name="type"
            value={newCategory.type}
            onChange={onNewCategoryChange}
            className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            name="name"
            value={newCategory.name}
            onChange={onNewCategoryChange}
            placeholder="Category name"
            className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none focus:border-gray-900"
          />
        </div>
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
        >
          <FolderPlus size={17} />
          Add Category
        </button>
      </form>

      <div className="mt-5 grid gap-4">
        {["income", "expense"].map((type) => (
          <div key={type}>
            <p className="mb-2 text-xs font-semibold uppercase text-gray-500">{type}</p>
            <div className="flex flex-wrap gap-2">
              {getCategoriesByType(categories, type).map((category) => (
                <span
                  key={`${type}-${category}`}
                  className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
