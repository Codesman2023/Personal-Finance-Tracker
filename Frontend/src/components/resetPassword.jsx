import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaHome, FaPiggyBank } from "react-icons/fa";
import { FiCheckCircle, FiLock } from "react-icons/fi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("error");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/reset-password/${token}`,
        { password }
      );

      setMessage(response.data.message || "Password reset successfully.");
      setMessageType("success");
      setPassword("");
      setConfirmPassword("");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-200 to-blue-500 px-4 py-24 relative overflow-hidden">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full absolute top-0 left-0 p-4 bg-blue-600 text-white shadow-md flex items-center justify-between px-6 z-10"
      >
        <Link
          to="/home"
          className="text-white text-xl md:text-2xl hover:text-gray-200 transition"
          aria-label="Go to home"
        >
          <FaHome />
        </Link>
        <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center gap-2">
          <FaPiggyBank className="text-xl md:text-2xl" />
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-wide whitespace-nowrap">
            Personal Finance Tracker
          </h1>
        </div>
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md bg-white/35 backdrop-blur-lg border border-white/40 rounded-2xl shadow-2xl p-8 relative z-10"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
          {messageType === "success" ? (
            <FiCheckCircle className="text-3xl" />
          ) : (
            <FiLock className="text-3xl" />
          )}
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-700">Reset Password</h2>
          <p className="mt-3 text-sm leading-6 text-gray-700">
            Enter a new password for your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-white/60 bg-white/80 px-4 py-3 text-gray-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-700 font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-lg border border-white/60 bg-white/80 px-4 py-3 text-gray-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {message && (
            <p
              className={`rounded-lg px-4 py-3 text-center text-sm font-medium ${
                messageType === "success"
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <motion.button
            whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-500 py-3 font-semibold text-white shadow-md transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300"
          >
            {isSubmitting ? "Resetting..." : "Reset Password"}
          </motion.button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </motion.main>
    </div>
  );
};

export default ResetPassword;
