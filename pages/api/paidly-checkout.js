export const config = {
  api: {
    bodyParser: false, // important for raw stream forwarding
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // Collect raw body manually
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const bodyString = Buffer.concat(buffers).toString();

    // Send request to Paidly staging
    const paidlyResponse = await fetch(
      "https://api-staging.paidlyinteractive.com/v1/widget/checkout",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.PAIDLY_API_KEY}`, // staging key
        },
        body: bodyString,
      }
    );

    // Try to parse JSON safely
    let data;
    try {
      data = await paidlyResponse.json();
    } catch {
      const text = await paidlyResponse.text();
      console.error("Paidly returned non-JSON:", text);
      return res.status(paidlyResponse.status).json({
        message: "Paidly returned non-JSON response",
        raw: text,
      });
    }

    // Forward Paidly's response
    res.status(paidlyResponse.status).json(data);
  } catch (error) {
    console.error("Paidly proxy error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
