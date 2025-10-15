export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { storeId, currency, amount, metadata, redirectUrl } = req.body;

    if (!storeId || !currency || !amount) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const paidlyRes = await fetch("https://api-staging.paidlyinteractive.com/v1/widget/withdrawal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        storeId,
        currency,
        amount,
        metadata,
        redirectUrl,
      }),
    });

    const data = await paidlyRes.json();

    if (!paidlyRes.ok) {
      return res.status(paidlyRes.status).json({
        message: data.message || "Paidly withdrawal request failed",
      });
    }

    return res.status(200).json({
      widgetUrl: data.widgetUrl,
      message: data.message || "Success",
    });
  } catch (error) {
    console.error("Paidly withdrawal error:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
