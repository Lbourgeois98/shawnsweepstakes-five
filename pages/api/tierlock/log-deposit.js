import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" })

  try {
    const { playerName, username, gameName, depositAmount, tierlockId, tierlockOrderId } = req.body

    const { data, error } = await supabase
      .from("tierlock_deposits")
      .insert([
        {
          player_name: playerName,
          username,
          game_name: gameName,
          deposit_amount: depositAmount,
          tierlock_id: tierlockId,
          tierlock_order_id: tierlockOrderId,
          status: "initiated",
        },
      ])
      .select()

    if (error) throw error
    res.status(200).json({ success: true, data })
  } catch (err) {
    console.error("tierlock error:", err)
    res.status(500).json({ error: "Failed to log deposit", details: err.message })
  }
}
