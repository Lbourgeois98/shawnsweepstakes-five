import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.WERT_API_KEY;
  const partnerId = "01K1T8VJJ8TY67M49FDXY865GF"; // your Wert partner ID

  try {
    // Create Wert session
    const r = await fetch("https://partner.wert.io/api/external/hpp/create-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        flow_type: "simple",
        partner_id: partnerId,
        origin: "https://widget.wert.io",
        extra: {
          ...req.body.extra,
          wallets: [
            {
              name: "USDT",
              network: "ethereum",
              address: "0x9980B1bAaD63ec43dd0a1922B09bb08995C6f380",
            },
          ],
          // Set min amount to $5
          amount: {
            currency: "USD",
            amount: 5,
          },
        },
      }),
    });

    const data = await r.json();

    if (!r.ok) {
      console.error("❌ Wert API error:", data);
      return res.status(r.status).json(data);
    }

    // Log session in Supabase
    const { error } = await supabase.from("wert_transactions").insert([
      {
        wert_session_id: data.session_id,
        status: "created",
        user_wallet: "0x9980B1bAaD63ec43dd0a1922B09bb08995C6f380",
        currency: "USDT",
        network: "ethereum",
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) console.error("⚠️ Supabase insert error:", error);

    console.log("✅ Wert session created:", data.session_id);
    res.status(200).json(data);
  } catch (err) {
    console.error("❌ create-session error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
