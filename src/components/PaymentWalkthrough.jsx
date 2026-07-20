import { useEffect, useState } from "react";

/* ============================================================
   <PaymentWalkthrough />
   Animated "video-style" walkthrough of the MoonPay flow.

   ▸ Zero dependencies. Zero backend. Pure presentational.
   ▸ All styles are scoped with the "pwk-" prefix + injected
     locally, so it cannot break or restyle anything else.
   ▸ Behavior:
       - Desktop (≥1024px): always-visible card. Put it in a
         right column next to your provider list (see below).
       - Mobile (<1024px): renders as a small collapsed button
         "See how payment works · 35 sec" that expands inline.
         Autoplay only runs while expanded.

   USAGE — checkout page layout suggestion:

     import PaymentWalkthrough from "./PaymentWalkthrough";

     <div className="checkout-grid">
       <main>...your existing provider list + Pay Now...</main>
       <aside className="checkout-rail">
         <PaymentWalkthrough />
       </aside>
     </div>

     CSS for the wrapper (add to your page styles):
       .checkout-grid { display:block; }
       .checkout-rail { margin: 12px 0 20px; }        // mobile: sits above/below naturally
       @media (min-width:1024px){
         .checkout-grid { display:grid; grid-template-columns: 1fr 380px; gap:32px;
                          align-items:start; max-width:1080px; margin:0 auto; }
         .checkout-rail { position:sticky; top:24px; }
       }

   EDIT: the amounts below (three props defaults) — taken from
   your screenshots. You can also pass them as props:
     <PaymentWalkthrough total="89,00 $" usdc="85,86 USDC" wallet="Trust Wallet" />
   ============================================================ */

const CSS = `
.pwk-card{font-family:inherit;-webkit-font-smoothing:antialiased;width:100%;max-width:380px;margin:0 auto;background:#fff;border:1px solid #E4E8EE;border-radius:18px;padding:20px 18px 16px;color:#1C2635}
.pwk-eyebrow{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#3E5FDE;text-align:center;margin:0 0 4px}
.pwk-title{font-size:18px;font-weight:700;text-align:center;margin:0 0 14px}
.pwk-phone{width:236px;height:372px;margin:0 auto;background:#FAFBFC;border:1.5px solid #E4E8EE;border-radius:24px;position:relative;overflow:hidden;box-shadow:0 10px 26px rgba(28,38,53,.10)}
.pwk-bartrack{position:absolute;top:0;left:0;right:0;height:3px;background:rgba(127,127,140,.25);z-index:9}
.pwk-bar{height:100%;width:0;background:#3E5FDE}
@keyframes pwkFill{from{width:0}to{width:100%}}
.pwk-screen{position:absolute;inset:0;padding:20px 16px 14px;opacity:0;transform:translateX(14px);transition:opacity .32s ease,transform .32s ease;pointer-events:none;display:flex;flex-direction:column}
.pwk-screen.pwk-on{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){.pwk-screen{transition:none}}
.pwk-h{font-size:12.5px;font-weight:700;margin:0 0 3px}
.pwk-s{font-size:10px;color:#8B95A7;line-height:1.45;margin:0 0 12px}
.pwk-prov{border:1.5px solid #79A9E2;background:#E5EFFB;border-radius:11px;padding:9px 10px;margin-bottom:8px}
.pwk-prov b{font-size:12px}
.pwk-prov-dim{border:1px solid #E4E8EE;border-radius:11px;padding:9px 10px;opacity:.55}
.pwk-prov-dim b{font-size:12px}
.pwk-cards{margin-top:5px;display:flex;gap:4px}
.pwk-cards span{font-size:7px;font-weight:700;background:#fff;border:1px solid #E4E8EE;border-radius:4px;padding:2px 5px;color:#3a4557}
.pwk-btn{margin-top:auto;background:#3E5FDE;color:#fff;font-size:11.5px;font-weight:600;text-align:center;border-radius:20px;padding:10px}
.pwk-tap{position:absolute;width:30px;height:30px;border-radius:50%;background:rgba(62,95,222,.28);border:1.5px solid #3E5FDE;animation:pwkTap 1.4s ease infinite;pointer-events:none;z-index:8}
@keyframes pwkTap{0%,55%{transform:scale(.75);opacity:0}70%{transform:scale(1);opacity:1}100%{transform:scale(1.25);opacity:0}}
@media (prefers-reduced-motion:reduce){.pwk-tap{animation:none;opacity:.8}}
.pwk-dark{background:#0B0B0D;color:#fff}
.pwk-mpt{font-size:12.5px;font-weight:700;text-align:center;margin:0 0 4px}
.pwk-mps{font-size:9.5px;color:#9B9BA6;line-height:1.45;margin:0 0 12px}
.pwk-mpf{border:1px solid #3A3A42;border-radius:12px;background:#141417;padding:8px 10px;font-size:9.5px;color:#fff;margin-bottom:8px;display:flex;align-items:center;gap:7px}
.pwk-mpf small{display:block;font-size:7.5px;color:#9B9BA6;margin-bottom:1px}
.pwk-mpf .pwk-chev{margin-left:auto;color:#9B9BA6;font-size:9px}
.pwk-mpbtn{margin-top:auto;background:#7B1FFF;color:#fff;font-size:11.5px;font-weight:600;text-align:center;border-radius:22px;padding:10px}
.pwk-or{text-align:center;font-size:8.5px;color:#9B9BA6;margin:8px 0}
.pwk-pills{display:flex;gap:7px}
.pwk-pill{flex:1;background:#141417;border:1px solid #3A3A42;border-radius:20px;padding:8px 0;font-size:10px;font-weight:600;color:#fff;display:flex;align-items:center;justify-content:center;gap:5px}
.pwk-paybtn{flex:1;background:#fff;border-radius:20px;padding:8px 0;display:flex;align-items:center;justify-content:center;gap:4px;color:#000;font-size:10.5px;font-weight:600}
.pwk-foot{text-align:center;font-size:7.5px;color:#9B9BA6;margin-top:8px}
.pwk-code{display:flex;gap:7px;margin-bottom:10px;justify-content:center}
.pwk-code span{width:32px;height:40px;border:1px solid #3A3A42;border-radius:10px;background:#141417;font-size:15px;font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center}
.pwk-mpl{background:#F4F4F6;color:#111;padding:12px}
.pwk-ban{background:#E7E7EA;border-radius:10px;padding:6px 9px;font-size:7px;line-height:1.4;color:#333;text-align:center;margin-bottom:8px}
.pwk-mplt{font-size:12px;font-weight:700;text-align:center;margin:0 0 8px}
.pwk-coin{width:30px;height:30px;border-radius:50%;background:#2775CA;color:#fff;font-size:15px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 5px}
.pwk-buy{text-align:center;font-size:13px;font-weight:700;margin:0 0 9px}
.pwk-row{background:#fff;border:1px solid #E6E6EA;border-radius:12px;padding:7px 9px;display:flex;align-items:center;gap:7px;margin-bottom:7px}
.pwk-row .pwk-lab{font-size:7.5px;color:#8E8E96}
.pwk-row .pwk-val{font-size:9.5px;font-weight:600}
.pwk-row .pwk-r{margin-left:auto;font-size:8px;color:#8E8E96}
.pwk-tot{display:flex;align-items:flex-start;justify-content:space-between;padding:2px 3px 8px}
.pwk-tot b{font-size:10.5px}
.pwk-tot span{display:block;font-size:7.5px;color:#8E8E96}
.pwk-tot .pwk-tr{text-align:right}
.pwk-tot .pwk-tr b{font-size:11.5px}
.pwk-mplbtn{margin-top:auto;background:#1F2BFB;color:#fff;font-size:11.5px;font-weight:600;text-align:center;border-radius:22px;padding:10px}
.pwk-check{width:62px;height:62px;border-radius:50%;background:#E5F6EC;color:#27A05E;font-size:28px;display:flex;align-items:center;justify-content:center;margin:40px auto 14px}
.pwk-dt{text-align:center;font-size:14px;font-weight:700;margin:0}
.pwk-ds{text-align:center;font-size:10.5px;color:#8B95A7;margin:5px 0 0;line-height:1.5}
.pwk-cap{min-height:66px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:13px;line-height:1.5;padding:14px 4px 6px;color:#1C2635;margin:0}
.pwk-cap b{color:#3E5FDE}
.pwk-ctrl{display:flex;align-items:center;justify-content:center;gap:14px;padding:4px 0 14px}
.pwk-dots{display:flex;gap:7px}
.pwk-dot{width:8px;height:8px;border-radius:50%;border:none;background:#E4E8EE;cursor:pointer;padding:0;transition:background .2s,transform .2s}
.pwk-dot.pwk-on{background:#3E5FDE;transform:scale(1.25)}
.pwk-dot:focus-visible{outline:2px solid #3E5FDE;outline-offset:2px}
.pwk-pp{width:34px;height:34px;border-radius:50%;border:1px solid #E4E8EE;background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#1C2635}
.pwk-pp:hover{border-color:#79A9E2}
.pwk-pp:focus-visible{outline:2px solid #3E5FDE;outline-offset:2px}
.pwk-pp svg{width:13px;height:13px}
.pwk-note{background:#E5EFFB;border-radius:11px;padding:12px 13px;font-size:12px;line-height:1.55;color:#1C2635;margin:0}
.pwk-toggle{width:100%;display:flex;align-items:center;justify-content:center;gap:8px;background:#fff;border:1px solid #E4E8EE;border-radius:14px;padding:12px 14px;font-size:13.5px;font-weight:600;color:#1C2635;cursor:pointer;font-family:inherit}
.pwk-toggle:hover{border-color:#79A9E2}
.pwk-toggle .pwk-play-ic{width:26px;height:26px;border-radius:50%;background:#3E5FDE;color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.pwk-toggle .pwk-play-ic svg{width:10px;height:10px;margin-left:1px}
.pwk-toggle small{color:#8B95A7;font-weight:500}
.pwk-hide{display:block;margin:10px auto 0;background:none;border:none;font-family:inherit;font-size:12px;color:#8B95A7;cursor:pointer;text-decoration:underline}
`;

const AppleLogo = ({ fill = "#000", size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden="true">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27-.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const GoogleLogo = ({ size = 11 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const MCLogo = ({ w = 14, h = 10 }) => (
  <svg width={w} height={h} viewBox="0 0 28 18" aria-hidden="true">
    <circle cx="10" cy="9" r="8" fill="#EB001B"/>
    <circle cx="18" cy="9" r="8" fill="#F79E1B" fillOpacity=".9"/>
  </svg>
);

export default function PaymentWalkthrough({
  total,                    // pass the REAL amount the customer pays, e.g. "USD 89.00". If omitted, shows neutral "your total"
  usdc,                     // optional; if omitted the confirm screen just says "your amount"
  wallet = "your wallet",   // wallet name shown on confirm screen
  forcePill = false,        // true → always render as the collapsed pill (mobile inline slot)
}) {
  const totalText = total || "your total";
  const usdcText = usdc || "your amount";
  const steps = [
    { cap: <>1 · Pick <b>MoonPay</b> and tap <b>Pay Now</b></>, dur: 3000 },
    { cap: <>2 · Sign in with your email — or one tap with <b>Apple / Google</b></>, dur: 3200 },
    { cap: <>3 · Enter the quick code sent to your email</>, dur: 2800 },
    { cap: <>4 · Name, nationality &amp; date of birth — as on your ID. Standard for regulated payments, like PayPal</>, dur: 3800 },
    { cap: <>5 · Pay how you always do — <b>Apple&nbsp;Pay, Google&nbsp;Pay or card</b></>, dur: 3200 },
    { cap: <>6 · You&apos;ll see <b>&quot;Buy USDC&quot;</b> — that&apos;s just your payment processing. Total: <b>{totalText}, fees included</b></>, dur: 4600 },
    { cap: <>✓ Done — the whole thing takes about <b>3 minutes</b></>, dur: 4200 },
  ];

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.matchMedia("(max-width: 1023px)").matches
      : false
  );
  const [open, setOpen] = useState(false);         // mobile: collapsed by default
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(!prefersReduced);

  // track viewport
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const fn = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  const collapsible = forcePill || isMobile;
  const expanded = !collapsible || open;

  // autoplay timer — only while visible & playing
  useEffect(() => {
    if (!playing || !expanded) return;
    const t = setTimeout(() => setI((v) => (v + 1) % steps.length), steps[i].dur);
    return () => clearTimeout(t);
  }, [i, playing, expanded]); // eslint-disable-line react-hooks/exhaustive-deps

  const go = (n) => setI(n);

  /* ---------- collapsed mobile pill ---------- */
  if (!expanded) {
    return (
      <>
        <style>{CSS}</style>
        <button className="pwk-toggle" onClick={() => { setOpen(true); setI(0); setPlaying(!prefersReduced); }}>
          <span className="pwk-play-ic" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
          </span>
          See how payment works&nbsp;<small>· 35 sec</small>
        </button>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="pwk-card">
        <p className="pwk-eyebrow">Watch first — 35 seconds</p>
        <p className="pwk-title">See how easy payment is</p>

        <div className="pwk-phone" aria-hidden="true">
          <div className="pwk-bartrack">
            <div
              key={i}
              className="pwk-bar"
              style={{
                animation: `pwkFill ${steps[i].dur}ms linear forwards`,
                animationPlayState: playing ? "running" : "paused",
              }}
            />
          </div>

          {/* 1 · your checkout */}
          <div className={`pwk-screen ${i === 0 ? "pwk-on" : ""}`}>
            <p className="pwk-h">Complete Your Purchase</p>
            <p className="pwk-s">🔒 Secure &amp; encrypted — select a payment provider</p>
            <div className="pwk-prov">
              <b>MoonPay</b>
              <div className="pwk-cards"><span>VISA</span><span>MC</span><span>PayPal</span><span>APay</span><span>GPay</span></div>
            </div>
            <div className="pwk-prov-dim">
              <b>Others</b>
              <div className="pwk-cards"><span>VISA</span><span>MC</span></div>
            </div>
            <div className="pwk-btn">Pay Now</div>
            <div className="pwk-tap" style={{ bottom: 16, right: 26 }} />
          </div>

          {/* 2 · sign in (dark) */}
          <div className={`pwk-screen pwk-dark ${i === 1 ? "pwk-on" : ""}`}>
            <p className="pwk-mpt">Sign in with MoonPay</p>
            <p className="pwk-mps" style={{ textAlign: "center" }}>Quick and secure</p>
            <div className="pwk-mpf">✉&nbsp; you@email.com</div>
            <div className="pwk-mpbtn" style={{ marginTop: 6 }}>Continue</div>
            <p className="pwk-or">— &nbsp;Or sign in with&nbsp; —</p>
            <div className="pwk-pills">
              <div className="pwk-pill"><AppleLogo fill="#fff" /> Apple</div>
              <div className="pwk-pill"><GoogleLogo /> Google</div>
            </div>
            <p className="pwk-foot" style={{ marginTop: "auto" }}>Powered by ● MoonPay Rails</p>
          </div>

          {/* 3 · code (dark) */}
          <div className={`pwk-screen pwk-dark ${i === 2 ? "pwk-on" : ""}`}>
            <p className="pwk-mpt">Check your email</p>
            <p className="pwk-mps" style={{ textAlign: "center" }}>Enter the code we just sent you</p>
            <div className="pwk-code"><span>4</span><span>8</span><span>2</span><span>7</span></div>
            <div className="pwk-mpbtn">Verify</div>
            <p className="pwk-foot">Powered by ● MoonPay Rails</p>
          </div>

          {/* 4 · personal info (dark) */}
          <div className={`pwk-screen pwk-dark ${i === 3 ? "pwk-on" : ""}`}>
            <p className="pwk-mpt">Your personal info</p>
            <p className="pwk-mps">Enter your details as they appear on your government-issued ID.</p>
            <div className="pwk-mpf">Alex</div>
            <div className="pwk-mpf">Carter</div>
            <div className="pwk-mpf">
              <span style={{ fontSize: 11 }}>🇩🇪</span>
              <span><small>Nationality</small>Germany</span>
              <span className="pwk-chev">▾</span>
            </div>
            <div className="pwk-mpf">14 / 03 / 1992</div>
            <div className="pwk-mpbtn">Continue</div>
            <p className="pwk-foot">Powered by ● MoonPay Rails</p>
          </div>

          {/* 5 · payment method (dark) */}
          <div className={`pwk-screen pwk-dark ${i === 4 ? "pwk-on" : ""}`}>
            <p className="pwk-mpt">How you&apos;d like to pay</p>
            <p className="pwk-mps" style={{ textAlign: "center" }}>Use what you already have</p>
            <div className="pwk-pills" style={{ marginBottom: 8 }}>
              <div className="pwk-paybtn"><AppleLogo /> Pay</div>
              <div className="pwk-paybtn"><GoogleLogo /> Pay</div>
            </div>
            <p className="pwk-or">— &nbsp;or pay with card&nbsp; —</p>
            <div className="pwk-mpf"><MCLogo /> •••• •••• •••• 9483</div>
            <div className="pwk-mpbtn">Continue</div>
            <p className="pwk-foot">Powered by ● MoonPay Rails</p>
          </div>

          {/* 6 · confirm order (light) */}
          <div className={`pwk-screen pwk-mpl ${i === 5 ? "pwk-on" : ""}`}>
            <div className="pwk-ban">Buying crypto assets can be risky and value may decrease quickly. <u>Learn more.</u></div>
            <p className="pwk-mplt">‹ &nbsp;Confirm order</p>
            <div className="pwk-coin">$</div>
            <p className="pwk-buy">Buy {usdcText}</p>
            <div className="pwk-row">
              <MCLogo w={16} h={11} />
              <span><span className="pwk-lab">Pay with</span><br /><span className="pwk-val">•••• 9483</span></span>
              <span className="pwk-r">›</span>
            </div>
            <div className="pwk-row">
              <svg width="13" height="14" viewBox="0 0 24 24" fill="none" stroke="#3375BB" strokeWidth="2.4" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 22s8-3.5 8-10V5l-8-3-8 3v7c0 6.5 8 10 8 10z"/>
              </svg>
              <span><span className="pwk-lab">Deliver to</span><br /><span className="pwk-val">{wallet}</span></span>
              <span className="pwk-r">0x84…A34dc6</span>
            </div>
            <div className="pwk-tot">
              <div><b>Total to pay</b><span>Tap to see fees</span></div>
              <div className="pwk-tr"><b>{totalText}</b><span>Fees included</span></div>
            </div>
            <div className="pwk-mplbtn">Pay with card</div>
          </div>

          {/* 7 · done */}
          <div className={`pwk-screen ${i === 6 ? "pwk-on" : ""}`}>
            <div className="pwk-check">✓</div>
            <p className="pwk-dt">Payment complete</p>
            <p className="pwk-ds">Your order is confirmed.<br />Receipt sent to your email.</p>
          </div>
        </div>

        <p className="pwk-cap" aria-live="polite">{steps[i].cap}</p>

        <div className="pwk-ctrl">
          <div className="pwk-dots" role="tablist" aria-label="Walkthrough steps">
            {steps.map((_, n) => (
              <button
                key={n}
                className={`pwk-dot ${n === i ? "pwk-on" : ""}`}
                aria-label={`Go to step ${n + 1}`}
                onClick={() => go(n)}
              />
            ))}
          </div>
          <button
            className="pwk-pp"
            aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? (
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4h4v16H7zM13 4h4v16h-4z"/></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            )}
          </button>
        </div>

        <p className="pwk-note">
          <b>Heads up:</b> on the confirm screen you&apos;ll see <b>&quot;Buy USDC&quot;</b> — USDC
          is simply the digital dollar that processes your payment. You pay <b>{totalText} total,
          fees included</b>, and nothing else. The crypto-risk warning is shown by law, but
          your price is fixed at checkout.
        </p>

        {collapsible && (
          <button className="pwk-hide" onClick={() => { setOpen(false); setPlaying(false); }}>
            Hide walkthrough
          </button>
        )}
      </div>
    </>
  );
}
