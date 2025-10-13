import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" })

  try {
    const { playerName, username, gameName, depositAmount, bitcoinTx, bitcoinAddress } = req.body

    const { data, error } = await supabase
      .from("bitcoin_deposits")
      .insert([
        {
          player_name: playerName,
          username,
          game_name: gameName,
          deposit_amount: depositAmount,
          bitcoin_tx: bitcoinTx,
          bitcoin_address: bitcoinAddress,
          status: "pending",
        },
      ])
      .select()

    if (error) throw error
    res.status(200).json({ success: true, data })
  } catch (err) {
    console.error("bitcoin error:", err)
    res.status(500).json({ error: "Failed to log deposit", details: err.message })
  }
}
