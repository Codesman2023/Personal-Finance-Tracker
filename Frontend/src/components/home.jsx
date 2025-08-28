import React from "react";
import { FaPiggyBank } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-900">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="sticky top-0 px-6 py-4 flex justify-between items-center shadow-md bg-blue-600 text-white"
      >
        <div className="flex items-center gap-2">
          <FaPiggyBank className="md:text-2xl" />
          <h1 className="text-2xl font-bold">Personal Finance Tracker</h1>
        </div>
        <nav className="space-x-12 hidden md:block">
          <a href="#features" className="hover:text-yellow-300 text-lg">
            Features
          </a>
          <a href="#about" className="hover:text-yellow-300 text-lg">
            About
          </a>
          <a href="#contact" className="hover:text-yellow-300 text-lg">
            Contact
          </a>
        </nav>
        <Link
          to="/login"
          className="hidden md:inline-block bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
        >
          Log In
        </Link>
      </motion.header>

      <section className="px-6 py-20 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-xl mb-10 md:mb-0"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-blue-800">
            Take Control of Your <span className="text-blue-600">Finances</span>
          </h2>
          <p className="text-lg mb-6 text-blue-900">
            Track income, expenses, and savings goals all in one place. Make
            smarter money decisions.
          </p>
          <div className="flex items-center gap-2">
            <Link
              to="/register"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
            >
              Try It Now
              <ArrowRight size={22} />
            </Link>
          </div>
        </motion.div>
      </section>

      <section id="features" className="px-6 py-20 bg-blue-100">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-blue-800">Key Features</h3>
          <p className="text-blue-700">
            Everything you need to manage your personal finances
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl shadow bg-white border border-blue-200"
          >
            <h4 className="text-xl font-semibold mb-2 text-blue-700">
              Expense Tracking
            </h4>
            <p className="text-blue-600">
              Log income & expenses and keep all your transactions in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl shadow bg-white border border-blue-200"
          >
            <h4 className="text-xl font-semibold mb-2 text-blue-700">
              Budget Planning
            </h4>
            <p className="text-blue-600">
              Set monthly budgets and get instant alerts if you overspend.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl shadow bg-white border border-blue-200"
          >
            <h4 className="text-xl font-semibold mb-2 text-blue-700">
              Visual Insights
            </h4>
            <p className="text-blue-600">
              Understand your spending habits with interactive charts & graphs.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl shadow bg-white border border-blue-200"
          >
            <h4 className="text-xl font-semibold mb-2 text-blue-700">
              Easy Management
            </h4>
            <p className="text-blue-600">
              Add, edit, and delete transactions anytime with full control.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl shadow bg-white border border-blue-200"
          >
            <h4 className="text-xl font-semibold mb-2 text-blue-700">
              Smart Filters
            </h4>
            <p className="text-blue-600">
              Instantly filter by income, expense, or view everything together.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl shadow bg-white border border-blue-200"
          >
            <h4 className="text-xl font-semibold mb-2 text-blue-700">
              Balance Overview
            </h4>
            <p className="text-blue-600">
              Always know your total income, expenses, and remaining balance.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl shadow bg-white border border-blue-200"
          >
            <h4 className="text-xl font-semibold mb-2 text-blue-700">
              Secure & Private
            </h4>
            <p className="text-blue-600">
              Your data is protected with JWT authentication & stays private.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl shadow bg-white border border-blue-200"
          >
            <h4 className="text-xl font-semibold mb-2 text-blue-700">
              Personalized Dashboard
            </h4>
            <p className="text-blue-600">
              Get a warm greeting with your name and a clean, modern interface.
            </p>
          </motion.div>
        </div>
      </section>

      <motion.section
        id="about"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="px-6 py-20 bg-blue-50"
      >
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4 text-blue-800">
            About FinanceTracker
          </h3>
          <p className="text-blue-700 text-lg mb-6">
            FinanceTracker is designed to make managing your money simple,
            smart, and stress-free. Whether you’re keeping track of daily
            expenses, planning your monthly budget, or monitoring long-term
            goals, our dashboard gives you full control over your financial
            journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mt-8">
            <div className="bg-white shadow p-6 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-700 mb-2">
                💳 Easy Transaction Management
              </h4>
              <p className="text-blue-600">
                Add, edit, or delete income and expense records with just a few
                clicks. All your transactions are securely stored and easy to
                access anytime.
              </p>
            </div>
            <div className="bg-white shadow p-6 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-700 mb-2">
                📊 Visual Insights
              </h4>
              <p className="text-blue-600">
                Our interactive charts and graphs help you clearly see where
                your money goes, making it easier to adjust spending and improve
                savings.
              </p>
            </div>
            <div className="bg-white shadow p-6 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-700 mb-2">
                ⚡ Budget Alerts
              </h4>
              <p className="text-blue-600">
                Stay in control with monthly budget tracking. Receive alerts
                when your expenses exceed your set limits. No more surprises at
                the end of the month!
              </p>
            </div>
            <div className="bg-white shadow p-6 rounded-xl border border-blue-100">
              <h4 className="font-semibold text-blue-700 mb-2">
                🔒 Secure & Personalized
              </h4>
              <p className="text-blue-600">
                Your data is protected with secure login. Enjoy a personalized
                dashboard that greets you by name and adapts to your financial
                goals.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.footer
        id="contact"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="bg-blue-600 px-6 py-10 text-center text-white"
      >
        <h4 className="text-xl font-semibold mb-2">Stay Connected</h4>
        <p className="mb-4">Email us at support@financetracker.com</p>
        <p className="text-sm">
          &copy; {new Date().getFullYear()} FinanceTrackr. All rights reserved.
        </p>
      </motion.footer>
    </div>
  );
}
