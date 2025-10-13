"use client";

import { useEffect, useState } from "react";
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default function AdminDashboard() {
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  // Fetch deposits on load
  useEffect(() => {
    async function fetchDeposits() {
      try {
        const { data, error } = await supabase
          .from("deposits")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setDeposits(data);
      } catch (err) {
        console.error("Error fetching deposits:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchDeposits();
  }, []);

  // Real-time subscription
  useEffect(() => {
    const subscription = supabase
      .from("deposits")
      .on("*", (payload) => {
        setDeposits((prev) => {
          const index = prev.findIndex((d) => d.id === payload.new?.id);
          if (payload.eventType === "INSERT") return [payload.new, ...prev];
          if (payload.eventType === "UPDATE" && index !== -1) {
            const updated = [...prev];
            updated[index] = payload.new;
            return updated;
          }
          if (payload.eventType === "DELETE")
            return prev.filter((d) => d.id !== payload.old.id);
          return prev;
        });
      })
      .subscribe();

    return () => supabase.removeSubscription(subscription);
  }, []);

  const filteredDeposits = deposits.filter((d) =>
    d.player_name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div className="min-h-screen bg-red-900 text-yellow-300 p-8 font-sans">
        <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Filter by player name..."
            className="p-2 rounded border border-yellow-300 bg-red-800 text-yellow-300 w-full md:w-1/3"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading deposits...</p>
        ) : (
          <table className="w-full border-collapse border border-yellow-300">
            <thead>
              <tr className="bg-red-800">
                <th className="border border-yellow-300 px-2 py-1">Player Name</th>
                <th className="border border-yellow-300 px-2 py-1">Username</th>
                <th className="border border-yellow-300 px-2 py-1">Game</th>
                <th className="border border-yellow-300 px-2 py-1">Amount</th>
                <th className="border border-yellow-300 px-2 py-1">Status</th>
                <th className="border border-yellow-300 px-2 py-1">Click ID</th>
                <th className="border border-yellow-300 px-2 py-1">Order ID</th>
                <th className="border border-yellow-300 px-2 py-1">Created At</th>
                <th className="border border-yellow-300 px-2 py-1">Updated At</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeposits.map((d) => (
                <tr key={d.id} className="even:bg-red-800 odd:bg-red-700">
                  <td className="border border-yellow-300 px-2 py-1">{d.player_name}</td>
                  <td className="border border-yellow-300 px-2 py-1">{d.username}</td>
                  <td className="border border-yellow-300 px-2 py-1">{d.game_name}</td>
                  <td className="border border-yellow-300 px-2 py-1">{d.deposit_amount}</td>
                  <td className="border border-yellow-300 px-2 py-1">{d.status}</td>
                  <td className="border border-yellow-300 px-2 py-1">{d.click_id}</td>
                  <td className="border border-yellow-300 px-2 py-1">{d.wert_order_id}</td>
                  <td className="border border-yellow-300 px-2 py-1">{d.created_at}</td>
                  <td className="border border-yellow-300 px-2 py-1">{d.updated_at}</td>
                </tr>
              ))}
              {filteredDeposits.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center p-4">
                    No deposits found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
