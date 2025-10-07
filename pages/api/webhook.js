// pages/api/webhook.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body;
    const event = body.event || body.event_name;
    const data = body.data || body;

    console.log("🔔 Wert webhook received:", event);

    switch (event) {
      case "order_complete": {
        console.log(
          `✅ Order complete for ${data.user_id} - ${data["commodity amount"]} ${data.commodity}`
        );

        // Extract relevant fields
        const partner = data.partner_data || {};
        const deposit = {
          order_id: data.order_id,
          user_id: data.user_id,
          click_id: partner.click_id || null,
          player_name: partner.playerName || null,
          username: partner.username || null,
          game_name: partner.gameName || null,
          commodity: data.commodity,
          commodity_amount: data["commodity amount"]
            ? Number(data["commodity amount"])
            : null,
          currency: data.currency || null,
          currency_amount: data["currency amount"]
            ? Number(data["currency amount"])
            : null,
          address: data.address || null,
          transaction_id: data.transaction_id || null,
          status: "completed",
          raw_event: body,
        };

        const { error } = await supabase.from("deposits").insert([deposit]);

        if (error) {
          console.error("❌ Supabase insert error:", error);
        } else {
          console.log("✅ Saved successful deposit in Supabase.");
        }

        break;
      }

      case "order_failed":
        console.log("❌ Order failed:", data);
        break;

      case "order_canceled":
        console.log("🚫 Order canceled:", data);
        break;

      case "transfer_started":
        console.log("💸 Transfer started:", data);
        break;

      default:
        console.log("ℹ️ Unhandled event:", event);
    }

    // Always confirm receipt to Wert
    res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Error handling Wert webhook:", err);
    res.status(400).json({ error: "Bad Request" });
  }
}
