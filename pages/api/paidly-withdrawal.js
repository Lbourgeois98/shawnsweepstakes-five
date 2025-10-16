export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { userId, amount } = req.body;

    const storeId = process.env.PAIDLY_STORE_ID;
    const apiToken = process.env.PAIDLY_API_TOKEN;

    if (!storeId || !apiToken) {
      console.error("❌ Missing Paidly credentials");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const response = await fetch(
      `https://api-staging.paidlyinteractive.com/api/v1/stores/${storeId}/withdrawal/request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${apiToken}`,
        },
        body: JSON.stringify({
          userId,
          currency: "BTC",
          amount: amount,
          checkout: {
            redirectURL: `${process.env.NEXT_PUBLIC_APP_URL || "https://shawnsweepstakes-five.vercel.app"}/`,
            redirectAutomatically: false,
          },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Paidly API error:", data);
      return res.status(response.status).json({
        error: "Paidly request failed",
        details: data,
      });
    }

    console.log("✅ Paidly withdrawal request created:", data);
    res.status(200).json(data);
  } catch (err) {
    console.error("Paidly withdrawal error:", err);
    res.status(500).json({ error: "Internal server error", details: err.message });
  }
}
