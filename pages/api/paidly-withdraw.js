import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { playerName, username, gameName, withdrawAmount, walletAddress } = req.body;

    // Validate required fields
    if (!playerName || !username || !gameName || !withdrawAmount || !walletAddress) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields (playerName, username, gameName, withdrawAmount, walletAddress)" 
      });
    }

    const storeId = process.env.PAIDLY_STORE_ID;
    const apiToken = process.env.PAIDLY_API_TOKEN;

    if (!storeId || !apiToken) {
      console.error("❌ Missing Paidly credentials");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // Call Paidly withdrawal API
    const paidlyRes = await fetch(
      `https://api-staging.paidlyinteractive.com/api/v1/stores/${storeId}/withdrawals`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiToken}`,
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          address: walletAddress,
          currency: "BTC",
          reference: `${username}_${Date.now()}`,
        }),
      }
    );

    const paidlyData = await paidlyRes.json();

    if (!paidlyRes.ok) {
      console.error("❌ Paidly API error:", paidlyData);
      return res.status(paidlyRes.status).json({
        success: false,
        message: paidlyData.message || "Paidly withdrawal failed",
        details: paidlyData,
      });
    }

    console.log("✅ Paidly withdrawal created:", paidlyData);

    // Log withdrawal to Supabase
    const { data: withdrawalData, error: dbError } = await supabase
      .from("withdrawals")
      .insert([
        {
          player_name: playerName,
          username,
          game_name: gameName,
          amount: parseFloat(withdrawAmount),
          wallet_address: walletAddress,
          transaction_id: paidlyData.id || null,
          status: paidlyData.status || "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (dbError) {
      console.error("⚠️ Database logging error:", dbError);
      // Still return success since Paidly succeeded
    }

    return res.status(200).json({ 
      success: true, 
      data: paidlyData,
      message: "Withdrawal request submitted successfully"
    });

  } catch (err) {
    console.error("Paidly Withdraw API Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: err.message 
    });
  }
}
