export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { playerName, username, gameName, withdrawAmount, walletAddress } = req.body;

  if (!playerName || !username || !gameName || !withdrawAmount || !walletAddress) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    // Example Paidly withdrawal API call (replace with real endpoint)
    const paidlyRes = await fetch("https://api.paidly.io/withdrawals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAIDLY_API_KEY}`,
      },
      body: JSON.stringify({
        amount: withdrawAmount,
        wallet_address: walletAddress,
        currency: "BTC",
        reference: `${username}_${Date.now()}`,
      }),
    });

    const paidlyData = await paidlyRes.json();

    // Log withdrawal (to Supabase or your DB)
    await fetch(`${process.env.SUPABASE_URL}/rest/v1/withdrawals`, {
      method: "POST",
      headers: {
        "apikey": process.env.SUPABASE_KEY,
        "Content-Type": "application/json",
        "Prefer": "return=minimal",
      },
      body: JSON.stringify({
        player_name: playerName,
        username,
        game_name: gameName,
        amount: withdrawAmount,
        wallet_address: walletAddress,
        transaction_id: paidlyData.id || null,
        status: paidlyData.status || "pending",
        created_at: new Date().toISOString(),
      }),
    });

    res.status(200).json({ success: true, data: paidlyData });
  } catch (err) {
    console.error("Paidly Withdraw API Error:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
}
