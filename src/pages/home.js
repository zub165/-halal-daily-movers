import { mountShell } from "../shared/ui.js";
import { getBackendStatus } from "../shared/storage.js";

mountShell({ active: "home", title: "" });

getBackendStatus().then((ok) => {
  const sync = document.getElementById("sync-status");
  if (!sync) return;
  sync.classList.toggle("online", ok);
  sync.querySelector(".label").textContent = ok ? "Backend synced" : "Local storage ready";
});
