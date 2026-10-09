import { mountShell, showToast, num, val } from "../shared/ui.js";
import {
  calculatedOsmolality,
  osmolalGap,
  effectiveOsmolality,
  osmGapStatus,
  formatNum,
} from "../shared/calculations.js";
import { saveCalculation } from "../shared/storage.js";

mountShell({ active: "osmolality", title: "Osmolality" });

function render() {
  const na = num("na");
  const glucose = num("glucose");
  const bun = num("bun");
  const ethanol = num("ethanol");
  const measured = num("measured");

  const calc = calculatedOsmolality({
    na,
    glucoseMgDl: glucose,
    bunMgDl: bun,
    ethanolMgDl: ethanol,
  });
  const gap = osmolalGap(measured, calc);
  const eff = effectiveOsmolality(na, glucose);
  const status = osmGapStatus(gap);

  document.getElementById("out-calc").textContent =
    calc == null ? "—" : `${formatNum(calc, 1)} mOsm/kg`;
  document.getElementById("out-gap").textContent =
    gap == null ? "—" : `${formatNum(gap, 1)} mOsm/kg`;
  const hint = document.getElementById("out-gap-hint");
  hint.textContent = status.label;
  hint.className = `hint tone-${status.tone}`;
  document.getElementById("out-eff").textContent =
    eff == null ? "—" : `${formatNum(eff, 1)} mOsm/kg`;

  document.getElementById("formula-calc").innerHTML =
    calc == null
      ? "Enter Na, glucose, and BUN."
      : `2×${formatNum(na, 1)} <span class="op">+</span> ${formatNum(glucose, 0)}/18 <span class="op">+</span> ${formatNum(bun, 1)}/2.8${ethanol > 0 ? ` <span class="op">+</span> ${formatNum(ethanol, 0)}/4.6` : ""} <span class="op">=</span> <strong>${formatNum(calc, 1)}</strong>`;

  document.getElementById("formula-gap").innerHTML =
    gap == null
      ? "Enter measured osmolality."
      : `${formatNum(measured, 1)} <span class="op">−</span> ${formatNum(calc, 1)} <span class="op">=</span> <strong>${formatNum(gap, 1)}</strong>`;

  document.getElementById("formula-eff").innerHTML =
    eff == null
      ? "—"
      : `2×${formatNum(na, 1)} <span class="op">+</span> ${formatNum(glucose, 0)}/18 <span class="op">=</span> <strong>${formatNum(eff, 1)}</strong>`;

  return { na, glucose, bun, ethanol, measured, calc, gap, eff, status: status.label };
}

document.getElementById("calc-form").addEventListener("input", render);
document.getElementById("btn-save").addEventListener("click", async () => {
  const data = render();
  if (data.calc == null) {
    showToast("Enter Na, glucose, and BUN first");
    return;
  }
  await saveCalculation({
    type: "osmolality",
    label: val("label") || `Osm ${formatNum(data.calc, 1)} gap ${formatNum(data.gap, 1)}`,
    inputs: {
      na: data.na,
      glucose_mg_dl: data.glucose,
      bun_mg_dl: data.bun,
      ethanol_mg_dl: data.ethanol,
      measured_osm: data.measured,
    },
    results: {
      calculated_osm: data.calc,
      osmolal_gap: data.gap,
      effective_osm: data.eff,
      status: data.status,
    },
  });
  showToast("Saved to local + backend");
});

render();
