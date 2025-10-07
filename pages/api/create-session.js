// pages/api/create-session.js
import crypto from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.WERT_API_KEY;

  try {
    const { playerName, username, gameName, depositAmount } = req.body.extra;

    // Unique ID to trace this session across Wert events
    const click_id = crypto.randomUUID();

    // Build Wert session payload (Production mode)
    const body = {
      flow_type: "simple",
      commodity: "USDC", // Token being purchased
      network: "polygon", // Polygon = fast + cheap
      commodity_amount: String(depositAmount), // Amount in USDC
      address: "0x9980B1bAaD63ec43dd0a1922B09bb08995C6f380", // 👈 Your USDC wallet
      partner_data: {
        click_id,
        playerName,
        username,
        gameName,
      },
      extra: {
        playerName,
        username,
        gameName,
        depositAmount,
      },
    };

    // Wert PRODUCTION endpoint
    const r = await fetch(
      "https://partner.wert.io/api/external/hpp/create-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await r.json();

    // Return session + click ID to frontend
    return res.status(r.status).json({ ...data, click_id });
  } catch (err) {
    console.error("❌ create-session error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
