import { pageUrl } from "../shared/ui.js";
import { CASE, MODES, STEAL_TABS } from "./config.js";
import { renderDiagramSvg } from "./diagrams.js";
import "./styles.css";

const QUIZ_PROGRESS_KEY = "steal_quiz_progress_v1";

export function getQuizProgressLocal() {
  try {
    return JSON.parse(localStorage.getItem(QUIZ_PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
}

export function setQuizProgressLocal(progress) {
  localStorage.setItem(QUIZ_PROGRESS_KEY, JSON.stringify(progress));
}

export function clearQuizProgressLocal() {
  localStorage.removeItem(QUIZ_PROGRESS_KEY);
}

export function renderCaseStrip(root) {
  const labs = CASE.labs
    .map((l) => `<span class="lab-chip${l.abn ? " abn" : ""}">${l.text}</span>`)
    .join("");
  root.innerHTML = `
    <div>
      <h2>${CASE.title}</h2>
      <p>${CASE.summary}</p>
    </div>
    <div class="labs">${labs}</div>
  `;
}

export function renderTabs(root, activeId) {
  root.innerHTML = STEAL_TABS.map((t) => {
    const active = t.id === activeId ? " active" : "";
    return `<a class="tab ${t.accent}${active}" href="${pageUrl(t.href)}">${t.label}</a>`;
  }).join("");
}

export function mountModePage(modeId) {
  const mode = MODES[modeId];
  if (!mode) return;

  const caseEl = document.getElementById("caseStrip");
  const tabsEl = document.getElementById("tabs");
  const stageEl = document.getElementById("stage");
  if (caseEl) renderCaseStrip(caseEl);
  if (tabsEl) renderTabs(tabsEl, modeId);

  if (stageEl) {
    stageEl.innerHTML = `
      ${renderDiagramSvg(modeId, mode)}
      <div class="info-float highlight-${mode.accent}" id="infoPanel">
        <button type="button" class="info-header" id="infoToggle" aria-expanded="true">
          <h4 id="infoTitle">${mode.infoTitle}</h4>
          <span class="toggle-btn" id="toggleBtn">Hide</span>
        </button>
        <div class="info-body" id="infoBody">
          ${mode.infoRows
            .map(
              (r) =>
                `<div class="row"><span class="k">${r.k}</span><span class="v">${r.v}</span></div>`
            )
            .join("")}
        </div>
      </div>
    `;

    let collapsed = false;
    document.getElementById("infoToggle")?.addEventListener("click", () => {
      collapsed = !collapsed;
      const panel = document.getElementById("infoPanel");
      const btn = document.getElementById("toggleBtn");
      panel?.classList.toggle("collapsed", collapsed);
      if (btn) btn.textContent = collapsed ? "Show" : "Hide";
      document.getElementById("infoToggle")?.setAttribute("aria-expanded", String(!collapsed));
    });
  }

  const p1 = document.getElementById("panel1");
  const p2 = document.getElementById("panel2");
  if (p1) {
    p1.className = `panel-teach one ${mode.accent}`;
    p1.innerHTML = `
      <h3>${mode.panel1Title}</h3>
      <p class="tagline">${mode.panel1Tagline}</p>
      <ul>${mode.panel1List.map((li) => `<li>${li}</li>`).join("")}</ul>
    `;
  }
  if (p2) {
    p2.className = `panel-teach two ${mode.accent}`;
    p2.innerHTML = `
      <h3>${mode.panel2Title}</h3>
      <p class="tagline">${mode.panel2Tagline}</p>
      <ul>${mode.panel2List.map((li) => `<li>${li}</li>`).join("")}</ul>
    `;
  }

  const alert = document.getElementById("alertBox");
  if (alert) {
    alert.className = `alert ${mode.accent}`;
    alert.innerHTML = `
      <div class="icon" aria-hidden="true">${mode.alertIcon}</div>
      <div>
        <h3>${mode.alertTitle}</h3>
        <p>${mode.alertText}</p>
      </div>
    `;
  }
}

export function mountQuizChrome(activeId = "quiz") {
  const caseEl = document.getElementById("caseStrip");
  const tabsEl = document.getElementById("tabs");
  if (caseEl) renderCaseStrip(caseEl);
  if (tabsEl) renderTabs(tabsEl, activeId);
}
