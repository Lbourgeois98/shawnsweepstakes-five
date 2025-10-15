// pages/api/paidly-withdraw.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { orderId, username, amount, currency, paymentRequest } = req.body || {};

  if (!orderId || !username || !amount || !currency) {
    res.status(400).json({ message: "Missing required fields" });
    return;
  }

  const PAIDLY_API_BASE = process.env.PAIDLY_API_BASE || "https://api.paidlyinteractive.com";
  const STORE_ID = process.env.PAIDLY_STORE_ID;
  const API_TOKEN = process.env.PAIDLY_API_TOKEN;

  if (!STORE_ID || !API_TOKEN) {
    res.status(500).json({ message: "Paidly config missing on server (PAIDLY_STORE_ID / PAIDLY_API_TOKEN)" });
    return;
  }

  try {
    const metadata = {
      OrderId: orderId,
      CustomerId: username,
    };

    let endpoint = "";
    let payload = {};

    // If bolt11 invoice provided => direct invoice-withdrawal (attempt immediate payout)
    if (paymentRequest) {
      endpoint = `/api/v1/stores/${STORE_ID}/invoice-withdrawal`;
      payload = {
        amount: amount.toString(),
        currency: "BTC",
        metadata,
        payment_request: paymentRequest, // Bolt11 invoice
      };
    } else {
      // No invoice provided => create a withdrawal request (widget / LNURL). Paidly will return checkoutLink.
      endpoint = `/api/v1/stores/${STORE_ID}/withdrawal/request`;
      payload = {
        amount: amount.toString(),
        currency: "BTC",
        metadata,
      };
    }

    const apiUrl = `${PAIDLY_API_BASE}${endpoint}`;

    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${API_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("Paidly withdraw API error:", resp.status, data);
      return res.status(resp.status).json({
        message: data.error || data.message || "Paidly API error",
        data,
      });
    }

    // Return Paidly response to frontend (includes checkoutLink for widget flow)
    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (err) {
    console.error("paidly-withdraw exception:", err);
    return res.status(500).json({ message: "Internal server error", error: String(err) });
  }
}
