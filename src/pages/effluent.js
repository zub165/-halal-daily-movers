import { mountShell, showToast, num, val } from "../shared/ui.js";
import {
  effluentRate,
  prescribedDose,
  doseStatus,
  formatNum,
} from "../shared/calculations.js";
import { saveCalculation } from "../shared/storage.js";

mountShell({ active: "effluent", title: "Effluent" });

function modality() {
  return document.getElementById("modality").value;
}

function rates() {
  return {
    preFilterRf: num("pre"),
    postFilterRf: num("post"),
    fluidRemoval: num("removal"),
    pbp: num("pbp"),
    dialysate: num("dialysate"),
  };
}

function render() {
  const m = modality();
  const r = rates();
  const weight = num("weight");
  const qe = effluentRate(m, r);
  const dose = prescribedDose(qe, weight);
  const status = doseStatus(dose);

  document.getElementById("out-qe").textContent = `${formatNum(qe, 0)} mL/h`;
  document.getElementById("out-dose").textContent =
    dose == null ? "—" : `${formatNum(dose, 1)} mL/kg/h`;
  const hint = document.getElementById("out-dose-hint");
  hint.textContent = status.label;
  hint.className = `hint tone-${status.tone}`;

  const dialysateField = document.getElementById("dialysate").closest(".field");
  dialysateField.style.display = m === "CVVH" ? "none" : "";

  const eq = document.getElementById("formula-qe-eq");
  const qeWorked = document.getElementById("formula-qe-worked");
  const doseWorked = document.getElementById("formula-dose-worked");

  if (m === "CVVH") {
    eq.innerHTML =
      "QE <span class=\"op\">=</span> Pre-RF <span class=\"op\">+</span> Post-RF <span class=\"op\">+</span> Fluid removal <span class=\"op\">+</span> PBP";
    qeWorked.innerHTML = `QE <span class="op">=</span> ${formatNum(r.preFilterRf, 0)} <span class="op">+</span> ${formatNum(r.postFilterRf, 0)} <span class="op">+</span> ${formatNum(r.fluidRemoval, 0)} <span class="op">+</span> ${formatNum(r.pbp, 0)} <span class="op">=</span> <strong>${formatNum(qe, 0)} mL/h</strong>`;
  } else if (m === "CVVHD") {
    eq.innerHTML =
      "QE <span class=\"op\">=</span> Dialysate <span class=\"op\">+</span> Fluid removal";
    qeWorked.innerHTML = `QE <span class="op">=</span> ${formatNum(r.dialysate, 0)} <span class="op">+</span> ${formatNum(r.fluidRemoval, 0)} <span class="op">=</span> <strong>${formatNum(qe, 0)} mL/h</strong>`;
  } else {
    eq.innerHTML =
      "QE <span class=\"op\">=</span> Pre-RF <span class=\"op\">+</span> Post-RF <span class=\"op\">+</span> Fluid removal <span class=\"op\">+</span> PBP <span class=\"op\">+</span> Dialysate";
    qeWorked.innerHTML = `QE <span class="op">=</span> ${formatNum(r.preFilterRf, 0)} <span class="op">+</span> ${formatNum(r.postFilterRf, 0)} <span class="op">+</span> ${formatNum(r.fluidRemoval, 0)} <span class="op">+</span> ${formatNum(r.pbp, 0)} <span class="op">+</span> ${formatNum(r.dialysate, 0)} <span class="op">=</span> <strong>${formatNum(qe, 0)} mL/h</strong>`;
  }

  if (dose == null || weight <= 0) {
    doseWorked.textContent = "Enter weight to see dose calculation.";
  } else {
    doseWorked.innerHTML = `Dose <span class="op">=</span> ${formatNum(qe, 0)} <span class="op">÷</span> ${formatNum(weight, 1)} <span class="op">=</span> <strong>${formatNum(dose, 1)} mL/kg/h</strong>`;
  }

  return { modality: m, rates: r, weight, effluent: qe, dose, status: status.label };
}

document.getElementById("calc-form").addEventListener("input", render);
document.getElementById("modality").addEventListener("change", render);
document.getElementById("btn-save").addEventListener("click", async () => {
  const data = render();
  await saveCalculation({
    type: "effluent",
    label: val("label") || `${data.modality} QE ${formatNum(data.effluent, 0)}`,
    inputs: { modality: data.modality, weight_kg: data.weight, ...data.rates },
    results: { effluent_ml_hr: data.effluent, dose_ml_kg_hr: data.dose, status: data.status },
  });
  showToast("Saved to local + backend");
});

render();
