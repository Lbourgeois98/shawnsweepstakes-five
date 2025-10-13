import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" })

  try {
    const { playerName, username, gameName, depositAmount, sessionId, clickId, timestamp } = req.body

    console.log("📩 /api/log-deposits called:", req.body)

    // ✅ Check Supabase connection
    const { error: connError } = await supabase.from("deposits").select("*").limit(1)
    if (connError) {
      console.error("❌ Supabase connection failed:", connError)
      return res.status(500).json({ error: "Supabase connection failed", details: connError.message })
    }

    const { data, error } = await supabase
      .from("deposits")
      .insert([
        {
          player_name: playerName,
          username,
          game_name: gameName,
          deposit_amount: depositAmount,
          wert_session_id: sessionId,
          click_id: clickId,
          status: "initiated",
          created_at: timestamp || new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("❌ Supabase insert error:", error)
      return res.status(500).json({ error: "Failed to log deposit", details: error.message })
    }

    console.log("✅ Deposit logged:", data)
    res.status(200).json({ success: true, data })
  } catch (err) {
    console.error("log-deposit error:", err)
    res.status(500).json({ error: "Internal server error", details: err.message })
  }
}
