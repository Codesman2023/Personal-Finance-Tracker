export const defaultCategories = {
  income: ["Salary", "Freelance", "Business", "Investment", "Gift", "Other Income"],
  expense: ["Food", "Transport", "Bills", "Shopping", "Rent", "Health", "Education", "Travel", "General"],
};

export const getCategoriesByType = (categories, type) => categories[type] || [];

export const normalizeCategoryName = (name) => name.trim().replace(/\s+/g, " ");

export const mergeCategories = (savedCategories = {}) => ({
  income: Array.from(new Set([...defaultCategories.income, ...(savedCategories.income || [])])),
  expense: Array.from(new Set([...defaultCategories.expense, ...(savedCategories.expense || [])])),
});
