"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
);

export default function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [inputUser, setInputUser] = useState("");
  const [inputPass, setInputPass] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🧠 Change your admin credentials here
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "shawn123";

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

    if (error) {
      console.error(error);
      alert("Error loading events");
    } else {
      setEvents(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) loadEvents();
  }, [authenticated]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        fontFamily: "sans-serif",
        padding: "40px",
      }}
    >
      {!authenticated ? (
        <div
          style={{
            maxWidth: 400,
            margin: "100px auto",
            background: "#111",
            padding: 30,
            borderRadius: 12,
            boxShadow: "0 0 15px rgba(255,0,0,0.3)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: 20 }}>Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={inputUser}
            onChange={(e) => setInputUser(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 10,
              borderRadius: 6,
              border: "none",
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={inputPass}
            onChange={(e) => setInputPass(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              marginBottom: 15,
              borderRadius: 6,
              border: "none",
            }}
          />
          <button
            onClick={login}
            style={{
              width: "100%",
              background: "#e00",
              border: "none",
              padding: 12,
              borderRadius: 6,
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Login
          </button>
        </div>
      ) : (
        <div>
          <h1 style={{ textAlign: "center", marginBottom: 30 }}>
            💳 Wert Webhook Dashboard
          </h1>
          <button
            onClick={loadEvents}
            disabled={loading}
            style={{
              display: "block",
              margin: "0 auto 20px",
              padding: "10px 20px",
              background: "#e00",
              border: "none",
              borderRadius: 6,
              color: "white",
              cursor: "pointer",
            }}
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>

          <div
            style={{
              overflowX: "auto",
              background: "#111",
              padding: 20,
              borderRadius: 10,
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                color: "white",
                fontSize: 14,
              }}
            >
              <thead>
                <tr style={{ background: "#222" }}>
                  <th style={thStyle}>Event Name</th>
                  <th style={thStyle}>Player</th>
                  <th style={thStyle}>Username</th>
                  <th style={thStyle}>Game</th>
                  <th style={thStyle}>Deposit</th>
                  <th style={thStyle}>User ID</th>
                  <th style={thStyle}>Created</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev) => (
                  <tr key={ev.id}>
                    <td style={tdStyle}>{ev.event_name}</td>
                    <td style={tdStyle}>{ev.player_name || "-"}</td>
                    <td style={tdStyle}>{ev.username || "-"}</td>
                    <td style={tdStyle}>{ev.game_name || "-"}</td>
                    <td style={tdStyle}>
                      {ev.deposit_amount
                        ? `$${Number(ev.deposit_amount).toFixed(2)}`
                        : "-"}
                    </td>
                    <td style={tdStyle}>{ev.user_id || "-"}</td>
                    <td style={tdStyle}>
                      {new Date(ev.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
                {events.length === 0 && !loading && (
                  <tr>
                    <td style={tdStyle} colSpan="7">
                      No data found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "10px 8px",
  borderBottom: "1px solid #333",
  textAlign: "left",
};

const tdStyle = {
  padding: "8px",
  borderBottom: "1px solid #222",
};
