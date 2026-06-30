import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaPiggyBank } from "react-icons/fa";
import { FiArrowLeft, FiCheckCircle, FiMail } from "react-icons/fi";
import { motion } from "framer-motion";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/user/forgot-password`,
        { email }
      );

      setMessage(response.data.message || "Reset link sent. Check your inbox.");
      setIsSubmitted(true);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to send reset link. Please try again.");
      setIsSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-sky-200 to-blue-500 px-4 py-24 relative overflow-hidden">
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

      <motion.div
        className="absolute -top-16 right-8 w-52 h-52 bg-emerald-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40"
        animate={{ x: [0, -30, 20, 0], y: [0, 35, -20, 0] }}
        transition={{ repeat: Infinity, duration: 16, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-8 left-8 w-44 h-44 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-40"
        animate={{ x: [0, 45, -25, 0], y: [0, -25, 30, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
      />

      <motion.main
        initial={{ opacity: 0, y: 36, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md bg-white/35 backdrop-blur-lg border border-white/40 rounded-2xl shadow-2xl p-8 relative z-10"
      >
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
          {isSubmitted ? (
            <FiCheckCircle className="text-3xl" />
          ) : (
            <FiMail className="text-3xl" />
          )}
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-700">
            Forgot Password
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-700">
            {isSubmitted
              ? "Check your inbox for the next step to reset your password."
              : "Enter the email linked to your account and we will send reset instructions."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block mb-2 text-gray-700 font-medium">
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsSubmitted(false);
                  setMessage("");
                }}
                required
                className="w-full rounded-lg border border-white/60 bg-white/80 py-3 pl-12 pr-4 text-gray-800 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </motion.div>

          {message && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-lg px-4 py-3 text-center text-sm font-medium ${
                isSubmitted
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-600"
              }`}
            >
              {message}
            </motion.p>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-blue-500 py-3 font-semibold text-white shadow-md transition hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-blue-300"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </motion.button>
        </form>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-700">
          <FiArrowLeft className="text-blue-500" />
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Back to Login
          </Link>
        </div>
      </motion.main>
    </div>
  );
};

export default ForgotPassword;
