import React, { useState } from "react";
import Lottie from "lottie-react";
import signupJson from "../visuals/signup.json";
import loadingJson from "../visuals/loading.json";
import { signup } from "../api";

export default function Signup({ onSignup }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handle(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      const res = await signup({ name, email, password });
      setLoading(false);
      if (res && (res.id || res.success || res.message)) {
        setMsg("Account created — please log in.");
        if (typeof onSignup === "function") onSignup();
      } else {
        setMsg(JSON.stringify(res) || "Signup failed");
      }
    } catch (err) {
      setLoading(false);
      setMsg(String(err && err.message ? err.message : err));
    }
  }

  return (
    <div>
      <div className="auth-grid" role="region" aria-label="signup form">
        <div className="auth-left">
          <div className="auth-lottie" aria-hidden>
            <Lottie animationData={signupJson} loop={true} />
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-heading">Create account</div>
          <div className="auth-sub">Sign up to start using MediLens — fast symptom and image analysis at your fingertips.</div>

          <form onSubmit={handle}>
            <input
              className="auth-input"
              required
              placeholder="Full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className="auth-input"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              <button className="btn primary" type="submit">Sign up</button>
            </div>

            <div className="msg-line" role="status" aria-live="polite">{msg}</div>
          </form>
        </div>
      </div>

      {}
      {loading && (
        <div className="loading-overlay" role="status" aria-live="assertive">
          <div className="overlay-lottie">
            <Lottie animationData={loadingJson} loop={true} />
          </div>
        </div>
      )}
    </div>
  );
}
