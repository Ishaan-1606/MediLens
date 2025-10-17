import React, { useState } from "react";
import Lottie from "lottie-react";
import loadingJson from "../visuals/loading.json";
import err404Json from "../visuals/err404.json";
import hospitalJson from "../visuals/hospital.json";
import { analyzeImage } from "../api";
import AIResponse from "./AIResponse";

export default function AnalyzeImage() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  function handleFileChange(e) {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
    setResult(null);
    setMsg("");
    if (f) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  }

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

    if (!file) {
      setMsg("Choose an image file first");
      return;
    }

    setLoading(true);
    try {
      const res = await analyzeImage({
        file,
        symptoms,
        latitude: latitude === "" ? undefined : Number(latitude),
        longitude: longitude === "" ? undefined : Number(longitude)
      });
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
            Please log in or sign up to analyze images. Authentication is required to access MediLens analysis.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{ paddingTop: 12 }}>
      <div className="auth-grid" role="region" aria-label="analyze image">
        {}
        <div className="auth-left" style={{ alignItems: "flex-start" }}>
          <div style={{
            width: 320,
            maxWidth: "100%",
            minHeight: 280,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 8,
            overflow: "hidden",
            background: "transparent"
          }}>
            {!previewUrl ? (
              <div style={{ width: 320, maxWidth: "100%" }}>
                <Lottie animationData={hospitalJson} loop={true} />
              </div>
            ) : (
              <img
                src={previewUrl}
                alt="preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  borderRadius: 8,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)"
                }}
              />
            )}
          </div>
        </div>

        {}
        <div className="auth-right">
          <div className="auth-heading">Analyze (image)</div>
          <div className="auth-sub">Upload a photo (skin lesion, rash, wound, etc.) and an optional description. Provide location to improve contextual relevance.</div>

          <form onSubmit={handleSubmit}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="auth-input"
              style={{ padding: 10 }}
            />

            <textarea
              className="auth-input"
              placeholder="Optional description: location on body, duration, other symptoms..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              rows={4}
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

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <button className="btn primary" type="submit">Upload & Analyze</button>
              <button
                type="button"
                className="btn ghost"
                onClick={() => {
                  setFile(null);
                  setPreviewUrl(null);
                  setSymptoms("");
                  setLatitude("");
                  setLongitude("");
                  setMsg("");
                  setResult(null);
                }}
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
