import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { customerId, playerName, username, gameName, depositAmount } = req.body;

    if (!customerId || !depositAmount) {
      return res.status(400).json({
        message: "Missing required fields (customerId, depositAmount)",
      });
    }

    const storeId = process.env.PAIDLY_STORE_ID;
    const apiToken = process.env.PAIDLY_API_TOKEN;

    if (!storeId || !apiToken) {
      console.error("❌ Missing Paidly credentials");
      return res.status(500).json({
        message: "Server configuration error",
      });
    }

    const paidlyRes = await fetch(
      `https://api-staging.paidlyinteractive.com/api/v1/stores/${storeId}/onchain/btc/addresses/${customerId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiToken}`,
        },
        body: JSON.stringify({
          checkout: {
            redirectURL: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/`,
            redirectAutomatically: false,
          },
        }),
      }
    );

    const data = await paidlyRes.json();

    if (!paidlyRes.ok) {
      console.error("❌ Paidly API error:", data);
      return res.status(paidlyRes.status).json({
        message: data.message || "Paidly request failed",
        details: data,
      });
    }

    console.log("✅ Paidly Bitcoin top-up created:", data);

    return res.status(200).json({
      checkoutLink: data.checkoutLink,
      bitcoinAddress: data.address,
      topUpId: data.id,
      message: "Success",
    });

  } catch (error) {
    console.error("Paidly checkout error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
