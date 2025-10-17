import React, { useState } from "react";
import Lottie from "lottie-react";
import loadingJson from "../visuals/loading.json";
import err404Json from "../visuals/err404.json";
import hospitalJson from "../visuals/hospital.json";
import { analyzeText } from "../api";
import AIResponse from "./AIResponse";

export default function AnalyzeText() {
  const [symptoms, setSymptoms] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  function fillLocationFromBrowser() {
    setMsg("");
    if (!("geolocation" in navigator)) {
      setMsg("Geolocation not supported by this browser");
      return;
    }
    setMsg("Requesting location...");
    navigator.geolocation.getCurrentPosition(
      (p) => {
        setLatitude(String(p.coords.latitude));
        setLongitude(String(p.coords.longitude));
        setMsg("Location set");
      },
      (err) => {
        if (err.code === 1) setMsg("Permission denied for location");
        else setMsg("Error obtaining location");
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 }
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setResult(null);

    if (!symptoms || symptoms.trim().length < 3) {
      setMsg("Please describe symptoms in a few words.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        symptoms,
        latitude: latitude === "" ? undefined : Number(latitude),
        longitude: longitude === "" ? undefined : Number(longitude)
      };
      const res = await analyzeText(payload);
      setResult(res);
      setMsg("");
    } catch (err) {
      setMsg(String(err && err.message ? err.message : err));
    } finally {
      setLoading(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="auth-container" style={{ paddingTop: 12 }}>
        <div style={{ maxWidth: 720, margin: "28px auto", textAlign: "center" }}>
          <div style={{ maxWidth: 300, margin: "0 auto" }}>
            <Lottie animationData={err404Json} loop={true} />
          </div>

          <div style={{ marginTop: 18, color: "#9ff0cc", fontWeight: 700, fontSize: 18 }}>
            You are not logged in
          </div>
          <div style={{ marginTop: 8, color: "#bfffcf" }}>
            Please log in or sign up to use the MediLens text analysis features.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{ paddingTop: 12 }}>
      <div className="auth-grid" role="region" aria-label="analyze text">
        <div className="auth-left" style={{ alignItems: "flex-start" }}>
          <div style={{ width: 320, maxWidth: "100%" }}>
            <Lottie animationData={hospitalJson} loop={true} />
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-heading">Analyze (text)</div>
          <div className="auth-sub">Describe symptoms in plain text. Optionally share your location to improve results.</div>

          <form onSubmit={handleSubmit}>
            <textarea
              className="auth-input"
              placeholder="Describe symptoms in plain text"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={6}
            />

            <div style={{ marginTop: 10, marginBottom: 8, color: "rgba(255,255,255,0.75)" }}>Location (optional)</div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button type="button" className="btn ghost" onClick={fillLocationFromBrowser}>Get current location</button>
              <div style={{ alignSelf: "center", color: "rgba(255,255,255,0.6)" }}>
                {latitude && longitude ? `Lat ${parseFloat(latitude).toFixed(4)}, Lon ${parseFloat(longitude).toFixed(4)}` : "No location"}
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input
                className="auth-input"
                placeholder="Latitude (manual)"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                style={{ padding: 10 }}
              />
              <input
                className="auth-input"
                placeholder="Longitude (manual)"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                style={{ padding: 10 }}
              />
            </div>

            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button className="btn primary" type="submit">Analyze</button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => { setSymptoms(""); setLatitude(""); setLongitude(""); setMsg(""); setResult(null); }}
              >
                Reset
              </button>
            </div>

            <div className="msg-line" role="status" aria-live="polite">{msg}</div>
          </form>
        </div>
      </div>

      {}
      {result && (
        <div style={{ maxWidth: 1200, margin: "28px auto 0 auto" }}>
          <AIResponse data={result} />
        </div>
      )}

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
