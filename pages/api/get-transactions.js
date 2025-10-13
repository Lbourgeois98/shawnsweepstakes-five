import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // ✅ use service key safely here
);

export default async function handler(req, res) {
  try {
    const { data: transactions, error: txError } = await supabase
      .from("transactions")
      .select("*");

    const { data: deposits, error: depError } = await supabase
      .from("deposits")
      .select("*");

    if (txError || depError) throw txError || depError;

    const merged = [...(transactions || []), ...(deposits || [])];
    const sorted = merged.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    return res.status(200).json({ data: sorted });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: err.message });
  }
}
