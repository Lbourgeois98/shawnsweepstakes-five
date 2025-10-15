import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { playerName, username, gameName, withdrawAmount, walletAddress } = req.body;

    if (!playerName || !username || !gameName || !withdrawAmount || !walletAddress) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing required fields" 
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

    console.log("📤 Creating Paidly Lightning withdrawal:", { username, withdrawAmount, walletAddress });

    // Call Paidly Lightning withdrawal API
    const paidlyRes = await fetch(
      `https://api-staging.paidlyinteractive.com/api/v1/stores/${storeId}/lightning-network/btc/pull-payments/${username}/payouts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiToken}`,
        },
        body: JSON.stringify({
          destination: walletAddress,
          amount: parseFloat(withdrawAmount),
        }),
      }
    );

    const responseText = await paidlyRes.text();
    console.log("📥 Paidly response status:", paidlyRes.status);
    console.log("📥 Paidly raw response:", responseText);

    let paidlyData;
    try {
      paidlyData = responseText ? JSON.parse(responseText) : {};
    } catch (parseError) {
      console.error("❌ Failed to parse response:", responseText);
      return res.status(500).json({
        success: false,
        message: "Invalid response from payment processor",
        details: responseText.substring(0, 200),
      });
    }

    if (!paidlyRes.ok) {
      console.error("❌ Paidly API error:", paidlyData);
      return res.status(paidlyRes.status).json({
        success: false,
        message: paidlyData.message || paidlyData.error || `API error: ${paidlyRes.status}`,
        details: paidlyData,
      });
    }

    console.log("✅ Paidly Lightning withdrawal created:", paidlyData);

    // Log to Supabase
    const { data: withdrawalData, error: dbError } = await supabase
      .from("bitcoin_withdrawals")
      .insert([
        {
          player_name: playerName,
          username,
          game_name: gameName,
          amount: parseFloat(withdrawAmount),
          wallet_address: walletAddress,
          paidly_payout_id: paidlyData.id || null,
          status: paidlyData.state || "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (dbError) {
      console.error("⚠️ Database error:", dbError);
    }

    return res.status(200).json({ 
      success: true, 
      data: paidlyData,
      message: "Lightning withdrawal request submitted successfully"
    });

  } catch (err) {
    console.error("❌ Paidly Withdraw Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: err.message 
    });
  }
}
