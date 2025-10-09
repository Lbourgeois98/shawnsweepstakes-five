import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { playerName, username, gameName, depositAmount, sessionId, timestamp } = req.body;

  try {
    const { data, error } = await supabase
      .from("deposits")
      .insert([
        {
          player_name: playerName,
          username,
          game_name: gameName,
          deposit_amount: depositAmount,
          wert_session_id: sessionId,
          created_at: timestamp || new Date().toISOString(),
        },
      ]);

    if (error) throw error;

    res.status(200).json({ success: true, data });
  } catch (err) {
    console.error("log-deposit error:", err);
    res.status(500).json({ error: "Failed to log deposit" });
  }
}
