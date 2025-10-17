import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import loadingJson from "../visuals/loading.json";
import err404Json from "../visuals/err404.json";
import { getHistory } from "../api";
import AIResponse from "./AIResponse";

export default function History() {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!isLoggedIn) return;
      setLoading(true);
      setMsg("");
      try {
        const data = await getHistory();
        if (!mounted) return;
        if (Array.isArray(data)) setHistory(data.reverse()); 
        else if (data && Array.isArray(data.history)) setHistory(data.history.reverse());
        else setHistory([]);
      } catch (err) {
        setMsg(String(err && err.message ? err.message : err));
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [isLoggedIn]);
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
            Please log in or sign up to see your analysis history.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{ paddingTop: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "#eaffee" }}>History</div>
        <div style={{ color: "#bfffcf" }}>{history ? `${history.length} item${history.length !== 1 ? "s" : ""}` : ""}</div>
      </div>

      {loading && (
        <div className="loading-overlay" role="status" aria-live="assertive">
          <div className="overlay-lottie">
            <Lottie animationData={loadingJson} loop={true} />
          </div>
        </div>
      )}

      {msg && <div className="msg-line" style={{ marginBottom: 12 }}>{msg}</div>}

      {history && history.length === 0 && (
        <div style={{ padding: 20, borderRadius: 12, background: "rgba(255,255,255,0.01)", color: "#bfffcf" }}>
          No history yet — run an analysis to create your first item.
        </div>
      )}

      {history && history.length > 0 && (
        <div style={{ display: "grid", gap: 20 }}>
          {history.map((item, idx) => {
            const res = item.response || item.result || item.analysis || item;
            const imageUrl = item.image_url || item.image || (res && res.image_url) || null;
            const time = item.created_at || item.timestamp || item.date || null;

            return (
              <article key={item.id || idx} style={{
                borderRadius: 12,
                padding: 18,
                background: "linear-gradient(180deg, rgba(20,20,20,0.6), rgba(10,10,10,0.55))",
                border: "1px solid rgba(255,255,255,0.03)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontWeight: 800, color: "#eaffee" }}>{item.title || item.symptoms || "Analysis"}</div>
                  <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>{time ? new Date(time).toLocaleString() : ""}</div>
                </div>

                {}
                {imageUrl && (
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                    <img
                      src={imageUrl}
                      alt="history preview"
                      style={{ maxWidth: "80%", height: "auto", borderRadius: 10, border: "1px solid rgba(255,255,255,0.04)" }}
                    />
                  </div>
                )}

                {}
                {item.symptoms && (
                  <div style={{ marginBottom: 12, color: "#bfffcf" }}>
                    <strong>Symptoms:</strong> {item.symptoms}
                  </div>
                )}

                {}
                <AIResponse data={res} />

                {}
                <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                  {}
                  <button className="btn ghost" onClick={() => { navigator.clipboard && navigator.clipboard.writeText(JSON.stringify(res || {}, null, 2)); }}>
                    Copy JSON
                  </button>
                  <a className="btn ghost" href={imageUrl || "#"} onClick={(e) => { if (!imageUrl) e.preventDefault(); }} target="_blank" rel="noreferrer">Open Image</a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
