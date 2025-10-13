export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" })

  const apiKey = process.env.WERT_API_KEY
  if (!apiKey) {
    console.error("❌ Missing WERT_API_KEY environment variable")
    return res.status(500).json({ error: "Missing API key" })
  }

  try {
    const { depositAmount, playerName, username, gameName } = req.body
    console.log("💳 Creating Wert session:", { playerName, username, gameName, depositAmount })

    const response = await fetch("https://partner.wert.io/api/external/hpp/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        flow_type: "simple_full_restrict",
        partner_id: "01K1T8VJJ8TY67M49FDXY865GF",
        origin: "https://widget.wert.io",
        commodity: "USDT",
        network: "ethereum",
        wallet_address: "0x9980B1bAaD63ec43dd0a1922B09bb08995C6f380",
        currency: "USD",
        currency_amount: depositAmount ? parseFloat(depositAmount) : undefined,
        extra: {
          partner_data: {
            playerName,
            username,
            gameName,
            depositAmount,
          },
        },
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      console.error("❌ Wert API error:", data)
      return res.status(response.status).json({ error: "Wert API request failed", details: data })
    }

    console.log("✅ Wert session created:", data)
    res.status(200).json(data)
  } catch (err) {
    console.error("create-session error:", err)
    res.status(500).json({ error: "Internal server error", details: err.message })
  }
}
