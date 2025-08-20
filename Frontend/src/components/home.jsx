import React from "react";
import { FaPiggyBank } from "react-icons/fa";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-900">
      <header className="sticky top-0 px-6 py-4 flex justify-between items-center shadow-md bg-blue-600 text-white">
        <div className="flex items-center gap-2">
          <FaPiggyBank className="md:text-2xl" />
          <h1 className="text-2xl font-bold">Personal Finance Tracker</h1>
        </div>
        <nav className="space-x-12 hidden md:block">
          <a href="#features" className="hover:text-yellow-300 text-lg">Features</a>
          <a href="#about" className="hover:text-yellow-300 text-lg">About</a>
          <a href="#contact" className="hover:text-yellow-300 text-lg">Contact</a>
        </nav>
        <Link
          to="/login"
          className="hidden md:inline-block bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
        >
          Log In
        </Link>
      </header>

      <section className="px-6 py-20 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
        <div className="max-w-xl mb-10 md:mb-0">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-blue-800">
            Take Control of Your <span className="text-blue-600">Finances</span>
          </h2>
          <p className="text-lg mb-6 text-blue-900">
            Track income, expenses, and savings goals all in one place. Make smarter money decisions.
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
        </div>
      </section>

      <section id="features" className="px-6 py-20 bg-blue-100">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-blue-800">Key Features</h3>
          <p className="text-blue-700">Everything you need to manage your personal finances</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="p-6 rounded-2xl shadow bg-white border border-blue-200">
            <h4 className="text-xl font-semibold mb-2 text-blue-700">Expense Tracking</h4>
            <p className="text-blue-600">Log daily spending and visualize trends to stay on budget.</p>
          </div>
          <div className="p-6 rounded-2xl shadow bg-white border border-blue-200">
            <h4 className="text-xl font-semibold mb-2 text-blue-700">Budget Planning</h4>
            <p className="text-blue-600">Set monthly budgets and get alerts when you’re nearing limits.</p>
          </div>
          <div className="p-6 rounded-2xl shadow bg-white border border-blue-200">
            <h4 className="text-xl font-semibold mb-2 text-blue-700">Goal Setting</h4>
            <p className="text-blue-600">Create and track progress toward savings or investment goals.</p>
          </div>
        </div>
      </section>

      <section id="about" className="px-6 py-20 bg-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-4 text-blue-800">About FinanceTracker</h3>
          <p className="text-blue-700 text-lg">
            FinanceTrackr was built to simplify money management. Whether you’re a student, a working
            professional, or a family planner, our intuitive tools help you achieve financial peace of mind.
          </p>
        </div>
      </section>

      <footer id="contact" className="bg-blue-600 px-6 py-10 text-center text-white">
        <h4 className="text-xl font-semibold mb-2">Stay Connected</h4>
        <p className="mb-4">Email us at support@financetracker.com</p>
        <p className="text-sm">&copy; {new Date().getFullYear()} FinanceTrackr. All rights reserved.</p>
      </footer>
    </div>
  );
}
