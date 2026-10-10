import { mountShell, showToast, num, val } from "../shared/ui.js";
import {
  anionGap,
  albuminCorrectedAnionGap,
  interpretAbg,
  wintersExpectedPco2,
  deltaRatio,
  formatNum,
} from "../shared/calculations.js";
import { saveCalculation } from "../shared/storage.js";

mountShell({ active: "abg", title: "ABG" });

function render() {
  const pH = num("ph");
  const pco2 = num("pco2");
  const hco3 = num("hco3");
  const na = num("na");
  const cl = num("cl");
  const albumin = num("albumin");

  const ag = anionGap(na, cl, hco3);
  const agCorr = albuminCorrectedAnionGap(ag, albumin);
  const interp = interpretAbg({ pH, pco2, hco3, ag });
  const delta = deltaRatio(ag, hco3);
  const winters = wintersExpectedPco2(hco3);

  const primaryEl = document.getElementById("out-primary");
  primaryEl.textContent = interp.primary;
  const detail = document.getElementById("out-detail");
  detail.textContent = interp.detail;
  detail.className = `hint tone-${interp.tone}`;

  document.getElementById("out-ag").textContent =
    ag == null ? "—" : `${formatNum(ag, 1)} mEq/L`;
  document.getElementById("out-ag-corr").textContent =
    agCorr == null ? "" : `Albumin-corrected ${formatNum(agCorr, 1)} mEq/L`;
  document.getElementById("out-delta").textContent =
    delta == null ? "—" : formatNum(delta, 2);

  document.getElementById("formula-ag").innerHTML =
    ag == null
      ? "Enter Na, Cl, and HCO₃."
      : `AG <span class="op">=</span> ${formatNum(na, 1)} <span class="op">−</span> (${formatNum(cl, 1)} <span class="op">+</span> ${formatNum(hco3, 1)}) <span class="op">=</span> <strong>${formatNum(ag, 1)}</strong>`;

  document.getElementById("formula-ag-corr").innerHTML =
    agCorr == null
      ? "—"
      : `AG<sub>corr</sub> <span class="op">=</span> ${formatNum(ag, 1)} <span class="op">+</span> 2.5 <span class="op">×</span> (4 <span class="op">−</span> ${formatNum(albumin, 1)}) <span class="op">=</span> <strong>${formatNum(agCorr, 1)}</strong>`;

  document.getElementById("formula-winters").innerHTML =
    winters == null
      ? "—"
      : `Expected PCO₂ <span class="op">=</span> 1.5 <span class="op">×</span> ${formatNum(hco3, 1)} <span class="op">+</span> 8 <span class="op">=</span> <strong>${formatNum(winters.expected, 1)}</strong> (range ${formatNum(winters.low, 1)}–${formatNum(winters.high, 1)}); measured ${formatNum(pco2, 1)}`;

  document.getElementById("formula-delta").innerHTML =
    delta == null
      ? "—"
      : `Δ/Δ <span class="op">=</span> (${formatNum(ag, 1)} <span class="op">−</span> 12) <span class="op">÷</span> (24 <span class="op">−</span> ${formatNum(hco3, 1)}) <span class="op">=</span> <strong>${formatNum(delta, 2)}</strong>`;

  return { pH, pco2, hco3, na, cl, albumin, ag, agCorr, delta, interp };
}

document.getElementById("calc-form").addEventListener("input", render);
document.getElementById("btn-save").addEventListener("click", async () => {
  const data = render();
  if (data.ag == null) {
    showToast("Enter ABG and electrolytes first");
    return;
  }
  await saveCalculation({
    type: "abg",
    label: val("label") || `ABG ${data.interp.primary}`,
    inputs: {
      pH: data.pH,
      pco2: data.pco2,
      hco3: data.hco3,
      na: data.na,
      cl: data.cl,
      albumin: data.albumin,
    },
    results: {
      primary: data.interp.primary,
      detail: data.interp.detail,
      anion_gap: data.ag,
      anion_gap_corrected: data.agCorr,
      delta_ratio: data.delta,
    },
  });
  showToast("Saved to local + backend");
});

render();
