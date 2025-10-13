import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  try {
    // Fetch from all deposit tables
    const { data: wertDeposits, error: wertError } = await supabase
      .from("wert_deposits")
      .select("*")
      .then((result) => {
        if (result.error) return result;
        return {
          data: (result.data || []).map((d) => ({
            ...d,
            payment_method: "Wert",
            table: "wert_deposits",
          })),
          error: null,
        };
      });

    const { data: tierlockDeposits, error: tierlockError } = await supabase
      .from("tierlock_deposits")
      .select("*")
      .then((result) => {
        if (result.error) return result;
        return {
          data: (result.data || []).map((d) => ({
            ...d,
            payment_method: "TierLock",
            table: "tierlock_deposits",
          })),
          error: null,
        };
      });

    const { data: fnupayDeposits, error: fnupayError } = await supabase
      .from("fnupay_deposits")
      .select("*")
      .then((result) => {
        if (result.error) return result;
        return {
          data: (result.data || []).map((d) => ({
            ...d,
            payment_method: "FNUPAY",
            table: "fnupay_deposits",
          })),
          error: null,
        };
      });

    const { data: bitcoinDeposits, error: bitcoinError } = await supabase
      .from("bitcoin_deposits")
      .select("*")
      .then((result) => {
        if (result.error) return result;
        return {
          data: (result.data || []).map((d) => ({
            ...d,
            payment_method: "Bitcoin",
            table: "bitcoin_deposits",
          })),
          error: null,
        };
      });

    if (wertError || tierlockError || fnupayError || bitcoinError) {
      throw wertError || tierlockError || fnupayError || bitcoinError;
    }

    // Merge all deposits
    const allDeposits = [
      ...(wertDeposits || []),
      ...(tierlockDeposits || []),
      ...(fnupayDeposits || []),
      ...(bitcoinDeposits || []),
    ];

    // Sort by most recent first
    const sorted = allDeposits.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    console.log(`✅ Fetched ${sorted.length} total deposits`);

    return res.status(200).json(sorted);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: err.message });
  }
}
