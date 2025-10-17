import React, { useState } from "react";
import Lottie from "lottie-react";
import loginJson from "../visuals/login.json";
import loadingJson from "../visuals/loading.json";
import { login } from "../api";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState(""); // 'success', 'error', or ''
  const [loading, setLoading] = useState(false);

  function getErrorMessage(err) {
    // Parse error to show user-friendly message
    if (!err) return "Login failed. Please try again.";
    
    const errStr = String(err);
    
    if (errStr.includes("Incorrect email or password")) {
      return "Incorrect email or password. Please try again.";
    }
    if (errStr.includes("not found") || errStr.includes("404")) {
      return "User not found. Please check your email and try again.";
    }
    if (errStr.includes("network") || errStr.includes("Network")) {
      return "Network error. Please check your connection and try again.";
    }
    
    return "Login failed. Please try again.";
  }

  async function handle(e) {
    e.preventDefault();
    setMsg("");
    setMsgType("");
    setLoading(true);
    try {
      const res = await login({ username, password });
      setLoading(false);
      if (res && res.access_token) {
        localStorage.setItem("token", res.access_token);
        const user = { email: username };
        localStorage.setItem("user", JSON.stringify(user));
        setMsgType("success");
        setMsg("Logged in successfully!");
        if (typeof onLogin === "function") onLogin(user);
      } else {
        setMsgType("error");
        setMsg(getErrorMessage(res?.detail || "Login failed"));
      }
    } catch (err) {
      setLoading(false);
      setMsgType("error");
      setMsg(getErrorMessage(err?.message || err));
    }
  }

  return (
    <div>
      <div className="auth-grid" role="region" aria-label="login form">
        <div className="auth-left">
          <div className="auth-lottie" aria-hidden>
            <Lottie animationData={loginJson} loop={true} />
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-heading">Login</div>
          <div className="auth-sub">Sign in to access MediLens and view your previous analyses.</div>

          <form onSubmit={handle}>
            <input
              className="auth-input"
              required
              placeholder="Email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              className="auth-input"
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="auth-actions">
              <button className="btn primary" type="submit">Login</button>
            </div>

            {msg && (
              <div 
                className={`msg-line ${msgType}`} 
                role="status" 
                aria-live="polite"
              >
                <span className="msg-icon">
                  {msgType === "error" && "⚠"}
                  {msgType === "success" && "✓"}
                </span>
                <span className="msg-text">{msg}</span>
              </div>
            )}
          </form>
        </div>
      </div>

      {loading && (
        <div className="loading-overlay" role="status" aria-live="assertive">
          <div className="overlay-lottie">
            <Lottie animationData={loadingJson} loop={true} />
          </div>
        </div>
      )}

      <style>{`
        .msg-line {
          margin-top: 16px;
          padding: 12px 14px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 500;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .msg-line.error {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .msg-line.success {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .msg-icon {
          font-size: 16px;
          font-weight: bold;
          flex-shrink: 0;
        }

        .msg-text {
          flex: 1;
        }
      `}</style>
    </div>
  );
}