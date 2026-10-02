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

export function formatNum(n, digits = 1) {
  if (n == null || Number.isNaN(n)) return "—";
  return Number(n).toFixed(digits);
}
