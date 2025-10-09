export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.WERT_API_KEY;

  try {
    const r = await fetch("https://partner.wert.io/api/external/hpp/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        flow_type: "simple",
        partner_id: "01K1T8VJJ8TY67M49FDXY865GF",
        origin: "https://widget.wert.io",
        commodity: "USDT",            // ✅ USDT
        network: "ethereum",          // ✅ Ethereum
        commodity_amount: req.body.extra?.depositAmount || "5",
        extra: {
          partner_data: {
            playerName: req.body.extra?.playerName,
            username: req.body.extra?.username,
            gameName: req.body.extra?.gameName,
            depositAmount: req.body.extra?.depositAmount,
          },
          wallets: [
            {
              name: "USDT",
              network: "ethereum",
              address: "0x9980B1bAaD63ec43dd0a1922B09bb08995C6f380",
            },
          ],
        },
      }),
    });

    const data = await r.json();
    console.log("Wert session created:", data);
    res.status(r.status).json(data);
  } catch (err) {
    console.error("create-session error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
