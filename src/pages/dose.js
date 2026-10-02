import { mountShell, showToast, num, val } from "../shared/ui.js";
import { prescribedDose, doseStatus, formatNum } from "../shared/calculations.js";
import { saveCalculation } from "../shared/storage.js";

mountShell({ active: "dose", title: "Dose" });

function render() {
  const effluent = num("effluent");
  const weight = num("weight");
  const dose = prescribedDose(effluent, weight);
  const status = doseStatus(dose);

  document.getElementById("out-dose").textContent =
    dose == null ? "—" : `${formatNum(dose, 1)} mL/kg/h`;
  const hint = document.getElementById("out-dose-hint");
  hint.textContent = status.label;
  hint.className = `hint tone-${status.tone}`;

  return { effluent, weight, dose, status: status.label };
}

document.getElementById("calc-form").addEventListener("input", render);
document.getElementById("btn-save").addEventListener("click", async () => {
  const data = render();
  if (data.dose == null) {
    showToast("Enter effluent and weight first");
    return;
  }
  await saveCalculation({
    type: "dose",
    label: val("label") || `Dose ${formatNum(data.dose, 1)} mL/kg/h`,
    inputs: { effluent_ml_hr: data.effluent, weight_kg: data.weight },
    results: { dose_ml_kg_hr: data.dose, status: data.status },
  });
  showToast("Saved to local + backend");
});

render();
