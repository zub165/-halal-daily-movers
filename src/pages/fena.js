import { mountShell, showToast, num, val } from "../shared/ui.js";
import {
  fractionalExcretionNa,
  fractionalExcretionUrea,
  fenaStatus,
  formatNum,
} from "../shared/calculations.js";
import { saveCalculation } from "../shared/storage.js";

mountShell({ active: "fena", title: "FeNa" });

function feureaHint(pct) {
  if (pct == null) return { label: "", tone: "muted" };
  if (pct < 35) return { label: "FeUrea <35% — prerenal pattern (esp. on diuretics)", tone: "ok" };
  if (pct > 50) return { label: "FeUrea >50% — ATN / intrinsic pattern", tone: "caution" };
  return { label: "FeUrea 35–50% — indeterminate", tone: "muted" };
}

function render() {
  const uNa = num("una");
  const pNa = num("pna");
  const uCr = num("ucr");
  const pCr = num("pcr");
  const uUrea = num("uurea");
  const pUrea = num("purea");

  const fena = fractionalExcretionNa({ uNa, pNa, uCr, pCr });
  const feurea = fractionalExcretionUrea({ uUrea, pUrea, uCr, pCr });
  const fenaHint = fenaStatus(fena);
  const ureaHint = feureaHint(feurea);

  document.getElementById("out-fena").textContent =
    fena == null ? "—" : `${formatNum(fena, 2)}%`;
  const fh = document.getElementById("out-fena-hint");
  fh.textContent = fenaHint.label;
  fh.className = `hint tone-${fenaHint.tone}`;

  document.getElementById("out-feurea").textContent =
    feurea == null ? "—" : `${formatNum(feurea, 1)}%`;
  const uh = document.getElementById("out-feurea-hint");
  uh.textContent = ureaHint.label;
  uh.className = `hint tone-${ureaHint.tone}`;

  document.getElementById("formula-fena").innerHTML =
    fena == null
      ? "Enter urine/plasma Na and creatinine."
      : `(${formatNum(uNa, 1)} <span class="op">×</span> ${formatNum(pCr, 2)}) <span class="op">÷</span> (${formatNum(pNa, 1)} <span class="op">×</span> ${formatNum(uCr, 1)}) <span class="op">×</span> 100 <span class="op">=</span> <strong>${formatNum(fena, 2)}%</strong>`;

  document.getElementById("formula-feurea").innerHTML =
    feurea == null
      ? "Enter urine/plasma urea and creatinine."
      : `(${formatNum(uUrea, 0)} <span class="op">×</span> ${formatNum(pCr, 2)}) <span class="op">÷</span> (${formatNum(pUrea, 1)} <span class="op">×</span> ${formatNum(uCr, 1)}) <span class="op">×</span> 100 <span class="op">=</span> <strong>${formatNum(feurea, 1)}%</strong>`;

  return { uNa, pNa, uCr, pCr, uUrea, pUrea, fena, feurea, fenaHint: fenaHint.label };
}

document.getElementById("calc-form").addEventListener("input", render);
document.getElementById("btn-save").addEventListener("click", async () => {
  const data = render();
  if (data.fena == null && data.feurea == null) {
    showToast("Enter urine and plasma labs first");
    return;
  }
  await saveCalculation({
    type: "fena",
    label: val("label") || `FeNa ${formatNum(data.fena, 2)}%`,
    inputs: {
      urine_na: data.uNa,
      plasma_na: data.pNa,
      urine_cr: data.uCr,
      plasma_cr: data.pCr,
      urine_urea: data.uUrea,
      plasma_urea: data.pUrea,
    },
    results: {
      fena_pct: data.fena,
      feurea_pct: data.feurea,
      status: data.fenaHint,
    },
  });
  showToast("Saved to local + backend");
});

render();
