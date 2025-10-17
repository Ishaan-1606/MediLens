import React, { useState } from "react";
import Header from "./components/Header";
import Splash from "./components/Splash";
import Signup from "./components/Signup";
import Login from "./components/Login";
import AnalyzeText from "./components/AnalyzeText";
import AnalyzeImage from "./components/AnalyzeImage";
import History from "./components/History";

export default function App() {
  const [view, setView] = useState("splash");
  const [user, setUser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setView("login");
  }

  function handleLogin(u) {
    setUser(u);
    localStorage.setItem("user", JSON.stringify(u));
    setView("text");
  }

  function afterSplash() {
    if (localStorage.getItem("user")) {
      setView("text");
    } else {
      setView("login");
    }
  }

  return (
    <div className="app">
      <Header active={view} onNavigate={setView} onLogout={handleLogout} user={user} />

      <main className="app-main" role="main">
        {}
        {view === "splash" && <Splash onContinue={afterSplash} />}

        {}
        {view !== "splash" && (
          <div className="auth-container">
            {view === "signup" && <Signup onSignup={() => setView("login")} />}
            {view === "login" && <Login onLogin={handleLogin} />}
            {view === "text" && <AnalyzeText />}
            {view === "image" && <AnalyzeImage />}
            {view === "history" && <History />}
          </div>
        )}
      </main>

      <footer style={{ padding: 18, textAlign: "center", color: "rgba(255,255,255,0.35)" }}>
        <small>Proof-of-concept only — not medical advice. See API docs.</small>
      </footer>
    </div>
  );
}
