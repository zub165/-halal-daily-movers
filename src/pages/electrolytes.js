import { mountShell, showToast, num, val } from "../shared/ui.js";
import {
  correctedSodium,
  correctedCalcium,
  calciumPhosphateProduct,
  freeWaterDeficit,
  bicarbonateDeficit,
  urineAnionGap,
  ttkG,
  formatNum,
} from "../shared/calculations.js";
import { saveCalculation } from "../shared/storage.js";

mountShell({ active: "electrolytes", title: "Electrolytes" });

function render() {
  const na = num("na");
  const glucose = num("glucose");
  const ca = num("ca");
  const albumin = num("albumin");
  const phos = num("phos");
  const hco3 = num("hco3");
  const desiredHco3 = num("desired-hco3");
  const weight = num("weight");
  const sex = val("sex");
  const elderly = val("elderly") === "yes";
  const uNa = num("una");
  const uK = num("uk");
  const uCl = num("ucl");
  const pK = num("pk");
  const uOsm = num("uosm");
  const pOsm = num("posm");

  const naCorr16 = correctedSodium(na, glucose, 1.6);
  const naCorr24 = correctedSodium(na, glucose, 2.4);
  const caCorr = correctedCalcium(ca, albumin);
  const cap = calciumPhosphateProduct(caCorr ?? ca, phos);
  const fwd = freeWaterDeficit({ na, weightKg: weight, sex, elderly });
  const bicarb = bicarbonateDeficit({ weightKg: weight, currentHco3: hco3, desiredHco3 });
  const uag = urineAnionGap(uNa, uK, uCl);
  const ttk = ttkG({ uK, pK, uOsm, pOsm });

  document.getElementById("out-na").textContent =
    naCorr16 == null ? "—" : `${formatNum(naCorr16, 1)} mEq/L`;
  document.getElementById("out-na-24").textContent =
    naCorr24 == null ? "" : `Hillier ×2.4 → ${formatNum(naCorr24, 1)} mEq/L`;

  document.getElementById("out-ca").textContent =
    caCorr == null
      ? "—"
      : `${formatNum(caCorr, 1)} mg/dL · product ${cap == null ? "—" : formatNum(cap, 1)}`;

  document.getElementById("out-fwd").textContent =
    fwd == null ? "—" : `${formatNum(fwd, 2)} L ${fwd < 0 ? "(negative = free-water excess)" : ""}`;

  document.getElementById("out-bicarb").textContent =
    bicarb == null ? "—" : `${formatNum(bicarb, 0)} mEq`;

  document.getElementById("out-uag").textContent =
    uag == null && ttk == null
      ? "—"
      : `UAG ${uag == null ? "—" : formatNum(uag, 1)} · TTKG ${ttk == null ? "—" : formatNum(ttk, 1)}`;

  document.getElementById("formula-na").innerHTML =
    naCorr16 == null
      ? "—"
      : `${formatNum(na, 1)} <span class="op">+</span> 1.6 <span class="op">×</span> [(${formatNum(glucose, 0)} <span class="op">−</span> 100)/100] <span class="op">=</span> <strong>${formatNum(naCorr16, 1)}</strong>`;

  document.getElementById("formula-ca").innerHTML =
    caCorr == null
      ? "—"
      : `${formatNum(ca, 1)} <span class="op">+</span> 0.8 <span class="op">×</span> (4 <span class="op">−</span> ${formatNum(albumin, 1)}) <span class="op">=</span> <strong>${formatNum(caCorr, 1)}</strong>; Ca×P <span class="op">=</span> <strong>${cap == null ? "—" : formatNum(cap, 1)}</strong>`;

  document.getElementById("formula-fwd").innerHTML =
    fwd == null
      ? "—"
      : `TBW × (${formatNum(na, 1)}/140 <span class="op">−</span> 1) <span class="op">=</span> <strong>${formatNum(fwd, 2)} L</strong>`;

  document.getElementById("formula-bicarb").innerHTML =
    bicarb == null
      ? "—"
      : `0.5 <span class="op">×</span> ${formatNum(weight, 1)} <span class="op">×</span> (${formatNum(desiredHco3, 1)} <span class="op">−</span> ${formatNum(hco3, 1)}) <span class="op">=</span> <strong>${formatNum(bicarb, 0)} mEq</strong>`;

  document.getElementById("formula-uag").innerHTML =
    `UAG <span class="op">=</span> ${formatNum(uNa, 1)} <span class="op">+</span> ${formatNum(uK, 1)} <span class="op">−</span> ${formatNum(uCl, 1)} <span class="op">=</span> <strong>${uag == null ? "—" : formatNum(uag, 1)}</strong>; TTKG <span class="op">=</span> <strong>${ttk == null ? "—" : formatNum(ttk, 1)}</strong>`;

  return {
    na,
    glucose,
    ca,
    albumin,
    phos,
    hco3,
    desiredHco3,
    weight,
    sex,
    elderly,
    naCorr16,
    naCorr24,
    caCorr,
    cap,
    fwd,
    bicarb,
    uag,
    ttk,
  };
}

document.getElementById("calc-form").addEventListener("input", render);
document.getElementById("calc-form").addEventListener("change", render);
document.getElementById("btn-save").addEventListener("click", async () => {
  const data = render();
  await saveCalculation({
    type: "electrolytes",
    label: val("label") || `Na corr ${formatNum(data.naCorr16, 1)}`,
    inputs: {
      na: data.na,
      glucose_mg_dl: data.glucose,
      ca_mg_dl: data.ca,
      albumin_g_dl: data.albumin,
      phos_mg_dl: data.phos,
      hco3: data.hco3,
      desired_hco3: data.desiredHco3,
      weight_kg: data.weight,
      sex: data.sex,
      elderly: data.elderly,
    },
    results: {
      corrected_na_1_6: data.naCorr16,
      corrected_na_2_4: data.naCorr24,
      corrected_ca: data.caCorr,
      ca_phos_product: data.cap,
      free_water_deficit_l: data.fwd,
      bicarbonate_deficit_meq: data.bicarb,
      urine_anion_gap: data.uag,
      ttk_g: data.ttk,
    },
  });
  showToast("Saved to local + backend");
});

render();
