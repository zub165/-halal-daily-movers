import { mountShell, showToast, num, val } from "../shared/ui.js";
import {
  egfrCkdEpi2021,
  cockcroftGault,
  egfrStage,
  formatNum,
} from "../shared/calculations.js";
import { saveCalculation } from "../shared/storage.js";

mountShell({ active: "egfr", title: "eGFR" });

function render() {
  const scr = num("scr");
  const age = num("age");
  const weight = num("weight");
  const sex = val("sex");

  const egfr = egfrCkdEpi2021({ scrMgDl: scr, ageYears: age, sex });
  const crcl = cockcroftGault({ ageYears: age, weightKg: weight, scrMgDl: scr, sex });
  const stage = egfrStage(egfr);

  document.getElementById("out-egfr").textContent =
    egfr == null ? "—" : `${formatNum(egfr, 1)} mL/min/1.73 m²`;
  const stageEl = document.getElementById("out-stage");
  stageEl.textContent = stage.label;
  stageEl.className = `hint tone-${stage.tone}`;
  document.getElementById("out-crcl").textContent =
    crcl == null ? "—" : `${formatNum(crcl, 1)} mL/min`;

  document.getElementById("formula-egfr").innerHTML =
    egfr == null
      ? "Enter creatinine, age, and sex."
      : `Scr ${formatNum(scr, 2)} mg/dL · age ${formatNum(age, 0)} · ${sex} → <strong>${formatNum(egfr, 1)} mL/min/1.73 m²</strong>`;

  document.getElementById("formula-crcl").innerHTML =
    crcl == null
      ? "Enter weight for CrCl."
      : `[(140 <span class="op">−</span> ${formatNum(age, 0)}) <span class="op">×</span> ${formatNum(weight, 1)}${sex === "female" ? " <span class=\"op\">×</span> 0.85" : ""}] <span class="op">÷</span> (72 <span class="op">×</span> ${formatNum(scr, 2)}) <span class="op">=</span> <strong>${formatNum(crcl, 1)} mL/min</strong>`;

  return { scr, age, weight, sex, egfr, crcl, stage: stage.label };
}

document.getElementById("calc-form").addEventListener("input", render);
document.getElementById("calc-form").addEventListener("change", render);
document.getElementById("btn-save").addEventListener("click", async () => {
  const data = render();
  if (data.egfr == null) {
    showToast("Enter creatinine, age, and sex first");
    return;
  }
  await saveCalculation({
    type: "egfr",
    label: val("label") || `eGFR ${formatNum(data.egfr, 1)}`,
    inputs: {
      scr_mg_dl: data.scr,
      age_years: data.age,
      weight_kg: data.weight,
      sex: data.sex,
    },
    results: {
      egfr_ckd_epi_2021: data.egfr,
      crcl_cockcroft_gault: data.crcl,
      stage: data.stage,
    },
  });
  showToast("Saved to local + backend");
});

render();
