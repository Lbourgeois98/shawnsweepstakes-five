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
    const storeId = process.env.PAIDLY_STORE_ID;
    const apiUrl = `https://api.paidly.io/api/v1/stores/${storeId}/withdrawal/request`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAIDLY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: withdrawAmount,
        currency: "USD",
        metadata: {
          username,
          playerName,
          gameName,
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Paidly withdrawal error:", data);
      return res.status(400).json({ error: data.message || "Paidly API error" });
    }

    // Log pending withdrawal in Supabase
    const { error: insertError } = await supabase.from("bitcoin_withdrawals").insert([
      {
        username,
        player_name: playerName,
        game_name: gameName,
        amount: withdrawAmount,
        status: "pending",
        checkout_link: data.checkoutLink,
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error("⚠️ Supabase insert error:", insertError);
    }

    return res.status(200).json({ success: true, checkoutLink: data.checkoutLink });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
