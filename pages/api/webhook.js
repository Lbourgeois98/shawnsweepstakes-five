import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export const config = {
  api: {
    bodyParser: false, // Important — Wert sends raw JSON
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Collect the raw request body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks).toString("utf8");

    // Parse Wert's webhook payload
    const event = JSON.parse(rawBody);
    console.log("🔔 Wert Webhook Received:", JSON.stringify(event, null, 2));

    const { type, click_id, order, user } = event;

    // ✅ Wert sends order.id, not session_id
    const orderId = order?.id;
    const userId = user?.user_id;

    if (!orderId && !click_id) {
      console.error("⚠️ Missing both order_id and click_id in webhook data");
      // Still return 200 to acknowledge receipt
      return res.status(200).json({ received: true });
    }

    // Determine new transaction status based on event type
    let newStatus = "unknown";
    if (type === "order_complete") newStatus = "completed";
    else if (type === "order_failed") newStatus = "failed";
    else if (type === "order_canceled") newStatus = "canceled";
    else if (type === "payment_started") newStatus = "pending";
    else if (type === "transfer_started") newStatus = "transfer_started";

    // Try to update by order_id first, then by click_id
    let updateResult;
    
    if (orderId) {
      updateResult = await supabase
        .from("deposits")
        .update({
          status: newStatus,
          wert_event_type: type,
          wert_order_id: orderId,
          wert_user_id: userId,
          transaction_id: order?.transaction_id,
          updated_at: new Date().toISOString(),
        })
        .eq("wert_order_id", orderId);

      // If no rows updated, try by click_id
      if (updateResult.data?.length === 0 && click_id) {
        updateResult = await supabase
          .from("deposits")
          .update({
            status: newStatus,
            wert_event_type: type,
            wert_order_id: orderId,
            wert_user_id: userId,
            transaction_id: order?.transaction_id,
            updated_at: new Date().toISOString(),
          })
          .eq("click_id", click_id);
      }
    } else if (click_id) {
      // Only have click_id
      updateResult = await supabase
        .from("deposits")
        .update({
          status: newStatus,
          wert_event_type: type,
          wert_user_id: userId,
          updated_at: new Date().toISOString(),
        })
        .eq("click_id", click_id);
    }

    if (updateResult?.error) {
      console.error("❌ Supabase update error:", updateResult.error);
      return res.status(500).json({ error: "Failed to update transaction" });
    }

    console.log(`✅ Updated order ${orderId || click_id} to status: ${newStatus}`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
