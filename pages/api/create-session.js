export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.WERT_API_KEY;

  try {
    const response = await fetch("https://partner.wert.io/api/external/hpp/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        flow_type: "simple",
        partner_id: "01K1T8VJJ8TY67M49FDXY865GF",
        origin: "https://widget.wert.io",
        commodity: "USDT",
        network: "ethereum",
        extra: {
          // Automatically set your wallet destination
          wallets: [
            {
              name: "USDT",
              network: "ethereum",
              address: "0x9980B1bAaD63ec43dd0a1922B09bb08995C6f380",
            },
          ],
          // Keep any optional extra data from frontend if needed
          ...(req.body?.extra || {}),
        },
      }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("create-session error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
