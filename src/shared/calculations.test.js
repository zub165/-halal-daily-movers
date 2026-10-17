import test from "node:test";
import assert from "node:assert/strict";
import {
  effluentRate,
  prescribedDose,
  dilutionFactor,
  correctedDose,
  filtrationFraction,
  suggestCitrateRate,
  calciumToIonizedRatio,
  calculatedOsmolality,
  osmolalGap,
  anionGap,
  wintersExpectedPco2,
  interpretAbg,
  egfrCkdEpi2021,
  cockcroftGault,
  fractionalExcretionNa,
  correctedSodium,
  correctedCalcium,
  freeWaterDeficit,
  bicarbonateDeficit,
  recirculationPct,
  recirculationWorked,
} from "./calculations.js";

test("CVVHDF effluent sums UF + dialysate", () => {
  const qe = effluentRate("CVVHDF", {
    preFilterRf: 1000,
    postFilterRf: 200,
    fluidRemoval: 100,
    pbp: 0,
    dialysate: 1000,
  });
  assert.equal(qe, 2300);
});

test("dose = effluent / weight", () => {
  assert.equal(prescribedDose(2000, 80), 25);
});

test("dilution-corrected dose matches UAB-style example", () => {
  // BF 200, Hct 30%, pre 2000, post 200, removal 200, PBP 300, wt 100
  const qe = effluentRate("CVVH", {
    preFilterRf: 2000,
    postFilterRf: 200,
    fluidRemoval: 200,
    pbp: 300,
  });
  assert.equal(qe, 2700);
  const prescribed = prescribedDose(qe, 100);
  assert.equal(prescribed, 27);
  const dil = dilutionFactor({
    bloodFlowMlMin: 200,
    hct: 0.3,
    preFilterRf: 2000,
    pbp: 300,
  });
  assert.ok(Math.abs(dil - 0.784) < 0.01);
  const corr = correctedDose(prescribed, dil);
  assert.ok(corr > 20 && corr < 23);
});

test("filtration fraction warns above 25%", () => {
  const ff = filtrationFraction({
    bloodFlowMlMin: 100,
    hct: 0.3,
    preFilterRf: 0,
    postFilterRf: 2000,
    fluidRemoval: 200,
    pbp: 0,
  });
  assert.ok(ff > 25);
});

test("citrate suggestion and Ca ratio", () => {
  assert.equal(suggestCitrateRate(150, 1.5), 225);
  assert.ok(calciumToIonizedRatio(2.6, 1.0) > 2.5);
});

test("serum osmolality and osm gap", () => {
  const calc = calculatedOsmolality({ na: 140, glucoseMgDl: 90, bunMgDl: 14 });
  // 280 + 5 + 5 = 290
  assert.ok(Math.abs(calc - 290) < 0.5);
  assert.ok(Math.abs(osmolalGap(300, calc) - 10) < 0.5);
});

test("anion gap and Winter's for metabolic acidosis", () => {
  assert.equal(anionGap(140, 104, 12), 24);
  const w = wintersExpectedPco2(12);
  assert.equal(w.expected, 26);
  const interp = interpretAbg({ pH: 7.28, pco2: 26, hco3: 12, ag: 24 });
  assert.match(interp.primary, /Metabolic acidosis/i);
});

test("CKD-EPI 2021 and Cockcroft-Gault", () => {
  const egfr = egfrCkdEpi2021({ scrMgDl: 1.0, ageYears: 50, sex: "male" });
  assert.ok(egfr > 80 && egfr < 110);
  const crcl = cockcroftGault({
    ageYears: 50,
    weightKg: 70,
    scrMgDl: 1.0,
    sex: "male",
  });
  assert.ok(Math.abs(crcl - 87.5) < 0.1);
});

test("FeNa, corrected Na/Ca, deficits", () => {
  const fena = fractionalExcretionNa({ uNa: 20, pNa: 140, uCr: 100, pCr: 2 });
  assert.ok(Math.abs(fena - 0.286) < 0.01);
  assert.ok(Math.abs(correctedSodium(130, 400, 1.6) - 134.8) < 0.01);
  assert.ok(Math.abs(correctedCalcium(8, 2.5) - 9.2) < 0.01);
  // TBW 0.6×70=42; FWD = 42×(154/140−1) = 4.2 L
  const fwd = freeWaterDeficit({ na: 154, weightKg: 70, sex: "male" });
  assert.ok(Math.abs(fwd - 4.2) < 0.01);
  assert.equal(bicarbonateDeficit({ weightKg: 70, currentHco3: 12, desiredHco3: 24 }), 420);
});

test("recirculation (S−A)/(S−V)×100 with worked steps", () => {
  // S=60, A=48, V=12 → (12)/(48)×100 = 25%
  const pct = recirculationPct({ s: 60, a: 48, v: 12 });
  assert.ok(Math.abs(pct - 25) < 0.01);
  const worked = recirculationWorked({ s: 60, a: 48, v: 12 });
  assert.equal(worked.numer, 12);
  assert.equal(worked.denom, 48);
  assert.ok(worked.steps.length >= 6);
  assert.ok(worked.steps.some((s) => s.id === "pct"));
  assert.equal(recirculationWorked({ s: 50, a: 40, v: 50 }).error != null, true);
});
