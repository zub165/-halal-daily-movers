/**
 * CRRT clinical calculation utilities
 * Formulas aligned with UAB CRRT Academy / standard ICU practice.
 * Educational reference only — verify with institutional protocols.
 */

export function plasmaFlowMlHr(bloodFlowMlMin, hctFraction) {
  return bloodFlowMlMin * 60 * (1 - hctFraction);
}

export function totalUltrafiltration({
  preFilterRf = 0,
  postFilterRf = 0,
  fluidRemoval = 0,
  pbp = 0,
}) {
  return preFilterRf + postFilterRf + fluidRemoval + pbp;
}

export function effluentRate(modality, rates) {
  const uf = totalUltrafiltration(rates);
  const dialysate = rates.dialysate || 0;
  switch (modality) {
    case "CVVH":
      return uf;
    case "CVVHD":
      return dialysate + (rates.fluidRemoval || 0);
    case "CVVHDF":
      return uf + dialysate;
    default:
      return uf + dialysate;
  }
}

export function prescribedDose(effluentMlHr, weightKg) {
  if (!weightKg || weightKg <= 0) return null;
  return effluentMlHr / weightKg;
}

export function targetEffluent(doseMlKgHr, weightKg) {
  return doseMlKgHr * weightKg;
}

export function dilutionFactor({ bloodFlowMlMin, hct, preFilterRf = 0, pbp = 0 }) {
  const qp = plasmaFlowMlHr(bloodFlowMlMin, hct);
  const denom = qp + preFilterRf + pbp;
  if (denom <= 0) return null;
  return qp / denom;
}

export function correctedDose(prescribed, dilution) {
  if (prescribed == null || dilution == null) return null;
  return prescribed * dilution;
}

export function filtrationFraction({
  bloodFlowMlMin,
  hct,
  preFilterRf = 0,
  postFilterRf = 0,
  fluidRemoval = 0,
  pbp = 0,
}) {
  const uf = totalUltrafiltration({ preFilterRf, postFilterRf, fluidRemoval, pbp });
  const qp = plasmaFlowMlHr(bloodFlowMlMin, hct);
  const denom = qp + preFilterRf + pbp;
  if (denom <= 0) return null;
  return (uf / denom) * 100;
}

/**
 * ACD-A 2.2% (~112 mmol/L citrate). Common starting ratio ~1.5× BFR (mL/h ≈ 1.5 × mL/min).
 * Target circuit citrate ~3–4 mmol/L blood often maps near 1–2× BFR depending on protocol.
 */
export function suggestCitrateRate(bloodFlowMlMin, ratio = 1.5) {
  return bloodFlowMlMin * ratio;
}

export function citrateConcentrationInCircuit(citrateRateMlHr, bloodFlowMlMin, citrateMmolPerL = 112) {
  const bloodMlHr = bloodFlowMlMin * 60;
  if (bloodMlHr <= 0) return null;
  return (citrateRateMlHr * citrateMmolPerL) / (bloodMlHr + citrateRateMlHr);
}

export function calciumToIonizedRatio(totalCaMmolL, systemicICa) {
  if (!systemicICa || systemicICa <= 0) return null;
  return totalCaMmolL / systemicICa;
}

export function netFluidBalance({
  intakeMl = 0,
  outputMl = 0,
  crrtRemovalMl = 0,
  hours = 24,
}) {
  const net = intakeMl - outputMl - crrtRemovalMl;
  const rate = hours > 0 ? crrtRemovalMl / hours : null;
  return { net, removalRateMlHr: rate };
}

export function doseStatus(doseMlKgHr) {
  if (doseMlKgHr == null) return { label: "—", tone: "muted" };
  if (doseMlKgHr < 20) return { label: "Below target (<20)", tone: "warn" };
  if (doseMlKgHr <= 25) return { label: "Within delivered target (20–25)", tone: "ok" };
  if (doseMlKgHr <= 30) return { label: "Prescribed band (25–30)", tone: "ok" };
  return { label: "Above typical prescribe band", tone: "caution" };
}

export function ffStatus(ffPct) {
  if (ffPct == null) return { label: "—", tone: "muted" };
  if (ffPct <= 20) return { label: "Acceptable (≤20%)", tone: "ok" };
  if (ffPct <= 25) return { label: "Borderline (20–25%)", tone: "caution" };
  return { label: "High clotting risk (>25%)", tone: "warn" };
}

/**
 * Vascular access recirculation (%) via two-needle urea method:
 * Recirculation = (S − A) / (S − V) × 100
 * S = systemic, A = arterial line, V = venous line (same concentration units).
 * Returns worked steps so the UI can show a multi-step tape (not a keypad).
 */
export function recirculationWorked({ s, a, v }) {
  const steps = [];
  const push = (id, label, expression, value, tone = "teal", status = "ok") => {
    steps.push({ id, label, expression, value, tone, status });
  };

  if (![s, a, v].every(Number.isFinite)) {
    push("bind", "Bind variables", "Enter S, A, and V", null, "teal", "pending");
    return { pct: null, numer: null, denom: null, ratio: null, steps, error: "Enter S, A, and V" };
  }

  push("bind-s", "Bind S (systemic)", `S = ${formatNum(s, 2)}`, s, "teal", "ok");
  push("bind-a", "Bind A (arterial)", `A = ${formatNum(a, 2)}`, a, "sea", "ok");
  push("bind-v", "Bind V (venous)", `V = ${formatNum(v, 2)}`, v, "amber", "ok");

  const numer = s - a;
  push("numer", "Numerator", `S − A = ${formatNum(s, 2)} − ${formatNum(a, 2)} = ${formatNum(numer, 2)}`, numer, "coral", "ok");

  const denom = s - v;
  push("denom", "Denominator", `S − V = ${formatNum(s, 2)} − ${formatNum(v, 2)} = ${formatNum(denom, 2)}`, denom, "indigo", "ok");

  if (denom === 0) {
    push("ratio", "Divide", "(S − A) ÷ (S − V) — denominator is 0", null, "forest", "error");
    return { pct: null, numer, denom, ratio: null, steps, error: "Denominator (S − V) is zero" };
  }

  const ratio = numer / denom;
  push(
    "ratio",
    "Divide",
    `(S − A) ÷ (S − V) = ${formatNum(numer, 2)} ÷ ${formatNum(denom, 2)} = ${formatNum(ratio, 4)}`,
    ratio,
    "forest",
    "ok"
  );

  const pct = ratio * 100;
  push(
    "pct",
    "Recirculation %",
    `Ratio × 100 = ${formatNum(ratio, 4)} × 100 = ${formatNum(pct, 1)}%`,
    pct,
    "teal",
    "ok"
  );

  return { pct, numer, denom, ratio, steps, error: null };
}

export function recirculationPct({ s, a, v }) {
  const { pct } = recirculationWorked({ s, a, v });
  return pct;
}

export function recirculationStatus(pct) {
  if (pct == null || Number.isNaN(pct)) return { label: "—", tone: "muted" };
  if (pct < 0) return { label: "Negative — check sampling / units", tone: "warn" };
  if (pct < 10) return { label: "Low recirculation (<10%)", tone: "ok" };
  if (pct <= 15) return { label: "Borderline (10–15%) — investigate access", tone: "caution" };
  return { label: "Significant recirculation (>15%)", tone: "warn" };
}

export function formatNum(n, digits = 1) {
  if (n == null || Number.isNaN(n)) return "—";
  return Number(n).toFixed(digits);
}

/* ── Nephrology bedside formulas ───────────────────────── */

/** Anion gap (mEq/L): Na − (Cl + HCO₃) */
export function anionGap(na, cl, hco3) {
  if (![na, cl, hco3].every(Number.isFinite)) return null;
  return na - (cl + hco3);
}

/** Albumin-corrected AG: AG + 2.5 × (4 − albumin g/dL) */
export function albuminCorrectedAnionGap(ag, albuminGdl) {
  if (ag == null || !Number.isFinite(albuminGdl)) return null;
  return ag + 2.5 * (4 - albuminGdl);
}

/**
 * Calculated serum osmolality (mOsm/kg), US conventional units:
 * 2×Na + glucose/18 + BUN/2.8  (+ ethanol/4.6 if provided)
 */
export function calculatedOsmolality({ na, glucoseMgDl, bunMgDl, ethanolMgDl = 0 }) {
  if (![na, glucoseMgDl, bunMgDl].every(Number.isFinite)) return null;
  return 2 * na + glucoseMgDl / 18 + bunMgDl / 2.8 + (ethanolMgDl || 0) / 4.6;
}

/** Osmolal gap = measured − calculated (normal typically <10) */
export function osmolalGap(measured, calculated) {
  if (measured == null || calculated == null) return null;
  if (!Number.isFinite(measured) || !Number.isFinite(calculated)) return null;
  return measured - calculated;
}

/** Effective osmolality / tonicity: 2×Na + glucose/18 */
export function effectiveOsmolality(na, glucoseMgDl) {
  if (![na, glucoseMgDl].every(Number.isFinite)) return null;
  return 2 * na + glucoseMgDl / 18;
}

/**
 * CKD-EPI 2021 creatinine equation (race-free), mL/min/1.73 m².
 * Scr in mg/dL; sex "female" | "male".
 */
export function egfrCkdEpi2021({ scrMgDl, ageYears, sex }) {
  if (!Number.isFinite(scrMgDl) || scrMgDl <= 0) return null;
  if (!Number.isFinite(ageYears) || ageYears <= 0) return null;
  const female = String(sex).toLowerCase() === "female";
  const kappa = female ? 0.7 : 0.9;
  const alpha = female ? -0.241 : -0.302;
  const sexFactor = female ? 1.012 : 1;
  const ratio = scrMgDl / kappa;
  return (
    142 *
    Math.pow(Math.min(ratio, 1), alpha) *
    Math.pow(Math.max(ratio, 1), -1.2) *
    Math.pow(0.9938, ageYears) *
    sexFactor
  );
}

/** Cockcroft–Gault creatinine clearance (mL/min) */
export function cockcroftGault({ ageYears, weightKg, scrMgDl, sex }) {
  if (![ageYears, weightKg, scrMgDl].every(Number.isFinite)) return null;
  if (scrMgDl <= 0 || weightKg <= 0) return null;
  const female = String(sex).toLowerCase() === "female";
  const base = ((140 - ageYears) * weightKg) / (72 * scrMgDl);
  return female ? base * 0.85 : base;
}

/** FeNa (%) = (UNa × PCr) / (PNa × UCr) × 100 */
export function fractionalExcretionNa({ uNa, pNa, uCr, pCr }) {
  if (![uNa, pNa, uCr, pCr].every(Number.isFinite)) return null;
  if (pNa <= 0 || uCr <= 0) return null;
  return ((uNa * pCr) / (pNa * uCr)) * 100;
}

/** FeUrea (%) = (UUrea × PCr) / (PUrea × UCr) × 100 */
export function fractionalExcretionUrea({ uUrea, pUrea, uCr, pCr }) {
  if (![uUrea, pUrea, uCr, pCr].every(Number.isFinite)) return null;
  if (pUrea <= 0 || uCr <= 0) return null;
  return ((uUrea * pCr) / (pUrea * uCr)) * 100;
}

/**
 * Glucose-corrected sodium (Katz 1.6 factor; Hillier 2.4 optional for marked hyperglycemia).
 * corrected = measured + factor × ((glucose − 100) / 100)
 */
export function correctedSodium(measuredNa, glucoseMgDl, factor = 1.6) {
  if (![measuredNa, glucoseMgDl].every(Number.isFinite)) return null;
  return measuredNa + factor * ((glucoseMgDl - 100) / 100);
}

/** Corrected calcium (mg/dL) = measured + 0.8 × (4 − albumin) */
export function correctedCalcium(measuredCaMgDl, albuminGdl) {
  if (![measuredCaMgDl, albuminGdl].every(Number.isFinite)) return null;
  return measuredCaMgDl + 0.8 * (4 - albuminGdl);
}

/** Calcium–phosphate product (mg²/dL²) */
export function calciumPhosphateProduct(caMgDl, phosMgDl) {
  if (![caMgDl, phosMgDl].every(Number.isFinite)) return null;
  return caMgDl * phosMgDl;
}

/**
 * Free water deficit (L) = TBW × (Na/140 − 1)
 * TBW ≈ 0.6×wt (male), 0.5×wt (female); elderly 0.5 / 0.45
 */
export function freeWaterDeficit({ na, weightKg, sex, elderly = false }) {
  if (![na, weightKg].every(Number.isFinite) || weightKg <= 0 || na <= 0) return null;
  const female = String(sex).toLowerCase() === "female";
  let fraction = female ? 0.5 : 0.6;
  if (elderly) fraction = female ? 0.45 : 0.5;
  const tbw = fraction * weightKg;
  return tbw * (na / 140 - 1);
}

/** Bicarbonate deficit (mEq) ≈ 0.5 × weight × (desired − current) */
export function bicarbonateDeficit({ weightKg, currentHco3, desiredHco3 = 24 }) {
  if (![weightKg, currentHco3, desiredHco3].every(Number.isFinite)) return null;
  if (weightKg <= 0) return null;
  return 0.5 * weightKg * (desiredHco3 - currentHco3);
}

/** Urine anion gap = UNa + UK − UCl (negative favors GI bicarb loss / RTA discrimination) */
export function urineAnionGap(uNa, uK, uCl) {
  if (![uNa, uK, uCl].every(Number.isFinite)) return null;
  return uNa + uK - uCl;
}

/** TTKG = (UK / PK) ÷ (Uosm / Posm) */
export function ttkG({ uK, pK, uOsm, pOsm }) {
  if (![uK, pK, uOsm, pOsm].every(Number.isFinite)) return null;
  if (pK <= 0 || pOsm <= 0 || uOsm <= 0) return null;
  return uK / pK / (uOsm / pOsm);
}

/**
 * Winter's formula — expected PCO₂ in metabolic acidosis:
 * expected = 1.5 × HCO₃ + 8 (±2)
 */
export function wintersExpectedPco2(hco3) {
  if (!Number.isFinite(hco3)) return null;
  const expected = 1.5 * hco3 + 8;
  return { expected, low: expected - 2, high: expected + 2 };
}

/** Expected PCO₂ in metabolic alkalosis ≈ 40 + 0.7 × (HCO₃ − 24) */
export function expectedPco2MetabolicAlkalosis(hco3) {
  if (!Number.isFinite(hco3)) return null;
  return 40 + 0.7 * (hco3 - 24);
}

/** Delta ratio (ΔAG / ΔHCO₃) for mixed metabolic disorders */
export function deltaRatio(ag, hco3, normalAg = 12, normalHco3 = 24) {
  if (![ag, hco3].every(Number.isFinite)) return null;
  const dHco3 = normalHco3 - hco3;
  if (dHco3 === 0) return null;
  return (ag - normalAg) / dHco3;
}

/**
 * Interpret primary acid–base disorder from pH, PCO₂, HCO₃.
 * Returns structured labels for bedside rounds (educational).
 */
export function interpretAbg({ pH, pco2, hco3, ag = null }) {
  if (![pH, pco2, hco3].every(Number.isFinite)) {
    return { primary: "—", detail: "Enter pH, PCO₂, and HCO₃.", tone: "muted" };
  }

  const acidemia = pH < 7.35;
  const alkalemia = pH > 7.45;
  const normalPh = !acidemia && !alkalemia;

  let primary = "Normal acid–base";
  let tone = "ok";
  const notes = [];

  if (acidemia) {
    if (hco3 < 22 && pco2 <= 45) {
      primary = "Metabolic acidosis";
      tone = "warn";
      const w = wintersExpectedPco2(hco3);
      if (w) {
        if (pco2 < w.low) notes.push("PCO₂ below Winter's → additional respiratory alkalosis");
        else if (pco2 > w.high) notes.push("PCO₂ above Winter's → additional respiratory acidosis");
        else notes.push(`Winter's expected PCO₂ ≈ ${formatNum(w.expected, 0)} (${formatNum(w.low, 0)}–${formatNum(w.high, 0)})`);
      }
      if (ag != null && ag >= 12) {
        const dr = deltaRatio(ag, hco3);
        if (dr != null) {
          if (dr < 0.4) notes.push(`Δ/Δ ${formatNum(dr, 2)} → hyperchloremic component likely`);
          else if (dr > 2) notes.push(`Δ/Δ ${formatNum(dr, 2)} → concurrent metabolic alkalosis likely`);
          else notes.push(`Δ/Δ ${formatNum(dr, 2)} → pure HAGMA range`);
        }
      }
    } else if (pco2 > 45 && hco3 >= 22) {
      primary = "Respiratory acidosis";
      tone = "warn";
      const dPco2 = pco2 - 40;
      const acuteHco3 = 24 + 0.1 * dPco2;
      const chronicHco3 = 24 + 0.35 * dPco2;
      notes.push(
        `Acute expected HCO₃ ≈ ${formatNum(acuteHco3, 1)}; chronic ≈ ${formatNum(chronicHco3, 1)}`
      );
    } else {
      primary = "Mixed acidemia";
      tone = "caution";
      notes.push("Both PCO₂ and HCO₃ contribute — review for mixed disorder");
    }
  } else if (alkalemia) {
    if (hco3 > 26 && pco2 >= 35) {
      primary = "Metabolic alkalosis";
      tone = "caution";
      const exp = expectedPco2MetabolicAlkalosis(hco3);
      notes.push(`Expected compensatory PCO₂ ≈ ${formatNum(exp, 0)}`);
      if (pco2 < exp - 5) notes.push("PCO₂ lower than expected → additional respiratory alkalosis");
      if (pco2 > exp + 5) notes.push("PCO₂ higher than expected → additional respiratory acidosis");
    } else if (pco2 < 35 && hco3 <= 26) {
      primary = "Respiratory alkalosis";
      tone = "caution";
      const dPco2 = 40 - pco2;
      const acuteHco3 = 24 - 0.2 * dPco2;
      const chronicHco3 = 24 - 0.5 * dPco2;
      notes.push(
        `Acute expected HCO₃ ≈ ${formatNum(acuteHco3, 1)}; chronic ≈ ${formatNum(chronicHco3, 1)}`
      );
    } else {
      primary = "Mixed alkalemia";
      tone = "caution";
      notes.push("Both PCO₂ and HCO₃ contribute — review for mixed disorder");
    }
  } else if (normalPh) {
    if ((hco3 < 22 && pco2 < 35) || (hco3 > 26 && pco2 > 45)) {
      primary = "Compensated / mixed (normal pH)";
      tone = "caution";
      notes.push("Normal pH with abnormal PCO₂/HCO₃ — consider fully compensated or mixed disorder");
    }
  }

  if (ag != null) {
    if (ag >= 20) notes.push(`Anion gap ${formatNum(ag, 1)} — high (HAGMA if acidotic)`);
    else if (ag >= 12) notes.push(`Anion gap ${formatNum(ag, 1)} — borderline/high`);
    else notes.push(`Anion gap ${formatNum(ag, 1)} — normal/low`);
  }

  return { primary, detail: notes.join(" · ") || "Within typical ranges.", tone };
}

export function fenaStatus(fenaPct) {
  if (fenaPct == null) return { label: "—", tone: "muted" };
  if (fenaPct < 1) return { label: "FeNa <1% — prerenal pattern (context-dependent)", tone: "ok" };
  if (fenaPct > 2) return { label: "FeNa >2% — ATN / intrinsic pattern (context-dependent)", tone: "caution" };
  return { label: "FeNa 1–2% — indeterminate", tone: "muted" };
}

export function osmGapStatus(gap) {
  if (gap == null) return { label: "—", tone: "muted" };
  if (gap < 10) return { label: "Gap <10 — typically normal", tone: "ok" };
  if (gap <= 15) return { label: "Gap 10–15 — borderline", tone: "caution" };
  return { label: "Gap >15 — consider alcohols, mannitol, lab error", tone: "warn" };
}

export function egfrStage(egfr) {
  if (egfr == null) return { label: "—", tone: "muted" };
  if (egfr >= 90) return { label: "G1 ≥90 (normal/high)", tone: "ok" };
  if (egfr >= 60) return { label: "G2 60–89 (mildly decreased)", tone: "ok" };
  if (egfr >= 45) return { label: "G3a 45–59", tone: "caution" };
  if (egfr >= 30) return { label: "G3b 30–44", tone: "caution" };
  if (egfr >= 15) return { label: "G4 15–29", tone: "warn" };
  return { label: "G5 <15 (kidney failure range)", tone: "warn" };
}
