import { LogOut, WalletCards } from "lucide-react";

export default function DashboardHeader({ userName, onLogout }) {
  return (
    <header className="flex flex-col gap-4 border-b border-gray-200 bg-white px-4 py-4 md:flex-row md:items-center md:justify-between md:px-8">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-900 text-white">
          <WalletCards size={22} />
        </div>
        <div>
          <p className="text-sm text-gray-500">Personal Finance Tracker</p>
          <h1 className="text-xl font-semibold text-gray-950 md:text-2xl">
            {userName ? `Welcome, ${userName}` : "Financial dashboard"}
          </h1>
        </div>
      </div>

      <button
        type="button"
        onClick={onLogout}
        className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-gray-300 px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
      >
        <LogOut size={18} />
        Logout
      </button>
    </header>
  );
}
