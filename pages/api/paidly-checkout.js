export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const paidlyResponse = await fetch("https://api-staging.paidlyinteractive.com/v1/widget/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAIDLY_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    // Try to parse as JSON safely
    let data;
    try {
      data = await paidlyResponse.json();
    } catch (parseError) {
      const text = await paidlyResponse.text();
      console.error("Paidly response (non-JSON):", text);
      return res.status(paidlyResponse.status).json({
        message: "Paidly API returned non-JSON response",
        raw: text,
      });
    }

    res.status(paidlyResponse.status).json(data);
  } catch (error) {
    console.error("Paidly proxy error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
