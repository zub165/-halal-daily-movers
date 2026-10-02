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
