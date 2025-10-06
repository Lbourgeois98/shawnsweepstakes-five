import { supabase } from "../../lib/supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const event = req.body;
    console.log("✅ Wert webhook received:", event);

    const { event_name, click_id, user_id, order_id, commodity, currency, currency_amount } =
      event || {};

    const partnerData = event?.payload?.partner_data || {};
    const { playerName, username, gameName, depositAmount } = partnerData;

    const { error } = await supabase.from("wert_events").insert([
      {
        event_name,
        click_id,
        user_id,
        order_id,
        commodity,
        currency,
        currency_amount,
        player_name: playerName || null,
        username: username || null,
        game_name: gameName || null,
        deposit_amount: depositAmount || null,
      },
    ]);

    if (error) throw error;

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
