export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await fetch("https://api-staging.paidlyinteractive.com/v1/widget/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PAIDLY_API_KEY}`, // keep key safe in env vars
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Paidly proxy error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
