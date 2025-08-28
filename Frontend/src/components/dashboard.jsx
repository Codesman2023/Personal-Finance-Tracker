import { useContext, useEffect, useState } from "react";
import { UserDataContext } from "../context/UserContext";
import {
  getTransactions,
  createTransaction,
  deleteTransaction,
  updateTransaction,
} from "../utils/api.transaction";
import { useNavigate } from "react-router-dom";
import ChartSection from "../Parts/ChartSection";
import axios from "axios";
import { motion } from "framer-motion";

const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();

export default function Dashboard() {
  const { user } = useContext(UserDataContext);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ title: "", amount: "", type: "income" });
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", amount: "", type: "" });
  const [budgetLimit, setBudgetLimit] = useState(30000);
  const [UserName, setUserName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/user/dashboard`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data && res.data.user && res.data.user.Fullname) {
          setUserName(
            `${res.data.user.Fullname.firstname} ${res.data.user.Fullname.lastname}`
          );
        }
      } catch (err) {
        setUserName("");
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTransactions(user.token);
        setTransactions(response.data);
      } catch (err) {
        alert("Failed to fetch transactions");
      }
    };
    fetchData();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTx = await createTransaction(form, user.token);
      setTransactions([...transactions, newTx]);
      setForm({ title: "", amount: "", type: "income" });
    } catch (err) {
      alert("Failed to add transaction");
    }
  };

  const handleEditClick = (tx) => {
    setEditId(tx._id);
    setEditForm({ title: tx.title, amount: tx.amount, type: tx.type });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (id) => {
    try {
      const updated = await updateTransaction(id, editForm, user.token);
      setTransactions(transactions.map((tx) => (tx._id === id ? updated : tx)));
      setEditId(null);
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteTransaction(id, user.token);
      setTransactions(transactions.filter((tx) => tx._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  const incomeTotal = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const expenseTotal = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const balance = incomeTotal - expenseTotal;

  const filteredTxs = transactions.filter((tx) =>
    filter === "all" ? true : tx.type === filter
  );

  const monthlyExpense = transactions
    .filter((tx) => {
      const txDate = new Date(tx.date);
      return (
        tx.type === "expense" &&
        txDate.getMonth() === currentMonth &&
        txDate.getFullYear() === currentYear
      );
    })
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="max-w-6xl mx-auto px-6 py-8"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-br from-blue-50 to-purple-100 rounded-2xl p-6 shadow-lg"
      >
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Hi,{" "}
              <motion.span
                animate={{ color: ["#9333ea", "#2563eb", "#9333ea"] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                {UserName || "User"}
              </motion.span>
            </h1>
            <p className="text-gray-600 mt-1">Here’s your financial overview</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-xl hover:bg-red-600 transition cursor-pointer"
          >
            Logout
          </motion.button>
        </header>

        {monthlyExpense > budgetLimit && (
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-red-100 text-red-700 p-4 mb-6 rounded-xl font-semibold border border-red-300"
          >
            🚨 You’ve exceeded your monthly budget of ₹{budgetLimit}!
          </motion.div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Income", value: `₹${incomeTotal}`, color: "text-green-600" },
            { label: "Expense", value: `₹${expenseTotal}`, color: "text-red-600" },
            { label: "Balance", value: `₹${balance}`, color: "text-blue-600" },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-4 rounded-xl shadow-md"
            >
              <p className="text-gray-500 text-sm">{card.label}</p>
              <p className={`${card.color} text-2xl font-bold`}>{card.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 items-center mb-6">
          <label className="font-semibold">Monthly Budget:</label>
          <input
            type="number"
            value={budgetLimit}
            onChange={(e) => setBudgetLimit(Number(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <label className="font-semibold ml-4">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid md:grid-cols-4 gap-4 mb-6"
        >
          <input
            name="title"
            placeholder="Transaction title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <input
            name="amount"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
            className="px-4 py-2 border border-gray-300 rounded-lg"
          />
          <select
            name="type"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Add Transaction
          </motion.button>
        </form>

        <ChartSection transactions={transactions} />

        <motion.div
          layout
          className="mt-8 space-y-4"
        >
            {filteredTxs.map((tx) => (
              <motion.div
                key={tx._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className={`p-4 rounded-xl shadow-md flex justify-between items-center ${
                  tx.type === "income" ? "bg-green-50" : "bg-red-50"
                }`}
              >
                {editId === tx._id ? (
                  <div className="flex flex-wrap gap-3 items-center w-full">
                    <input
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      className="px-3 py-1 border border-gray-300 rounded-md"
                    />
                    <input
                      name="amount"
                      type="number"
                      value={editForm.amount}
                      onChange={handleEditChange}
                      className="px-3 py-1 border border-gray-300 rounded-md"
                    />
                    <select
                      name="type"
                      value={editForm.type}
                      onChange={handleEditChange}
                      className="px-3 py-1 border border-gray-300 rounded-md"
                    >
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                    <button
                      onClick={() => handleUpdate(tx._id)}
                      className="bg-blue-500 text-white px-4 py-1 rounded-md"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-300 px-4 py-1 rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center w-full">
                    <span className="text-gray-700">
                      <strong>{tx.title}</strong> — ₹{tx.amount} ({tx.type})
                    </span>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleEditClick(tx)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tx._id)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
