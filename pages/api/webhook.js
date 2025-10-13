import { createClient } from "@supabase/supabase-js"

export const config = {
  api: {
    bodyParser: false, // Wert sends raw JSON
  },
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  try {
    // Collect raw request body (Wert requires this)
    const chunks = []
    for await (const chunk of req) chunks.push(chunk)
    const rawBody = Buffer.concat(chunks).toString("utf8")

    const event = JSON.parse(rawBody)
    console.log("🔔 Wert Webhook Received:", event)

    const { type, click_id, order, user } = event
    const orderId = order?.id
    const userId = user?.user_id

    if (!orderId && !click_id) {
      console.warn("⚠️ Missing both order_id and click_id in webhook data")
      return res.status(200).json({ received: true })
    }

    const statusMap = {
      order_complete: "completed",
      order_failed: "failed",
      order_canceled: "canceled",
      payment_started: "pending",
      transfer_started: "transfer_started",
    }
    const newStatus = statusMap[type] || "unknown"

    let updateResult
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
        .eq("wert_order_id", orderId)
        .select()

      // Fallback to click_id
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
          .eq("click_id", click_id)
          .select()
      }
    } else if (click_id) {
      updateResult = await supabase
        .from("deposits")
        .update({
          status: newStatus,
          wert_event_type: type,
          wert_user_id: userId,
          updated_at: new Date().toISOString(),
        })
        .eq("click_id", click_id)
        .select()
    }

    if (updateResult?.error) {
      console.error("❌ Supabase update error:", updateResult.error)
      return res.status(500).json({ error: "Failed to update transaction" })
    }

    console.log(`✅ Updated ${orderId || click_id} → ${newStatus}`)
    res.status(200).json({ success: true })
  } catch (err) {
    console.error("❌ Webhook handler error:", err)
    res.status(500).json({ error: "Internal server error", details: err.message })
  }
}
