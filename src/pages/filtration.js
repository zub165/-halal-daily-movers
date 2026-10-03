import { mountShell, showToast, num, val } from "../shared/ui.js";
import {
  filtrationFraction,
  plasmaFlowMlHr,
  totalUltrafiltration,
  ffStatus,
  formatNum,
} from "../shared/calculations.js";
import { saveCalculation } from "../shared/storage.js";

mountShell({ active: "filtration", title: "Filtration Fraction" });

function render() {
  const bloodFlow = num("bfr");
  const hctPct = num("hct");
  const hct = hctPct / 100;
  const pre = num("pre");
  const post = num("post");
  const removal = num("removal");
  const pbp = num("pbp");

  const ff = filtrationFraction({
    bloodFlowMlMin: bloodFlow,
    hct,
    preFilterRf: pre,
    postFilterRf: post,
    fluidRemoval: removal,
    pbp,
  });
  const qp = plasmaFlowMlHr(bloodFlow, hct);
  const uf = totalUltrafiltration({
    preFilterRf: pre,
    postFilterRf: post,
    fluidRemoval: removal,
    pbp,
  });
  const status = ffStatus(ff);
  const denom = qp + pre + pbp;

  document.getElementById("out-ff").textContent =
    ff == null ? "—" : `${formatNum(ff, 1)}%`;
  document.getElementById("out-qp").textContent = `${formatNum(qp, 0)} mL/h`;
  document.getElementById("out-uf").textContent = `${formatNum(uf, 0)} mL/h`;
  const hint = document.getElementById("out-ff-hint");
  hint.textContent = status.label;
  hint.className = `hint tone-${status.tone}`;

  document.getElementById("formula-qp-worked").innerHTML =
    `Q<sub>p</sub> <span class="op">=</span> ${formatNum(bloodFlow, 0)} <span class="op">×</span> 60 <span class="op">×</span> (1 − ${formatNum(hct, 2)}) <span class="op">=</span> <strong>${formatNum(qp, 0)} mL/h</strong>`;
  document.getElementById("formula-uf-worked").innerHTML =
    `UF <span class="op">=</span> ${formatNum(pre, 0)} <span class="op">+</span> ${formatNum(post, 0)} <span class="op">+</span> ${formatNum(removal, 0)} <span class="op">+</span> ${formatNum(pbp, 0)} <span class="op">=</span> <strong>${formatNum(uf, 0)} mL/h</strong>`;
  document.getElementById("formula-ff-worked").innerHTML =
    ff == null
      ? "Enter blood flow and hematocrit."
      : `FF <span class="op">=</span> ${formatNum(uf, 0)} <span class="op">÷</span> (${formatNum(qp, 0)} <span class="op">+</span> ${formatNum(pre, 0)} <span class="op">+</span> ${formatNum(pbp, 0)}) <span class="op">×</span> 100 <span class="op">=</span> ${formatNum(uf, 0)} <span class="op">÷</span> ${formatNum(denom, 0)} <span class="op">×</span> 100 <span class="op">=</span> <strong>${formatNum(ff, 1)}%</strong>`;

  return { bloodFlow, hctPct, pre, post, removal, pbp, ff, qp, uf, status: status.label };
}

document.getElementById("calc-form").addEventListener("input", render);
document.getElementById("btn-save").addEventListener("click", async () => {
  const data = render();
  if (data.ff == null) {
    showToast("Enter blood flow and hematocrit");
    return;
  }
  await saveCalculation({
    type: "filtration",
    label: val("label") || `FF ${formatNum(data.ff, 1)}%`,
    inputs: {
      blood_flow_ml_min: data.bloodFlow,
      hct_pct: data.hctPct,
      pre_filter_rf: data.pre,
      post_filter_rf: data.post,
      fluid_removal: data.removal,
      pbp: data.pbp,
    },
    results: {
      filtration_fraction_pct: data.ff,
      plasma_flow_ml_hr: data.qp,
      total_uf_ml_hr: data.uf,
      status: data.status,
    },
  });
  showToast("Saved to local + backend");
});

render();
