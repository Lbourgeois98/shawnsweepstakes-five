export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, userId } = req.body;

    const response = await fetch(
      `https://api-staging.paidlyinteractive.com/api/v1/stores/${process.env.PAIDLY_STORE_ID}/withdrawal/request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${process.env.PAIDLY_API_TOKEN}`,
        },
        body: JSON.stringify({
          amount: amount.toString(), // BTC amount as string
          currency: "BTC",
          metadata: { CustomerId: userId },
          checkout: {
            redirectURL: "https://shawnsweepstakes-five.vercel.app/withdrawal-complete",
            redirectAutomatically: true,
          },
        }),
      }
    );

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
