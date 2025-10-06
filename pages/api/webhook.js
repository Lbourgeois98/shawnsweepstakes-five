// app/api/wert-webhook/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    console.log("🔔 Wert webhook received:", body);

    const event = body.event || body.event_name;
    const data = body.data || body;

    switch (event) {
      case "order_complete":
        console.log("✅ Order complete!");
        console.log(`User: ${data.user_id}, Amount: ${data["commodity amount"]} ${data.commodity}`);
        // 👉 You can now mark this deposit as "successful" in your DB
        break;

      case "order_failed":
        console.log("❌ Order failed:", data);
        break;

      case "order_canceled":
        console.log("🚫 Order canceled:", data);
        break;

      case "transfer_started":
        console.log("💸 Transfer started (funds sent, waiting for confirmation):", data);
        break;

      default:
        console.log("ℹ️ Unhandled event:", event);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Error handling Wert webhook:", err);
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  }
}
