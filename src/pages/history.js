import { mountShell, showToast, pageUrl } from "../shared/ui.js";
import {
  listCalculations,
  deleteCalculation,
  deleteAllCalculations,
  getBackendStatus,
} from "../shared/storage.js";

mountShell({ active: "history", title: "History" });

const tbody = document.getElementById("rows");
const empty = document.getElementById("empty");

async function refresh() {
  const items = await listCalculations();
  const online = await getBackendStatus();
  const sync = document.getElementById("sync-status");
  if (sync) {
    sync.classList.toggle("online", online);
    sync.querySelector(".label").textContent = online
      ? "Backend synced"
      : "Local storage";
  }

  tbody.innerHTML = "";
  if (!items.length) {
    empty.hidden = false;
    return;
  }
  empty.hidden = true;
  for (const item of items) {
    const tr = document.createElement("tr");
    const when = new Date(item.created_at).toLocaleString();
    const summary = summarize(item);
    tr.innerHTML = `
      <td><strong>${escapeHtml(item.type)}</strong><div class="tone-muted">${escapeHtml(
        item.label || ""
      )}</div></td>
      <td>${escapeHtml(summary)}</td>
      <td>${escapeHtml(when)}</td>
      <td><button class="btn btn-ghost" data-del="${escapeHtml(item.id)}">Delete</button></td>
    `;
    tbody.appendChild(tr);
  }
}

function summarize(item) {
  const r = item.results || {};
  if (item.type === "dose") return `${r.dose_ml_kg_hr?.toFixed?.(1) ?? r.dose_ml_kg_hr} mL/kg/h`;
  if (item.type === "effluent") return `QE ${r.effluent_ml_hr} · dose ${r.dose_ml_kg_hr?.toFixed?.(1)}`;
  if (item.type === "filtration") return `FF ${r.filtration_fraction_pct?.toFixed?.(1)}%`;
  if (item.type === "dilution") return `Corrected ${r.corrected_dose?.toFixed?.(1)}`;
  if (item.type === "citrate") return `Citrate ${r.suggested_citrate_ml_hr} mL/h`;
  if (item.type === "fluid") return `Net ${r.net_ml} mL`;
  return JSON.stringify(r).slice(0, 80);
}

function escapeHtml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

tbody.addEventListener("click", async (e) => {
  const btn = e.target.closest("[data-del]");
  if (!btn) return;
  await deleteCalculation(btn.getAttribute("data-del"));
  showToast("Deleted");
  refresh();
});

document.getElementById("btn-clear").addEventListener("click", async () => {
  if (!confirm("Delete all saved calculations from local storage and backend?")) return;
  await deleteAllCalculations();
  showToast("All calculations deleted");
  refresh();
});

document.getElementById("btn-privacy").addEventListener("click", () => {
  window.location.href = pageUrl("privacy.html");
});

refresh();
