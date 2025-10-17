import React, { useEffect, useState } from "react";
import logoDark from "../visuals/logo_dark.png";

export default function Splash({ onContinue }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        if (typeof onContinue === "function") onContinue();
      }, 450);
    }, 2800);
    return () => clearTimeout(t);
  }, [onContinue]);

  return (
    <div className={`splash-screen ${visible ? "enter" : "leave"}`} role="region" aria-label="Splash screen">
      <div className="splash-inner">
        <div className="splash-left">
          <div className="logo-wrap" aria-hidden>
            <img src={logoDark} alt="MediLens" className="splash-logo" />
          </div>
        </div>

        <div className="splash-right">
          <h1 className="splash-title">
            <span className="neon">MediLens</span>
          </h1>

          <p className="splash-desc">
            Rapid symptom & image triage powered by modern models — designed to augment clinicians and empower patients. Fast, beautiful, and clinical-grade UX vibes.
          </p>

          <div className="splash-actions">
            <button
              className="splash-cta"
              onClick={() => {
                setVisible(false);
                setTimeout(() => { if (typeof onContinue === "function") onContinue(); }, 450);
              }}
            >
              Get started
            </button>

            <button
              className="splash-ghost"
              onClick={() => {
                if (typeof onContinue === "function") onContinue();
              }}
            >
              Skip
            </button>
          </div>
        </div>
      </div>

      {}
      <div className="splash-bg stripe" aria-hidden />
      <div className="splash-bg glow" aria-hidden />
    </div>
  );
}
