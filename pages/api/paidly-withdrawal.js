// pages/api/paidly-withdrawal.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { username, playerName, gameName, withdrawAmount } = req.body;

    if (!username || !playerName || !gameName || !withdrawAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const storeId = process.env.PAIDLY_STORE_ID;
    if (!storeId) return res.status(500).json({ error: "PAIDLY_STORE_ID not configured" });

    const apiUrl = `${process.env.PAIDLY_API_BASE || "https://api.paidly.io"}/api/v1/stores/${storeId}/withdrawal/request`;

    const paidlyRes = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAIDLY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: withdrawAmount,
        currency: "USD",
        metadata: { username, playerName, gameName },
      }),
    });

    const paidlyData = await paidlyRes.json();

    if (!paidlyRes.ok) {
      console.error("Paidly create withdrawal error:", paidlyData);
      return res.status(400).json({ error: paidlyData.message || "Paidly API error", details: paidlyData });
    }

    // Log pending withdrawal to Supabase
    const { error: insertError } = await supabase.from("bitcoin_withdrawals").insert([
      {
        username,
        player_name: playerName,
        game_name: gameName,
        amount: withdrawAmount,
        status: "pending",
        checkout_link: paidlyData.checkoutLink || null,
        paidly_response: paidlyData,
        created_at: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error("Supabase insert error (withdrawal):", insertError);
      // still return checkoutLink so user can continue
    }

    return res.status(200).json({ success: true, checkoutLink: paidlyData.checkoutLink, raw: paidlyData });
  } catch (err) {
    console.error("paidly-withdrawal error:", err);
    return res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
