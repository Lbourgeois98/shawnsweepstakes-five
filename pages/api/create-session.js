export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.WERT_API_KEY;

  try {
    const r = await fetch(
      "https://partner.wert.io/api/external/hpp/create-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify({
          flow_type: "simple_full_restrict",
          partner_id: "01K1T8VJJ8TY67M49FDXY865GF",
          origin: "https://widget.wert.io",

          // Restrict to USDT / Ethereum
          commodity: "USDT",
          network: "ethereum",

          // Enforce minimum deposit of $5 USD (in fiat) — this is allowed per docs
          total_amount: 5,
          currency: "USD",

          // Enforce your wallet address and prevent user override
          wallet_address: "0x9980B1bAaD63ec43dd0a1922B09bb08995C6f380",

          // Any extra metadata you want to pass (order ID, user ID, etc.)
          extra: {
            ...(req.body?.extra || {}),
          },
        }),
      }
    );

    const data = await r.json();
    res.status(r.status).json(data);
  } catch (err) {
    console.error("create-session error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
