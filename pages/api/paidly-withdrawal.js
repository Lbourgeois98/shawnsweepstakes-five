export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { withdrawAmount } = req.body;

  try {
    const storeId = process.env.PAIDLY_STORE_ID;

    const response = await fetch(
      `https://api.paidly.io/api/v1/stores/${storeId}/withdrawal/request`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAIDLY_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: withdrawAmount,
          currency: "USD",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Paidly error:", data);
      return res.status(400).json({ error: data.message || "Paidly error" });
    }

    // ✅ Return the Paidly widget link
    return res.status(200).json({ checkoutLink: data.checkoutLink });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
