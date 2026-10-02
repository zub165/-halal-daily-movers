import { mountShell, showToast, num, val } from "../shared/ui.js";
import { netFluidBalance, targetEffluent, formatNum } from "../shared/calculations.js";
import { saveCalculation } from "../shared/storage.js";

mountShell({ active: "fluid", title: "Fluid Balance" });

function render() {
  const intake = num("intake");
  const output = num("output");
  const removal = num("removal");
  const hours = num("hours") || 24;
  const weight = num("weight");
  const targetDose = num("target_dose");

  const bal = netFluidBalance({
    intakeMl: intake,
    outputMl: output,
    crrtRemovalMl: removal,
    hours,
  });

  const suggestedQe =
    weight > 0 && targetDose > 0 ? targetEffluent(targetDose, weight) : null;

  document.getElementById("out-net").textContent = `${formatNum(bal.net, 0)} mL`;
  document.getElementById("out-rate").textContent =
    bal.removalRateMlHr == null
      ? "—"
      : `${formatNum(bal.removalRateMlHr, 0)} mL/h`;
  document.getElementById("out-qe").textContent =
    suggestedQe == null ? "—" : `${formatNum(suggestedQe, 0)} mL/h`;

  const netHint = document.getElementById("out-net-hint");
  if (bal.net > 0) {
    netHint.textContent = "Positive balance (net gain)";
    netHint.className = "hint tone-caution";
  } else if (bal.net < 0) {
    netHint.textContent = "Negative balance (net loss)";
    netHint.className = "hint tone-ok";
  } else {
    netHint.textContent = "Even balance";
    netHint.className = "hint tone-muted";
  }

  return { intake, output, removal, hours, weight, targetDose, bal, suggestedQe };
}

document.getElementById("calc-form").addEventListener("input", render);
document.getElementById("btn-save").addEventListener("click", async () => {
  const data = render();
  await saveCalculation({
    type: "fluid",
    label: val("label") || `Net ${formatNum(data.bal.net, 0)} mL`,
    inputs: {
      intake_ml: data.intake,
      output_ml: data.output,
      crrt_removal_ml: data.removal,
      hours: data.hours,
      weight_kg: data.weight,
      target_dose: data.targetDose,
    },
    results: {
      net_ml: data.bal.net,
      removal_rate_ml_hr: data.bal.removalRateMlHr,
      suggested_effluent_ml_hr: data.suggestedQe,
    },
  });
  showToast("Saved to local + backend");
});

render();
