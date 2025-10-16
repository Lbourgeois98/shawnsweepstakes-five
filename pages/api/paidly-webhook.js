// pages/api/paidly-webhook.js
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

export const config = {
  api: {
    bodyParser: false, // we need raw body for HMAC verification
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// helper to read raw body
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const raw = await getRawBody(req); // Buffer
    const bodyString = raw.toString("utf8");

    const signature = (req.headers["paidly-sig"] || req.headers["btcpay-sig"] || "").toString();
    const secret = process.env.PAIDLY_WEBHOOK_SECRET;

    if (!signature || !secret) {
      console.warn("⚠️ Missing signature or webhook secret");
      return res.status(401).json({ error: "Invalid webhook configuration" });
    }

    const computed = crypto.createHmac("sha256", secret).update(bodyString).digest("hex");

    if (computed !== signature) {
      console.warn("⚠️ Signature mismatch", { computed, signature });
      return res.status(401).json({ error: "Signature mismatch" });
    }

    // parse JSON after verification
    let payload;
    try {
      payload = JSON.parse(bodyString);
    } catch (e) {
      console.error("Invalid JSON webhook body", e);
      return res.status(400).json({ error: "Invalid JSON" });
    }

    const { type, metadata, tx } = payload;
    console.log("🔔 Paidly webhook received:", type);

    // --- Existing Onchain deposit events (keep your logic) ---
    if (type === "OnchainDepositSettled") {
      await supabase
        .from("bitcoin_deposits")
        .update({
          status: "completed",
          bitcoin_tx: tx?.hash || null,
          bitcoin_address: tx?.address || null,
          paidly_metadata: metadata || null,
        })
        .eq("bitcoin_tx", metadata?.customerId);

      console.log("✅ Deposit marked completed");
    } else if (type === "OnchainDepositProcessing") {
      await supabase
        .from("bitcoin_deposits")
        .update({
          status: "processing",
          bitcoin_tx: tx?.hash || null,
          bitcoin_address: tx?.address || null,
          paidly_metadata: metadata || null,
        })
        .eq("bitcoin_tx", metadata?.customerId);

      console.log("⏳ Deposit marked processing");
    }

    // --- Withdrawal events (widget flow) ---
    // Paidly will notify you when the withdrawal completes or fails.
    // Event types used here: "WithdrawalSettled", "WithdrawalFailed"
    // If your Paidly staging docs use different exact strings, adjust them accordingly.
    else if (type === "WithdrawalSettled" || type === "LightningWithdrawalSettled") {
      // Prefer to match by metadata fields if available (e.g., metadata.username)
      const paidlyId = payload?.metadata?.id || payload?.metadata?.withdrawal_id || payload?.id || null;

      // Update the bitcoin_withdrawals row that has status 'pending'
      const updateQuery = supabase
        .from("bitcoin_withdrawals")
        .update({
          status: "completed",
          paidly_tx: tx || null,
          paidly_metadata: payload || null,
          paidly_withdrawal_id: paidlyId,
          settled_at: new Date().toISOString(),
        });

      // try to find by checkout_link or metadata.username if available
      if (payload?.checkoutLink) {
        updateQuery.eq("checkout_link", payload.checkoutLink);
      } else if (payload?.metadata?.username) {
        updateQuery.eq("username", payload.metadata.username).eq("status", "pending");
      } else if (paidlyId) {
        updateQuery.eq("paidly_withdrawal_id", paidlyId);
      }

      await updateQuery;
      console.log("✅ Withdrawal marked completed");
    } else if (type === "WithdrawalFailed" || type === "LightningWithdrawalFailed") {
      const paidlyId = payload?.metadata?.id || payload?.metadata?.withdrawal_id || payload?.id || null;

      const updateQuery = supabase
        .from("bitcoin_withdrawals")
        .update({
          status: "failed",
          paidly_tx: tx || null,
          paidly_metadata: payload || null,
          failed_at: new Date().toISOString(),
        });

      if (payload?.checkoutLink) {
        updateQuery.eq("checkout_link", payload.checkoutLink);
      } else if (payload?.metadata?.username) {
        updateQuery.eq("username", payload.metadata.username).eq("status", "pending");
      } else if (paidlyId) {
        updateQuery.eq("paidly_withdrawal_id", paidlyId);
      }

      await updateQuery;
      console.log("❌ Withdrawal marked failed");
    } else {
      // Other events — store them for traceability
      try {
        await supabase.from("paidly_webhook_logs").insert([{ event: payload, received_at: new Date().toISOString() }]);
      } catch (e) {
        // non-fatal
      }
      console.log("ℹ️ Unhandled Paidly event type (logged).");
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return res.status(500).json({ error: "Internal server error", details: String(err) });
  }
}
