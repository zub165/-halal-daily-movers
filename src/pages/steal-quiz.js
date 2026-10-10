import { mountShell, showToast } from "../shared/ui.js";
import { saveCalculation, listCalculations, getBackendStatus } from "../shared/storage.js";
import { QUIZ } from "../steal/config.js";
import {
  mountQuizChrome,
  getQuizProgressLocal,
  setQuizProgressLocal,
  clearQuizProgressLocal,
} from "../steal/shell.js";

mountShell({ active: "steal", title: "Steal — Quiz" });
mountQuizChrome("quiz");

const quizGrid = document.getElementById("quizGrid");
const quizCount = document.getElementById("quizCount");
const scoreEl = document.getElementById("quizScore");

if (quizCount) quizCount.textContent = String(QUIZ.length);

let answers = { ...getQuizProgressLocal() };

function renderQuiz() {
  let html = "";
  for (let i = 0; i < QUIZ.length; i++) {
    const q = QUIZ[i];
    const selected = answers[i];
    html += `
      <div class="q" data-q="${i}">
        <p>${i + 1}. ${q.question}</p>
        <div class="opts">
          ${q.options
            .map((o, oi) => {
              let cls = "opt";
              if (selected !== undefined && Number(selected) === oi) {
                cls += o.correct ? " correct" : " wrong";
              }
              return `<button type="button" class="${cls}" data-q="${i}" data-o="${oi}">${o.text}</button>`;
            })
            .join("")}
        </div>
        <div class="explain${selected !== undefined ? " show" : ""}${
          selected !== undefined
            ? q.options[Number(selected)].correct
              ? " correct-explain"
              : " wrong-explain"
            : ""
        }">${
          selected !== undefined
            ? q.options[Number(selected)].correct
              ? `<strong class="correct">Correct.</strong> ${q.options[Number(selected)].explanation}`
              : `<strong class="wrong">Incorrect.</strong> ${q.options[Number(selected)].explanation}`
            : ""
        }</div>
      </div>
    `;
  }
  quizGrid.innerHTML = html;
  updateScore();
}

function updateScore() {
  const answered = Object.keys(answers).length;
  let correct = 0;
  for (const [qi, oi] of Object.entries(answers)) {
    if (QUIZ[Number(qi)]?.options[Number(oi)]?.correct) correct += 1;
  }
  if (scoreEl) {
    scoreEl.textContent =
      answered === 0
        ? "No answers yet"
        : `Score: ${correct}/${answered} answered (${QUIZ.length} total)`;
  }
}

quizGrid?.addEventListener("click", (e) => {
  const btn = e.target.closest(".opt");
  if (!btn) return;
  const qi = parseInt(btn.dataset.q, 10);
  const oi = parseInt(btn.dataset.o, 10);
  answers[qi] = oi;
  setQuizProgressLocal(answers);
  renderQuiz();
});

document.getElementById("btn-save-quiz")?.addEventListener("click", async () => {
  const answered = Object.keys(answers).length;
  let correct = 0;
  for (const [qi, oi] of Object.entries(answers)) {
    if (QUIZ[Number(qi)]?.options[Number(oi)]?.correct) correct += 1;
  }
  await saveCalculation({
    type: "steal_quiz",
    inputs: { answers },
    results: {
      correct,
      answered,
      total: QUIZ.length,
      score_pct: answered ? Math.round((correct / answered) * 100) : 0,
    },
    label: `Steal quiz ${correct}/${answered}`,
  });
  showToast("Quiz progress saved (local + backend)");
  refreshSync();
});

document.getElementById("btn-reset-quiz")?.addEventListener("click", () => {
  answers = {};
  clearQuizProgressLocal();
  renderQuiz();
  showToast("Quiz reset on this device");
});

document.getElementById("btn-restore-quiz")?.addEventListener("click", async () => {
  const items = await listCalculations();
  const latest = items.find((i) => i.type === "steal_quiz");
  if (!latest?.inputs?.answers) {
    showToast("No saved quiz found");
    return;
  }
  answers = { ...latest.inputs.answers };
  setQuizProgressLocal(answers);
  renderQuiz();
  showToast("Restored from hybrid storage");
});

async function refreshSync() {
  const online = await getBackendStatus();
  document.querySelectorAll("[data-sync]").forEach((sync) => {
    sync.classList.toggle("online", online);
    const label = sync.querySelector(".label");
    if (label) label.textContent = online ? "Backend synced" : "Local only";
  });
}

renderQuiz();
refreshSync();
