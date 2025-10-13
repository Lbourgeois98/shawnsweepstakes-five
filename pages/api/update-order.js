import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" })

  try {
    const { clickId, orderId, status } = req.body
    console.log("📩 /api/update-order called:", req.body)

    const { data, error } = await supabase
      .from("deposits")
      .update({
        wert_order_id: orderId,
        status: status || "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("click_id", clickId)
      .select()

    if (error) {
      console.error("❌ Supabase update error:", error)
      return res.status(500).json({ error: "Failed to update order", details: error.message })
    }

    console.log("✅ Order updated:", data)
    res.status(200).json({ success: true, data })
  } catch (err) {
    console.error("update-order error:", err)
    res.status(500).json({ error: "Internal server error", details: err.message })
  }
}
