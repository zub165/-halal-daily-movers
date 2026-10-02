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
