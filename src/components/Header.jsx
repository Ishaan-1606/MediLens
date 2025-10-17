import React from "react";
import logoDark from "../visuals/logo_dark.png";

function NavButton({ id, label, active, onClick }) {
  const isActive = active === id;
  const baseStyle = {
    position: "relative",
    padding: "8px 14px",
    borderRadius: 999,
    fontWeight: 600,
    cursor: "pointer",
    border: "1px solid transparent",
    background: "transparent",
    color: "#dfffe8",
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    transition: "all 160ms ease"
  };

  const activeStyle = isActive
    ? {
        background: "rgba(16,185,129,0.09)",
        color: "#10b981",
        borderColor: "rgba(16,185,129,0.12)",
        boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.02)"
      }
    : { color: "#dfffe8" };

  const blipStyle = {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "#10b981",
    boxShadow: "0 6px 12px rgba(16,185,129,0.12)"
  };

  return (
    <button
      onClick={onClick}
      aria-current={isActive ? "page" : undefined}
      style={{ ...baseStyle, ...activeStyle }}
      className="btn"
    >
      {}
      {isActive && <span style={blipStyle} aria-hidden />}
      <span style={{ fontSize: 14 }}>{label}</span>
    </button>
  );
}

export default function Header({ active, onNavigate, onLogout, user }) {
  return (
    <header className="app-header" role="banner">
      <div className="header-left" style={{ gap: 12 }}>
        <div
          className="header-logo"
          aria-hidden
          style={{ width: 48, height: 48, borderRadius: 10, overflow: "hidden" }}
        >
          <img
            src={logoDark}
            alt="MediLens logo"
            style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
          />
        </div>

        <div>
          <div className="header-title" style={{ fontSize: 18, fontWeight: 800, color: "#bfffcf" }}>
            MediLens
          </div>
          <div className="header-sub" style={{ fontSize: 11 }}>Symptom Checker</div>
        </div>
      </div>

      <nav className="header-nav" role="navigation" aria-label="main" style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <NavButton id="text" label="Text" active={active} onClick={() => onNavigate && onNavigate("text")} />
        <NavButton id="image" label="Image" active={active} onClick={() => onNavigate && onNavigate("image")} />
        <NavButton id="history" label="History" active={active} onClick={() => onNavigate && onNavigate("history")} />

        {!user ? (
          <>
            <NavButton id="signup" label="Signup" active={active} onClick={() => onNavigate && onNavigate("signup")} />
            <NavButton id="login" label="Login" active={active} onClick={() => onNavigate && onNavigate("login")} />
          </>
        ) : (
          <button
            className="btn"
            style={{
              padding: "8px 14px",
              borderRadius: 999,
              fontWeight: 600,
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.04)",
              background: "transparent",
              color: "#dfffe8"
            }}
            onClick={() => { if (onLogout) onLogout(); }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
