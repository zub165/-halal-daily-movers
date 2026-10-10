import { mountShell, pageUrl } from "../shared/ui.js";
import { renderCaseStrip, renderTabs } from "../steal/shell.js";
import "../steal/styles.css";

mountShell({ active: "steal", title: "Steal Syndrome" });

renderCaseStrip(document.getElementById("caseStrip"));
renderTabs(document.getElementById("tabs"), "hub");

document.getElementById("startLink")?.setAttribute("href", pageUrl("steal-normal.html"));
document.getElementById("quizLink")?.setAttribute("href", pageUrl("steal-quiz.html"));
