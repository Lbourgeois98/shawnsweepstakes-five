"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [username, setUsername] = useState("");
  const [gameName, setGameName] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const games = [
      { id: "megaspinsweeps", name: "Mega Spin Sweeps", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/85307f95.jpg?v=0c91e9dc", gameUrl: "http://www.megaspinsweeps.com/index.html" },
      { id: "vblink777", name: "Vblink", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/753a32c3.jpg?v=0c91e9dc", gameUrl: "https://www.vblink777.club/" },
      { id: "goldentreasure", name: "Golden Treasure", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/7c9b03e5.jpg?v=0c91e9dc", gameUrl: "https://www.goldentreasure.mobi/" },
      { id: "orionstars", name: "Orion Stars", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/417aedb1.png?v=0c91e9dc", gameUrl: "http://start.orionstars.vip:8580/index.html" },
      { id: "firekirin", name: "Fire Kirin", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/189aadee.jpg?v=0c91e9dc", gameUrl: "http://start.firekirin.xyz:8580/index.html" },
      { id: "rivermonster", name: "River Monster", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/253c9f08.jpg?v=0c91e9dc", gameUrl: "https://rm777.net/" },
      { id: "riversweeps", name: "Riversweeps", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/597c1510.jpg?v=0c91e9dc", gameUrl: "https://bet777.eu/" },
      { id: "fortune2go", name: "Fortune 2 Go", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/d1498abc.jpg?v=0c91e9dc", gameUrl: "https://www.fortune2go20.com/mobile/Login/index.html" },
      { id: "goldendragon", name: "Golden Dragon", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/de5f04bc.jpg?v=0c91e9dc", gameUrl: "https://playgd.mobi/SSLobby/3733.0/web-mobile/index.html" },
      { id: "bludragon", name: "Blue Dragon", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/faeeb77b.png?v=0c91e9dc", gameUrl: "http://app.bluedragon777.com/" },
      { id: "vegasx", name: "VEGAS X", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/1e472144.jpg?v=0c91e9dc", gameUrl: "https://vegas-x.org/" },
      { id: "ultrapanda", name: "ULTRAPANDA", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/ad5dd9c6.jpg?v=0c91e9dc", gameUrl: "https://www.ultrapanda.mobi/" },
      { id: "milkyways", name: "MILKY WAY", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/2bc0a981.jpg?v=0c91e9dc", gameUrl: "https://milkywayapp.xyz/" },
      { id: "luckypenny", name: "LUCKY PENNY", imageUrl: "http://luckypenny.xyz:8580/index.html", gameUrl: "http://luckypenny.xyz:8580/index.html" },
      { id: "gametime", name: "Gametime", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/85307f95.jpg?v=0c91e9dc", gameUrl: "http://game-time.vip:8580/index.html" },
      { id: "goldstar", name: "Gold Star", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/74eb627d.jpg?v=0c91e9dc", gameUrl: "https://goldstar.games/" },
      { id: "100plus", name: "100 Plus", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/e00a2881.jpg?v=0c91e9dc", gameUrl: "https://99.100plus.me/lobby/1684487595/index.html?agreement=1&/player/release/" },
      { id: "gamevault", name: "Gamevault", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/050dac4a.jpg?v=0c91e9dc", gameUrl: "https://download.gamevault999.com/" },
      { id: "galaxyworld", name: "Galaxy World", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/1f44c7e1.png?v=0c91e9dc", gameUrl: "https://m.galaxyworld999.com/" },
      { id: "magiccity", name: "Magic City", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/71d5fc8f.jpg?v=0c91e9dc", gameUrl: "https://www.magiccity777.com/SSLobby/3657.0/web-mobile/index.html" },
      { id: "highstake", name: "High Stake Sweeps", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/e1d3a0f7.jpg?v=0c91e9dc", gameUrl: "https://dl.highstakesweeps.com/" },
      { id: "sincity", name: "Sin City", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/98333b44.jpg?v=0c91e9dc", gameUrl: "https://sincitysweeps.net/" },
      { id: "vegassweeps", name: "Vegas Sweeps", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/bd38d36f.jpg?v=0c91e9dc", gameUrl: "https://m.lasvegassweeps.com/" },
      { id: "ignite", name: "IGNITE", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/3603f518.png?v=0c91e9dc", gameUrl: "https://casinoignite.vip/" },
      { id: "cashfrenzy", name: "Cashapp Frenzy", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/a67374ce.jpg?v=0c91e9dc", gameUrl: "https://www.cashfrenzy777.com/" },
      { id: "acebook", name: "ACEBOOK", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/09e14951.jpg?v=0c91e9dc", gameUrl: "https://www.playacebook.mobi/" },
      { id: "bluedragon2", name: "Blue Dragon 2", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/637eb5ee.png?v=0c91e9dc", gameUrl: "http://app.getbluedragon.com/" },
      { id: "juwa777", name: "Juwa", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/bebb5d9e.jpg?v=0c91e9dc", gameUrl: "https://dl.juwa777.com/" },
      { id: "pandamaster", name: "Panda Master", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/0b6843e0.jpg?v=0c91e9dc", gameUrl: "https://pandamaster.vip:8888/index.html" },
      { id: "fishglory", name: "Fish Glory", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/346fd5a6.jpg?v=0c91e9dc", gameUrl: "https://www.fishglory.games/" },
      { id: "vegasroll", name: "Vegas Roll", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/7867671f.jpg?v=0c91e9dc", gameUrl: "http://www.vegas-roll.com/m" },
      { id: "mrallinone", name: "Mr All In One", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/d6f9845f.jpg?v=0c91e9dc", gameUrl: "https://www.mrallinone777.com/m" },
      { id: "orionpower", name: "ORION Power", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/6c415d9a.jpg?v=0c91e9dc", gameUrl: "http://product.orionpower.games/v1001/" },
      { id: "quakegame", name: "Quake Game", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/0c63b506.jpg?v=0c91e9dc", gameUrl: "https://www.quakegame.net/" },
      { id: "vegasluck777", name: "Vegas Luck", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/961ffa7e.jpg?v=0c91e9dc", gameUrl: "https://start.vegasluck777.com/" },
      { id: "noble777", name: "Noble", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/21cf31e9.jpg?v=0c91e9dc", gameUrl: "https://www.noble777.com/m" },
      { id: "cashmachine777", name: "Cash Machine", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/d68e85e8.jpg?v=0c91e9dc", gameUrl: "https://www.cashmachine777.com/m" },
      { id: "gameroom777", name: "Gameroom", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/92bca02e.jpg?v=0c91e9dc", gameUrl: "https://www.gameroom777.com/m" },
      { id: "luckystars", name: "Lucky Stars", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/990e95bf.jpg?v=0c91e9dc", gameUrl: "http://www.luckystars.games/m" },
      { id: "slots88888", name: "King of Pop", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/035f8253.jpg?v=0c91e9dc", gameUrl: "https://www.slots88888.com/m" },
      { id: "winstar99999", name: "Win Star", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/b48ed188.jpg?v=0c91e9dc", gameUrl: "http://server.winstar99999.com:8009/m" },
      { id: "mafia77777", name: "Mafia", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/a3830c1f.jpg?v=0c91e9dc", gameUrl: "http://product.mafia77777.com/v1003/" },
      { id: "yolo777", name: "YOLO", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/e1b31467.jpg?v=0c91e9dc", gameUrl: "https://yolo777.game/" },
      { id: "fpc", name: "Fire Phoenix", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/2eb63b4e.png?v=0c91e9dc", gameUrl: "https://fpc-mob.com/AD/index.html" },
      { id: "winnersclub777", name: "Winners Club", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/a9e0fca0.jpg?v=0c91e9dc", gameUrl: "https://www.winnersclub777.com/" },
      { id: "legendfire", name: "Legend Fire", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/8b67f370.jpg?v=0c91e9dc", gameUrl: "https://www.legendfire.xyz/" },
      { id: "firelinkplus", name: "Great Balls of Fire", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/f592d30c.jpg?v=0c91e9dc", gameUrl: "https://firelinkplus.com/" },
      { id: "blackmamba", name: "Black Mamba", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/b99b4435.jpg?v=0c91e9dc", gameUrl: "https://blackmamba.mobi/" },
      { id: "playorca", name: "Play Orca", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/a281d47e.jpg?v=0c91e9dc", gameUrl: "https://playorca.mobi/" },
      { id: "playbdd", name: "Big Daddy Dragon", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/fcf9c9dd.jpg?v=0c91e9dc", gameUrl: "https://www.playbdd.com/" },
      { id: "kraken", name: "Kraken", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/f6ee4ae8.jpg?v=0c91e9dc", gameUrl: "https://getthekraken.com/" },
      { id: "nova", name: "Nova", imageUrl: "https://sweepshub.us/IMG_2683.jpeg", gameUrl: "https://novaplay.cc/" },
      { id: "funstation", name: "FunStation", imageUrl: "https://sweepshub.us/IMG_2663.jpeg", gameUrl: "https://www.funstation.site/" }
    ];

    const gamesEl = document.getElementById("games");
    if (gamesEl) {
      gamesEl.innerHTML = "";
      games.forEach((g) => {
        const card = document.createElement("div");
        card.className = "game-card";
        card.innerHTML = `<a href="${g.gameUrl}" target="_blank" rel="noopener noreferrer"><img src="${g.imageUrl}" alt="${g.name}"/><div class="card-label">${g.name}</div></a>`;
        gamesEl.appendChild(card);
      });
    }
  }, []);

  const handleDeposit = async (paymentMethod) => {
    if (!playerName || !username || !gameName || !depositAmount) {
      alert("Please fill out all fields.");
      return;
    }
    setLoading(true);

    try {
      const clickId = `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const response = await fetch("/api/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          depositAmount,
          playerName,
          username,
          gameName,
          paymentMethod
        }),
      });

      const data = await response.json();

      const sessionId =
        data.session_id ||
        data.sessionId ||
        data.session?.session_id ||
        data.session?.id ||
        data.id;

      if (!sessionId) {
        alert("Failed to create Wert session.");
        setLoading(false);
        return;
      }

      // Open Wert widget
      const WertWidget = (await import("@wert-io/widget-initializer")).default;
      const widget = new WertWidget({
        partner_id: process.env.NEXT_PUBLIC_WERT_PARTNER_ID || "01K1T8VJJ8TY67M49FDXY865GF",
        session_id: sessionId,
        click_id: clickId,
        origin: "https://widget.wert.io",
        listeners: {
          loaded: () => console.log("✅ Widget loaded"),
          "payment-status": async (evt) => {
            console.log("💰 Payment status:", evt);
          },
        },
      });

      widget.open();
      setShowForm(false);
      setPlayerName("");
      setUsername("");
      setGameName("");
      setDepositAmount("");
    } catch (err) {
      console.error(err);
      alert("Error opening deposit widget.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body, html { width: 100%; min-height: 100vh; overflow-x: hidden; font-family: Arial, sans-serif; color: white; }
        #bg-video { position: fixed; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: -2; pointer-events: none; }
        .video-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.35); z-index: -1; pointer-events: none; }
        header { text-align: center; margin: 30px 0 20px; position: relative; z-index: 10; }
        header img { width: 220px; filter: drop-shadow(0 0 10px rgba(250,10,10,0.6)); }
        .social-buttons { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; max-width: 600px; margin: 20px auto; }
        .social-buttons a { text-decoration: none; color: white; font-weight: bold; padding: 10px 15px; border-radius: 6px; display: flex; align-items: center; justify-content: center; gap: 8px; transition: all 0.2s; }
        .social-buttons a:hover { transform: scale(1.05); }
        .game-container { display: grid; grid-template-columns: repeat(auto-fill,minmax(180px,1fr)); gap: 20px; padding: 20px; }
        .game-card { border: 2px solid #555; border-radius: 12px; overflow: hidden; cursor: pointer; transition: all 0.3s; }
        .game-card img { width: 100%; display: block; }
        .game-card:hover { transform: scale(1.05); border-color: #ff3d00; }
        .card-label { text-align: center; padding: 5px; font-weight: bold; background: rgba(0,0,0,0.6); }
        .deposit-buttons { display: flex; justify-content: center; gap: 15px; margin-top: 20px; }
        .deposit-buttons button { padding: 12px 20px; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
        .deposit-buttons button:hover { transform: scale(1.05); }
        .logos img { height: 24px; display: inline-block; }
      `}</style>

      <video id="bg-video" autoPlay loop muted>
        <source src="https://www.w3schools.com/howto/rain.mp4" type="video/mp4" />
      </video>
      <div className="video-overlay"></div>

      <header>
        <img src="/logo.png" alt="Logo" />
      </header>

      <div className="deposit-buttons">
        <button onClick={() => handleDeposit("card")}>
          Card
          <span className="logos">
            <img src="/visa.png" alt="Visa" />
            <img src="/mastercard.png" alt="Mastercard" />
            <img src="/amex.png" alt="AmEx" />
            <img src="/discover.png" alt="Discover" />
            <img src="/applepay.png" alt="Apple Pay" />
            <img src="/googlepay.png" alt="Google Pay" />
          </span>
        </button>
        <button onClick={() => handleDeposit("btc")}>BTC</button>
        <button onClick={() => handleDeposit("teirlock")}>Teirlock</button>
      </div>

      <div id="games" className="game-container"></div>
    </>
  );
}
