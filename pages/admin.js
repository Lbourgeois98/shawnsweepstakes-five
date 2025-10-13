"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// ✅ Supabase client for browser
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Admin() {
  const [transactions, setTransactions] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  // ✅ Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASS) {
      setLoggedIn(true);
    } else {
      alert("Incorrect password");
    }
  };

  // ✅ Fetch all transactions (server uses SERVICE_KEY)
  async function fetchAllTransactions() {
    try {
      const response = await fetch("/api/get-transactions");
      const data = await response.json();
      if (Array.isArray(data)) {
        setTransactions(data);
      } else {
        console.error("Unexpected response:", data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  // ✅ Real-time Supabase updates
  useEffect(() => {
    if (!loggedIn) return;

    fetchAllTransactions();

    const subscriptions = [];
    const tables = ["transactions", "deposits"];

    tables.forEach((table) => {
      const subscription = supabase
        .channel(`public:${table}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table },
          (payload) => {
            console.log("Change received:", payload);
            fetchAllTransactions();
          }
        )
        .subscribe();

      subscriptions.push(subscription);
    });

    return () => {
      subscriptions.forEach((sub) => supabase.removeChannel(sub));
    };
  }, [loggedIn]);

  // ✅ Show login screen if not logged in
  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-2xl shadow-md w-80"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded mb-4"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Login
          </button>
        </form>
      </div>
    );
  }

  // ✅ Admin dashboard view
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h1>

      <div className="overflow-x-auto bg-white rounded-2xl shadow-md p-4">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">User</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Created At</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-4 text-gray-500 italic"
                >
                  No transactions found
                </td>
              </tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{tx.id}</td>
                  <td className="border px-4 py-2">{tx.user}</td>
                  <td className="border px-4 py-2">${tx.amount}</td>
                  <td className="border px-4 py-2 capitalize">{tx.type}</td>
                  <td className="border px-4 py-2">
                    {new Date(tx.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
