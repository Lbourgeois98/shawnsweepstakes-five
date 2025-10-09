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
        partner_id: "01K1T8VJJ8TY67M49FDXY865GF", // Replace with your Partner ID if necessary
        origin: "https://widget.wert.io",
        commodity: "USDT",
        network: "ethereum",
        extra: {
          // Preserve any custom frontend data
          ...req.body.extra,
          wallets: [
            {
              name: "USDT",
              network: "ethereum",
              address: "0x9980B1bAaD63ec43dd0a1922B09bb08995C6f380", // Your fixed USDT wallet
            },
          ],
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
