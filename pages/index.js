import { useState } from 'react';

const PARTNER_ID = process.env.NEXT_PUBLIC_WERT_PARTNER_ID;
const ORIGIN = 'https://sandbox.wert.io';

const EXTRA = {
  "wallets": [
    { "name": "TT",  "network": "amoy",   "address": "0x0118E8e2FCb391bCeb110F62b5B7B963477C1E0d" },
    { "name": "ETH", "network": "sepolia", "address": "0x0118E8e2FCb391bCeb110F62b5B7B963477C1E0d" }
  ]
};

export default function Home() {
  const [loading, setLoading] = useState(false);

  const openWert = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flow_type: 'simple' }),
      });
      const data = await res.json();

      if (!data.sessionId) {
        alert('Failed: ' + JSON.stringify(data));
        setLoading(false);
        return;
      }

      const WertWidget = (await import('@wert-io/widget-initializer')).default;
      const options = {
        partner_id: PARTNER_ID,
        session_id: data.sessionId,
        origin: ORIGIN,
        extra: JSON.stringify(EXTRA),
      };
      const wertWidget = new WertWidget(options);
      wertWidget.open();
    } catch (err) {
      console.error(err);
      alert('Error creating session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 40, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Wert widget demo (sandbox)</h1>
      <button onClick={openWert} disabled={loading}>
        {loading ? 'Opening...' : 'Open Wert widget'}
      </button>
    </main>
  );
}
