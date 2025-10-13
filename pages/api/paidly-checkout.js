export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { storeId, currency, amount, metadata, redirectUrl } = req.body;

    if (!storeId || !currency || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Call Paidly staging API
    const paidlyRes = await fetch(
      "https://api-staging.paidlyinteractive.com/v1/widget/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          storeId,
          currency,
          amount: parseFloat(amount),
          metadata,
          redirectUrl,
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

    console.log("✅ Paidly checkout created:", data);

    // Paidly returns widgetUrl or redirectUrl
    return res.status(200).json({
      widgetUrl: data.widgetUrl || data.redirectUrl || data.url,
      message: data.message || "Success",
      data,
    });
  } catch (error) {
    console.error("Paidly checkout error:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
