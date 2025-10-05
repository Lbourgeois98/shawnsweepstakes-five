// pages/api/webhook.js

export const config = {
  api: {
    bodyParser: true, // Wert sends JSON
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const event = req.body;
    console.log("📬 Wert Webhook:", event);

    switch (event.type) {
      case "order_complete":
        console.log("✅ Deposit successful:", {
          playerName: event.order?.partner_data?.playerName,
          username: event.order?.partner_data?.username,
          gameName: event.order?.partner_data?.gameName,
          depositAmount: event.order?.partner_data?.depositAmount,
          wertOrderId: event.order?.id,
          txHash: event.order?.transaction_id,
          amountUSD: event.order?.quote_amount,
        });
        break;

      case "order_failed":
        console.log("❌ Deposit failed:", {
          orderId: event.order?.id,
          reason: event.error || "unknown",
        });
        break;

      default:
        console.log("ℹ️ Other Wert event:", event.type);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
