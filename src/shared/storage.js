/**
 * Hybrid storage: localStorage + optional backend API (SQLite).
 * Local is always written; backend syncs when available.
 */

const LOCAL_KEY = "crrt_calculations_v1";
const SETTINGS_KEY = "crrt_settings_v1";

function apiBase() {
  const fromEnv = import.meta.env?.VITE_API_BASE;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined" && window.location.port === "5174") {
    return "http://127.0.0.1:3851";
  }
  return "";
}

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLocal(items) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

function uid() {
  return `calc_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

async function api(path, options) {
  const base = apiBase();
  if (!base && !path.startsWith("http")) {
    // Production static host: no backend — local only
    if (!import.meta.env?.DEV) return null;
  }
  const url = `${base}${path}`;
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
      ...options,
    });
    if (!res.ok) throw new Error(`API ${res.status}`);
    if (res.status === 204) return true;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getBackendStatus() {
  const data = await api("/api/health");
  return data?.ok === true;
}

export async function listCalculations() {
  const remote = await api("/api/calculations");
  if (Array.isArray(remote)) {
    writeLocal(remote);
    return remote;
  }
  return readLocal();
}

export async function saveCalculation({ type, inputs, results, label = "" }) {
  const record = {
    id: uid(),
    type,
    inputs,
    results,
    label: label || `${type} ${new Date().toLocaleString()}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const local = readLocal();
  local.unshift(record);
  writeLocal(local);

  const remote = await api("/api/calculations", {
    method: "POST",
    body: JSON.stringify(record),
  });
  if (remote?.id) {
    // Prefer server id if created
    const synced = readLocal().map((r) => (r.id === record.id ? { ...r, ...remote } : r));
    writeLocal(synced);
    return remote;
  }
  return record;
}

export async function deleteCalculation(id) {
  const local = readLocal().filter((r) => r.id !== id);
  writeLocal(local);
  await api(`/api/calculations/${encodeURIComponent(id)}`, { method: "DELETE" });
  return true;
}

export async function deleteAllCalculations() {
  writeLocal([]);
  await api("/api/calculations", { method: "DELETE" });
  return true;
}

export function getSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function setSettings(partial) {
  const next = { ...getSettings(), ...partial };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  return next;
}

export async function exportAllData() {
  return {
    exported_at: new Date().toISOString(),
    settings: getSettings(),
    calculations: await listCalculations(),
  };
}

export async function wipeAllUserData() {
  await deleteAllCalculations();
  localStorage.removeItem(LOCAL_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  return true;
}
