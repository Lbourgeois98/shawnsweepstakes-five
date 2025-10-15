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
        message: "Server configuration error - Missing Paidly credentials",
      });
    }

    console.log("📤 Creating Paidly on-chain Bitcoin withdrawal:", { playerName, username, gameName, withdrawAmount, walletAddress });

    // Call Paidly API for on-chain Bitcoin withdrawal
    const paidlyRes = await fetch(
      `https://api-staging.paidlyinteractive.com/api/v1/stores/${storeId}/onchain/btc/payouts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiToken}`,
        },
        body: JSON.stringify({
          destination: walletAddress,
          amount: parseFloat(withdrawAmount),
          subtractFeeFromAmount: false,
          metadata: {
            playerName,
            username,
            gameName,
          },
        }),
      }
    );

    const paidlyData = await paidlyRes.json();

    if (!paidlyRes.ok) {
      console.error("❌ Paidly on-chain API error:", paidlyData);
      return res.status(paidlyRes.status).json({
        success: false,
        message: paidlyData.message || paidlyData.error || "Paidly on-chain withdrawal request failed",
        details: paidlyData,
      });
    }

    console.log("✅ Paidly on-chain Bitcoin withdrawal created:", paidlyData);

    // Log to Supabase bitcoin_withdrawals table
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
          bitcoin_tx: paidlyData.transactionId || null,
          status: paidlyData.status || "pending",
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (dbError) {
      console.error("⚠️ Database logging error:", dbError);
    }

    return res.status(200).json({ 
      success: true, 
      data: paidlyData,
      withdrawal: withdrawalData?.[0],
      message: "On-chain Bitcoin withdrawal request submitted successfully"
    });

  } catch (err) {
    console.error("❌ Paidly On-chain Withdraw Error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Server error", 
      error: err.message 
    });
  }
}
