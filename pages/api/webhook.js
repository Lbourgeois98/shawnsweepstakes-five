// pages/api/webhook.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const event = req.body;

    console.log("✅ Wert webhook received:", event);

    const {
      event_name,
      click_id,
      user_id,
      order_id,
      payload = {},
    } = event;

    // Try to extract partner_data from payload if available
    const partnerData =
      payload.partner_data || payload.extra || {};

    const { playerName, username, gameName, depositAmount } = partnerData;

    // Store webhook data in Supabase
    const { error } = await supabase.from("wert_events").insert([
      {
        event_name: event_name || "unknown",
        click_id,
        user_id,
        order_id,
        payload,
        player_name: playerName || null,
        username: username || null,
        game_name: gameName || null,
        deposit_amount: depositAmount || null,
        created_at: new Date(),
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error);
      return res.status(500).json({ error: "Database insert failed" });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Webhook error:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
