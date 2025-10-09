export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.WERT_API_KEY;

  try {
    const { depositAmount, playerName, username, gameName } = req.body;

    const response = await fetch(
      "https://partner.wert.io/api/external/hpp/create-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify({
          flow_type: "simple_full_restrict", // ✅ Changed to restrict flow for preset values
          partner_id: "01K1T8VJJ8TY67M49FDXY865GF",
          origin: "https://widget.wert.io",

          // ✅ USDT on Ethereum - preset values
          commodity: "USDT",
          network: "ethereum",
          wallet_address: "0x9980B1bAaD63ec43dd0a1922B09bb08995C6f380", // ✅ Correct parameter name
          
          // ✅ Preset deposit amount
          currency: "USD",
          currency_amount: depositAmount ? parseFloat(depositAmount) : undefined,

          // ✅ Optional metadata for tracking
          extra: {
            partner_data: {
              playerName,
              username,
              gameName,
              depositAmount,
            },
          },
        }),
      }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("create-session error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
