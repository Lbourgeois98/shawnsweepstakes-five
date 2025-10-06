// pages/admin.js
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [inputUser, setInputUser] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USERNAME || process.env.ADMIN_USERNAME;
  const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

  const login = () => {
    if (inputUser === ADMIN_USER && inputPass === ADMIN_PASS) {
      setAuthenticated(true);
    } else {
      alert("Incorrect username or password.");
    }
  };

  const loadEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("wert_events")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) alert("Error loading events");
    else setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) loadEvents();
  }, [authenticated]);

  return (
    <div style={{ padding: 40, background: "#000", color: "#fff", minHeight: "100vh" }}>
      {!authenticated ? (
        <div
          style={{
            maxWidth: 400,
            margin: "100px auto",
            background: "#111",
            padding: 30,
            borderRadius: 10,
          }}
        >
          <h2>Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={inputUser}
            onChange={(e) => setInputUser(e.target.value)}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <input
            type="password"
            placeholder="Password"
            value={inputPass}
            onChange={(e) => setInputPass(e.target.value)}
            style={{ width: "100%", marginBottom: 10, padding: 8 }}
          />
          <button
            onClick={login}
            style={{ width: "100%", padding: 10, background: "#e00", border: "none" }}
          >
            Login
          </button>
        </div>
      ) : (
        <div>
          <h1>💳 Wert Webhook Dashboard</h1>
          <button
            onClick={loadEvents}
            disabled={loading}
            style={{
              padding: "10px 20px",
              background: "#e00",
              border: "none",
              marginBottom: 20,
            }}
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#222" }}>
                <th>Event</th>
                <th>Player</th>
                <th>Username</th>
                <th>Game</th>
                <th>Deposit</th>
                <th>User ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>{e.event_name}</td>
                  <td>{e.player_name}</td>
                  <td>{e.username}</td>
                  <td>{e.game_name}</td>
                  <td>{e.deposit_amount}</td>
                  <td>{e.user_id}</td>
                  <td>{new Date(e.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
