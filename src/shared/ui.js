import "./styles.css";
import { getBackendStatus } from "./storage.js";

const PAGES = [
  { href: "index.html", id: "home", label: "Home" },
  { href: "dose.html", id: "dose", label: "Dose" },
  { href: "effluent.html", id: "effluent", label: "Effluent" },
  { href: "filtration.html", id: "filtration", label: "Filtration" },
  { href: "dilution.html", id: "dilution", label: "Dilution" },
  { href: "citrate.html", id: "citrate", label: "Citrate" },
  { href: "fluid.html", id: "fluid", label: "Fluid" },
  { href: "history.html", id: "history", label: "History" },
  { href: "halal.html", id: "halal", label: "Halal" },
  { href: "privacy.html", id: "privacy", label: "Privacy" },
];

function basePath() {
  const b = import.meta.env.BASE_URL || "/";
  return b.endsWith("/") ? b : `${b}/`;
}

export function pageUrl(file) {
  return `${basePath()}${file}`;
}

export function mountShell({ active, title }) {
  document.title = title ? `${title} · CRRT Calculators` : "CRRT Calculators";

  const header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML = `
    <div class="site-header__inner">
      <a class="brand" href="${pageUrl("index.html")}">
        <span class="brand__mark" aria-hidden="true">⊕</span>
        <span class="brand__text">CRRT Calculators<span>ICU reference toolkit</span></span>
      </a>
      <nav class="nav" aria-label="Primary">
        ${PAGES.map(
          (p) =>
            `<a href="${pageUrl(p.href)}" ${p.id === active ? 'aria-current="page"' : ""}>${p.label}</a>`
        ).join("")}
      </nav>
    </div>
  `;
  document.body.prepend(header);

  const mobile = document.createElement("nav");
  mobile.className = "mobile-nav";
  mobile.setAttribute("aria-label", "Mobile");
  mobile.innerHTML = PAGES.filter((p) => p.id !== "privacy")
    .map(
      (p) =>
        `<a href="${pageUrl(p.href)}" ${p.id === active ? 'aria-current="page"' : ""}>${p.label}</a>`
    )
    .join("");

  const wrap = document.querySelector(".wrap");
  if (wrap) wrap.prepend(mobile);

  const footer = document.createElement("footer");
  footer.className = "footer";
  footer.innerHTML = `
    <span>v${import.meta.env.VITE_APP_VERSION || "2.2.0"} · HTML + JavaScript · Educational reference only</span>
    <span><a href="${pageUrl("privacy.html")}">Privacy</a> · Hybrid local + backend storage</span>
  `;
  document.body.appendChild(footer);

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.id = "toast";
  document.body.appendChild(toast);

  document.querySelectorAll("[data-sync]").forEach((sync) => {
    getBackendStatus().then((ok) => {
      sync.classList.toggle("online", ok);
      const label = sync.querySelector(".label");
      if (label) label.textContent = ok ? "Backend synced" : "Local only";
    });
  });
}

export function showToast(message) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = message;
  el.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => el.classList.remove("show"), 2200);
}

export function num(id) {
  const el = document.getElementById(id);
  if (!el) return 0;
  const v = parseFloat(el.value);
  return Number.isFinite(v) ? v : 0;
}

export function val(id) {
  return document.getElementById(id)?.value ?? "";
}
