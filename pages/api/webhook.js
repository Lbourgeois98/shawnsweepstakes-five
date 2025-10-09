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
    console.log("🔔 Wert Webhook Received:", event);

    const { event_type, data } = event;

    if (!data?.session_id) {
      console.error("⚠️ Missing session_id in webhook data");
      return res.status(400).json({ error: "Missing session_id" });
    }

    // Determine new transaction status
    let newStatus = "unknown";
    if (event_type === "payment_success") newStatus = "completed";
    else if (event_type === "payment_fail") newStatus = "failed";
    else if (event_type === "payment_pending") newStatus = "pending";

    // Update the matching record in Supabase
    const { error } = await supabase
      .from("wert_transactions")
      .update({
        status: newStatus,
        wert_event_type: event_type,
        updated_at: new Date().toISOString(),
      })
      .eq("wert_session_id", data.session_id);

    if (error) {
      console.error("❌ Supabase update error:", error);
      return res.status(500).json({ error: "Failed to update transaction" });
    }

    console.log(`✅ Updated Wert session ${data.session_id} to status: ${newStatus}`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("❌ Webhook handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
