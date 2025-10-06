export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const event = req.body;

    console.log("✅ Wert webhook received:", event);

    // You can store this in your DB, send an email, etc.
    // Example: event.payload.partner_data contains your playerName, username, gameName, depositAmount

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}
