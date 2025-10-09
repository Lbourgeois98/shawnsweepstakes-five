export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.WERT_API_KEY;
  const { depositAmount } = req.body.extra || {};

  // 1️⃣ Enforce a $5 minimum
  if (!depositAmount || depositAmount < 5) {
    return res.status(400).json({ error: "Minimum deposit is $5" });
  }

  try {
    // 2️⃣ Create the Wert session
    const r = await fetch("https://partner.wert.io/api/external/hpp/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        flow_type: "simple",
        commodity: "USDC", // Token type
        network: "ethereum", // Or "polygon" if you prefer
        address: "0x9980B1bAaD63ec43dd0a1922B09bb08995C6f380", // Your wallet
        extra: req.body.extra,
        total_amount: depositAmount, // USD amount to purchase
      }),
    });

    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    console.error("create-session error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
