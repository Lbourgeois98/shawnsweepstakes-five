export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.WERT_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'WERT_API_KEY not configured on server' });
  }

  try {
    const payload = req.body || {};

    const r = await fetch('https://partner-sandbox.wert.io/api/external/hpp/create-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': apiKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await r.json();
    return res.status(r.status).json(data);
  } catch (err) {
    console.error('create-session error', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
