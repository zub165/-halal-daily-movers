import { mountShell, showToast, num, val } from "../shared/ui.js";
import {
  recirculationWorked,
  recirculationStatus,
  formatNum,
} from "../shared/calculations.js";
import { saveCalculation } from "../shared/storage.js";

mountShell({ active: "recirculation", title: "Recirculation" });

const TAPE_KEY = "crrt_recirc_tape_v1";
/** @type {Array<{id:string,at:string,label:string,s:number,a:number,v:number,pct:number|null,steps:any[]}>} */
let pinned = loadPinned();

function loadPinned() {
  try {
    const raw = localStorage.getItem(TAPE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistPinned() {
  localStorage.setItem(TAPE_KEY, JSON.stringify(pinned));
}

function stepToneClass(tone) {
  return `step-tone-${tone || "teal"}`;
}

function renderLiveSteps(steps) {
  const ol = document.getElementById("live-steps");
  if (!steps.length) {
    ol.innerHTML = `<li class="step-row step-row--empty">Enter S, A, and V to build the worked tape.</li>`;
    return;
  }
  ol.innerHTML = steps
    .map(
      (st, i) => `
      <li class="step-row ${stepToneClass(st.tone)} ${st.status === "error" ? "step-row--error" : ""} ${st.status === "pending" ? "step-row--pending" : ""}">
        <span class="step-num">${String(i + 1).padStart(2, "0")}</span>
        <div class="step-body">
          <div class="step-label">${st.label}</div>
          <div class="step-expr">${st.expression}</div>
        </div>
        <div class="step-value">${st.value == null ? "—" : typeof st.value === "number" && st.id === "pct" ? `${formatNum(st.value, 1)}%` : formatNum(st.value, st.id === "ratio" ? 4 : 2)}</div>
      </li>`
    )
    .join("");
}

function renderHistory() {
  const wrap = document.getElementById("tape-history");
  const list = document.getElementById("tape-history-list");
  const meta = document.getElementById("tape-meta");
  if (!pinned.length) {
    wrap.hidden = true;
    meta.textContent = "Live worked steps · pin to keep history";
    list.innerHTML = "";
    return;
  }
  wrap.hidden = false;
  meta.textContent = `${pinned.length} pinned run${pinned.length === 1 ? "" : "s"} on tape`;
  list.innerHTML = pinned
    .map(
      (run) => `
      <article class="tape-run">
        <header class="tape-run__head">
          <strong>${run.label}</strong>
          <span>${run.at} · S=${formatNum(run.s, 1)} A=${formatNum(run.a, 1)} V=${formatNum(run.v, 1)} → <em>${run.pct == null ? "—" : formatNum(run.pct, 1) + "%"}</em></span>
        </header>
        <ol class="step-tape step-tape--compact">
          ${run.steps
            .map(
              (st, i) => `
            <li class="step-row ${stepToneClass(st.tone)}">
              <span class="step-num">${i + 1}</span>
              <div class="step-body">
                <div class="step-label">${st.label}</div>
                <div class="step-expr">${st.expression}</div>
              </div>
            </li>`
            )
            .join("")}
        </ol>
      </article>`
    )
    .join("");
}

function render() {
  const s = num("s");
  const a = num("a");
  const v = num("v");
  const worked = recirculationWorked({ s, a, v });
  const status = recirculationStatus(worked.pct);

  document.getElementById("out-pct").textContent =
    worked.pct == null ? "—" : `${formatNum(worked.pct, 1)}%`;
  document.getElementById("out-numer").textContent =
    worked.numer == null ? "—" : formatNum(worked.numer, 2);
  document.getElementById("out-denom").textContent =
    worked.denom == null ? "—" : formatNum(worked.denom, 2);

  const hint = document.getElementById("out-hint");
  hint.textContent = worked.error || status.label;
  hint.className = `hint tone-${worked.error ? "warn" : status.tone}`;

  renderLiveSteps(worked.steps);

  document.getElementById("formula-numer").innerHTML =
    worked.numer == null
      ? "—"
      : `${formatNum(s, 2)} <span class="op">−</span> ${formatNum(a, 2)} <span class="op">=</span> <strong>${formatNum(worked.numer, 2)}</strong>`;
  document.getElementById("formula-denom").innerHTML =
    worked.denom == null
      ? "—"
      : `${formatNum(s, 2)} <span class="op">−</span> ${formatNum(v, 2)} <span class="op">=</span> <strong>${formatNum(worked.denom, 2)}</strong>`;
  document.getElementById("formula-ratio").innerHTML =
    worked.ratio == null
      ? worked.error || "—"
      : `${formatNum(worked.numer, 2)} <span class="op">÷</span> ${formatNum(worked.denom, 2)} <span class="op">=</span> <strong>${formatNum(worked.ratio, 4)}</strong>`;
  document.getElementById("formula-pct").innerHTML =
    worked.pct == null
      ? "—"
      : `${formatNum(worked.ratio, 4)} <span class="op">×</span> 100 <span class="op">=</span> <strong>${formatNum(worked.pct, 1)}%</strong>`;

  return { s, a, v, worked, status };
}

document.getElementById("calc-form").addEventListener("input", render);

document.getElementById("btn-pin").addEventListener("click", () => {
  const { s, a, v, worked } = render();
  if (worked.pct == null) {
    showToast(worked.error || "Complete S, A, V first");
    return;
  }
  const run = {
    id: crypto.randomUUID(),
    at: new Date().toLocaleString(),
    label: val("label") || `Recirc ${formatNum(worked.pct, 1)}%`,
    s,
    a,
    v,
    pct: worked.pct,
    steps: worked.steps,
  };
  pinned = [run, ...pinned].slice(0, 20);
  persistPinned();
  renderHistory();
  showToast("Pinned to step tape");
});

document.getElementById("btn-clear-tape").addEventListener("click", () => {
  pinned = [];
  persistPinned();
  renderHistory();
  showToast("Step tape cleared");
});

document.getElementById("btn-save").addEventListener("click", async () => {
  const { s, a, v, worked, status } = render();
  if (worked.pct == null) {
    showToast(worked.error || "Enter S, A, and V");
    return;
  }
  await saveCalculation({
    type: "recirculation",
    label: val("label") || `Recirc ${formatNum(worked.pct, 1)}%`,
    inputs: { s, a, v },
    results: {
      recirculation_pct: worked.pct,
      numerator: worked.numer,
      denominator: worked.denom,
      ratio: worked.ratio,
      status: status.label,
      steps: worked.steps,
    },
  });
  showToast("Saved recirculation run");
});

render();
renderHistory();
