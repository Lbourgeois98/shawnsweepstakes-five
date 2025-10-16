// pages/api/paidly-withdrawal.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { username, playerName, gameName, withdrawAmount } = req.body;

  if (!username || !playerName || !gameName || !withdrawAmount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Call Paidly API to create a Lightning withdrawal
    const paidlyRes = await fetch(`${process.env.PAIDLY_API_BASE || "https://api.paidly.io"}/v1/withdrawals`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAIDLY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: withdrawAmount,
        currency: "USD",
        method: "lightning",
        metadata: {
          username,
          playerName,
          gameName,
        },
      }),
    });

    const paidlyData = await paidlyRes.json();

    if (!paidlyRes.ok) {
      console.error("Paidly error creating withdrawal:", paidlyData);
      return res.status(400).json({ error: paidlyData.message || "Paidly API error", details: paidlyData });
    }

    // Log withdrawal in Supabase
    const { error: insertError } = await supabase.from("bitcoin_withdrawals").insert([
      {
        username,
        player_name: playerName,
        game_name: gameName,
        amount: withdrawAmount,
        status: "pending",
        paidly_withdrawal_id: paidlyData?.id || null,
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error("Supabase insert error for withdrawal:", insertError);
      // still return success because Paidly created it — but mark it in response
      return res.status(201).json({ success: true, withdrawal: paidlyData, warning: "Failed to log in Supabase", supabaseError: insertError });
    }

    return res.status(200).json({ success: true, withdrawal: paidlyData });
  } catch (err) {
    console.error("paidly-withdrawal handler error:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
