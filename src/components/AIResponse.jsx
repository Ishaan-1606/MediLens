import React from "react";
export default function AIResponse({ data, className = "" }) {
  if (!data) return null;

  const conditions = data.possible_conditions || [];
  const steps = data.recommended_next_steps || data.recommendations || "";
  const disclaimer = data.disclaimer || "";
  const hospitals = data.nearby_hospitals || [];

  function distanceBadge(meters) {
    if (meters == null || isNaN(meters)) return { color: "#9CA3AF", label: "—" };
    if (meters <= 1200) return { color: "#10b981", label: `${Math.round(meters)} m` };
    if (meters <= 2500) return { color: "#f59e0b", label: `${Math.round(meters)} m` };
    return { color: "#ef4444", label: `${Math.round(meters)} m` };
  }

  const containerStyle = {
    marginTop: 28,
    borderRadius: 12,
    background: "linear-gradient(180deg, rgba(20,20,20,0.6), rgba(10,10,10,0.55))",
    border: "1px solid rgba(255,255,255,0.03)",
    padding: 20,
    boxShadow: "0 18px 40px rgba(0,0,0,0.7)",
    color: "#e6fff2"
  };

  const heading = { fontSize: 20, fontWeight: 800, marginBottom: 8, color: "#eaffee" };
  const sub = { color: "#bfffcf", marginBottom: 14 };

  return (
    <section className={`ai-response ${className}`} style={containerStyle}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div>
          <div style={heading}>🩺 Analysis result</div>
          <div style={sub}>Clear, compact interpretation of the model output — for informational use only.</div>
        </div>

        <div style={{ textAlign: "right", color: "rgba(255,255,255,0.55)", fontSize: 13 }}>
          <div>Confidence summary</div>
          <div style={{ marginTop: 6, fontWeight: 700 }}>{conditions.length} possible condition{conditions.length !== 1 ? "s" : ""}</div>
        </div>
      </div>

      {}
      <div style={{ marginTop: 16 }}>
        <h3 style={{ margin: "6px 0 10px 0", color: "#ecffef", fontSize: 16 }}>🔎 Possible conditions</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {conditions.length === 0 && (
            <div style={{ color: "#bfffcf" }}>No suspected conditions returned by the model.</div>
          )}

          {conditions.map((c, i) => {
            const conf = c.confidence_score ?? c.confidence ?? "";
            return (
              <div key={i} style={{
                padding: 12,
                borderRadius: 10,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.02)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div style={{ fontWeight: 700, color: "#eaffee" }}>{c.condition || c.name || "Unknown"}</div>
                  <div style={{ fontSize: 13, color: "#9ff0cc", fontWeight: 800 }}>{conf}</div>
                </div>
                {}
                <div style={{ marginTop: 8, color: "rgba(255,255,255,0.72)" }}>
                  {c.note || c.excerpt || ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {}
      {steps && (
        <div style={{ marginTop: 18 }}>
          <h3 style={{ margin: "6px 0 10px 0", color: "#ecffef", fontSize: 16 }}>➡️ Recommended next steps</h3>
          {}
          {typeof steps === "string"
            ? steps.split(/\n{1,}|\d+\./).filter(s => s.trim()).map((p, idx) => (
                <p key={idx} style={{ marginTop: 8, color: "#dfffe8", lineHeight: 1.6 }}>{p.trim()}</p>
              ))
            : Array.isArray(steps)
            ? steps.map((p, idx) => <p key={idx} style={{ marginTop: 8, color: "#dfffe8" }}>{p}</p>)
            : <p style={{ color: "#dfffe8" }}>{String(steps)}</p>
          }
        </div>
      )}

      {}
      {hospitals && hospitals.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <h3 style={{ margin: "6px 0 10px 0", color: "#ecffef", fontSize: 16 }}>🏥 Nearby hospitals & clinics</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {hospitals.map((h, i) => {
              const dist = h.distance_meters ?? h.distance ?? null;
              const d = distanceBadge(dist);
              return (
                <div key={i} style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: 12,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.01)",
                  border: "1px solid rgba(255,255,255,0.02)"
                }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 10, height: 10, borderRadius: 999, background: d.color, marginTop: 6 }} aria-hidden />
                    <div>
                      <div style={{ fontWeight: 700, color: "#eaffee" }}>{h.name}</div>
                      <div style={{ color: "#bfffcf", fontSize: 13 }}>{h.address}</div>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: d.color }}>{d.label}</div>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{(dist && `${(dist/1000).toFixed(1)} km`) || ""}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {}
      {disclaimer && (
        <div style={{ marginTop: 16, color: "rgba(255,255,255,0.6)", fontSize: 13 }}>
          <strong>Disclaimer:</strong> {disclaimer}
        </div>
      )}
    </section>
  );
}
