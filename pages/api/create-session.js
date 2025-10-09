export default async function handler(req, res) {
  const apiKey = process.env.WERT_API_KEY;

  try {
    const response = await fetch("https://partner.wert.io/api/external/hpp/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      // 🔒 Always use this fixed configuration
      body: JSON.stringify({
        partner_id: "01K1T8VJJ8TY67M49FDXY865GF",
        origin: "https://widget.wert.io",
        extra: {
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

    const data = await response.json();

    // Return Wert session data
    res.status(response.status).json(data);
  } catch (err) {
    console.error("create-session error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
