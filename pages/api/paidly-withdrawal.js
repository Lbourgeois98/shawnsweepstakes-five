export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { userId } = req.body; // no amount here, let user choose in widget

    const response = await fetch(
      `https://api.paidlyinteractive.com/api/v1/stores/${process.env.PAIDLY_STORE_ID}/withdrawal/request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${process.env.PAIDLY_API_TOKEN}`,
        },
        body: JSON.stringify({
          userId,
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
