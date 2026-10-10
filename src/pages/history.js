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
  document.querySelectorAll("[data-sync]").forEach((sync) => {
    sync.classList.toggle("online", online);
    const label = sync.querySelector(".label");
    if (label) label.textContent = online ? "Backend synced" : "Local storage";
  });

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
      <td><button class="btn btn-ghost btn-sm" data-del="${escapeHtml(item.id)}">Delete</button></td>
    `;
    tbody.appendChild(tr);
  }
}

function summarize(item) {
  const r = item.results || {};
  if (item.type === "abg") return `${r.primary || "ABG"} · AG ${r.anion_gap?.toFixed?.(1) ?? r.anion_gap}`;
  if (item.type === "osmolality")
    return `Osm ${r.calculated_osm?.toFixed?.(1)} · gap ${r.osmolal_gap?.toFixed?.(1)}`;
  if (item.type === "egfr")
    return `eGFR ${r.egfr_ckd_epi_2021?.toFixed?.(1)} · CrCl ${r.crcl_cockcroft_gault?.toFixed?.(1)}`;
  if (item.type === "fena")
    return `FeNa ${r.fena_pct?.toFixed?.(2)}% · FeUrea ${r.feurea_pct?.toFixed?.(1)}%`;
  if (item.type === "electrolytes")
    return `Na corr ${r.corrected_na_1_6?.toFixed?.(1)} · Ca corr ${r.corrected_ca?.toFixed?.(1)}`;
  if (item.type === "dose") return `${r.dose_ml_kg_hr?.toFixed?.(1) ?? r.dose_ml_kg_hr} mL/kg/h`;
  if (item.type === "effluent") return `QE ${r.effluent_ml_hr} · dose ${r.dose_ml_kg_hr?.toFixed?.(1)}`;
  if (item.type === "filtration") return `FF ${r.filtration_fraction_pct?.toFixed?.(1)}%`;
  if (item.type === "dilution") return `Corrected ${r.corrected_dose?.toFixed?.(1)}`;
  if (item.type === "citrate") return `Citrate ${r.suggested_citrate_ml_hr} mL/h`;
  if (item.type === "fluid") return `Net ${r.net_ml} mL`;
  if (item.type === "steal_quiz")
    return `Quiz ${r.correct ?? 0}/${r.answered ?? 0} (${r.score_pct ?? 0}%)`;
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
