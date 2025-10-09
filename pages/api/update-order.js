import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { clickId, orderId, status } = req.body;

  try {
    const { data, error } = await supabase
      .from("deposits")
      .update({
        wert_order_id: orderId,
        status: status || "processing",
        updated_at: new Date().toISOString(),
      })
      .eq("click_id", clickId);

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("update-order error:", err);
    res.status(500).json({ error: "Failed to update order" });
  }
}
