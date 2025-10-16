import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { userId, amount, redirectURL } = req.body;

  try {
    const response = await fetch(
      `https://api.paidly.com/api/v1/stores/${process.env.PAIDLY_STORE_ID}/withdrawal/request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PAIDLY_API_TOKEN}`,
        },
        body: JSON.stringify({
          amount,
          currency: "sats",
          checkout: {
            redirectURL,
            redirectAutomatically: true,
          },
          metadata: { userId },
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
