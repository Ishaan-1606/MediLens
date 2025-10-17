const DEV_PROXY = "/api";
const PROD_BASE = import.meta.env.VITE_API_BASE || "https://hsc1606.onrender.com";

const BASE = (location.hostname === "localhost" || location.hostname === "127.0.0.1") ? DEV_PROXY : PROD_BASE;

function getToken() { return localStorage.getItem("token"); }
function setToken(t) { if (t) localStorage.setItem("token", t); else localStorage.removeItem("token"); }
function authHeader() { const token = getToken(); return token ? { Authorization: `Bearer ${token}` } : {}; }

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  let body = null;
  try {
    if (contentType.includes("application/json")) body = await res.json();
    else body = await res.text();
  } catch { body = await res.text().catch(() => null); }
  if (!res.ok) {
    const msg = (body && ((body.error && body.error) || (body.message && body.message) || JSON.stringify(body))) || `HTTP ${res.status} ${res.statusText}`;
    const err = new Error(msg);
    err.status = res.status; err.body = body; throw err;
  }
  return body;
}

export async function signup({ name, email, password }) {
  const res = await fetch(`${BASE}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  return handleResponse(res);
}

export async function login({ username, password }) {
  const body = new URLSearchParams();
  body.append("username", username);
  body.append("password", password);
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString()
  });
  const data = await handleResponse(res);
  if (data && data.access_token) setToken(data.access_token);
  return data;
}

export function logout() { setToken(null); }

export async function analyzeText({ symptoms, latitude, longitude }) {
  const payload = { symptoms };
  if (latitude !== undefined) payload.latitude = latitude;
  if (longitude !== undefined) payload.longitude = longitude;
  const res = await fetch(`${BASE}/analyze/text`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(payload)
  });
  return handleResponse(res);
}

export async function analyzeImage({ file, symptoms, latitude, longitude }) {
  const fd = new FormData();
  if (file) fd.append("image", file);
  if (symptoms) fd.append("symptoms", symptoms);
  if (latitude !== undefined) fd.append("latitude", String(latitude));
  if (longitude !== undefined) fd.append("longitude", String(longitude));
  const res = await fetch(`${BASE}/analyze/image`, {
    method: "POST",
    headers: { ...authHeader() },
    body: fd
  });
  return handleResponse(res);
}

export async function getHistory() {
  const res = await fetch(`${BASE}/history`, {
    method: "GET",
    headers: { "Content-Type": "application/json", ...authHeader() }
  });
  return handleResponse(res);
}
