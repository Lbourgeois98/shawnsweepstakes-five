// pages/api/create-session.js
export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.WERT_API_KEY;

  try {
    // Extract user info from request body
    const { playerName, username, gameName, depositAmount } = req.body;

    // Construct "extra" metadata for Wert dashboard logging
    const extra = {
      playerName,
      username,
      gameName,
      depositAmount,
      wallets: [
        { name: "TT", network: "amoy", address: "0x0118E8e2FCb391bCeb110F62b5B7B963477C1E0d" },
        { name: "ETH", network: "sepolia", address: "0x0118E8e2FCb391bCeb110F62b5B7B963477C1E0d" },
      ],
    };

    const r = await fetch(
      "https://partner-sandbox.wert.io/api/external/hpp/create-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify({
          flow_type: "simple",
          commodity: {
            // Optional but helps your Wert dashboard show context
            item_name: `${gameName} | ${username}`,
            item_amount: depositAmount,
            currency: "USD",
          },
          extra,
        }),
      }
    );

    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    console.error("Error creating Wert session:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
