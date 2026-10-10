/** Dialysis Access Steal Syndrome — shared content config */

export const STEAL_TABS = [
  { id: "normal", label: "Normal Flow", href: "steal-normal.html", accent: "opt1" },
  { id: "phenomenon", label: "Steal Phenomenon", href: "steal-phenomenon.html", accent: "opt2" },
  { id: "pseudo", label: "Pseudoaneurysm", href: "steal-pseudoaneurysm.html", accent: "opt3" },
  { id: "treatment", label: "Treatment", href: "steal-treatment.html", accent: "opt4" },
  { id: "quiz", label: "Quick Check", href: "steal-quiz.html", accent: "opt5" },
];

export const CASE = {
  title: "79-year-old man with hand pain and a high-flow AV fistula",
  summary:
    "Right forearm radiocephalic AV fistula for 10+ years. <strong>Hand pain, paresthesias.</strong> Duplex: <strong>Flow 4,774 mL/min</strong> (normal &lt; 1,500), <strong>2.7 cm pseudoaneurysm</strong>, retrograde distal radial flow.",
  labs: [
    { text: "Flow 4,774", abn: true },
    { text: "Pseudo 2.7 cm", abn: true },
    { text: "Hand pain", abn: true },
    { text: "Retrograde flow", abn: true },
    { text: "INR 1.0", abn: false },
  ],
};

export const MODES = {
  normal: {
    accent: "opt1",
    infoTitle: "Normal AV Fistula — Blood Flow",
    infoRows: [
      { k: "Inflow", v: "Radial artery → fistula" },
      { k: "Outflow", v: "Cephalic vein → heart" },
      { k: "Hand perfusion", v: "Ulnar artery + palmar arch" },
      { k: "Access flow", v: "600–1,500 mL/min" },
    ],
    svgTitle: "Normal Flow — Radial Artery Feeds Fistula AND Hand",
    svgSubtitle: "Antegrade flow in both directions · Ulnar artery maintains hand perfusion",
    bannerBg: "#16a34a",
    bannerText1: "Normal AV Fistula — Radial Artery Feeds Fistula AND Hand",
    bannerText2: "Ulnar artery + palmar arch keep the hand perfused · Access flow 600–1,500 mL/min",
    panel1Title: "Normal Flow — Antegrade",
    panel1Tagline: "Blood flows forward in all directions",
    panel1List: [
      "<strong>Inflow:</strong> Radial artery delivers blood into the AV anastomosis",
      "<strong>Fistula:</strong> Blood flows through the low-resistance fistula into the cephalic vein",
      "<strong>Hand:</strong> The ulnar artery provides antegrade flow into the palmar arch",
      "<strong>Balance:</strong> Both the fistula and the hand receive adequate perfusion",
      "<strong>Access flow:</strong> Normally 600–1,500 mL/min — enough for dialysis",
    ],
    panel2Title: "Key Anatomy",
    panel2Tagline: "Two arteries, one hand",
    panel2List: [
      "<strong>Radial artery:</strong> Feeds the fistula + contributes to palmar arch",
      "<strong>Ulnar artery:</strong> Provides the main hand perfusion",
      "<strong>Palmar arch:</strong> Communicating network that allows either artery to compensate",
      "<strong>AV anastomosis:</strong> Connection between artery and vein that creates the fistula",
      "<strong>Why this works:</strong> Normal resistance in both the fistula and hand maintains balance",
    ],
    alertIcon: "!",
    alertTitle: "Board Pearl — Normal Fistula Flow < 1,500 mL/min",
    alertText:
      "A normal mature AV fistula carries <strong>600–1,500 mL/min</strong>. The hand is protected by the <strong>ulnar artery</strong> and <strong>palmar arch</strong>. Flow > 2,000 mL/min is a risk factor for steal.",
  },
  phenomenon: {
    accent: "opt2",
    infoTitle: "Steal Phenomenon — Retrograde Flow",
    infoRows: [
      { k: "Access flow", v: "4,774 mL/min (very high)" },
      { k: "Distal radial flow", v: "REVERSED (retrograde)" },
      { k: "Hand perfusion", v: "Diminished via ulnar only" },
      { k: "Symptoms", v: "Pain, paresthesias, cold" },
    ],
    svgTitle: "Steal Phenomenon — Retrograde Distal Radial Flow",
    svgSubtitle:
      "High-flow fistula draws blood BACKWARD through the distal radial artery → hand ischemia",
    bannerBg: "#ca8a04",
    bannerText1: "STEAL — Blood Flows Backward into the Fistula",
    bannerText2: "Retrograde flow in distal radial artery → hand ischemia → pain, paresthesias, cold",
    panel1Title: "What Is Steal?",
    panel1Tagline: "The fistula 'steals' blood from the hand",
    panel1List: [
      "<strong>Very high flow:</strong> 4,774 mL/min (normal < 1,500) — the fistula acts as a low-resistance sink",
      "<strong>Retrograde flow:</strong> Blood in the DISTAL radial artery reverses direction — flowing AWAY from the hand and INTO the fistula",
      "<strong>Ulnar compensation:</strong> The ulnar artery must now supply the entire hand — often insufficient",
      "<strong>Palmar arch:</strong> Can no longer maintain adequate perfusion pressure",
      "<strong>Result:</strong> Hand ischemia → pain, paresthesias, cold, pallor",
    ],
    panel2Title: "Risk Factors",
    panel2Tagline: "Who is at risk?",
    panel2List: [
      "<strong>High access flow:</strong> > 2,000 mL/min — strongly associated with steal",
      "<strong>Diabetes:</strong> Distal small vessel disease impairs collateral flow",
      "<strong>Peripheral arterial disease:</strong> Atherosclerosis reduces ulnar compensation",
      "<strong>Age > 60:</strong> Reduced vascular compliance",
      "<strong>Proximal fistula:</strong> Brachial-based fistulas have higher steal risk",
    ],
    alertIcon: "!",
    alertTitle: "Board Pearl — Retrograde Distal Flow = Steal",
    alertText:
      "In access-related steal, the <strong>distal radial artery flows BACKWARD</strong> into the fistula instead of forward into the hand. This is the hallmark of steal syndrome.",
  },
  pseudo: {
    accent: "opt3",
    infoTitle: "Pseudoaneurysm — What Is It?",
    infoRows: [
      { k: "Definition", v: "Blood leak contained by fibrous capsule" },
      { k: "Cause", v: "Chronic needling of the same site" },
      { k: "Size", v: "2.7 cm in this patient" },
      { k: "Risk", v: "Rupture, bleeding, thrombosis" },
    ],
    svgTitle: "Pseudoaneurysm — Weakened Vein Wall from Needling",
    svgSubtitle:
      "Blood leaks into surrounding tissue, contained by a fibrous capsule — not a true aneurysm",
    bannerBg: "#7c3aed",
    bannerText1: "Pseudoaneurysm — Disrupted Vein Wall Contained by Fibrous Capsule",
    bannerText2: "Caused by repeated needling at the same site · Risk: rupture, bleeding, thrombosis",
    panel1Title: "Pseudoaneurysm — Definition",
    panel1Tagline: "Not a true aneurysm",
    panel1List: [
      "<strong>True aneurysm:</strong> All three vessel wall layers (intima, media, adventitia) are intact but dilated",
      "<strong>Pseudoaneurysm:</strong> The vessel wall is disrupted — blood leaks out and is contained by surrounding tissue and a fibrous capsule",
      "<strong>Cause:</strong> Repeated needling of the fistula at the same site (buttonhole technique gone wrong)",
      "<strong>Appearance:</strong> Pulsatile mass at the fistula site — 2.7 cm in this patient",
      "<strong>Risk:</strong> Rupture (life-threatening bleeding), thrombosis, infection, neuropathy",
    ],
    panel2Title: "Pseudoaneurysm — Management",
    panel2Tagline: "How to treat it",
    panel2List: [
      "<strong>Observation:</strong> Small (< 2 cm), asymptomatic pseudoaneurysms can be monitored",
      "<strong>Ultrasound-guided compression:</strong> For small lesions — compress to induce thrombosis",
      "<strong>Thrombin injection:</strong> Percutaneous thrombin injected into the sac to clot it",
      "<strong>Surgical repair:</strong> Resect the pseudoaneurysm and repair the vein — preferred for large (> 2 cm) or symptomatic",
      "<strong>In this patient:</strong> 2.7 cm pseudoaneurysm → surgical repair indicated (can be combined with DRIL for steal)",
    ],
    alertIcon: "!",
    alertTitle: "Board Pearl — Pseudoaneurysm ≠ True Aneurysm",
    alertText:
      "A <strong>pseudoaneurysm</strong> is a contained rupture of the vessel wall — blood leaks out but is held in by a fibrous capsule. A <strong>true aneurysm</strong> involves all three vessel wall layers. Pseudoaneurysms are common in dialysis fistulas from repeated needling.",
  },
  treatment: {
    accent: "opt4",
    infoTitle: "Treatment Options",
    infoRows: [
      { k: "First-line", v: "Flow reduction" },
      { k: "Preferred (tissue loss)", v: "DRIL procedure" },
      { k: "Last resort", v: "Ligation + new access" },
      { k: "Goal", v: "Preserve access + relieve ischemia" },
    ],
    svgTitle: "Treatment Options — Flow Reduction & DRIL",
    svgSubtitle:
      "Banding · DRIL · Ligation — the goal is to preserve access and relieve hand ischemia",
    bannerBg: "#0891b2",
    bannerText1: "Treatment — Flow Reduction or DRIL Procedure",
    bannerText2: "DRIL preferred for steal with tissue loss · Ligation is a last resort",
    panel1Title: "Treatment Options",
    panel1Tagline: "Match intervention to severity",
    panel1List: [
      "<strong>Banding:</strong> Narrow the fistula with a band to reduce flow — simple but risk of thrombosis",
      "<strong>Plication:</strong> Surgical narrowing of the fistula vein — similar concept",
      "<strong>DRIL (Distal Revascularization-Interval Ligation):</strong> Ligate the distal artery + bypass with a vein graft — preserves access AND hand perfusion",
      "<strong>Proximalization of arterial inflow (PAI):</strong> Move the anastomosis more proximally",
      "<strong>Ligation:</strong> Last resort — closes the fistula but requires new access",
    ],
    panel2Title: "Decision for This Patient",
    panel2Tagline: "What to do here",
    panel2List: [
      "<strong>Flow 4,774 mL/min:</strong> Markedly elevated — flow reduction clearly indicated",
      "<strong>Pseudoaneurysm 2.7 cm:</strong> Surgical revision may address both issues",
      "<strong>Hand ischemia:</strong> Urgent intervention to prevent tissue loss",
      "<strong>Preferred approach:</strong> DRIL if tissue loss is present; banding if mild",
      "<strong>Multidisciplinary:</strong> Vascular surgery + interventional nephrology",
      "<strong>Post-op:</strong> Repeat duplex to confirm flow reduction and hand perfusion",
    ],
    alertIcon: "!",
    alertTitle: "Board Pearl — DRIL for Steal with Tissue Loss",
    alertText:
      "For access-related steal with <strong>tissue loss or severe ischemia</strong>, the <strong>DRIL procedure</strong> is preferred. For milder cases, banding or plication may suffice. Ligation sacrifices the access — it's a last resort.",
  },
};

export const QUIZ = [
  {
    question: "What is the primary mechanism of dialysis access steal syndrome?",
    options: [
      {
        text: "A. Increased ulnar artery flow into the hand",
        correct: false,
        explanation:
          "Ulnar flow may increase to compensate, but it does not cause steal. The steal is due to <strong>retrograde distal radial artery flow</strong>.",
      },
      {
        text: "B. Retrograde flow in the distal radial artery into the fistula",
        correct: true,
        explanation:
          "High-flow fistula creates low resistance that draws blood <strong>backwards</strong> through the distal radial artery into the fistula, away from the hand → steal.",
      },
      {
        text: "C. Venous stenosis blocking outflow",
        correct: false,
        explanation:
          "Venous stenosis causes access dysfunction and swelling, not steal. In this patient the venous anastomosis is patent (81 cm/s).",
      },
    ],
  },
  {
    question: "What is the reported access flow in this patient?",
    options: [
      {
        text: "A. 850 mL/min",
        correct: false,
        explanation: "That value is not in this case. The access flow was 4,774 mL/min.",
      },
      {
        text: "B. 4,774 mL/min",
        correct: true,
        explanation:
          "The duplex showed an estimated access volume flow of <strong>4,774 mL/min</strong> — markedly elevated (normal < 1,500).",
      },
      {
        text: "C. 220 mL/min",
        correct: false,
        explanation: "That value is from a different case. Here the flow was 4,774 mL/min.",
      },
    ],
  },
  {
    question: "What is the normal flow range for a mature AV fistula?",
    options: [
      {
        text: "A. 100–300 mL/min",
        correct: false,
        explanation: "Too low — this would not support adequate dialysis.",
      },
      {
        text: "B. 600–1,500 mL/min",
        correct: true,
        explanation:
          "A mature AV fistula typically carries <strong>600–1,500 mL/min</strong>. Flow above 2,000 mL/min is a risk factor for steal.",
      },
      {
        text: "C. 3,000–5,000 mL/min",
        correct: false,
        explanation:
          "This range is markedly elevated and puts the patient at high risk for steal syndrome.",
      },
    ],
  },
  {
    question: "What is a pseudoaneurysm?",
    options: [
      {
        text: "A. A dilated artery with all three wall layers intact",
        correct: false,
        explanation:
          "This describes a <strong>true aneurysm</strong>. A pseudoaneurysm has a disrupted wall.",
      },
      {
        text: "B. A contained rupture of the vessel wall with blood held in by a fibrous capsule",
        correct: true,
        explanation:
          "A <strong>pseudoaneurysm</strong> occurs when the vessel wall is disrupted, allowing blood to leak out and be contained by surrounding tissue and a fibrous capsule — commonly from repeated needling.",
      },
      {
        text: "C. A blood clot inside the fistula",
        correct: false,
        explanation:
          "This describes a thrombus, not a pseudoaneurysm. A pseudoaneurysm is a pulsatile, contained collection of blood outside the vessel wall.",
      },
    ],
  },
  {
    question: "Which physical exam finding is most concerning for steal syndrome?",
    options: [
      {
        text: "A. Warm hand with bounding pulse",
        correct: false,
        explanation: "A warm hand suggests adequate perfusion — not steal.",
      },
      {
        text: "B. Cool hand with delayed capillary refill and pain",
        correct: true,
        explanation:
          "Steal causes <strong>hand ischemia</strong> — cool, pale hand, delayed capillary refill, pain, and paresthesias.",
      },
      {
        text: "C. Palpable thrill at the fistula",
        correct: false,
        explanation:
          "A thrill is normal and expected in a working fistula — it does not indicate steal.",
      },
    ],
  },
  {
    question: "What is the preferred surgical treatment for steal syndrome with tissue loss?",
    options: [
      {
        text: "A. Simple banding",
        correct: false,
        explanation:
          "Banding may reduce flow but is less reliable than DRIL and risks thrombosis.",
      },
      {
        text: "B. DRIL procedure",
        correct: true,
        explanation:
          "<strong>DRIL (Distal Revascularization-Interval Ligation)</strong> is preferred for steal with tissue loss. It ligates the distal artery and bypasses with a vein graft — preserving both access and hand perfusion.",
      },
      {
        text: "C. Immediate fistula ligation",
        correct: false,
        explanation:
          "Ligation sacrifices the access and is a <strong>last resort</strong> when other options fail.",
      },
    ],
  },
  {
    question: "Which finding on duplex ultrasound most strongly suggests steal?",
    options: [
      {
        text: "A. Low access flow",
        correct: false,
        explanation:
          "Low flow suggests access dysfunction, not steal. Steal is associated with HIGH flow.",
      },
      {
        text: "B. Retrograde flow in the distal radial artery",
        correct: true,
        explanation:
          "<strong>Retrograde (reversed) flow in the distal radial artery</strong> is the hallmark of steal — blood flows away from the hand and into the fistula.",
      },
      {
        text: "C. High venous anastomotic velocity",
        correct: false,
        explanation: "Elevated venous anastomotic velocity suggests venous stenosis, not steal.",
      },
    ],
  },
  {
    question: "Which patient characteristic increases the risk of steal syndrome?",
    options: [
      {
        text: "A. Young age",
        correct: false,
        explanation:
          "Young age is protective. Older age (> 60) increases risk due to reduced vascular compliance.",
      },
      {
        text: "B. Diabetes mellitus and peripheral arterial disease",
        correct: true,
        explanation:
          "<strong>Diabetes and PAD</strong> reduce collateral flow and impair the ulnar artery's ability to compensate — increasing steal risk.",
      },
      {
        text: "C. Distal (radiocephalic) fistula location",
        correct: false,
        explanation:
          "Distal fistulas have <em>lower</em> steal risk than proximal (brachial-based) fistulas.",
      },
    ],
  },
  {
    question: "What is the goal of treatment in access-related steal syndrome?",
    options: [
      {
        text: "A. Ligate the fistula and place a catheter",
        correct: false,
        explanation:
          "Ligation is a last resort. The goal is to preserve access while relieving ischemia.",
      },
      {
        text: "B. Preserve access while relieving hand ischemia",
        correct: true,
        explanation:
          "The dual goal is to <strong>preserve the dialysis access</strong> and <strong>relieve hand ischemia</strong>. DRIL and banding achieve this.",
      },
      {
        text: "C. Increase access flow further",
        correct: false,
        explanation:
          "Increasing flow would worsen steal. The goal is to <em>reduce</em> flow to a level that preserves hand perfusion.",
      },
    ],
  },
  {
    question: "In this patient, what is the primary concern about the pseudoaneurysm?",
    options: [
      {
        text: "A. It causes the steal syndrome",
        correct: false,
        explanation:
          "The steal is caused by the HIGH-FLOW fistula, not the pseudoaneurysm. The pseudoaneurysm is a separate structural problem.",
      },
      {
        text: "B. It can rupture, causing severe bleeding",
        correct: true,
        explanation:
          "A pseudoaneurysm has a weakened wall. It can <strong>rupture</strong>, causing severe bleeding — especially concerning in a dialysis patient. It also risks thrombosis and infection.",
      },
      {
        text: "C. It is the only reason for surgical intervention",
        correct: false,
        explanation:
          "The steal syndrome also requires intervention. The pseudoaneurysm and steal may be addressed together during surgery.",
      },
    ],
  },
];
