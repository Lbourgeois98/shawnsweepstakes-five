import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const signature = req.headers["btcpay-sig"];
    const secret = process.env.PAIDLY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      console.warn("⚠️ Missing signature or secret");
      return res.status(401).json({ error: "Invalid webhook" });
    }

    const bodyString = JSON.stringify(req.body);
    const hash = crypto
      .createHmac("sha256", secret)
      .update(bodyString)
      .digest("hex");

    if (hash !== signature) {
      console.warn("⚠️ Signature mismatch");
      return res.status(401).json({ error: "Signature mismatch" });
    }

    const { type, metadata, tx } = req.body;

    console.log("🔔 Paidly Webhook:", type, metadata);

    if (type === "OnchainDepositSettled") {
      await supabase
        .from("bitcoin_deposits")
        .update({
          status: "completed",
          bitcoin_tx: tx?.hash,
          bitcoin_address: tx?.address,
        })
        .eq("bitcoin_tx", metadata?.customerId);

      console.log("✅ Deposit marked as completed");
    } else if (type === "OnchainDepositProcessing") {
      await supabase
        .from("bitcoin_deposits")
        .update({
          status: "processing",
          bitcoin_tx: tx?.hash,
          bitcoin_address: tx?.address,
        })
        .eq("bitcoin_tx", metadata?.customerId);

      console.log("⏳ Deposit marked as processing");
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ error: error.message });
  }
}
