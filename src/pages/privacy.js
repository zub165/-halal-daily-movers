import { mountShell, showToast } from "../shared/ui.js";
import { exportAllData, wipeAllUserData } from "../shared/storage.js";

mountShell({ active: "privacy", title: "Privacy" });

document.getElementById("btn-export").addEventListener("click", async () => {
  const data = await exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `crrt-data-export-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Export downloaded");
});

document.getElementById("btn-wipe").addEventListener("click", async () => {
  if (
    !confirm(
      "Permanently delete all CRRT calculator data from this browser and the backend database?"
    )
  ) {
    return;
  }
  await wipeAllUserData();
  showToast("All user data deleted");
});
