import { mountShell, showToast, num, val } from "../shared/ui.js";
import {
  suggestCitrateRate,
  citrateConcentrationInCircuit,
  calciumToIonizedRatio,
  formatNum,
} from "../shared/calculations.js";
import { saveCalculation } from "../shared/storage.js";

mountShell({ active: "citrate", title: "Citrate & Calcium" });

function render() {
  const bfr = num("bfr");
  const ratio = num("ratio") || 1.5;
  const citrateRate = num("citrate") || suggestCitrateRate(bfr, ratio);
  const circuitIca = num("circuit_ica");
  const systemicIca = num("systemic_ica");
  const totalCa = num("total_ca");
  const conc = citrateConcentrationInCircuit(citrateRate, bfr);
  const caRatio = calciumToIonizedRatio(totalCa, systemicIca);

  document.getElementById("out-suggest").textContent = `${formatNum(
    suggestCitrateRate(bfr, ratio),
    0
  )} mL/h`;
  document.getElementById("out-conc").textContent =
    conc == null ? "—" : `${formatNum(conc, 2)} mmol/L`;
  document.getElementById("out-ca-ratio").textContent =
    caRatio == null ? "—" : formatNum(caRatio, 2);

  let circuitHint = "Target circuit iCa often ~0.25–0.45 mmol/L (protocol-specific)";
  let circuitTone = "muted";
  if (circuitIca > 0) {
    if (circuitIca < 0.25) {
      circuitHint = "Circuit iCa low — review citrate per protocol";
      circuitTone = "caution";
    } else if (circuitIca <= 0.45) {
      circuitHint = "Circuit iCa in common target band";
      circuitTone = "ok";
    } else {
      circuitHint = "Circuit iCa high — anticoagulation may be inadequate";
      circuitTone = "warn";
    }
  }
  const cHint = document.getElementById("out-circuit-hint");
  cHint.textContent = circuitHint;
  cHint.className = `hint tone-${circuitTone}`;

  let caHint = "Total:iCa >2.5 may suggest citrate accumulation";
  let caTone = "muted";
  if (caRatio != null) {
    if (caRatio > 2.5) {
      caHint = "Ratio >2.5 — evaluate for citrate accumulation";
      caTone = "warn";
    } else {
      caHint = "Ratio ≤2.5 — accumulation less likely";
      caTone = "ok";
    }
  }
  const rHint = document.getElementById("out-ratio-hint");
  rHint.textContent = caHint;
  rHint.className = `hint tone-${caTone}`;

  const suggested = suggestCitrateRate(bfr, ratio);
  const bloodMlHr = bfr * 60;
  document.getElementById("formula-citrate-worked").innerHTML =
    `Citrate <span class="op">≈</span> ${formatNum(bfr, 0)} <span class="op">×</span> ${formatNum(ratio, 1)} <span class="op">=</span> <strong>${formatNum(suggested, 0)} mL/h</strong>`;
  document.getElementById("formula-conc-worked").innerHTML =
    conc == null
      ? "Enter blood flow and citrate rate."
      : `[Citrate] <span class="op">≈</span> (${formatNum(citrateRate, 0)} <span class="op">×</span> 112) <span class="op">÷</span> (${formatNum(bloodMlHr, 0)} <span class="op">+</span> ${formatNum(citrateRate, 0)}) <span class="op">=</span> <strong>${formatNum(conc, 2)} mmol/L</strong>`;
  document.getElementById("formula-ca-worked").innerHTML =
    caRatio == null
      ? "Enter total Ca and systemic iCa."
      : `Ratio <span class="op">=</span> ${formatNum(totalCa, 2)} <span class="op">÷</span> ${formatNum(systemicIca, 2)} <span class="op">=</span> <strong>${formatNum(caRatio, 2)}</strong>`;

  return {
    bfr,
    ratio,
    citrateRate,
    circuitIca,
    systemicIca,
    totalCa,
    conc,
    caRatio,
  };
}

document.getElementById("btn-fill").addEventListener("click", () => {
  const bfr = num("bfr");
  const ratio = num("ratio") || 1.5;
  document.getElementById("citrate").value = String(
    Math.round(suggestCitrateRate(bfr, ratio))
  );
  render();
});

document.getElementById("calc-form").addEventListener("input", render);
document.getElementById("btn-save").addEventListener("click", async () => {
  const data = render();
  await saveCalculation({
    type: "citrate",
    label: val("label") || `Citrate ${formatNum(data.citrateRate, 0)} mL/h`,
    inputs: {
      blood_flow_ml_min: data.bfr,
      ratio: data.ratio,
      citrate_ml_hr: data.citrateRate,
      circuit_ica: data.circuitIca,
      systemic_ica: data.systemicIca,
      total_ca: data.totalCa,
    },
    results: {
      suggested_citrate_ml_hr: suggestCitrateRate(data.bfr, data.ratio),
      circuit_citrate_mmol_l: data.conc,
      total_to_ionized_ratio: data.caRatio,
    },
  });
  showToast("Saved to local + backend");
});

render();
