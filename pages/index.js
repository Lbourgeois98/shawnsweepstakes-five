"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [showDepositOptions, setShowDepositOptions] = useState(false);
  const [showWertForm, setShowWertForm] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [username, setUsername] = useState("");
  const [gameName, setGameName] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // === Games data ===
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
      { id: "luckypenny", name: "LUCKY PENNY", imageUrl: "https://shawn-sweepstakes.carrd.co/assets/images/gallery01/9b984f9c.jpg?v=0c91e9dc", gameUrl: "http://luckypenny.xyz:8580/index.html" },
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

  // === Wert.io Deposit Flow ===
  const handleDeposit = async () => {
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
        console.error("No session id returned:", data);
        alert("Failed to create Wert session. Check server logs.");
        setLoading(false);
        return;
      }

      try {
        await fetch("/api/log-deposit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            playerName,
            username,
            gameName,
            depositAmount: parseFloat(depositAmount),
            sessionId,
            clickId,
            timestamp: new Date().toISOString(),
          }),
        });
        console.log("✅ Deposit logged to Supabase");
      } catch (logError) {
        console.error("⚠️ Failed to log deposit:", logError);
      }

      const WertWidget = (await import("@wert-io/widget-initializer")).default;
      const widget = new WertWidget({
        partner_id: process.env.NEXT_PUBLIC_WERT_PARTNER_ID || "01K1T8VJJ8TY67M49FDXY865GF",
        session_id: sessionId,
        click_id: clickId,
        origin: "https://widget.wert.io",
        listeners: {
          loaded: () => console.log("✅ Wert widget loaded"),
          "payment-status": async (evt) => {
            console.log("💰 Wert payment-status event:", evt);
            
            if (evt.order_id) {
              try {
                await fetch("/api/update-order", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    clickId,
                    orderId: evt.order_id,
                    status: evt.status,
                  }),
                });
              } catch (err) {
                console.error("Failed to update order:", err);
              }
            }
          },
        },
      });

      widget.open();

      setShowWertForm(false);
      setShowDepositOptions(false);
      setPlayerName("");
      setUsername("");
      setGameName("");
      setDepositAmount("");
    } catch (err) {
      console.error("Error creating/opening Wert session:", err);
      alert("Error opening deposit widget. See console for details.");
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
        .social-buttons { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; max-width: 600px; margin: 20px auto 40px; padding: 0 15px; position: relative; z-index: 10; }
        .social-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 16px 24px; background: rgba(250, 10, 10, 0.9); color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(250, 10, 10, 0.3); text-align: center; cursor:pointer; border: none; }
        .social-btn:hover { background: rgba(224, 9, 9, 0.9); transform: translateY(-2px); box-shadow: 0 6px 16px rgba(250, 10, 10, 0.4); }
        .deposit-btn { grid-column: 1 / -1; background: linear-gradient(90deg, #facc15, #fcd34d); color: black; box-shadow: 0 4px 12px rgba(255, 215, 0, 0.25); padding: 20px 28px; font-size: 18px; }
        .deposit-btn:hover { background: linear-gradient(90deg, #fde047, #facc15); transform: translateY(-2px); }

        #games { display: grid; grid-template-columns: repeat(4, 1fr); gap: 25px; max-width: 1200px; margin: 0 auto 60px; padding: 0 15px; position: relative; z-index: 10; }
        @media (max-width: 1024px) { #games { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 500px) { #games { grid-template-columns: repeat(2, 1fr); } }
        .game-card { position: relative; width: 100%; padding-bottom: 100%; border-radius: 50%; overflow: hidden; box-shadow: 0 6px 15px rgba(0,0,0,0.5); transition: all 0.3s; background: #111; }
        .game-card a { display:block; width:100%; height:100%; }
        .game-card img { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
        .card-label { position:absolute; left:8px; bottom:8px; right:8px; color:#fff; font-size:12px; background:rgba(0,0,0,0.4); padding:6px 8px; border-radius:6px; text-align:center; }
        .game-card:hover { transform: scale(1.08); box-shadow: 0 0 25px rgba(250,10,10,0.6); }

        .popup { position: fixed; top: 0; left: 0; right: 0; bottom: 0; display:flex; align-items:center; justify-content:center; background: rgba(0,0,0,0.7); z-index: 9999; }
        .form-box { background: #121212; padding: 22px; border-radius: 12px; width: 92%; max-width: 420px; border: 2px solid rgba(255, 215, 0, 0.18); box-shadow: 0 0 20px rgba(255,215,0,0.06); color: white; text-align: center; }
        .form-box input { width: 100%; padding: 12px 14px; margin-bottom:10px; border-radius:8px; border: none; font-size:14px; color: black; }
        .form-box .submit { width:100%; padding:12px; border-radius:8px; border:none; background: linear-gradient(90deg, #facc15, #fcd34d); color: black; font-weight:bold; cursor:pointer; }
        .form-box .submit[disabled] { opacity: 0.6; cursor: not-allowed; }
        .form-box .cancel { margin-top:8px; background:transparent; color:#ccc; border:none; cursor:pointer; }
        
        .payment-methods { margin-top: 16px; display: flex; flex-direction: column; gap: 10px; }
        .payment-method-btn { width: 100%; padding: 16px 12px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; transition: all 0.3s; font-size: 15px; background: linear-gradient(90deg, #facc15, #fcd34d); color: black; box-shadow: 0 4px 12px rgba(255, 215, 0, 0.25); text-decoration: none; display: block; }
        .payment-method-btn:hover { background: linear-gradient(90deg, #fde047, #facc15); box-shadow: 0 6px 16px rgba(255, 215, 0, 0.35); transform: translateY(-2px); }
        .payment-method-btn[disabled] { opacity: 0.6; cursor: not-allowed; }
        
        .payment-logos { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; justify-content: center; margin-bottom: 8px; }
        .payment-logos img { height: 24px; width: auto; }
        
        .payment-btn-text { font-weight: bold; color: black; }
      `}</style>

      <video id="bg-video" src="https://shawn-sweepstakes.carrd.co/assets/videos/bg.mp4?v=0c91e9dc" autoPlay loop muted playsInline></video>
      <div className="video-overlay"></div>

      <header><img src="https://shawn-sweepstakes.carrd.co/assets/images/image03.png?v=0c91e9dc" alt="ShawnSweeps"/></header>

      <div className="social-buttons">
        <button className="social-btn deposit-btn" onClick={() => setShowDepositOptions(true)}>Deposit</button>
        <a href="https://www.facebook.com/people/Shawn-Sweeps/61581214871852/" className="social-btn" target="_blank" rel="noopener noreferrer">Facebook Page</a>
        <a href="https://www.facebook.com/shawn.shawn.927528" className="social-btn" target="_blank" rel="noopener noreferrer">Facebook Profile</a>
        <a href="https://t.me/shawnsweeps" className="social-btn" target="_blank" rel="noopener noreferrer">Telegram</a>
        <a href="https://api.whatsapp.com/send/?phone=%2B13463028043&text&type=phone_number&app_absent=0" className="social-btn" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>

      <section id="games"></section>

      {showDepositOptions && !showWertForm && (
        <div className="popup">
          <div className="form-box" role="dialog" aria-modal="true">
            <h3 style={{marginBottom:16}}>Choose Payment Method</h3>
            <div className="payment-methods">
              
              <button className="payment-method-btn" onClick={() => setShowWertForm(true)}>
                <div className="payment-logos">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg" alt="Discover" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" />
                </div>
                <span className="payment-btn-text">Pay with Card/Wallet (Wert)</span>
              </button>
              
              <a 
                href="https://app.tierlock.com/pay/U2FsdGVkX18Xm9%2FenGSBxX1Gqeq4LupkuIKfuxI3%2F1gQ5fWzWTBGYB8G66oFJSCkc8tNqxell5NlcLrRLhH2lGhudkn2tto9gSS7G2tyJ0%2BfTgZIKuZBb%2BSzkABBUfgm?data=U2FsdGVkX1%2Fsqm2EnXylYdMUgUAiCU1Y888wBYrN3BM%3D" 
                className="payment-method-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="payment-logos">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg" alt="Discover" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" />
                </div>
                <span className="payment-btn-text">Pay with Card (TierLock)</span>
              </a>

              <a 
                href="https://buy.fnupay.com/genz-sweeps/deposit" 
                className="payment-method-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="payment-logos">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg" alt="Apple Pay" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg" alt="Google Pay" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/5/57/Discover_Card_logo.svg" alt="Discover" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex" />
                </div>
                <span className="payment-btn-text">Pay with Card (FNUPAY)</span>
              </a>
              
              <button className="payment-method-btn" onClick={() => alert("Bitcoin payment coming soon!")}>
                <span style={{fontSize: '20px', display: 'block', marginBottom: '4px'}}>₿</span>
                <span className="payment-btn-text">Pay with Bitcoin</span>
              </button>
            </div>
            
            <button className="cancel" onClick={() => setShowDepositOptions(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showWertForm && (
        <div className="popup">
          <div className="form-box" role="dialog" aria-modal="true">
            <h3 style={{marginBottom:12}}>Deposit to Shawn Sweeps</h3>
            <input type="text" placeholder="Player Name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
            <input type="text" placeholder="Game Name" value={gameName} onChange={(e) => setGameName(e.target.value)} />
            <input type="number" placeholder="Deposit Amount (USD)" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)} />
            <button className="submit" onClick={handleDeposit} disabled={loading}>
              {loading ? "Opening..." : "Submit Deposit"}
            </button>
            <button className="cancel" onClick={() => {
              setShowWertForm(false);
              setShowDepositOptions(true);
            }}>Back</button>
          </div>
        </div>
      )}
    </>
  );
}
