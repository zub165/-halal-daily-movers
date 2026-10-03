import { mountShell, showToast, num, val } from "../shared/ui.js";
import {
  effluentRate,
  prescribedDose,
  dilutionFactor,
  correctedDose,
  plasmaFlowMlHr,
  doseStatus,
  formatNum,
} from "../shared/calculations.js";
import { saveCalculation } from "../shared/storage.js";

mountShell({ active: "dilution", title: "Dilution Dose" });

function render() {
  const bloodFlow = num("bfr");
  const hct = num("hct") / 100;
  const pre = num("pre");
  const post = num("post");
  const removal = num("removal");
  const pbp = num("pbp");
  const dialysate = num("dialysate");
  const weight = num("weight");
  const modality = document.getElementById("modality").value;

  const qe = effluentRate(modality, {
    preFilterRf: pre,
    postFilterRf: post,
    fluidRemoval: removal,
    pbp,
    dialysate,
  });
  const prescribed = prescribedDose(qe, weight);
  const dil = dilutionFactor({
    bloodFlowMlMin: bloodFlow,
    hct,
    preFilterRf: pre,
    pbp,
  });
  const corrected = correctedDose(prescribed, dil);
  const status = doseStatus(corrected);
  const qp = plasmaFlowMlHr(bloodFlow, hct);
  const denom = qp + pre + pbp;

  document.getElementById("out-prescribed").textContent =
    prescribed == null ? "—" : `${formatNum(prescribed, 1)} mL/kg/h`;
  document.getElementById("out-dilution").textContent =
    dil == null ? "—" : formatNum(dil, 3);
  document.getElementById("out-corrected").textContent =
    corrected == null ? "—" : `${formatNum(corrected, 1)} mL/kg/h`;
  const hint = document.getElementById("out-corrected-hint");
  hint.textContent = status.label;
  hint.className = `hint tone-${status.tone}`;

  document.getElementById("formula-prescribed-worked").innerHTML =
    prescribed == null
      ? "Enter weight to see prescribed dose."
      : `Dose <span class="op">=</span> ${formatNum(qe, 0)} <span class="op">÷</span> ${formatNum(weight, 1)} <span class="op">=</span> <strong>${formatNum(prescribed, 1)} mL/kg/h</strong>`;
  document.getElementById("formula-df-worked").innerHTML =
    dil == null
      ? "Enter blood flow and hematocrit."
      : `DF <span class="op">=</span> ${formatNum(qp, 0)} <span class="op">÷</span> (${formatNum(qp, 0)} <span class="op">+</span> ${formatNum(pre, 0)} <span class="op">+</span> ${formatNum(pbp, 0)}) <span class="op">=</span> ${formatNum(qp, 0)} <span class="op">÷</span> ${formatNum(denom, 0)} <span class="op">=</span> <strong>${formatNum(dil, 3)}</strong>`;
  document.getElementById("formula-corrected-worked").innerHTML =
    corrected == null
      ? "Complete inputs to see corrected dose."
      : `Corrected <span class="op">=</span> ${formatNum(prescribed, 1)} <span class="op">×</span> ${formatNum(dil, 3)} <span class="op">=</span> <strong>${formatNum(corrected, 1)} mL/kg/h</strong>`;

  return {
    modality,
    bloodFlow,
    hct,
    pre,
    post,
    removal,
    pbp,
    dialysate,
    weight,
    qe,
    prescribed,
    dil,
    corrected,
    status: status.label,
  };
}

document.getElementById("calc-form").addEventListener("input", render);
document.getElementById("modality").addEventListener("change", render);
document.getElementById("btn-save").addEventListener("click", async () => {
  const data = render();
  await saveCalculation({
    type: "dilution",
    label: val("label") || `Corrected ${formatNum(data.corrected, 1)}`,
    inputs: {
      modality: data.modality,
      blood_flow_ml_min: data.bloodFlow,
      hct: data.hct,
      pre_filter_rf: data.pre,
      post_filter_rf: data.post,
      fluid_removal: data.removal,
      pbp: data.pbp,
      dialysate: data.dialysate,
      weight_kg: data.weight,
    },
    results: {
      effluent_ml_hr: data.qe,
      prescribed_dose: data.prescribed,
      dilution_factor: data.dil,
      corrected_dose: data.corrected,
      status: data.status,
    },
  });
  showToast("Saved to local + backend");
});

render();
