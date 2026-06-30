import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../utils/axios";
import ChartSection from "../Parts/ChartSection";
import { UserDataContext } from "../context/UserContext";
import CategoryManager from "./dashboard/CategoryManager";
import DashboardHeader from "./dashboard/DashboardHeader";
import InsightsPanel from "./dashboard/InsightsPanel";
import SummaryCards from "./dashboard/SummaryCards";
import TransactionFilters from "./dashboard/TransactionFilters";
import TransactionForm from "./dashboard/TransactionForm";
import TransactionList from "./dashboard/TransactionList";
import BudgetPanel from "./dashboard/BudgetPanel";
import {
  getCategoriesByType,
  mergeCategories,
  normalizeCategoryName,
} from "./dashboard/categories";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  sendMonthlyReportEmail,
  updateTransaction,
} from "../utils/api.transaction";
import { updateBudgetSettings } from "../utils/api.user";

const today = new Date().toISOString().slice(0, 10);
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

const initialForm = {
  title: "",
  amount: "",
  type: "income",
  category: "Salary",
  date: today,
  isRecurring: false,
  frequency: "monthly",
};

const categoryStorageKey = "finance-tracker-categories";

export default function Dashboard() {
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState(initialForm);
  const [categories, setCategories] = useState(() => {
    const savedCategories = JSON.parse(
      localStorage.getItem(categoryStorageKey) || "{}",
    );
    return mergeCategories(savedCategories);
  });
  const [newCategory, setNewCategory] = useState({ type: "expense", name: "" });
  const [budgetLimit, setBudgetLimit] = useState(30000);
  const [budgetMessage, setBudgetMessage] = useState("");
  const [isBudgetSaving, setIsBudgetSaving] = useState(false);
  const [isReportSending, setIsReportSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // API helper wrappers (use `API` which attaches token dynamically)
  const getTransactions = async () => await API.get(`/transactions`);
  const createTransaction = async (payload) =>
    await API.post(`/transactions`, payload);
  const updateTransaction = async (id, payload) =>
    (await API.put(`/transactions/${id}`, payload)).data;
  const deleteTransaction = async (id) =>
    (await API.delete(`/transactions/${id}`)).data;
  const sendMonthlyReportEmail = async () =>
    await API.post(`/transactions/monthly-report`);
  const updateBudgetSettings = async (monthlyBudgetLimit) =>
    await API.put(`/user/budget`, { monthlyBudgetLimit });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [profileResponse, transactionResponse] = await Promise.all([
          API.get(`/user/dashboard`),
          getTransactions(),
        ]);

        setUser(profileResponse.data);
        setBudgetLimit(profileResponse.data.monthlyBudgetLimit ?? 30000);
        setTransactions(transactionResponse.data);
      } catch (err) {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setError("Unable to load dashboard data. Please log in again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate, setUser]);

  useEffect(() => {
    if (!transactions.length) return;

    setCategories((currentCategories) => {
      const nextCategories = { ...currentCategories };
      let changed = false;

      transactions.forEach((tx) => {
        if (!tx.category || !tx.type || !nextCategories[tx.type]) return;

        if (!nextCategories[tx.type].includes(tx.category)) {
          nextCategories[tx.type] = [...nextCategories[tx.type], tx.category];
          changed = true;
        }
      });

      if (changed) {
        localStorage.setItem(
          categoryStorageKey,
          JSON.stringify(nextCategories),
        );
      }

      return changed ? nextCategories : currentCategories;
    });
  }, [transactions]);

  const userName = useMemo(() => {
    const firstName =
      user?.fullname?.firstname || user?.FullName?.firstName || "";
    const lastName = user?.fullname?.lastname || user?.FullName?.lastName || "";
    return `${firstName} ${lastName}`.trim();
  }, [user]);

  const totals = useMemo(() => {
    const income = transactions
      .filter((tx) => tx.type === "income")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    const expense = transactions
      .filter((tx) => tx.type === "expense")
      .reduce((sum, tx) => sum + Number(tx.amount), 0);

    return {
      income,
      expense,
      balance: income - expense,
      savingsRate:
        income > 0 ? Math.round(((income - expense) / income) * 100) : 0,
    };
  }, [transactions]);

  const monthlyExpense = useMemo(
    () =>
      transactions
        .filter((tx) => {
          const txDate = new Date(tx.date || tx.createdAt);
          return (
            tx.type === "expense" &&
            txDate.getMonth() === currentMonth &&
            txDate.getFullYear() === currentYear
          );
        })
        .reduce((sum, tx) => sum + Number(tx.amount), 0),
    [transactions],
  );

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((tx) => {
      const matchesType = filter === "all" || tx.type === filter;
      const matchesCategory =
        categoryFilter === "all" || tx.category === categoryFilter;
      const matchesSearch =
        !query ||
        tx.title?.toLowerCase().includes(query) ||
        tx.category?.toLowerCase().includes(query);

      return matchesType && matchesCategory && matchesSearch;
    });
  }, [categoryFilter, filter, search, transactions]);

  const categoryFilterOptions = useMemo(() => {
    if (filter !== "all") {
      return getCategoriesByType(categories, filter);
    }

    return Array.from(new Set([...categories.income, ...categories.expense]));
  }, [categories, filter]);

  const highestExpense = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === "expense")
        .sort((a, b) => Number(b.amount) - Number(a.amount))[0],
    [transactions],
  );

  const latestTransaction = transactions[0];

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "type") {
      setForm({
        ...form,
        type: value,
        category: getCategoriesByType(categories, value)[0] || "General",
      });
      return;
    }

    if (type === "checkbox") {
      setForm({ ...form, [name]: checked });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    const categoryName = normalizeCategoryName(newCategory.name);

    if (!categoryName) {
      setError("Category name is required.");
      return;
    }

    if (
      getCategoriesByType(categories, newCategory.type).includes(categoryName)
    ) {
      setError("Category already exists.");
      return;
    }

    const nextCategories = {
      ...categories,
      [newCategory.type]: [...categories[newCategory.type], categoryName],
    };

    setCategories(nextCategories);
    localStorage.setItem(categoryStorageKey, JSON.stringify(nextCategories));
    setForm({ ...form, type: newCategory.type, category: categoryName });
    setNewCategory({ ...newCategory, name: "" });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await createTransaction({
        ...form,
        amount: Number(form.amount),
      });
      setTransactions([response.data, ...transactions]);
      setForm(initialForm);
    } catch (err) {
      setError("Failed to add transaction.");
    }
  };

  const handleEditClick = (tx) => {
    setEditId(tx._id);
    setEditForm({
      title: tx.title,
      amount: tx.amount,
      type: tx.type,
      category: tx.category || "General",
      date: tx.date || tx.createdAt,
      isRecurring: tx.isRecurring || false,
      frequency: tx.frequency || "monthly",
    });
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "type") {
      setEditForm({
        ...editForm,
        type: value,
        category: getCategoriesByType(categories, value)[0] || "General",
      });
      return;
    }

    if (type === "checkbox") {
      setEditForm({ ...editForm, [name]: checked });
      return;
    }

    setEditForm({ ...editForm, [name]: value });
  };

  const handleUpdate = async (id) => {
    setError("");

    try {
      const updated = await updateTransaction(id, {
        ...editForm,
        amount: Number(editForm.amount),
      });
      setTransactions(transactions.map((tx) => (tx._id === id ? updated : tx)));
      setEditId(null);
    } catch (err) {
      setError("Update failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    setError("");

    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter((tx) => tx._id !== id));
    } catch (err) {
      setError("Delete failed.");
    }
  };

  const handleBudgetSave = async () => {
    setError("");
    setBudgetMessage("");
    setIsBudgetSaving(true);

    try {
      const response = await updateBudgetSettings(budgetLimit);
      setBudgetLimit(response.data.monthlyBudgetLimit);
      setBudgetMessage("Budget saved. Email alerts will use this limit.");
    } catch (err) {
      setError("Failed to save budget settings.");
    } finally {
      setIsBudgetSaving(false);
    }
  };

  const handleMonthlyReportEmail = async () => {
    setError("");
    setBudgetMessage("");
    setIsReportSending(true);

    try {
      const response = await sendMonthlyReportEmail();
      setBudgetMessage(
        response.data.message || "Monthly report sent to your email.",
      );
    } catch (err) {
      setError("Failed to send monthly report email.");
    } finally {
      setIsReportSending(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-7xl rounded-lg border border-gray-200 bg-white p-8 text-gray-600 shadow-sm">
          Loading your finance dashboard...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 text-gray-950">
      <DashboardHeader userName={userName} onLogout={handleLogout} />

      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-6 md:px-8">
        {error && (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {error}
          </div>
        )}

        <SummaryCards
          income={totals.income}
          expense={totals.expense}
          balance={totals.balance}
        />

        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-5">
            <TransactionForm
              form={form}
              categories={categories}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
            />
            <ChartSection transactions={transactions} />
          </div>

          <div className="flex flex-col gap-5">
            
            <CategoryManager
              categories={categories}
              newCategory={newCategory}
              onNewCategoryChange={handleNewCategoryChange}
              onAddCategory={handleAddCategory}
            />
            
          <BudgetPanel
            budgetLimit={budgetLimit}
            monthlyExpense={monthlyExpense}
            onBudgetChange={setBudgetLimit}
            onBudgetSave={handleBudgetSave}
            onMonthlyReportEmail={handleMonthlyReportEmail}
            isBudgetSaving={isBudgetSaving}
            isReportSending={isReportSending}
            message={budgetMessage}
          />
            <InsightsPanel
              highestExpense={highestExpense}
              latestTransaction={latestTransaction}
              savingsRate={totals.savingsRate}
            />
          </div>
          
        </div>

        <section className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
          <TransactionFilters
            filter={filter}
            categoryFilter={categoryFilter}
            categoryOptions={categoryFilterOptions}
            search={search}
            onFilterChange={(value) => {
              setFilter(value);
              setCategoryFilter("all");
            }}
            onCategoryFilterChange={setCategoryFilter}
            onSearchChange={setSearch}
          />
          <TransactionList
            transactions={filteredTransactions}
            editId={editId}
            editForm={editForm}
            categories={categories}
            onEditClick={handleEditClick}
            onEditChange={handleEditChange}
            onUpdate={handleUpdate}
            onCancelEdit={() => setEditId(null)}
            onDelete={handleDelete}
          />
        </section>
      </div>
    </main>
  );
}
