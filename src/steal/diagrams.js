/** SVG diagram bodies for each steal-guide mode (injected into the shared SVG shell). */

const DEFS = `
  <defs>
    <linearGradient id="arteryGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#dc2626"/><stop offset="100%" stop-color="#991b1b"/>
    </linearGradient>
    <linearGradient id="veinGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3b82f6"/><stop offset="100%" stop-color="#1e40af"/>
    </linearGradient>
    <linearGradient id="stealGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f59e0b"/><stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <radialGradient id="pseudoGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#c4b5fd"/><stop offset="100%" stop-color="#7c3aed"/>
    </radialGradient>
    <marker id="arrowRed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 Z" fill="#dc2626"/>
    </marker>
    <marker id="arrowBlue" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 Z" fill="#2563eb"/>
    </marker>
    <marker id="arrowAmber" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 Z" fill="#d97706"/>
    </marker>
    <marker id="arrowPurple" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto">
      <path d="M 0 0 L 10 5 L 0 10 Z" fill="#7c3aed"/>
    </marker>
  </defs>
`;

const FOREARM = `
  <path d="M 200 150 Q 180 400 200 650 L 500 670 Q 520 400 500 150 Z"
        fill="#fef3c7" stroke="#d97706" stroke-width="2.5" opacity="0.4"/>
  <text x="350" y="130" text-anchor="middle" font-size="12" font-weight="800" fill="#92400e">RIGHT FOREARM (volar view)</text>
`;

export const DIAGRAMS = {
  normal: `
    ${FOREARM}
    <path d="M 260 180 L 260 350 Q 260 400 340 420 L 450 420"
          stroke="url(#arteryGrad)" stroke-width="14" fill="none" stroke-linecap="round" class="flow-fwd" marker-end="url(#arrowRed)"/>
    <text x="240" y="170" text-anchor="middle" font-size="11" font-weight="800" fill="#7f1d1d">Radial A. (INFLOW)</text>
    <circle cx="470" cy="420" r="20" fill="#fbbf24" stroke="#78350f" stroke-width="3" class="pulse-node"/>
    <text x="470" y="425" text-anchor="middle" font-size="11" font-weight="800" fill="#78350f">AV</text>
    <text x="470" y="465" text-anchor="middle" font-size="11" font-weight="800" fill="#78350f">Anastomosis</text>
    <path d="M 400 180 L 400 500 Q 400 580 350 620"
          stroke="url(#arteryGrad)" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.9" class="flow-fwd" marker-end="url(#arrowRed)"/>
    <text x="420" y="170" text-anchor="middle" font-size="11" font-weight="800" fill="#7f1d1d">Ulnar A.</text>
    <ellipse cx="350" cy="680" rx="60" ry="45" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5"/>
    <text x="350" y="675" text-anchor="middle" font-size="13" font-weight="800" fill="#7f1d1d">HAND</text>
    <text x="350" y="695" text-anchor="middle" font-size="10" font-weight="800" fill="#16a34a">WELL PERFUSED</text>
    <path d="M 490 420 L 700 400 Q 850 350 950 250"
          stroke="url(#veinGrad)" stroke-width="18" fill="none" stroke-linecap="round" class="flow-fwd" marker-end="url(#arrowBlue)"/>
    <text x="850" y="230" text-anchor="middle" font-size="11" font-weight="800" fill="#1e3a8a">Cephalic V. (OUTFLOW)</text>
    <text x="350" y="390" text-anchor="middle" font-size="11" font-weight="800" fill="#dc2626">Blood flows INTO fistula</text>
    <text x="700" y="350" text-anchor="middle" font-size="11" font-weight="800" fill="#2563eb">Returns to heart</text>
    <text x="380" y="550" text-anchor="middle" font-size="11" font-weight="800" fill="#dc2626">Ulnar A. → hand</text>
    <g transform="translate(60, 700)">
      <line x1="0" y1="0" x2="30" y2="0" stroke="#dc2626" stroke-width="6" class="flow-fwd" marker-end="url(#arrowRed)"/>
      <text x="45" y="4" font-size="10" font-weight="700" fill="#7f1d1d">Antegrade flow (into hand + fistula)</text>
    </g>
  `,

  phenomenon: `
    ${FOREARM}
    <path d="M 260 180 L 260 350 Q 260 400 340 420 L 450 420"
          stroke="url(#arteryGrad)" stroke-width="14" fill="none" stroke-linecap="round" class="flow-fwd" marker-end="url(#arrowRed)"/>
    <text x="240" y="170" text-anchor="middle" font-size="11" font-weight="800" fill="#7f1d1d">Radial A. (INFLOW)</text>
    <circle cx="470" cy="420" r="24" fill="#fbbf24" stroke="#78350f" stroke-width="3" class="pulse-node"/>
    <text x="470" y="425" text-anchor="middle" font-size="11" font-weight="800" fill="#78350f">AV</text>
    <text x="470" y="465" text-anchor="middle" font-size="11" font-weight="800" fill="#78350f">Low-resistance "SINK"</text>
    <path d="M 350 600 Q 400 550 440 460 L 450 440"
          stroke="url(#stealGrad)" stroke-width="14" fill="none" stroke-linecap="round" class="flow-rev" marker-end="url(#arrowAmber)"/>
    <text x="350" y="580" text-anchor="middle" font-size="12" font-weight="800" fill="#b45309">REVERSED FLOW</text>
    <text x="350" y="560" text-anchor="middle" font-size="10" font-weight="700" fill="#d97706">Blood flows AWAY from hand → into fistula</text>
    <path d="M 400 180 L 400 500 Q 400 580 350 620"
          stroke="url(#arteryGrad)" stroke-width="12" fill="none" stroke-linecap="round" opacity="0.4" class="flow-fwd" marker-end="url(#arrowRed)"/>
    <text x="420" y="170" text-anchor="middle" font-size="11" font-weight="800" fill="#7f1d1d">Ulnar A.</text>
    <text x="440" y="530" text-anchor="middle" font-size="10" font-weight="700" fill="#991b1b">Insufficient alone</text>
    <ellipse cx="350" cy="680" rx="60" ry="45" fill="#fef2f2" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="6 4"/>
    <text x="350" y="675" text-anchor="middle" font-size="13" font-weight="800" fill="#991b1b">HAND</text>
    <text x="350" y="695" text-anchor="middle" font-size="10" font-weight="800" fill="#dc2626">PAIN + PARESTHESIAS</text>
    <path d="M 490 420 L 700 400 Q 850 350 950 250"
          stroke="url(#veinGrad)" stroke-width="28" fill="none" stroke-linecap="round" class="flow-fwd" marker-end="url(#arrowBlue)"/>
    <text x="850" y="220" text-anchor="middle" font-size="12" font-weight="800" fill="#1e3a8a">HIGH FLOW</text>
    <text x="850" y="238" text-anchor="middle" font-size="11" font-weight="700" fill="#1e40af">4,774 mL/min</text>
    <g transform="translate(600, 480)" class="pulse-warn">
      <circle r="22" fill="#fef2f2" stroke="#dc2626" stroke-width="2"/>
      <text x="0" y="7" text-anchor="middle" font-size="20" font-weight="800" fill="#dc2626">!</text>
    </g>
    <g transform="translate(60, 700)">
      <line x1="0" y1="0" x2="30" y2="0" stroke="#dc2626" stroke-width="6" class="flow-fwd" marker-end="url(#arrowRed)"/>
      <text x="45" y="4" font-size="10" font-weight="700" fill="#7f1d1d">Antegrade flow</text>
      <line x1="0" y1="22" x2="30" y2="22" stroke="#d97706" stroke-width="6" class="flow-rev" marker-end="url(#arrowAmber)"/>
      <text x="45" y="26" font-size="10" font-weight="700" fill="#b45309">Retrograde (STEAL) flow</text>
    </g>
  `,

  pseudo: `
    ${FOREARM}
    <path d="M 260 180 L 260 350 Q 260 400 340 420 L 450 420"
          stroke="url(#arteryGrad)" stroke-width="14" fill="none" stroke-linecap="round" class="flow-fwd" marker-end="url(#arrowRed)"/>
    <circle cx="470" cy="420" r="20" fill="#fbbf24" stroke="#78350f" stroke-width="3" class="pulse-node"/>
    <text x="470" y="425" text-anchor="middle" font-size="11" font-weight="800" fill="#78350f">AV</text>
    <path d="M 490 420 L 700 400 Q 850 350 950 250"
          stroke="url(#veinGrad)" stroke-width="18" fill="none" stroke-linecap="round" class="flow-fwd" marker-end="url(#arrowBlue)"/>
    <g transform="translate(750, 380)">
      <ellipse rx="60" ry="50" fill="url(#pseudoGrad)" stroke="#5b21b6" stroke-width="3" class="pulse-node"/>
      <text x="0" y="-10" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">PSEUDO-</text>
      <text x="0" y="8" text-anchor="middle" font-size="12" font-weight="800" fill="#fff">ANEURYSM</text>
      <text x="0" y="28" text-anchor="middle" font-size="10" fill="#ede9fe">2.7 cm</text>
    </g>
    <path d="M 750 460 L 750 440" stroke="#5b21b6" stroke-width="3" marker-end="url(#arrowPurple)"/>
    <text x="750" y="480" text-anchor="middle" font-size="11" font-weight="800" fill="#5b21b6">Weakened vein wall</text>
    <text x="750" y="498" text-anchor="middle" font-size="10" fill="#7c3aed">from repeated needling</text>
    <ellipse cx="350" cy="680" rx="60" ry="45" fill="#fee2e2" stroke="#dc2626" stroke-width="2.5"/>
    <text x="350" y="675" text-anchor="middle" font-size="13" font-weight="800" fill="#7f1d1d">HAND</text>
    <g transform="translate(60, 700)">
      <ellipse cx="10" cy="0" rx="15" ry="12" fill="url(#pseudoGrad)" stroke="#5b21b6" stroke-width="1.5"/>
      <text x="45" y="4" font-size="10" font-weight="700" fill="#5b21b6">Pseudoaneurysm</text>
    </g>
  `,

  treatment: `
    <text x="600" y="110" text-anchor="middle" font-size="15" font-weight="800" fill="#155e75">TREATMENT OPTIONS FOR STEAL SYNDROME</text>
    <g transform="translate(100, 160)">
      <rect x="0" y="0" width="300" height="200" rx="12" fill="#cffafe" stroke="#0891b2" stroke-width="2.5"/>
      <text x="150" y="32" text-anchor="middle" font-size="14" font-weight="800" fill="#155e75">1. BANDING / PLICATION</text>
      <circle cx="150" cy="85" r="24" fill="#0891b2" opacity="0.25"/>
      <text x="150" y="93" text-anchor="middle" font-size="18" font-weight="800" fill="#155e75">B</text>
      <text x="150" y="130" text-anchor="middle" font-size="11" fill="#155e75">Narrow the fistula to</text>
      <text x="150" y="150" text-anchor="middle" font-size="11" fill="#155e75">reduce flow</text>
      <text x="150" y="180" text-anchor="middle" font-size="10" font-weight="800" fill="#991b1b">Mild steal only</text>
    </g>
    <g transform="translate(450, 160)">
      <rect x="0" y="0" width="300" height="200" rx="12" fill="#cffafe" stroke="#0891b2" stroke-width="2.5"/>
      <text x="150" y="32" text-anchor="middle" font-size="14" font-weight="800" fill="#155e75">2. DRIL PROCEDURE</text>
      <circle cx="150" cy="85" r="24" fill="#0891b2" opacity="0.25"/>
      <text x="150" y="93" text-anchor="middle" font-size="18" font-weight="800" fill="#155e75">D</text>
      <text x="150" y="130" text-anchor="middle" font-size="11" fill="#155e75">Ligate distal artery +</text>
      <text x="150" y="150" text-anchor="middle" font-size="11" fill="#155e75">bypass with vein graft</text>
      <text x="150" y="180" text-anchor="middle" font-size="10" font-weight="800" fill="#16a34a">Preferred (tissue loss)</text>
    </g>
    <g transform="translate(800, 160)">
      <rect x="0" y="0" width="300" height="200" rx="12" fill="#cffafe" stroke="#0891b2" stroke-width="2.5"/>
      <text x="150" y="32" text-anchor="middle" font-size="14" font-weight="800" fill="#155e75">3. LIGATION</text>
      <circle cx="150" cy="85" r="24" fill="#0891b2" opacity="0.25"/>
      <text x="150" y="93" text-anchor="middle" font-size="18" font-weight="800" fill="#155e75">L</text>
      <text x="150" y="130" text-anchor="middle" font-size="11" fill="#155e75">Close the fistula,</text>
      <text x="150" y="150" text-anchor="middle" font-size="11" fill="#155e75">create new access</text>
      <text x="150" y="180" text-anchor="middle" font-size="10" font-weight="800" fill="#991b1b">Last resort only</text>
    </g>
    <g transform="translate(200, 430)">
      <rect x="0" y="0" width="800" height="200" rx="14" fill="#ecfeff" stroke="#0891b2" stroke-width="2.5"/>
      <text x="400" y="35" text-anchor="middle" font-size="15" font-weight="800" fill="#155e75">DECISION FOR THIS PATIENT</text>
      <text x="400" y="72" text-anchor="middle" font-size="12" fill="#334155">Flow 4,774 mL/min → markedly elevated → flow reduction indicated</text>
      <text x="400" y="102" text-anchor="middle" font-size="12" fill="#334155">Pseudoaneurysm 2.7 cm → surgical revision may address both issues</text>
      <text x="400" y="132" text-anchor="middle" font-size="12" fill="#334155">Hand ischemia symptoms → urgent intervention</text>
      <text x="400" y="162" text-anchor="middle" font-size="12" fill="#334155">Multidisciplinary: vascular surgery + interventional nephrology</text>
      <text x="400" y="190" text-anchor="middle" font-size="12" font-weight="800" fill="#0891b2">Goal: preserve access + relieve hand ischemia</text>
    </g>
  `,
};

export function renderDiagramSvg(modeId, mode) {
  const body = DIAGRAMS[modeId] || "";
  return `
    <svg class="diagram" viewBox="0 0 1200 780" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="svg-title svg-subtitle">
      ${DEFS}
      <rect width="1200" height="780" fill="#fdfdfd"/>
      <text id="svg-title" x="600" y="35" text-anchor="middle" font-size="17" font-weight="800" fill="#0f172a">${escapeXml(mode.svgTitle)}</text>
      <text id="svg-subtitle" x="600" y="58" text-anchor="middle" font-size="12" fill="#64748b">${escapeXml(mode.svgSubtitle)}</text>
      <g id="diagram-body">${body}</g>
      <g transform="translate(600, 745)">
        <rect id="banner-bg" x="-540" y="-28" width="1080" height="56" rx="14" fill="${mode.bannerBg}" opacity="0.95"/>
        <text id="banner-text-1" x="0" y="-3" text-anchor="middle" font-size="15" font-weight="800" fill="#fff">${escapeXml(mode.bannerText1)}</text>
        <text id="banner-text-2" x="0" y="18" text-anchor="middle" font-size="11" fill="#fee2e2">${escapeXml(mode.bannerText2)}</text>
      </g>
    </svg>
  `;
}

function escapeXml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
