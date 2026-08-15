import { useState, useEffect, useRef, useCallback } from "react";
import IMG from "./images.js";

/* ─────────────────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,300;0,400;0,600;0,700;0,900;1,400&family=Share+Tech+Mono:wght@400&display=swap');

    :root {
      --red:      #FF4655;
      --red-dim:  #8c2830;
      --white:    #ECE8E1;
      --grey:     #7F8487;
      --dark:     #0F1923;
      --darker:   #0a1018;
      --panel:    rgba(255,255,255,0.03);
      --panel-h:  rgba(255,255,255,0.07);
      --border:   rgba(255,255,255,0.07);
      --border-r: rgba(255,70,85,0.3);
      --font-d:   'Bebas Neue', 'Arial Narrow', sans-serif;
      --font-b:   'Barlow Condensed', 'Arial Narrow', sans-serif;
      --font-m:   'Share Tech Mono', monospace;
    }

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html { scroll-behavior: smooth; }

    body {
      background: var(--darker);
      color: var(--white);
      font-family: var(--font-b);
      overflow-x: hidden;
      cursor: none !important;
      min-height: 100vh;
    }

    * { cursor: none !important; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--darker); }
    ::-webkit-scrollbar-thumb { background: var(--red); border-radius: 2px; }

    /* ── Gamer Animations & Page Transitions ── */
    @keyframes pageEnter {
      0% { opacity: 0; transform: translateY(18px) scale(0.985); filter: blur(5px); }
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }

    @keyframes popoutEnter {
      0% { opacity: 0; transform: translateY(-10px) scale(0.96); filter: blur(4px); }
      100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
    }

    @keyframes qEnter {
      0% { opacity: 0; transform: translateX(24px) scale(0.985); filter: blur(4px); }
      100% { opacity: 1; transform: translateX(0) scale(1); filter: blur(0); }
    }

    @keyframes fadeUp  { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
    @keyframes floatA  { 0%,100%{ transform:translateY(0) rotate(-2deg); } 50%{ transform:translateY(-20px) rotate(1deg); } }
    @keyframes floatB  { 0%,100%{ transform:translateY(-8px) rotate(2deg); } 50%{ transform:translateY(12px) rotate(-1deg); } }
    @keyframes scanH   { 0%{ transform:translateY(-100%); } 100%{ transform:translateY(100vh); } }
    @keyframes pulseR  { 0%,100%{ box-shadow:0 0 18px rgba(255,70,85,.3); } 50%{ box-shadow:0 0 36px rgba(255,70,85,.65); } }
    @keyframes spin    { to { transform:rotate(360deg); } }
    @keyframes shimmer { 0%{ background-position:-200% center; } 100%{ background-position:200% center; } }
    @keyframes blink   { 0%,100%{ opacity:1; } 50%{ opacity:0; } }
    @keyframes cornerT { 0%,100%{ opacity:1; } 50%{ opacity:0.25; } }
    @keyframes orbDrift{ 0%{ transform:translate(0,0) scale(1); } 33%{ transform:translate(40px,-30px) scale(1.1); } 66%{ transform:translate(-20px,40px) scale(0.9); } 100%{ transform:translate(0,0) scale(1); } }

    .page-enter { animation: pageEnter 0.45s cubic-bezier(0.16, 1, 0.3, 1) both; will-change: transform, opacity, filter; }
    .popout-enter { animation: popoutEnter 0.28s cubic-bezier(0.16, 1, 0.3, 1) both; transform-origin: top center; will-change: transform, opacity, filter; }
    .q-enter { animation: qEnter 0.38s cubic-bezier(0.16, 1, 0.3, 1) both; will-change: transform, opacity, filter; }

    .fade-up  { animation: fadeUp  0.55s cubic-bezier(.22,1,.36,1) both; }
    .fade-in  { animation: fadeIn  0.4s ease both; }
    .float-a  { animation: floatA  7s ease-in-out infinite; }
    .float-b  { animation: floatB  8.5s ease-in-out infinite; }
    .spin     { animation: spin    1.5s linear infinite; }

    /* Tactical panel with smooth hover lifting & glowing notches */
    .panel {
      background: var(--panel);
      border: 1px solid var(--border);
      position: relative;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
    }
    .panel::before, .panel::after {
      content: '';
      position: absolute;
      width: 10px; height: 10px;
      border-color: var(--red);
      border-style: solid;
      transition: border-color 0.3s ease, opacity 0.3s ease;
      animation: cornerT 3s ease-in-out infinite;
    }
    .panel::before { top:-1px; left:-1px; border-width:2px 0 0 2px; }
    .panel::after  { bottom:-1px; right:-1px; border-width:0 2px 2px 0; }
    .panel:hover {
      transform: translateY(-4px) scale(1.008);
      background: var(--panel-h);
      border-color: rgba(255,70,85,0.4);
      box-shadow: 0 16px 40px rgba(0,0,0,0.5), 0 0 24px rgba(255,70,85,0.18);
    }

    .accent-line   { height:2px; background:linear-gradient(90deg, var(--red), transparent); }
    .accent-line-r { height:2px; background:linear-gradient(270deg, var(--red), transparent); }

    /* Primary button – angled clip with laser glare sweep */
    .btn-primary {
      background: var(--red);
      color: #000;
      font-family: var(--font-d);
      font-size: 1.05rem;
      letter-spacing: 3px;
      border: none;
      cursor: none;
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease;
      position: relative;
      overflow: hidden;
    }
    .btn-primary::before {
      content: '';
      position: absolute;
      top: 0; left: -100%; width: 60%; height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      transform: skewX(-20deg);
      transition: left 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .btn-primary:hover::before {
      left: 140%;
    }
    .btn-primary:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 10px 32px rgba(255,70,85,0.55), 0 0 16px rgba(255,70,85,0.4);
    }
    .btn-primary:active {
      transform: translateY(0) scale(0.98);
    }

    .btn-ghost {
      background: transparent;
      color: var(--white);
      font-family: var(--font-d);
      font-size: 1rem;
      letter-spacing: 2px;
      border: 1px solid rgba(255,255,255,0.18);
      cursor: none;
      clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease;
    }
    .btn-ghost:hover {
      transform: translateY(-2px);
      border-color: var(--red);
      color: var(--red);
      box-shadow: 0 0 24px rgba(255,70,85,0.35);
    }
    .btn-ghost:active {
      transform: translateY(0) scale(0.98);
    }

    /* Option button tile hover & selection transition */
    .option-btn {
      transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.22s ease, background 0.22s ease, box-shadow 0.22s ease, color 0.22s ease !important;
    }
    .option-btn:hover {
      transform: translateY(-2px) scale(1.015);
      border-color: var(--red) !important;
      color: var(--white) !important;
      box-shadow: 0 6px 20px rgba(255, 70, 85, 0.25) !important;
    }
    .option-btn:active {
      transform: translateY(0) scale(0.99);
    }

    /* Range */
    input[type=range] {
      -webkit-appearance:none;
      width:100%; height:4px;
      background:rgba(255,255,255,0.1);
      outline:none; cursor:none;
      border-radius:0;
      transition: background 0.2s;
    }
    input[type=range]::-webkit-slider-thumb {
      -webkit-appearance:none;
      width:16px; height:16px;
      background:var(--red);
      clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%);
      cursor:none;
      box-shadow:0 0 10px var(--red);
      transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    input[type=range]:hover::-webkit-slider-thumb {
      transform: scale(1.25);
    }

    /* Grid background */
    .tac-grid {
      background-image:
        linear-gradient(rgba(255,70,85,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,70,85,0.025) 1px, transparent 1px);
      background-size: 50px 50px;
    }

    /* Shimmer text */
    .shim {
      background: linear-gradient(90deg, var(--white) 0%, var(--red) 50%, var(--white) 100%);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    /* Chip tag */
    .chip {
      display:inline-flex; align-items:center; gap:5px;
      padding:3px 10px;
      border:1px solid rgba(255,70,85,0.35);
      background:rgba(255,70,85,0.08);
      font-family:var(--font-m); font-size:.68rem;
      color:var(--red);
      clip-path:polygon(6px 0%, 100% 0%, calc(100% - 6px) 100%, 0% 100%);
      letter-spacing:1px;
      transition: all 0.2s ease;
    }
    .chip:hover {
      border-color: var(--red);
      background: rgba(255,70,85,0.18);
      box-shadow: 0 0 12px rgba(255,70,85,0.3);
    }

    /* Score ring */
    .score-fill { transition: stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1); }

    /* Crosshair */
    #crosshair {
      position:fixed; pointer-events:none; z-index:9999;
      transform:translate(-50%,-50%);
      will-change: left, top;
    }

    /* Nav link smooth underline sweep */
    .nav-link {
      color: var(--grey);
      font-family: var(--font-m);
      font-size: 0.72rem;
      letter-spacing: 2px;
      background: none;
      border: none;
      cursor: none;
      transition: color 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      text-decoration: none;
      position: relative;
      padding: 4px 0;
    }
    .nav-link::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 0; width: 0%; height: 2px;
      background: var(--red);
      box-shadow: 0 0 10px var(--red);
      transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .nav-link:hover, .nav-link.active {
      color: var(--white);
    }
    .nav-link:hover::after, .nav-link.active::after {
      width: 100%;
    }

    /* Store link buttons */
    .store-link {
      padding: 8px 18px;
      text-decoration: none;
      font-family: var(--font-d);
      font-size: 0.85rem;
      letter-spacing: 2px;
      clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease, color 0.25s ease;
      display: inline-block;
    }
    .store-link:hover {
      transform: translateY(-2px) scale(1.02);
    }
    .store-steam {
      background: linear-gradient(135deg, rgba(23,26,33,0.95), rgba(42,71,94,0.85));
      border: 1px solid rgba(102,192,244,0.45);
      color: #66c0f4;
      display: inline-flex;
      align-items: center;
      gap: 7px;
    }
    .store-steam:hover {
      border-color: #66c0f4;
      color: #ffffff;
      box-shadow: 0 6px 22px rgba(102,192,244,0.45);
    }
    .store-epic  { background:rgba(28,28,28,.5); border:1px solid rgba(80,80,80,.4); color:#bbb; }
    .store-epic:hover  { border-color:#555; box-shadow: 0 4px 16px rgba(255,255,255,0.15); }
    .store-info  { background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,.08); color:var(--grey); }
    .store-info:hover  { border-color:rgba(255,255,255,.25); color:var(--white); box-shadow: 0 4px 16px rgba(255,255,255,0.1); }

    /* Mobile adjustments */
    @media (max-width: 640px) {
      .floating-cards { display: none; }
      .hero-title { font-size: 3rem !important; }
      .results-card { padding: 18px 16px !important; }
    }
  `}</style>
);

/* ─────────────────────────────────────────────────────────────────────────
   CROSSHAIR CURSOR
───────────────────────────────────────────────────────────────────────── */
const Crosshair = () => {
  const ref = useRef();
  useEffect(() => {
    const move = e => {
      if (ref.current) {
        ref.current.style.left = e.clientX + "px";
        ref.current.style.top  = e.clientY + "px";
      }
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);
  return (
    <div id="crosshair" ref={ref}>
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        <circle cx="15" cy="15" r="5.5" stroke="#FF4655" strokeWidth="1.4" opacity="0.9"/>
        <line x1="15" y1="0"  x2="15" y2="8.5" stroke="#FF4655" strokeWidth="1.3" opacity="0.85"/>
        <line x1="15" y1="21.5" x2="15" y2="30" stroke="#FF4655" strokeWidth="1.3" opacity="0.85"/>
        <line x1="0"  y1="15" x2="8.5" y2="15" stroke="#FF4655" strokeWidth="1.3" opacity="0.85"/>
        <line x1="21.5" y1="15" x2="30" y2="15" stroke="#FF4655" strokeWidth="1.3" opacity="0.85"/>
        <circle cx="15" cy="15" r="1.4" fill="#FF4655"/>
      </svg>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   SCOPE ARROW  (replaces plain arrows on all buttons)
───────────────────────────────────────────────────────────────────────── */
const ScopeArrow = ({ dir = "right", size = 18, color = "#FF4655" }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ flexShrink:0 }}>
    <circle cx="10" cy="10" r="8" stroke={color} strokeWidth="1" opacity="0.35"/>
    <line x1="10" y1="3"  x2="10" y2="17" stroke={color} strokeWidth="0.75" opacity="0.35"/>
    <line x1="3"  y1="10" x2="17" y2="10" stroke={color} strokeWidth="0.75" opacity="0.35"/>
    {dir === "right"
      ? <polyline points="8,7 13,10 8,13" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
      : <polyline points="12,7 7,10 12,13" stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round"/>
    }
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────
   OFFICIAL STEAM VECTOR ICON
───────────────────────────────────────────────────────────────────────── */
const SteamIcon = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink:0 }}>
    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.03 4.524 4.524s-2.03 4.524-4.524 4.524c-.104 0-.205-.008-.308-.014l-4.084 2.893c.006.07.012.141.012.213 0 1.907-1.547 3.454-3.455 3.454-1.603 0-2.955-1.096-3.349-2.583L.32 15.37C1.656 20.354 6.368 24 11.979 24c6.627 0 12-5.373 12-12s-5.373-12-12-12zM9.08 17.553l-1.921-.795c.218.49.638.868 1.156.993.882.214 1.768-.328 1.982-1.21.093-.385.029-.774-.143-1.091-.252.339-.63.578-1.074.673-.444.095-.892-.008-1.23-.274.153.228.375.405.642.502.502.184 1.05.02 1.385-.379-.266.305-.615.485-1.002.585zm7.387-8.643c0-1.425-1.155-2.58-2.58-2.58-1.425 0-2.58 1.155-2.58 2.58 0 1.425 1.155 2.58 2.58 2.58 1.425 0 2.58-1.155 2.58-2.58zm-4.3 0c0-.95.77-1.72 1.72-1.72.95 0 1.72.77 1.72 1.72 0 .95-.77 1.72-1.72 1.72-.95 0-1.72-.77-1.72-1.72z"/>
  </svg>
);

/* ─────────────────────────────────────────────────────────────────────────
   GAME COVER FALLBACK GENERATOR
───────────────────────────────────────────────────────────────────────── */
const getGameCover = (key, title) => {
  if (IMG[key]) return IMG[key];
  const colors = [
    ["#1e293b", "#0f172a"],
    ["#31101e", "#0f172a"],
    ["#1c1917", "#0f172a"],
    ["#064e3b", "#022c22"],
    ["#1e1b4b", "#0f172a"],
  ];
  const idx = Math.abs((title || "").split("").reduce((a, b) => a + b.charCodeAt(0), 0)) % colors.length;
  const [c1, c2] = colors[idx];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="240" viewBox="0 0 400 240">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="200" cy="120" r="80" fill="none" stroke="#FF4655" stroke-width="1" opacity="0.25"/>
    <circle cx="200" cy="120" r="40" fill="none" stroke="#FF4655" stroke-width="1" opacity="0.35"/>
    <text x="50%" y="48%" text-anchor="middle" fill="#ECE8E1" font-family="'Bebas Neue', sans-serif" font-size="24" letter-spacing="2">${(title || "").toUpperCase()}</text>
    <text x="50%" y="68%" text-anchor="middle" fill="#FF4655" font-family="'Share Tech Mono', monospace" font-size="11" letter-spacing="3">GAMEMATCH AI // STEAM VERIFIED</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

/* ─────────────────────────────────────────────────────────────────────────
   SCANLINE
───────────────────────────────────────────────────────────────────────── */
const Scanline = () => (
  <div style={{ position:"fixed",inset:0,pointerEvents:"none",zIndex:2,overflow:"hidden" }}>
    <div style={{
      position:"absolute",left:0,right:0,height:"3px",
      background:"linear-gradient(transparent,rgba(255,70,85,0.04),transparent)",
      animation:"scanH 10s linear infinite",
    }}/>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────
   ORB BACKGROUND
───────────────────────────────────────────────────────────────────────── */
const OrbBg = () => (
  <div style={{ position:"fixed",inset:0,overflow:"hidden",pointerEvents:"none",zIndex:0 }}>
    <div style={{
      position:"absolute",width:520,height:520,borderRadius:"50%",top:-160,right:-160,
      background:"radial-gradient(circle, rgba(255,70,85,0.07) 0%, transparent 70%)",
      animation:"orbDrift 18s ease-in-out infinite",
    }}/>
    <div style={{
      position:"absolute",width:400,height:400,borderRadius:"50%",bottom:-120,left:-120,
      background:"radial-gradient(circle, rgba(255,70,85,0.05) 0%, transparent 70%)",
      animation:"orbDrift 22s ease-in-out infinite reverse",
    }}/>
    <div style={{
      position:"absolute",width:300,height:300,borderRadius:"50%",top:"45%",left:"48%",
      background:"radial-gradient(circle, rgba(255,70,85,0.03) 0%, transparent 70%)",
      animation:"orbDrift 14s ease-in-out infinite 3s",
    }}/>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────
   FLOATING GAME CARD (hero section)
───────────────────────────────────────────────────────────────────────── */
const FloatingCard = ({ imgSrc, title, score, style, alt }) => (
  <div
    className={alt ? "float-b floating-cards" : "float-a floating-cards"}
    style={{
      position:"absolute", width:132,
      border:"1px solid rgba(255,70,85,0.28)",
      background:"rgba(10,16,24,0.93)",
      clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
      ...style,
    }}>
    <div style={{ position:"absolute",top:0,left:0,width:8,height:8,
      borderTop:"2px solid #FF4655",borderLeft:"2px solid #FF4655",zIndex:1 }}/>
    <div style={{ position:"absolute",bottom:0,right:0,width:8,height:8,
      borderBottom:"2px solid #FF4655",borderRight:"2px solid #FF4655",zIndex:1 }}/>
    <img src={imgSrc} alt={title} style={{
      width:"100%",height:88,objectFit:"cover",display:"block",
      filter:"brightness(0.82) saturate(0.9)",
    }}/>
    <div style={{ padding:"7px 9px" }}>
      <div style={{ fontFamily:"var(--font-d)",fontSize:"0.78rem",letterSpacing:1,color:"var(--white)",marginBottom:3,
        whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{title}</div>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
        <span style={{ fontFamily:"var(--font-m)",fontSize:"0.58rem",color:"var(--grey)",letterSpacing:1 }}>MATCH</span>
        <span style={{ fontFamily:"var(--font-m)",fontSize:"0.72rem",color:"var(--red)",fontWeight:700 }}>{score}%</span>
      </div>
    </div>
  </div>
);

/* ─────────────────────────────────────────────────────────────────────────
   SCORE RING
───────────────────────────────────────────────────────────────────────── */
const ScoreRing = ({ score, size = 112, color = "#FF4655" }) => {
  const r = (size - 14) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  return (
    <div style={{ position:"relative",width:size,height:size,flexShrink:0,
      animation:"pulseR 2.5s ease-in-out infinite" }}>
      <svg width={size} height={size} style={{ transform:"rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={4}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="butt" className="score-fill"
          style={{ filter:`drop-shadow(0 0 6px ${color})` }}
        />
        {[0,90,180,270].map(a => {
          const rad = (a - 90) * Math.PI / 180;
          return (
            <circle key={a}
              cx={size/2 + r * Math.cos(rad)}
              cy={size/2 + r * Math.sin(rad)}
              r={2.2} fill={color} opacity={0.55}
              style={{ animation:"diamondPulse 2s ease-in-out infinite", animationDelay:`${a/360}s` }}
            />
          );
        })}
      </svg>
      <div style={{
        position:"absolute",inset:0,display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",
      }}>
        <span style={{ fontFamily:"var(--font-d)",fontSize:"1.7rem",color,lineHeight:1,letterSpacing:1 }}>
          {score}%
        </span>
        <span style={{ fontFamily:"var(--font-m)",fontSize:"0.52rem",color:"var(--grey)",letterSpacing:2,marginTop:3 }}>
          MATCH
        </span>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   SEARCHABLE MULTI-SELECT
───────────────────────────────────────────────────────────────────────── */
const SearchSelect = ({ placeholder, options, selected, onSelect, onRemove }) => {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const filtered = options
    .filter(o => o.toLowerCase().includes(q.toLowerCase()) && !selected.includes(o))
    .slice(0, 8);

  useEffect(() => {
    const h = e => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position:"relative" }}>
      <div
        onClick={() => setOpen(true)}
        style={{
          display:"flex",flexWrap:"wrap",gap:8,padding:"10px 14px",
          background:"rgba(255,255,255,0.03)",
          border:"1px solid rgba(255,255,255,0.1)",
          clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))",
          minHeight:52,
        }}>
        {selected.map(s => (
          <span key={s} style={{
            display:"inline-flex",alignItems:"center",gap:5,
            padding:"3px 10px",
            background:"rgba(255,70,85,0.14)",border:"1px solid rgba(255,70,85,0.35)",
            fontSize:"0.8rem",color:"var(--red)",fontFamily:"var(--font-b)",fontWeight:600,
            clipPath:"polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)",
          }}>
            {s}
            <span
              style={{ fontSize:"0.68rem",opacity:0.65 }}
              onMouseDown={e => { e.stopPropagation(); onRemove(s); }}>
              X
            </span>
          </span>
        ))}
        <input
          value={q}
          onChange={e => { setQ(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? placeholder : "Add more..."}
          style={{
            flex:1,background:"none",border:"none",outline:"none",
            color:"var(--white)",fontFamily:"var(--font-b)",fontSize:"1rem",minWidth:130,
          }}
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="popout-enter" style={{
          position:"absolute",top:"calc(100% + 6px)",left:0,right:0,
          background:"rgba(10,16,24,0.98)",
          backdropFilter:"blur(16px)",
          border:"1px solid rgba(255,70,85,0.35)",
          zIndex:200,boxShadow:"0 20px 60px rgba(0,0,0,0.85), 0 0 20px rgba(255,70,85,0.15)",
          clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)",
        }}>
          {filtered.map(o => (
            <div
              key={o}
              onMouseDown={e => { e.preventDefault(); onSelect(o); setQ(""); setOpen(false); }}
              style={{
                padding:"9px 14px",fontSize:"0.95rem",fontFamily:"var(--font-b)",
                borderBottom:"1px solid rgba(255,255,255,0.04)",
                transition:"all 0.18s ease",display:"flex",alignItems:"center",gap:10,
                color:"var(--white)",
              }}
              onMouseEnter={e => { e.currentTarget.style.background="rgba(255,70,85,0.15)"; e.currentTarget.style.color="var(--red)"; e.currentTarget.style.paddingLeft="18px"; }}
              onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--white)"; e.currentTarget.style.paddingLeft="14px"; }}
            >
              <span style={{ width:5,height:5,clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",
                background:"var(--red)",display:"inline-block",flexShrink:0,opacity:0.7 }}/>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   OPTION BUTTON  (genre / platform / world tiles)
───────────────────────────────────────────────────────────────────────── */
const OptionBtn = ({ label, selected, onClick }) => (
  <button
    className="option-btn"
    onClick={onClick}
    style={{
      padding:"13px 14px",
      background: selected ? "rgba(255,70,85,0.14)" : "rgba(255,255,255,0.03)",
      border:`1px solid ${selected ? "var(--red)" : "rgba(255,255,255,0.08)"}`,
      color: selected ? "var(--white)" : "var(--grey)",
      fontFamily:"var(--font-d)",fontSize:"1rem",letterSpacing:2,
      cursor:"none",transition:"all 0.15s",textAlign:"left",
      clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
      display:"flex",alignItems:"center",gap:10,
      boxShadow: selected ? "0 0 14px rgba(255,70,85,0.18)" : "none",
    }}>
    <span style={{
      width:7,height:7,flexShrink:0,
      clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",
      background: selected ? "var(--red)" : "rgba(255,255,255,0.15)",
      boxShadow: selected ? "0 0 8px var(--red)" : "none",
      transition:"all 0.15s",
    }}/>
    {label}
  </button>
);

/* ─────────────────────────────────────────────────────────────────────────
   PROGRESS BAR
───────────────────────────────────────────────────────────────────────── */
const ProgressBar = ({ current, total }) => {
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div style={{ marginTop:12 }}>
      <div style={{ display:"flex",justifyContent:"space-between",marginBottom:6 }}>
        <span style={{ fontFamily:"var(--font-m)",fontSize:"0.63rem",color:"var(--grey)",letterSpacing:1 }}>
          STEP {current + 1} / {total}
        </span>
        <span style={{ fontFamily:"var(--font-m)",fontSize:"0.63rem",color:"var(--red)",letterSpacing:1 }}>
          {pct}%
        </span>
      </div>
      <div style={{ height:2,background:"rgba(255,255,255,0.06)" }}>
        <div style={{
          height:"100%",
          background:"linear-gradient(90deg, var(--red), #ff8a94)",
          width:`${pct}%`,transition:"width 0.5s cubic-bezier(.4,0,.2,1)",
          boxShadow:"0 0 8px var(--red)",
        }}/>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   AI COMPANION  (bottom-right callout)
───────────────────────────────────────────────────────────────────────── */
const Companion = ({ msg, visible }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (visible) { setShow(true); }
    else { const t = setTimeout(() => setShow(false), 500); return () => clearTimeout(t); }
  }, [visible]);
  if (!show) return null;
  return (
    <div style={{
      position:"fixed",bottom:24,right:24,zIndex:300,maxWidth:265,
      animation: visible ? "fadeUp 0.4s ease both" : "fadeIn 0.3s reverse both",
    }}>
      <div className="panel" style={{
        padding:"14px 18px",
        clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))",
      }}>
        <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
          <div style={{
            width:32,height:32,background:"var(--red)",flexShrink:0,
            clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",
            display:"flex",alignItems:"center",justifyContent:"center",
          }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth={2.5}>
              <circle cx={12} cy={8} r={4}/>
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
            </svg>
          </div>
          <div>
            <div style={{ fontFamily:"var(--font-m)",fontSize:"0.58rem",color:"var(--red)",letterSpacing:2,marginBottom:4 }}>
              OPERATOR AI
            </div>
            <p style={{ fontSize:"0.84rem",color:"var(--white)",lineHeight:1.55,fontFamily:"var(--font-b)",fontWeight:400 }}>
              {msg}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────────────────
   STATIC DATA
───────────────────────────────────────────────────────────────────────── */
const GAMES = [
  // 2024-2026 New Launches & Major Releases
  "Black Myth: Wukong","Helldivers 2","Warhammer 40,000: Space Marine 2","Palworld","Balatro",
  "Metaphor: ReFantazio","Final Fantasy VII Rebirth","Tekken 8","Dragon's Dogma 2","Hades II",
  "Silent Hill 2 Remake","S.T.A.L.K.E.R. 2: Heart of Chornobyl","Manor Lords","Frostpunk 2",
  "Pacific Drive","Senua's Saga: Hellblade II","Dragon Age: The Veilguard","Indiana Jones and the Great Circle",
  "Monster Hunter Wilds","Kingdom Come: Deliverance II","Clair Obscur: Expedition 33","DOOM: The Dark Ages",
  "Sid Meier's Civilization VII","Assassin's Creed Shadows","Grand Theft Auto VI","Ghost of Yōtei",
  "Death Stranding 2: On the Beach","Subnautica 2","Borderlands 4","Elden Ring: Shadow of the Erdtree",
  "Animal Well","Nine Sols","Satisfactory","Path of Exile 2","EA SPORTS FC 25",

  // Iconic All-Time Favorites
  "Elden Ring","The Witcher 3","Red Dead Redemption 2","God of War","Cyberpunk 2077",
  "Baldur's Gate 3","Dark Souls III","Hollow Knight","Hades","Sekiro","Mass Effect Legendary",
  "The Last of Us Part II","Ghost of Tsushima","Horizon Zero Dawn","Death Stranding","Control",
  "Disco Elysium","Outer Wilds","Celeste","Stardew Valley","Minecraft","Terraria","Valheim",
  "Deep Rock Galactic","Monster Hunter World","Destiny 2","Apex Legends","Valorant",
  "Counter-Strike 2","Overwatch 2","League of Legends","Dota 2","Path of Exile","Diablo IV",
  "Final Fantasy XVI","Persona 5 Royal","Divinity Original Sin 2","Starfield","No Man's Sky",
  "Resident Evil Village","Resident Evil 4 Remake","Dead Space","Alien Isolation","Portal 2","Bioshock Infinite",
  "DOOM Eternal","Titanfall 2","Forza Horizon 5","Rocket League","Spider-Man 2",
  "Batman Arkham Knight","Assassin's Creed","Split Fiction","Call of Duty","Rainbow Six Siege",
  "PUBG","Warzone","Metroid Dread","Ori and the Will of the Wisps","Cuphead","Returnal",
  "Deathloop","Prey","Dishonored 2","XCOM 2","Total War Warhammer III","Civilization VI",
];

const GAME_LIBRARY = [
  {
    id: "wukong",
    title: "Black Myth: Wukong",
    developer: "Game Science",
    year: 2024,
    genres: ["Action RPG", "Soulslike", "Mythology"],
    platforms: ["PC", "PS5"],
    rating: 96,
    category: "new",
    description: "An Action RPG rooted in Chinese mythology. As the Destined One, embark on an unforgettable journey through a rich dark fantasy realm.",
    steamUrl: "https://store.steampowered.com/app/2358720/Black_Myth_Wukong/",
    epicUrl: "https://store.epicgames.com/en-US/p/black-myth-wukong-87a2a3",
    playtime: "35-50 hrs",
    badge: "2024 NEW RELEASE"
  },
  {
    id: "helldivers2",
    title: "Helldivers 2",
    developer: "Arrowhead Game Studios",
    year: 2024,
    genres: ["Co-op Shooter", "FPS", "Sci-Fi"],
    platforms: ["PC", "PS5"],
    rating: 95,
    category: "coop",
    description: "The galaxy's last line of offense. Enlist in the Helldivers and join the fight for freedom across a hostile galaxy in this fast-paced co-op shooter.",
    steamUrl: "https://store.steampowered.com/app/553850/HELLDIVERS_2/",
    playtime: "50-100+ hrs",
    badge: "2024 NEW RELEASE"
  },
  {
    id: "spacemarine2",
    title: "Warhammer 40,000: Space Marine 2",
    developer: "Saber Interactive",
    year: 2024,
    genres: ["Action Shooter", "Co-op", "Sci-Fi"],
    platforms: ["PC", "PS5", "Xbox"],
    rating: 94,
    category: "new",
    description: "Embody the superhuman skill and brutality of a Space Marine. Unleash deadly abilities and devastate relentless Tyranid swarms.",
    steamUrl: "https://store.steampowered.com/app/1283400/Warhammer_40000_Space_Marine_2/",
    epicUrl: "https://store.epicgames.com/en-US/p/warhammer-40000-space-marine-2",
    playtime: "20-40 hrs",
    badge: "2024 NEW RELEASE"
  },
  {
    id: "palworld",
    title: "Palworld",
    developer: "Pocketpair",
    year: 2024,
    genres: ["Survival", "Open World", "Monster Taming"],
    platforms: ["PC", "Xbox"],
    rating: 92,
    category: "survival",
    description: "Fight, farm, build and work alongside mysterious creatures called 'Pals' in a massive multiplayer open-world survival experience.",
    steamUrl: "https://store.steampowered.com/app/1623730/Palworld/",
    playtime: "40-120 hrs",
    badge: "2024 NEW RELEASE"
  },
  {
    id: "balatro",
    title: "Balatro",
    developer: "LocalThunk",
    year: 2024,
    genres: ["Roguelike", "Strategy", "Deckbuilder"],
    platforms: ["PC", "Switch", "PS5", "Xbox", "Mobile"],
    rating: 97,
    category: "indie",
    description: "The poker roguelike sensation. Combine valid poker hands with unique Joker cards to create insane synergies and build outrageously high scores.",
    steamUrl: "https://store.steampowered.com/app/2379780/Balatro/",
    playtime: "30-150 hrs",
    badge: "2024 INDIE HIT"
  },
  {
    id: "metaphor",
    title: "Metaphor: ReFantazio",
    developer: "Studio Zero / Atlus",
    year: 2024,
    genres: ["RPG", "Turn-Based", "Fantasy"],
    platforms: ["PC", "PS5", "Xbox"],
    rating: 95,
    category: "rpg",
    description: "From the creators of Persona 3, 4, and 5. Write your destiny and overcome fear as you compete in a high-stakes tournament for the crown.",
    steamUrl: "https://store.steampowered.com/app/2679460/Metaphor_ReFantazio/",
    playtime: "70-120 hrs",
    badge: "2024 GOTY NOMINEE"
  },
  {
    id: "ff7rebirth",
    title: "Final Fantasy VII Rebirth",
    developer: "Square Enix",
    year: 2024,
    genres: ["Action RPG", "Open World"],
    platforms: ["PC", "PS5"],
    rating: 94,
    category: "rpg",
    description: "Cloud and his comrades venture across a vast, vibrant planet beyond Midgar in search of Sephiroth in this breathtaking standalone RPG adventure.",
    steamUrl: "https://store.steampowered.com/app/2922250/FINAL_FANTASY_VII_REBIRTH/",
    playtime: "60-100+ hrs",
    badge: "2024 BLOCKBUSTER"
  },
  {
    id: "tekken8",
    title: "Tekken 8",
    developer: "Bandai Namco",
    year: 2024,
    genres: ["Fighting", "Action"],
    platforms: ["PC", "PS5", "Xbox"],
    rating: 91,
    category: "new",
    description: "Fist Meets Fate! Next-gen visuals, aggressive combat mechanics, and 32 overhauled fighters continue the tragic Mishima bloodline saga.",
    steamUrl: "https://store.steampowered.com/app/1778820/TEKKEN_8/",
    playtime: "20-100+ hrs",
    badge: "2024 NEW RELEASE"
  },
  {
    id: "dragonsdogma2",
    title: "Dragon's Dogma 2",
    developer: "Capcom",
    year: 2024,
    genres: ["Action RPG", "Open World"],
    platforms: ["PC", "PS5", "Xbox"],
    rating: 89,
    category: "rpg",
    description: "A narrative driven action-RPG that challenges players to choose their own experience in a deeply detailed, fantasy world filled with giant beasts.",
    steamUrl: "https://store.steampowered.com/app/2054970/Dragons_Dogma_2/",
    playtime: "40-80 hrs",
    badge: "2024 NEW RELEASE"
  },
  {
    id: "hades2",
    title: "Hades II",
    developer: "Supergiant Games",
    year: 2024,
    genres: ["Action Roguelike", "Mythology"],
    platforms: ["PC", "Steam Deck"],
    rating: 97,
    category: "indie",
    description: "Battle beyond the Underworld using dark sorcery to take on the Titan of Time in this spellbinding follow-up to the award-winning roguelike.",
    steamUrl: "https://store.steampowered.com/app/1145350/Hades_II/",
    playtime: "40-100 hrs",
    badge: "2024 EARLY ACCESS"
  },
  {
    id: "silenthill2",
    title: "Silent Hill 2 Remake",
    developer: "Bloober Team / Konami",
    year: 2024,
    genres: ["Survival Horror", "Psychological"],
    platforms: ["PC", "PS5"],
    rating: 93,
    category: "horror",
    description: "Having received a letter from his deceased wife, James heads to where they shared so many memories: Silent Hill. A stunning remake of horror royalty.",
    steamUrl: "https://store.steampowered.com/app/2124490/SILENT_HILL_2/",
    playtime: "15-25 hrs",
    badge: "2024 HORROR HIT"
  },
  {
    id: "stalker2",
    title: "S.T.A.L.K.E.R. 2: Heart of Chornobyl",
    developer: "GSC Game World",
    year: 2024,
    genres: ["FPS", "Survival Horror", "Open World"],
    platforms: ["PC", "Xbox"],
    rating: 91,
    category: "fps",
    description: "Explore a huge Chornobyl Exclusion Zone full of dangerous enemies, deadly anomalies, and powerful artifacts in a true next-gen survival FPS.",
    steamUrl: "https://store.steampowered.com/app/1649080/STALKER_2_Heart_of_Chornobyl/",
    playtime: "40-80 hrs",
    badge: "2024 NEW RELEASE"
  },
  {
    id: "manorlords",
    title: "Manor Lords",
    developer: "Slavic Magic",
    year: 2024,
    genres: ["Medieval Strategy", "City Builder", "Simulation"],
    platforms: ["PC", "Steam Deck"],
    rating: 90,
    category: "strategy",
    description: "A medieval strategy game featuring in-depth city building, organic gridless placement, complex economic simulation, and tactical battles.",
    steamUrl: "https://store.steampowered.com/app/1363080/Manor_Lords/",
    playtime: "30-70 hrs",
    badge: "2024 STRATEGY HIT"
  },
  {
    id: "frostpunk2",
    title: "Frostpunk 2",
    developer: "11 bit studios",
    year: 2024,
    genres: ["Society Survival", "City Builder", "Strategy"],
    platforms: ["PC", "PS5", "Xbox"],
    rating: 89,
    category: "strategy",
    description: "Discover a city-survival game set 30 years after an apocalyptic blizzard ravaged Earth. Build your city on a new scale and steer factions.",
    steamUrl: "https://store.steampowered.com/app/1601580/Frostpunk_2/",
    playtime: "25-50 hrs",
    badge: "2024 NEW RELEASE"
  },
  {
    id: "eldenring",
    title: "Elden Ring",
    developer: "FromSoftware",
    year: 2022,
    genres: ["Action RPG", "Soulslike", "Open World"],
    platforms: ["PC", "PS5", "Xbox"],
    rating: 98,
    category: "rpg",
    description: "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring and become an Elden Lord in the Lands Between.",
    steamUrl: "https://store.steampowered.com/app/1245620/ELDEN_RING/",
    playtime: "80-150+ hrs",
    badge: "GOTY WINNER"
  },
  {
    id: "bg3",
    title: "Baldur's Gate 3",
    developer: "Larian Studios",
    year: 2023,
    genres: ["CRPG", "Turn-Based", "Co-op"],
    platforms: ["PC", "PS5", "Xbox"],
    rating: 97,
    category: "rpg",
    description: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.",
    steamUrl: "https://store.steampowered.com/app/1086940/Baldurs_Gate_3/",
    playtime: "90-200 hrs",
    badge: "GOTY WINNER"
  },
  {
    id: "cyberpunk",
    title: "Cyberpunk 2077",
    developer: "CD Projekt Red",
    year: 2020,
    genres: ["Action RPG", "Cyberpunk", "Open World"],
    platforms: ["PC", "PS5", "Xbox"],
    rating: 93,
    category: "rpg",
    description: "An open-world action-adventure RPG set in Night City, a megalopolis obsessed with power, glamour, and body modification.",
    steamUrl: "https://store.steampowered.com/app/1091500/Cyberpunk_2077/",
    playtime: "50-100 hrs",
    badge: "FAN FAVORITE"
  },
  {
    id: "rdr2",
    title: "Red Dead Redemption 2",
    developer: "Rockstar Games",
    year: 2018,
    genres: ["Action Adventure", "Open World", "Western"],
    platforms: ["PC", "PS4", "Xbox One"],
    rating: 97,
    category: "rpg",
    description: "Arthur Morgan and the Van der Linde gang are outlaws on the run. An epic tale of honor and loyalty at the dawn of the modern age.",
    steamUrl: "https://store.steampowered.com/app/1174180/Red_Dead_Redemption_2/",
    playtime: "60-120 hrs",
    badge: "MASTERPIECE"
  },
  {
    id: "mhwilds",
    title: "Monster Hunter Wilds",
    developer: "Capcom",
    year: 2025,
    genres: ["Action RPG", "Co-op", "Hunting"],
    platforms: ["PC", "PS5", "Xbox"],
    rating: 96,
    category: "new",
    description: "Unbridled nature running wild. Dynamic environments shift between harsh weather and lush life in Capcom's next-gen hunting titan.",
    steamUrl: "https://store.steampowered.com/app/2246340/Monster_Hunter_Wilds/",
    playtime: "60-150 hrs",
    badge: "2025 UPCOMING"
  },
  {
    id: "expedition33",
    title: "Clair Obscur: Expedition 33",
    developer: "Sandfall Interactive",
    year: 2025,
    genres: ["Turn-Based RPG", "Dark Fantasy"],
    platforms: ["PC", "PS5", "Xbox"],
    rating: 94,
    category: "new",
    description: "Lead the Expedition to break the Paintress's cycle of death. A reactive turn-based RPG with stunning real-time dodge and counter mechanics.",
    steamUrl: "https://store.steampowered.com/app/1903340/Clair_Obscur_Expedition_33/",
    playtime: "30-60 hrs",
    badge: "2025 UPCOMING"
  },
  {
    id: "doomdarkages",
    title: "DOOM: The Dark Ages",
    developer: "id Software / Bethesda",
    year: 2025,
    genres: ["FPS", "Action", "Dark Fantasy"],
    platforms: ["PC", "PS5", "Xbox"],
    rating: 95,
    category: "fps",
    description: "The single-player dark fantasy prequel to DOOM (2016) and DOOM Eternal. Wield shield saw and flail as the Slayer in a brutal medieval war against Hell.",
    steamUrl: "https://store.steampowered.com/app/3017850/DOOM_The_Dark_Ages/",
    playtime: "15-30 hrs",
    badge: "2025 UPCOMING"
  },
  {
    id: "civ7",
    title: "Sid Meier's Civilization VII",
    developer: "Firaxis Games",
    year: 2025,
    genres: ["4X Strategy", "Turn-Based", "Historical"],
    platforms: ["PC", "PS5", "Xbox", "Switch"],
    rating: 93,
    category: "strategy",
    description: "Rule as legendary leaders across distinct historical ages. Build your empire, construct wonders, and shape human history.",
    steamUrl: "https://store.steampowered.com/app/1295660/Sid_Meiers_Civilization_VII/",
    playtime: "50-200+ hrs",
    badge: "2025 UPCOMING"
  },
  {
    id: "witcher3",
    title: "The Witcher 3: Wild Hunt",
    developer: "CD Projekt Red",
    year: 2015,
    genres: ["Action RPG", "Fantasy", "Open World"],
    platforms: ["PC", "PS5", "Xbox", "Switch"],
    rating: 96,
    category: "rpg",
    description: "Geralt of Rivia, a monster slayer for hire, journeys across a war-torn continent to find the Child of Prophecy.",
    steamUrl: "https://store.steampowered.com/app/292030/The_Witcher_3_Wild_Hunt/",
    playtime: "70-150 hrs",
    badge: "HALL OF FAME"
  },
  {
    id: "hollowknight",
    title: "Hollow Knight",
    developer: "Team Cherry",
    year: 2017,
    genres: ["Metroidvania", "Platformer", "Indie"],
    platforms: ["PC", "Switch", "PS4", "Xbox"],
    rating: 97,
    category: "indie",
    description: "Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes.",
    steamUrl: "https://store.steampowered.com/app/367520/Hollow_Knight/",
    playtime: "30-60 hrs",
    badge: "INDIE LEGEND"
  }
];

const MOVIES = [
  "Interstellar","Blade Runner 2049","The Matrix","John Wick","Mad Max Fury Road",
  "Inception","Dune","Lord of the Rings","The Dark Knight","Avengers Endgame",
  "Star Wars","Guardians of the Galaxy","Avatar","Ghost in the Shell","Akira",
  "Parasite","Everything Everywhere All at Once","The Revenant","Arrival","Ex Machina",
  "Tenet","Oppenheimer","Top Gun Maverick","Mission Impossible","Heat",
  "Sicario","No Country for Old Men","Children of Men","28 Days Later","The Thing",
];

const GENRES = [
  { id:"rpg",       label:"RPG" },
  { id:"fps",       label:"FPS" },
  { id:"strategy",  label:"Strategy" },
  { id:"survival",  label:"Survival" },
  { id:"horror",    label:"Horror" },
  { id:"adventure", label:"Adventure" },
  { id:"simulation",label:"Simulation" },
  { id:"sandbox",   label:"Sandbox" },
  { id:"openworld", label:"Open World" },
  { id:"racing",    label:"Racing" },
  { id:"fighting",  label:"Fighting" },
  { id:"puzzle",    label:"Puzzle" },
];

const PLATFORMS = [
  { id:"pc",         label:"PC" },
  { id:"steam_deck", label:"Steam Deck" },
  { id:"ps5",        label:"PlayStation" },
  { id:"xbox",       label:"Xbox" },
  { id:"switch",     label:"Nintendo Switch" },
  { id:"mobile",     label:"Mobile" },
];

const DIFF = [
  { val:1, label:"RELAXING",  sub:"Just vibes" },
  { val:2, label:"CASUAL",    sub:"Light fun" },
  { val:3, label:"MODERATE",  sub:"Some tension" },
  { val:4, label:"HARDCORE",  sub:"Skilled play" },
  { val:5, label:"SOULSLIKE", sub:"Prepare to die" },
];

const WORLDS = [
  { id:"fantasy",    label:"Fantasy" },
  { id:"scifi",      label:"Sci-Fi" },
  { id:"cyberpunk",  label:"Cyberpunk" },
  { id:"medieval",   label:"Medieval" },
  { id:"apocalypse", label:"Post-Apocalypse" },
  { id:"space",      label:"Space" },
  { id:"zombies",    label:"Zombies" },
  { id:"historical", label:"Historical" },
  { id:"modern",     label:"Modern City" },
  { id:"underwater", label:"Underwater" },
];

const BUDGETS = [
  { id:"free",  label:"FREE TO PLAY" },
  { id:"indie", label:"UNDER $20" },
  { id:"mid",   label:"$20 - $40" },
  { id:"full",  label:"$40 - $70  (AAA)" },
  { id:"any",   label:"NO LIMIT" },
];

const PRIORITIES = [
  { id:"story",         label:"Story & Narrative" },
  { id:"graphics",      label:"Graphics & Visuals" },
  { id:"combat",        label:"Combat & Action" },
  { id:"exploration",   label:"Exploration" },
  { id:"multiplayer",   label:"Multiplayer" },
  { id:"replayability", label:"Replayability" },
];

const STEPS = [
  { id:"games",      title:"Games You've Played",  sub:"Search and select titles you've enjoyed" },
  { id:"movies",     title:"Movies You Love",       sub:"Films that resonate with you" },
  { id:"genres",     title:"Favorite Genres",       sub:"Select all that apply" },
  { id:"priorities", title:"What Matters Most",     sub:"Set your priority weights" },
  { id:"platforms",  title:"Your Platforms",        sub:"Where do you play?" },
  { id:"difficulty", title:"Challenge Level",       sub:"How hard do you want it?" },
  { id:"worlds",     title:"Preferred Settings",    sub:"What worlds excite you?" },
  { id:"budget",     title:"Budget Range",          sub:"How much do you spend per game?" },
];

/* ─────────────────────────────────────────────────────────────────────────
   FALLBACK RECOMMENDATIONS  (shown if API unavailable)
───────────────────────────────────────────────────────────────────────── */
const getFallback = () => [
  {
    title:"Black Myth: Wukong", developer:"Game Science", year:2024,
    genres:["Action RPG","Soulslike","Mythology"], platforms:["PC","PS5"],
    matchScore:98, matchColor:"#FF4655", setting:"Mythological Fantasy",
    description:"An Action RPG rooted in Chinese mythology. Embark as the Destined One to venture into challenges and marvels ahead.",
    whyRecommended:"Matches your desire for rich dark fantasy worlds with high-skill combat and breathtaking mythological lore.",
    highlights:["Next-gen Unreal Engine 5 visuals","Fluid transformation mechanics","Deep boss fight variety"],
    steamUrl:"https://store.steampowered.com/app/2358720/Black_Myth_Wukong/",
    epicUrl:"https://store.epicgames.com/en-US/p/black-myth-wukong-87a2a3",
    playtime:"35-50 hrs", label:"2024 TOP PICK",
  },
  {
    title:"Helldivers 2", developer:"Arrowhead Game Studios", year:2024,
    genres:["Co-op Shooter","FPS","Sci-Fi"], platforms:["PC","PS5"],
    matchScore:95, matchColor:"#FF4655", setting:"Galactic War",
    description:"The galaxy's last line of offense. Enlist in the Helldivers and join the battle for freedom across a hostile universe.",
    whyRecommended:"Perfect for gamers seeking chaotic co-op action, procedural galactic campaigns, and high replayability.",
    highlights:["4-Player tactical co-op","Dynamic galactic map campaign","Satisfying gunplay & stratagems"],
    steamUrl:"https://store.steampowered.com/app/553850/HELLDIVERS_2/",
    playtime:"50-100+ hrs", label:"2024 CO-OP PICK",
  },
  {
    title:"Elden Ring", developer:"FromSoftware", year:2022,
    genres:["Action RPG","Soulslike","Open World"], platforms:["PC","PS5","Xbox"],
    matchScore:94, matchColor:"#FF4655", setting:"Dark Fantasy",
    description:"A breathtaking open world of darkness and wonder. FromSoftware's masterpiece demands everything — and rewards beyond measure.",
    whyRecommended:"Matches your love for exploration-heavy RPGs with punishing, deeply satisfying combat in a vast dark fantasy setting.",
    highlights:["Massive interconnected world","Intricate environmental lore","Punishing but fair combat"],
    steamUrl:"https://store.steampowered.com/app/1245620/ELDEN_RING/",
    epicUrl:"https://store.epicgames.com/en-US/p/elden-ring",
    playtime:"60-150 hrs", label:"ALL-TIME FAVORITE",
  },
  {
    title:"Warhammer 40,000: Space Marine 2", developer:"Saber Interactive", year:2024,
    genres:["Action Shooter","Co-op","Sci-Fi"], platforms:["PC","PS5","Xbox"],
    matchScore:93, matchColor:"#FF4655", setting:"Grimdark Sci-Fi",
    description:"Embody the superhuman skill and brutality of a Space Marine. Unleash deadly abilities and devastate relentless Tyranid swarms.",
    whyRecommended:"Ideal for players who crave visceral action, cinematic scale, and team-based horde slaughter.",
    highlights:["Swarm Engine technology","3-player co-op campaign","Brutal melee and ranged combat"],
    steamUrl:"https://store.steampowered.com/app/1283400/Warhammer_40000_Space_Marine_2/",
    epicUrl:"https://store.epicgames.com/en-US/p/warhammer-40000-space-marine-2",
    playtime:"20-40 hrs", label:"2024 ACTION PICK",
  },
  {
    title:"Balatro", developer:"LocalThunk", year:2024,
    genres:["Roguelike","Strategy","Deckbuilder"], platforms:["PC","Switch","PS5","Xbox","Mobile"],
    matchScore:91, matchColor:"#FF4655", setting:"Retro Arcade",
    description:"The poker roguelike sensation. Combine valid poker hands with unique Joker cards to create insane synergies.",
    whyRecommended:"Unbeatable 'one more run' gameplay loop with limitless strategic deckbuilding variety.",
    highlights:["Addictive deckbuilding loop","150+ game-changing Jokers","Hypnotic synth-wave soundtrack"],
    steamUrl:"https://store.steampowered.com/app/2379780/Balatro/",
    playtime:"30-150 hrs", label:"2024 INDIE HIT",
  },
  {
    title:"Baldur's Gate 3", developer:"Larian Studios", year:2023,
    genres:["RPG","Turn-Based","Co-op"], platforms:["PC","PS5","Xbox"],
    matchScore:90, matchColor:"#FF4655", setting:"High Fantasy",
    description:"The definitive CRPG experience. Staggering narrative depth, true player agency, and four-player co-op that actually works.",
    whyRecommended:"Built for story-first players who want every decision to matter in a richly realized world full of memorable characters.",
    highlights:["Deep choice systems","4-player co-op","100+ hour story"],
    steamUrl:"https://store.steampowered.com/app/1086940/Baldurs_Gate_3/",
    epicUrl:"https://store.epicgames.com/en-US/p/baldurs-gate-3",
    playtime:"80-200 hrs", label:"STORY PICK",
  },
];

/* ─────────────────────────────────────────────────────────────────────────
   ROOT APP COMPONENT
───────────────────────────────────────────────────────────────────────── */
export default function App() {
  const [page, setPage]   = useState("landing"); // landing | quiz | loading | results | library
  const [step, setStep]   = useState(0);
  const [qKey, setQKey]   = useState(0);
  const [recs, setRecs]   = useState(null);
  const [loadMsg, setLoadMsg] = useState("Analyzing your profile...");
  const [compMsg, setCompMsg] = useState("");
  const [compVis, setCompVis] = useState(false);

  const [librarySearch, setLibrarySearch] = useState("");
  const [libraryFilter, setLibraryFilter] = useState("all");

  const [answers, setAnswers] = useState({
    games:[], movies:[], genres:[], platforms:[], worlds:[],
    priorities:{ story:70, graphics:50, combat:60, exploration:80, multiplayer:30, replayability:60 },
    difficulty:3, budget:"any",
  });

  const showComp = useCallback(msg => {
    setCompMsg(msg); setCompVis(true);
    setTimeout(() => setCompVis(false), 5000);
  }, []);

  useEffect(() => {
    if (page !== "quiz") return;
    const msgs = [
      "Tell me what you have played before.",
      "Movie taste reveals a lot about your instincts.",
      "Genre preferences are your core DNA.",
      "Weight what actually matters to you.",
      "Platform determines what I can recommend.",
      "Difficulty is personal. Be honest.",
      "Setting shapes the entire experience.",
      "Almost done. One last data point.",
    ];
    showComp(msgs[step] || "Almost there.");
  }, [step, page, showComp]);

  const toggleMulti = (key, val) =>
    setAnswers(a => ({
      ...a,
      [key]: a[key].includes(val) ? a[key].filter(x => x !== val) : [...a[key], val],
    }));

  const goNext = () => {
    if (step < STEPS.length - 1) { setStep(s => s + 1); setQKey(k => k + 1); }
    else runAI();
  };
  const goBack = () => {
    if (step > 0) { setStep(s => s - 1); setQKey(k => k + 1); }
  };

  /* ── AI Recommendation Call ── */
  const runAI = async () => {
    setPage("loading");
    const msgs = [
      "Analyzing your profile...",
      "Scanning 50,000+ titles...",
      "Applying preference weights...",
      "Calculating match scores...",
      "Finalizing recommendations...",
    ];
    let i = 0;
    const iv = setInterval(() => { setLoadMsg(msgs[i++ % msgs.length]); }, 1800);

    try {
      const prompt = `You are an elite video game recommendation AI. Based on this user profile, recommend exactly 6 games. Include recent 2024-2026 releases if relevant.

USER PROFILE:
- Games Played: ${answers.games.join(", ") || "Not specified"}
- Favorite Movies: ${answers.movies.join(", ") || "Not specified"}
- Preferred Genres: ${answers.genres.join(", ") || "Not specified"}
- Gaming Platforms: ${answers.platforms.join(", ") || "Any"}
- Preferred Settings/Worlds: ${answers.worlds.join(", ") || "Not specified"}
- Difficulty Preference: ${DIFF[answers.difficulty - 1]?.label}
- Budget: ${answers.budget}
- Priority Weights: Story(${answers.priorities.story}%), Graphics(${answers.priorities.graphics}%), Combat(${answers.priorities.combat}%), Exploration(${answers.priorities.exploration}%), Multiplayer(${answers.priorities.multiplayer}%), Replayability(${answers.priorities.replayability}%)

Respond ONLY with a valid JSON array. No markdown fences, no explanation text, no preamble:
[
  {
    "title": "Game Title",
    "developer": "Studio Name",
    "year": 2024,
    "genres": ["Genre1", "Genre2"],
    "platforms": ["PC", "PS5"],
    "matchScore": 96,
    "matchColor": "#FF4655",
    "setting": "Setting name",
    "description": "2-3 sentence compelling description of the game and why it is great.",
    "whyRecommended": "1-2 sentences specifically explaining why this matches this user's exact profile.",
    "highlights": ["Standout Feature 1", "Standout Feature 2", "Standout Feature 3"],
    "steamUrl": "https://store.steampowered.com/search/?term=GameTitle",
    "epicUrl": "https://store.epicgames.com/en-US/browse?q=GameTitle",
    "playtime": "40-80 hrs",
    "label": "TOP PICK"
  }
]

Rules:
- matchColor is always "#FF4655"
- matchScore between 82 and 99
- Order from highest to lowest matchScore
- Always provide valid Steam store links (e.g. https://store.steampowered.com/search/?term=GameTitle)
- Make label unique and short (e.g. "TOP PICK", "STORY PICK", "VISUAL PICK", "INDIE PICK", "CO-OP PICK", etc)
- Prioritize games available on the user's stated platforms`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2200,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.find(b => b.type === "text")?.text || "[]";
      const clean = text.replace(/```json|```/g, "").trim();
      const games = JSON.parse(clean);
      clearInterval(iv);
      setRecs(games);
      setPage("results");
    } catch {
      clearInterval(iv);
      setRecs(getFallback());
      setPage("results");
    }
  };

  /* ════════════════════════════════════════════════════════════════════
     LANDING PAGE
  ════════════════════════════════════════════════════════════════════ */
  if (page === "landing") return (
    <div className="page-enter" style={{ minHeight:"100vh", background:"var(--darker)", position:"relative", overflow:"hidden" }}>
      <Styles/>
      <Crosshair/>
      <Scanline/>
      <OrbBg/>
      <div className="tac-grid" style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none" }}/>

      {/* ── Navigation ── */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        padding:"18px 40px",
        display:"flex",justifyContent:"space-between",alignItems:"center",
        background:"rgba(10,16,24,0.72)",backdropFilter:"blur(18px)",
        borderBottom:"1px solid rgba(255,70,85,0.1)",
      }}>
        {/* Logo */}
        <div style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer" }} onClick={() => setPage("landing")}>
          <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            <polygon points="12,2 22,7 22,17 12,22 2,17 2,7"
              stroke="#FF4655" strokeWidth="1.4" fill="rgba(255,70,85,0.07)"/>
            <circle cx={12} cy={12} r={3} fill="#FF4655"/>
            <line x1={12} y1={5}  x2={12} y2={9}  stroke="#FF4655" strokeWidth="1.1"/>
            <line x1={12} y1={15} x2={12} y2={19} stroke="#FF4655" strokeWidth="1.1"/>
            <line x1={5}  y1={12} x2={9}  y2={12} stroke="#FF4655" strokeWidth="1.1"/>
            <line x1={15} y1={12} x2={19} y2={12} stroke="#FF4655" strokeWidth="1.1"/>
          </svg>
          <span style={{ fontFamily:"var(--font-d)",fontSize:"1.25rem",letterSpacing:4 }}>
            GAME<span style={{ color:"var(--red)" }}>MATCH</span> AI
          </span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:20 }}>
          <button className="nav-link" style={{ color: page==="landing" ? "var(--red)" : "var(--grey)" }} onClick={() => setPage("landing")}>HOME</button>
          <button className="nav-link" style={{ color: page==="library" ? "var(--red)" : "var(--grey)" }} onClick={() => setPage("library")}>GAME LIBRARY & STEAM</button>
          <button className="btn-primary" style={{ padding:"8px 22px" }}
            onClick={() => setPage("quiz")}>
            LAUNCH QUIZ
          </button>
        </div>
      </nav>

      {/* ── Floating Game Covers ── */}
      <FloatingCard imgSrc={IMG.rdr2}         title="Red Dead 2"     score={97} style={{ top:"18%",  left:"4%"   }}/>
      <FloatingCard imgSrc={IMG.gow}          title="God of War"     score={94} style={{ top:"22%",  right:"5%"  }} alt/>
      <FloatingCard imgSrc={IMG.valorant}     title="Valorant"       score={91} style={{ bottom:"27%",left:"3%"  }} alt/>
      <FloatingCard imgSrc={IMG.cod}          title="Call of Duty"   score={88} style={{ bottom:"20%",right:"4%" }}/>
      <FloatingCard imgSrc={IMG.minecraft}    title="Minecraft"      score={85} style={{ top:"58%",  left:"6%"   }}/>
      <FloatingCard imgSrc={IMG.splitfiction} title="Split Fiction"  score={90} style={{ top:"54%",  right:"5%"  }} alt/>

      {/* ── Hero Content ── */}
      <div style={{
        minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
        position:"relative",zIndex:10,padding:"100px 20px 60px",textAlign:"center",
      }}>
        <div style={{ maxWidth:780, animation:"fadeUp 0.7s cubic-bezier(.22,1,.36,1) both" }}>

          <div style={{ marginBottom:22 }}>
            <span className="chip">// AI-POWERED GAME DISCOVERY ENGINE</span>
          </div>

          {/* Decorative side lines */}
          <div style={{ position:"relative", marginBottom:30 }}>
            <div style={{
              position:"absolute",top:"50%",left:"3%",
              width:"12%",height:1,
              background:"linear-gradient(90deg,transparent,rgba(255,70,85,0.45))",
            }}/>
            <div style={{
              position:"absolute",top:"50%",right:"3%",
              width:"12%",height:1,
              background:"linear-gradient(270deg,transparent,rgba(255,70,85,0.45))",
            }}/>
            <h1 className="hero-title" style={{
              fontFamily:"var(--font-d)",fontWeight:400,letterSpacing:4,lineHeight:1,
              fontSize:"clamp(3.2rem,8vw,6.5rem)",color:"var(--white)",
            }}>
              DISCOVER YOUR<br/>
              NEXT <span className="shim">GAMING</span><br/>
              OBSESSION
            </h1>
          </div>

          <p style={{
            fontFamily:"var(--font-b)",fontWeight:300,fontSize:"1.15rem",
            color:"var(--grey)",maxWidth:520,margin:"0 auto 50px",lineHeight:1.75,
          }}>
            Answer a tactical questionnaire. Our AI cross-references your complete taste
            profile against 50,000+ titles including new 2024-2026 launches to find games you will actually love.
          </p>

          <div style={{ display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap" }}>
            <button className="btn-primary" style={{ padding:"17px 36px",display:"flex",alignItems:"center",gap:10 }}
              onClick={() => { setPage("quiz"); setStep(0); }}>
              INITIATE SCAN
              <ScopeArrow dir="right" size={18} color="#000"/>
            </button>
            <button className="btn-ghost" style={{ padding:"17px 26px" }}
              onClick={() => setPage("library")}>
              EXPLORE LIBRARY & STEAM
            </button>
            <button className="btn-ghost" style={{ padding:"17px 24px" }}
              onClick={() => { setRecs(getFallback()); setPage("results"); }}>
              DEMO PICKS
            </button>
          </div>

          {/* Stats */}
          <div style={{ display:"flex",gap:52,justifyContent:"center",marginTop:68,flexWrap:"wrap" }}>
            {[["50K+","TITLES INDEXED"],["98%","MATCH ACCURACY"],["< 2 MIN","QUIZ TIME"]].map(([n,l]) => (
              <div key={n} style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"var(--font-d)",fontSize:"2.3rem",color:"var(--red)",letterSpacing:2 }}>{n}</div>
                <div style={{ fontFamily:"var(--font-m)",fontSize:"0.58rem",color:"var(--grey)",letterSpacing:2,marginTop:4 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════════════════
     QUIZ PAGE
  ════════════════════════════════════════════════════════════════════ */
  if (page === "quiz") {
    const S = STEPS[step];

    const renderContent = () => {
      switch (S.id) {
        case "games": return (
          <SearchSelect
            placeholder="Search games... e.g. Elden Ring, Valorant"
            options={GAMES} selected={answers.games}
            onSelect={g => setAnswers(a => ({ ...a, games:[...a.games, g] }))}
            onRemove={g => setAnswers(a => ({ ...a, games:a.games.filter(x=>x!==g) }))}
          />
        );
        case "movies": return (
          <SearchSelect
            placeholder="Search movies... e.g. Dune, The Matrix"
            options={MOVIES} selected={answers.movies}
            onSelect={m => setAnswers(a => ({ ...a, movies:[...a.movies, m] }))}
            onRemove={m => setAnswers(a => ({ ...a, movies:a.movies.filter(x=>x!==m) }))}
          />
        );
        case "genres": return (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:10 }}>
            {GENRES.map(g => (
              <OptionBtn key={g.id} label={g.label}
                selected={answers.genres.includes(g.id)}
                onClick={() => toggleMulti("genres", g.id)}/>
            ))}
          </div>
        );
        case "priorities": return (
          <div style={{ display:"flex",flexDirection:"column",gap:24 }}>
            {PRIORITIES.map(p => (
              <div key={p.id}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:8 }}>
                  <span style={{ fontFamily:"var(--font-b)",fontWeight:600,fontSize:"1rem",letterSpacing:1 }}>
                    {p.label}
                  </span>
                  <span style={{ fontFamily:"var(--font-m)",fontSize:"0.8rem",color:"var(--red)" }}>
                    {answers.priorities[p.id]}%
                  </span>
                </div>
                <input type="range" min={0} max={100} value={answers.priorities[p.id]}
                  onChange={e => setAnswers(a => ({
                    ...a,
                    priorities: { ...a.priorities, [p.id]: parseInt(e.target.value) },
                  }))}
                />
              </div>
            ))}
          </div>
        );
        case "platforms": return (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))",gap:10 }}>
            {PLATFORMS.map(p => (
              <OptionBtn key={p.id} label={p.label}
                selected={answers.platforms.includes(p.id)}
                onClick={() => toggleMulti("platforms", p.id)}/>
            ))}
          </div>
        );
        case "difficulty": return (
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {DIFF.map(d => (
              <button key={d.val}
                onClick={() => setAnswers(a => ({ ...a, difficulty:d.val }))}
                style={{
                  padding:"16px 20px",
                  background: answers.difficulty===d.val ? "rgba(255,70,85,0.13)" : "rgba(255,255,255,0.03)",
                  border:`1px solid ${answers.difficulty===d.val ? "var(--red)" : "rgba(255,255,255,0.08)"}`,
                  color: answers.difficulty===d.val ? "var(--white)" : "var(--grey)",
                  display:"flex",justifyContent:"space-between",alignItems:"center",
                  cursor:"none",transition:"all 0.15s",
                  clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
                  boxShadow: answers.difficulty===d.val ? "0 0 14px rgba(255,70,85,0.18)" : "none",
                }}>
                <div style={{ display:"flex",gap:14,alignItems:"center" }}>
                  <span style={{
                    width:8,height:8,
                    clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",
                    background: answers.difficulty===d.val ? "var(--red)" : "rgba(255,255,255,0.18)",
                    boxShadow: answers.difficulty===d.val ? "0 0 8px var(--red)" : "none",
                    display:"inline-block",
                  }}/>
                  <span style={{ fontFamily:"var(--font-d)",fontSize:"1.15rem",letterSpacing:3 }}>{d.label}</span>
                </div>
                <span style={{ fontFamily:"var(--font-m)",fontSize:"0.68rem",color:"var(--grey)" }}>{d.sub}</span>
              </button>
            ))}
          </div>
        );
        case "worlds": return (
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:10 }}>
            {WORLDS.map(w => (
              <OptionBtn key={w.id} label={w.label}
                selected={answers.worlds.includes(w.id)}
                onClick={() => toggleMulti("worlds", w.id)}/>
            ))}
          </div>
        );
        case "budget": return (
          <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
            {BUDGETS.map(b => (
              <button key={b.id}
                onClick={() => setAnswers(a => ({ ...a, budget:b.id }))}
                style={{
                  padding:"16px 20px",
                  background: answers.budget===b.id ? "rgba(255,70,85,0.13)" : "rgba(255,255,255,0.03)",
                  border:`1px solid ${answers.budget===b.id ? "var(--red)" : "rgba(255,255,255,0.08)"}`,
                  color: answers.budget===b.id ? "var(--white)" : "var(--grey)",
                  display:"flex",alignItems:"center",gap:14,
                  cursor:"none",transition:"all 0.15s",
                  clipPath:"polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
                  boxShadow: answers.budget===b.id ? "0 0 14px rgba(255,70,85,0.18)" : "none",
                }}>
                <span style={{
                  width:8,height:8,
                  clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",
                  background: answers.budget===b.id ? "var(--red)" : "rgba(255,255,255,0.18)",
                  boxShadow: answers.budget===b.id ? "0 0 8px var(--red)" : "none",
                  display:"inline-block",flexShrink:0,
                }}/>
                <span style={{ fontFamily:"var(--font-d)",fontSize:"1.1rem",letterSpacing:2 }}>{b.label}</span>
              </button>
            ))}
          </div>
        );
        default: return null;
      }
    };

    return (
      <div className="page-enter" style={{ minHeight:"100vh",background:"var(--darker)",position:"relative" }}>
        <Styles/>
        <Crosshair/>
        <Scanline/>
        <OrbBg/>
        <div className="tac-grid" style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none" }}/>

        <div style={{ position:"relative",zIndex:10,maxWidth:660,margin:"0 auto",padding:"40px 20px 120px" }}>

          {/* Back + logo */}
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
            <button onClick={() => setPage("landing")} style={{
              background:"none",border:"none",cursor:"none",
              color:"var(--grey)",fontFamily:"var(--font-m)",fontSize:"0.72rem",
              display:"flex",alignItems:"center",gap:8,letterSpacing:1,
            }}>
              <ScopeArrow dir="left" size={15} color="var(--grey)"/>
              HOME
            </button>
            <span style={{ fontFamily:"var(--font-d)",fontSize:"1rem",letterSpacing:4,color:"var(--red)" }}>
              GAMEMATCH AI
            </span>
          </div>

          <ProgressBar current={step} total={STEPS.length}/>
          <div className="accent-line" style={{ marginTop:2,marginBottom:40 }}/>

          {/* Question */}
          <div key={qKey} className="q-enter">
            <div style={{ marginBottom:4 }}>
              <span style={{ fontFamily:"var(--font-m)",fontSize:"0.62rem",color:"var(--red)",letterSpacing:3 }}>
                // QUERY_{String(step+1).padStart(2,"0")}
              </span>
            </div>
            <h2 style={{
              fontFamily:"var(--font-d)",
              fontSize:"clamp(1.9rem,4.5vw,2.7rem)",
              letterSpacing:3,marginBottom:6,
            }}>
              {S.title}
            </h2>
            <p style={{
              fontFamily:"var(--font-b)",fontWeight:300,
              color:"var(--grey)",marginBottom:28,fontSize:"1rem",
            }}>
              {S.sub}
            </p>
            {renderContent()}
          </div>

          {/* Navigation buttons */}
          <div style={{ display:"flex",gap:12,marginTop:46,justifyContent:"flex-end" }}>
            {step > 0 && (
              <button className="btn-ghost"
                style={{ padding:"13px 24px",display:"flex",alignItems:"center",gap:10 }}
                onClick={goBack}>
                <ScopeArrow dir="left" size={17}/> BACK
              </button>
            )}
            <button className="btn-primary"
              style={{ padding:"13px 36px",display:"flex",alignItems:"center",gap:10 }}
              onClick={goNext}>
              {step === STEPS.length - 1 ? "ANALYZE PROFILE" : "CONTINUE"}
              {step < STEPS.length - 1 && <ScopeArrow dir="right" size={17} color="#000"/>}
            </button>
          </div>
        </div>

        <Companion msg={compMsg} visible={compVis}/>
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════════
     LOADING PAGE
  ════════════════════════════════════════════════════════════════════ */
  if (page === "loading") return (
    <div className="page-enter" style={{
      minHeight:"100vh",background:"var(--darker)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      position:"relative",
    }}>
      <Styles/>
      <Crosshair/>
      <OrbBg/>
      <div className="tac-grid" style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none" }}/>

      <div style={{ position:"relative",zIndex:10,textAlign:"center",padding:40 }}>
        {/* Spinning scope */}
        <div style={{ position:"relative",width:100,height:100,margin:"0 auto 36px" }}>
          <svg width={100} height={100} style={{ position:"absolute",inset:0 }}>
            <circle cx={50} cy={50} r={42} fill="none" stroke="rgba(255,70,85,0.08)" strokeWidth={2}/>
            <circle cx={50} cy={50} r={42} fill="none" stroke="var(--red)" strokeWidth={2}
              strokeDasharray="35 230" className="spin"
              style={{ filter:"drop-shadow(0 0 6px var(--red))" }}
            />
            {/* Crosshair */}
            <line x1={50} y1={8}  x2={50} y2={22} stroke="rgba(255,70,85,0.4)" strokeWidth={1}/>
            <line x1={50} y1={78} x2={50} y2={92} stroke="rgba(255,70,85,0.4)" strokeWidth={1}/>
            <line x1={8}  y1={50} x2={22} y2={50} stroke="rgba(255,70,85,0.4)" strokeWidth={1}/>
            <line x1={78} y1={50} x2={92} y2={50} stroke="rgba(255,70,85,0.4)" strokeWidth={1}/>
            <circle cx={50} cy={50} r={4} fill="var(--red)"
              style={{ filter:"drop-shadow(0 0 8px var(--red))" }}
            />
          </svg>
        </div>

        <div style={{ fontFamily:"var(--font-m)",fontSize:"0.62rem",color:"var(--red)",letterSpacing:3,marginBottom:12 }}>
          // PROCESSING
        </div>
        <h2 style={{ fontFamily:"var(--font-d)",fontSize:"1.8rem",letterSpacing:3,marginBottom:8 }}>
          {loadMsg}
        </h2>
        <p style={{ fontFamily:"var(--font-m)",fontSize:"0.68rem",color:"var(--grey)",letterSpacing:2 }}>
          POWERED BY CLAUDE AI
        </p>

        {/* Animated diamonds */}
        <div style={{ display:"flex",gap:7,justifyContent:"center",marginTop:32 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{
              width:5,height:5,
              clipPath:"polygon(50% 0%,100% 50%,50% 100%,0% 50%)",
              background:"var(--red)",
              animation:`floatA ${0.5+i*0.15}s ease-in-out infinite alternate`,
              boxShadow:"0 0 6px var(--red)",
            }}/>
          ))}
        </div>
      </div>
    </div>
  );

  /* ════════════════════════════════════════════════════════════════════
     RESULTS PAGE
  ════════════════════════════════════════════════════════════════════ */
  if (page === "results" && recs) {
    const insights = [
      {
        label:"GENRE DNA",
        value: answers.genres.length > 0
          ? answers.genres.slice(0,2).map(g => g.toUpperCase()).join(" + ")
          : "VARIED",
      },
      {
        label:"PLAY STYLE",
        value: answers.priorities.story > 65 ? "STORY HUNTER"
          : answers.priorities.combat > 65 ? "COMBAT SPECIALIST"
          : answers.priorities.exploration > 65 ? "WORLD EXPLORER"
          : "BALANCED",
      },
      {
        label:"CHALLENGE",
        value: DIFF[answers.difficulty - 1]?.label || "MODERATE",
      },
      {
        label:"PREFERRED WORLD",
        value: answers.worlds[0] ? answers.worlds[0].toUpperCase() : "OPEN",
      },
    ];

    return (
      <div className="page-enter" style={{ minHeight:"100vh",background:"var(--darker)",position:"relative" }}>
        <Styles/>
        <Crosshair/>
        <Scanline/>
        <OrbBg/>
        <div className="tac-grid" style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none" }}/>

        <div style={{ position:"relative",zIndex:10,maxWidth:1080,margin:"0 auto",padding:"60px 20px 80px" }}>

          {/* ── Header ── */}
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",
            flexWrap:"wrap",gap:16,marginBottom:14 }}>
            <div>
              <div style={{ marginBottom:10 }}>
                <span className="chip">// MATCH REPORT GENERATED</span>
              </div>
              <h1 style={{
                fontFamily:"var(--font-d)",letterSpacing:4,
                fontSize:"clamp(2.2rem,5.5vw,4rem)",
              }}>
                YOUR GAME <span style={{ color:"var(--red)" }}>MATCHES</span>
              </h1>
              <div className="accent-line" style={{ marginTop:8,width:220 }}/>
            </div>
            <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
              <button className="btn-ghost" style={{ padding:"10px 20px" }}
                onClick={() => { setStep(0); setPage("quiz"); }}>
                RETAKE
              </button>
              <button className="btn-primary" style={{ padding:"10px 22px" }}
                onClick={() => setPage("landing")}>
                HOME
              </button>
            </div>
          </div>

          {/* ── Profile Insights ── */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",
            gap:12,marginBottom:50 }}>
            {insights.map((ins, i) => (
              <div key={i} className="panel" style={{
                padding:"16px 20px",
                clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,0 100%)",
                animation:`fadeUp 0.5s ease ${i * 0.08}s both`,
              }}>
                <div style={{ fontFamily:"var(--font-m)",fontSize:"0.57rem",color:"var(--red)",
                  letterSpacing:2,marginBottom:6 }}>{ins.label}</div>
                <div style={{ fontFamily:"var(--font-d)",fontSize:"1.1rem",letterSpacing:2,
                  color:"var(--white)" }}>{ins.value}</div>
              </div>
            ))}
          </div>

          {/* ── Game Cards ── */}
          <div style={{ display:"flex",flexDirection:"column",gap:20 }}>
            {recs.map((game, i) => (
              <div key={i} className="panel results-card" style={{
                padding:"26px 28px",
                clipPath:"polygon(0 0,calc(100% - 16px) 0,100% 16px,100% 100%,16px 100%,0 calc(100% - 16px))",
                animation:`fadeUp 0.6s ease ${i * 0.1}s both`,
                borderColor: i === 0 ? "rgba(255,70,85,0.32)" : "var(--border)",
                position:"relative",overflow:"hidden",
              }}>
                {i === 0 && <div className="accent-line" style={{ position:"absolute",top:0,left:0,right:0 }}/>}

                <div style={{ display:"flex",gap:24,flexWrap:"wrap",alignItems:"flex-start" }}>

                  {/* Score ring */}
                  <ScoreRing score={game.matchScore} color={game.matchColor || "#FF4655"}/>

                  {/* Content */}
                  <div style={{ flex:1,minWidth:260 }}>

                    {/* Title row */}
                    <div style={{ display:"flex",alignItems:"center",gap:10,flexWrap:"wrap",marginBottom:7 }}>
                      {game.label && <span className="chip">{game.label}</span>}
                      <h2 style={{ fontFamily:"var(--font-d)",fontSize:"1.75rem",letterSpacing:2 }}>
                        {game.title}
                      </h2>
                      <span style={{ fontFamily:"var(--font-m)",fontSize:"0.68rem",color:"var(--grey)" }}>
                        {game.developer} / {game.year}
                      </span>
                    </div>

                    {/* Genre + playtime tags */}
                    <div style={{ display:"flex",gap:7,flexWrap:"wrap",marginBottom:13 }}>
                      {game.genres?.map(g => (
                        <span key={g} style={{
                          padding:"2px 10px",
                          background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",
                          fontFamily:"var(--font-m)",fontSize:"0.62rem",color:"var(--grey)",
                          clipPath:"polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)",
                        }}>{g}</span>
                      ))}
                      <span style={{
                        padding:"2px 10px",
                        background:"rgba(255,70,85,0.08)",border:"1px solid rgba(255,70,85,0.22)",
                        fontFamily:"var(--font-m)",fontSize:"0.62rem",color:"var(--red)",
                        clipPath:"polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)",
                      }}>{game.playtime}</span>
                    </div>

                    {/* Description */}
                    <p style={{
                      fontFamily:"var(--font-b)",fontWeight:300,color:"var(--grey)",
                      lineHeight:1.7,fontSize:"0.95rem",marginBottom:14,
                    }}>
                      {game.description}
                    </p>

                    {/* Why recommended */}
                    <div style={{
                      padding:"10px 14px",marginBottom:14,
                      borderLeft:"2px solid var(--red)",
                      background:"rgba(255,70,85,0.05)",
                    }}>
                      <div style={{ fontFamily:"var(--font-m)",fontSize:"0.6rem",color:"var(--red)",
                        letterSpacing:1,marginBottom:4 }}>// WHY THIS FOR YOU</div>
                      <p style={{ fontFamily:"var(--font-b)",fontSize:"0.9rem",color:"var(--white)",lineHeight:1.6 }}>
                        {game.whyRecommended}
                      </p>
                    </div>

                    {/* Highlights */}
                    <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:18 }}>
                      {game.highlights?.map(h => (
                        <span key={h} className="chip">+ {h}</span>
                      ))}
                    </div>

                    {/* Store links */}
                    <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
                      {game.steamUrl && (
                        <a href={game.steamUrl} target="_blank" rel="noopener noreferrer"
                          className="store-link store-steam">
                          <SteamIcon size={14} color="#66c0f4"/>
                          VIEW ON STEAM
                        </a>
                      )}
                      {game.epicUrl && (
                        <a href={game.epicUrl} target="_blank" rel="noopener noreferrer"
                          className="store-link store-epic">EPIC</a>
                      )}
                      <a href={`https://www.google.com/search?q=${encodeURIComponent(game.title + " game review")}`}
                        target="_blank" rel="noopener noreferrer"
                        className="store-link store-info">MORE INFO</a>
                    </div>
                  </div>

                  {/* Platform tags */}
                  <div style={{ display:"flex",flexDirection:"column",gap:6,alignItems:"flex-end" }}>
                    {game.platforms?.map(p => (
                      <span key={p} style={{
                        padding:"3px 12px",
                        background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",
                        fontFamily:"var(--font-m)",fontSize:"0.62rem",color:"var(--grey)",
                        whiteSpace:"nowrap",
                        clipPath:"polygon(6px 0,100% 0,calc(100% - 6px) 100%,0 100%)",
                      }}>{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{ textAlign:"center",marginTop:64 }}>
            <div style={{ fontFamily:"var(--font-m)",fontSize:"0.68rem",color:"var(--grey)",
              letterSpacing:2,marginBottom:20 }}>
              WANT MORE TARGETED RESULTS?
            </div>
            <button className="btn-primary" style={{ padding:"15px 42px",display:"inline-flex",alignItems:"center",gap:12 }}
              onClick={() => {
                setStep(0);
                setAnswers({
                  games:[],movies:[],genres:[],platforms:[],worlds:[],
                  priorities:{ story:70,graphics:50,combat:60,exploration:80,multiplayer:30,replayability:60 },
                  difficulty:3,budget:"any",
                });
                setPage("quiz");
              }}>
              RESCAN PROFILE
              <ScopeArrow dir="right" size={18} color="#000"/>
            </button>
          </div>
        </div>

        <Companion
          msg={`Profile confirmed. ${recs.length} matches found. Top match: ${recs[0]?.title}.`}
          visible={true}
        />
      </div>
    );
  }

  /* ════════════════════════════════════════════════════════════════════
     LIBRARY PAGE
  ════════════════════════════════════════════════════════════════════ */
  if (page === "library") {
    const filters = [
      { id: "all", label: "ALL GAMES" },
      { id: "new", label: "NEW RELEASES (2024-2026)" },
      { id: "rpg", label: "ACTION & RPG" },
      { id: "indie", label: "INDIE & ROGUELIKE" },
      { id: "fps", label: "FPS & STRATEGY" },
      { id: "coop", label: "SURVIVAL & CO-OP" },
    ];

    const filteredGames = GAME_LIBRARY.filter(game => {
      const matchesQuery = librarySearch === "" || 
        game.title.toLowerCase().includes(librarySearch.toLowerCase()) ||
        game.developer.toLowerCase().includes(librarySearch.toLowerCase()) ||
        game.genres.some(g => g.toLowerCase().includes(librarySearch.toLowerCase()));
      
      let matchesFilter = true;
      if (libraryFilter === "new") matchesFilter = game.year >= 2024 || game.category === "new";
      else if (libraryFilter === "rpg") matchesFilter = game.category === "rpg" || game.genres.includes("Action RPG") || game.genres.includes("RPG");
      else if (libraryFilter === "indie") matchesFilter = game.category === "indie" || game.genres.includes("Indie") || game.genres.includes("Roguelike");
      else if (libraryFilter === "fps") matchesFilter = game.category === "fps" || game.category === "strategy" || game.genres.includes("FPS") || game.genres.includes("Strategy");
      else if (libraryFilter === "coop") matchesFilter = game.category === "coop" || game.category === "survival" || game.genres.includes("Co-op") || game.genres.includes("Survival");

      return matchesQuery && matchesFilter;
    });

    return (
      <div className="page-enter" style={{ minHeight:"100vh",background:"var(--darker)",position:"relative" }}>
        <Styles/>
        <Crosshair/>
        <Scanline/>
        <OrbBg/>
        <div className="tac-grid" style={{ position:"fixed",inset:0,zIndex:0,pointerEvents:"none" }}/>

        {/* ── Top Navigation ── */}
        <nav style={{
          position:"fixed",top:0,left:0,right:0,zIndex:100,
          padding:"18px 40px",
          display:"flex",justifyContent:"space-between",alignItems:"center",
          background:"rgba(10,16,24,0.85)",backdropFilter:"blur(18px)",
          borderBottom:"1px solid rgba(255,70,85,0.15)",
        }}>
          <div style={{ display:"flex",alignItems:"center",gap:10,cursor:"pointer" }} onClick={() => setPage("landing")}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 22,7 22,17 12,22 2,17 2,7" stroke="#FF4655" strokeWidth="1.4" fill="rgba(255,70,85,0.07)"/>
              <circle cx={12} cy={12} r={3} fill="#FF4655"/>
            </svg>
            <span style={{ fontFamily:"var(--font-d)",fontSize:"1.25rem",letterSpacing:4 }}>
              GAME<span style={{ color:"var(--red)" }}>MATCH</span> AI
            </span>
          </div>
          <div style={{ display:"flex",alignItems:"center",gap:20 }}>
            <button className="nav-link" onClick={() => setPage("landing")}>HOME</button>
            <button className="nav-link" style={{ color:"var(--red)" }} onClick={() => setPage("library")}>GAME LIBRARY & STEAM</button>
            <button className="btn-primary" style={{ padding:"8px 22px" }} onClick={() => setPage("quiz")}>
              LAUNCH QUIZ
            </button>
          </div>
        </nav>

        <div style={{ position:"relative",zIndex:10,maxWidth:1180,margin:"0 auto",padding:"110px 20px 80px" }}>
          
          {/* Header */}
          <div style={{ marginBottom:28 }}>
            <span className="chip">// CATALOG & STEAM INTEGRATION</span>
            <h1 style={{ fontFamily:"var(--font-d)",fontSize:"clamp(2.2rem,5vw,3.8rem)",letterSpacing:4,marginTop:8 }}>
              INDEXED <span style={{ color:"var(--red)" }}>GAME LIBRARY</span>
            </h1>
            <p style={{ fontFamily:"var(--font-b)",fontSize:"1.05rem",color:"var(--grey)",maxWidth:620,marginTop:6 }}>
              Explore newly launched games (2024–2026) and all-time classics. Access direct Steam store links, view detailed game metadata, or match similar titles instantly.
            </p>
            <div className="accent-line" style={{ marginTop:14,width:260 }}/>
          </div>

          {/* Search + Filters */}
          <div style={{ display:"flex",flexDirection:"column",gap:16,marginBottom:32 }}>
            <div style={{ position:"relative",maxWidth:560 }}>
              <input
                value={librarySearch}
                onChange={e => setLibrarySearch(e.target.value)}
                placeholder="Search games, developers, genres... (e.g. Wukong, Helldivers, RPG)"
                style={{
                  width:"100%",padding:"12px 18px",
                  background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,70,85,0.25)",
                  color:"var(--white)",fontFamily:"var(--font-b)",fontSize:"1.05rem",outline:"none",
                  clipPath:"polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))",
                }}
              />
            </div>

            <div style={{ display:"flex",gap:10,flexWrap:"wrap" }}>
              {filters.map(f => (
                <button
                  key={f.id}
                  onClick={() => setLibraryFilter(f.id)}
                  style={{
                    padding:"8px 16px",
                    background: libraryFilter === f.id ? "rgba(255,70,85,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${libraryFilter === f.id ? "var(--red)" : "rgba(255,255,255,0.08)"}`,
                    color: libraryFilter === f.id ? "var(--white)" : "var(--grey)",
                    fontFamily:"var(--font-d)",fontSize:"0.9rem",letterSpacing:1,
                    cursor:"none",transition:"all 0.15s",
                    clipPath:"polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))",
                  }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontFamily:"var(--font-m)",fontSize:"0.7rem",color:"var(--grey)",letterSpacing:2,marginBottom:20 }}>
            // SHOWING {filteredGames.length} OF {GAME_LIBRARY.length} INDEXED TITLES
          </div>

          {/* Cards Grid */}
          <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(340px,1fr))",gap:20 }}>
            {filteredGames.map((game) => (
              <div key={game.id} className="panel" style={{
                padding:"20px",
                clipPath:"polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))",
                display:"flex",flexDirection:"column",justifyContent:"space-between",
                borderColor: game.year >= 2024 ? "rgba(255,70,85,0.3)" : "var(--border)",
              }}>
                <div>
                  {/* Cover Image Banner */}
                  <div style={{ position:"relative",marginBottom:14,borderRadius:2,overflow:"hidden" }}>
                    <img
                      src={getGameCover(game.id, game.title)}
                      alt={game.title}
                      style={{ width:"100%",height:150,objectFit:"cover",display:"block",filter:"brightness(0.9)" }}
                    />
                    <div style={{ position:"absolute",top:8,right:8,background:"rgba(10,16,24,0.85)",padding:"3px 8px",border:"1px solid rgba(255,70,85,0.3)",fontFamily:"var(--font-m)",fontSize:"0.65rem",color:"var(--red)",clipPath:"polygon(4px 0,100% 0,calc(100% - 4px) 100%,0 100%)" }}>
                      {game.badge || `${game.year}`}
                    </div>
                  </div>

                  {/* Title & Metadata */}
                  <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6 }}>
                    <h3 style={{ fontFamily:"var(--font-d)",fontSize:"1.45rem",letterSpacing:1.5,lineHeight:1.1 }}>
                      {game.title}
                    </h3>
                  </div>

                  <div style={{ fontFamily:"var(--font-m)",fontSize:"0.68rem",color:"var(--grey)",marginBottom:10 }}>
                    {game.developer} ({game.year}) &bull; {game.playtime}
                  </div>

                  {/* Genre Badges */}
                  <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:12 }}>
                    {game.genres.map(g => (
                      <span key={g} style={{
                        padding:"2px 8px",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.08)",
                        fontFamily:"var(--font-m)",fontSize:"0.6rem",color:"var(--grey)",
                      }}>
                        {g}
                      </span>
                    ))}
                  </div>

                  <p style={{ fontFamily:"var(--font-b)",fontWeight:300,fontSize:"0.88rem",color:"var(--grey)",lineHeight:1.5,marginBottom:16 }}>
                    {game.description}
                  </p>
                </div>

                {/* Actions (Steam Link & Quiz Matcher) */}
                <div style={{ display:"flex",gap:10,alignItems:"center",flexWrap:"wrap",paddingTop:12,borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                  {game.steamUrl && (
                    <a
                      href={game.steamUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="store-link store-steam"
                      style={{ padding:"8px 16px" }}
                    >
                      <SteamIcon size={14} color="#66c0f4"/>
                      VIEW ON STEAM
                    </a>
                  )}
                  <button
                    className="btn-ghost"
                    style={{ padding:"8px 14px",fontSize:"0.8rem" }}
                    onClick={() => {
                      if (!answers.games.includes(game.title)) {
                        setAnswers(a => ({ ...a, games: [...a.games, game.title] }));
                      }
                      setPage("quiz");
                    }}
                  >
                    MATCH SIMILAR
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        <Companion msg={`Showing ${filteredGames.length} games in library. Click 'VIEW ON STEAM' to visit official store pages.`} visible={true}/>
      </div>
    );
  }

  return null;
}
