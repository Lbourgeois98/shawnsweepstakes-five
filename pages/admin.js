"use client";
import { useEffect, useState } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Admin() {
  const [allTransactions, setAllTransactions] = useState([]);
  const [filter, setFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('adminLoggedIn') === 'true';
    }
    return false;
  });
  const [password, setPassword] = useState("");

  // 🧠 Handle login
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      setLoggedIn(true);
      sessionStorage.setItem('adminLoggedIn', 'true');
    } else {
      alert("Incorrect password");
    }
  };

  // 🧾 Fetch transactions
  const fetchAllTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/get-transactions");
      const data = await res.json();
      setAllTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Supabase realtime
  useEffect(() => {
    if (!loggedIn) return;
    fetchAllTransactions();

    const tables = ["transactions", "deposits"];
    const subscriptions = tables.map((table) =>
      supabase
        .channel(`public:${table}`)
        .on("postgres_changes", { event: "*", schema: "public", table }, () =>
          fetchAllTransactions()
        )
        .subscribe()
    );

    return () => subscriptions.forEach((sub) => supabase.removeChannel(sub));
  }, [loggedIn]);

  // 🧱 LOGIN PAGE (styled)
  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <Head>
          <title>Admin Login - Shawn Sweeps</title>
          <script src="https://cdn.tailwindcss.com"></script>
        </Head>

        <div className="bg-gray-900/80 border border-yellow-500/30 rounded-3xl shadow-2xl p-10 w-96 text-center backdrop-blur-md">
          <h1 className="text-4xl font-extrabold text-yellow-400 mb-6">
            Admin Access
          </h1>
          <p className="text-gray-400 mb-8 text-sm">
            Secure login required to view dashboard
          </p>

          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-yellow-500/40 text-white rounded-xl focus:outline-none focus:border-yellow-400 mb-6 placeholder-gray-500"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-semibold py-3 rounded-xl shadow-lg hover:shadow-yellow-500/50 transition-transform transform hover:-translate-y-1"
            >
              Enter Dashboard
            </button>
          </form>

          <div className="mt-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Authorized Personnel Only</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 🧮 FILTERING + STATS
  const filteredTransactions = allTransactions.filter((tx) => {
    const nameMatch =
      tx.player_name?.toLowerCase().includes(filter.toLowerCase()) ||
      tx.username?.toLowerCase().includes(filter.toLowerCase());
    const methodMatch =
      paymentFilter === "all" || tx.payment_method === paymentFilter;
    return nameMatch && methodMatch;
  });

  const totalDeposits = filteredTransactions
    .filter((tx) => {
      const status = tx.status?.toLowerCase();
      return status === "completed" || status === "settled";
    })
    .reduce((sum, tx) => sum + (parseFloat(tx.deposit_amount) || 0), 0);
  
  const completedDeposits = filteredTransactions.filter((tx) => {
    const status = tx.status?.toLowerCase();
    return status === "completed" || status === "settled";
  }).length;

  const getStatusColor = (status) => {
  if (!status) return "bg-gray-600 text-white";
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "completed":
    case "settled":
      return "bg-green-600 text-white";
    case "failed":
    case "canceled":
    case "cancelled":
      return "bg-red-600 text-white";
    case "pending":
    case "initiated":
    case "processing":
    case "transfer_started":
    case "onchain_deposit_processing":
      return "bg-yellow-600 text-black";
    default:
      return "bg-gray-600 text-white";
  }
};

  // ✅ DASHBOARD UI
  return (
    <>
      <Head>
        <title>Admin Dashboard - Shawn Sweeps</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-yellow-400">
              Admin Dashboard
            </h1>
            <button
              onClick={() => {
                setLoggedIn(false);
                sessionStorage.removeItem('adminLoggedIn');
              }}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-400 text-sm">Total Deposits</p>
              <p className="text-3xl font-bold text-yellow-400">
                ${totalDeposits.toFixed(2)}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-400 text-sm">Total Transactions</p>
              <p className="text-3xl font-bold text-yellow-400">
                {filteredTransactions.length}
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-green-400">
                {completedDeposits}
              </p>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <input
              type="text"
              placeholder="Search by player name or username..."
              className="flex-1 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-yellow-400"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <select
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-yellow-400"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">All Payment Methods</option>
              <option value="Wert">Wert</option>
              <option value="TierLock">TierLock</option>
              <option value="FNUPAY">FNUPAY</option>
              <option value="Bitcoin">Bitcoin</option>
            </select>
          </div>

          {/* TABLE */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Loading transactions...</p>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-900">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Player Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Username</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Game</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Payment</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Date</th>
                  </tr>
                </thead>
                <tbody>
  {filteredTransactions.length > 0 ? (
    filteredTransactions.map((tx) => (
      <tr
        key={`${tx.table || "unknown"}-${tx.id}`}
        className="border-b border-gray-700 hover:bg-gray-700 transition"
      >
        <td className="px-6 py-4 text-sm">
          {tx.player_name || "N/A"}
        </td>
        <td className="px-6 py-4 text-sm">
          {tx.username || "N/A"}
        </td>
        <td className="px-6 py-4 text-sm">
          {tx.game_name || "N/A"}
        </td>
        <td className="px-6 py-4 text-sm font-semibold text-green-400">
          ${parseFloat(tx.deposit_amount || 0).toFixed(2)}
        </td>
        <td className="px-6 py-4 text-sm">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white">
            {tx.payment_method || "Unknown"}
          </span>
        </td>
        <td className="px-6 py-4 text-sm">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
              tx.status
            )}`}
          >
            {tx.status || "unknown"}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-400">
          {tx.created_at
            ? new Date(tx.created_at).toLocaleDateString() +
              " " +
              new Date(tx.created_at).toLocaleTimeString()
            : "N/A"}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="7" className="text-center py-8 text-gray-400">
        No transactions found
      </td>
    </tr>
  )}
</tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
