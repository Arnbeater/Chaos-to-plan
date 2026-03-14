const sections = {
  goals: document.getElementById('goals'),
  deliverables: document.getElementById('deliverables'),
  timeline: document.getElementById('timeline'),
  risks: document.getElementById('risks'),
  nextSteps: document.getElementById('nextSteps')
};

const noteInput = document.getElementById('rawNotes');
const generateBtn = document.getElementById('generateBtn');
const clearBtn = document.getElementById('clearBtn');

const categoryRules = {
  goals: [
    { pattern: /(mål|formål|succeskriterie|vision|ambition|effekt|kpi|okr)/i, weight: 4 },
    { pattern: /(øge|forbedre|reducere|nå|opnå)/i, weight: 2 }
  ],
  deliverables: [
    { pattern: /(leverance|deliverable|output|resultat|feature|prototype|dokument|prd|mvp)/i, weight: 4 },
    { pattern: /(byg|lanc|implement|udrul|release)/i, weight: 2 }
  ],
  timeline: [
    { pattern: /(tidslinje|deadline|senest|milepæl|q[1-4]|kvartal|uge\s*\d{1,2}|måned|mandag|tirsdag|onsdag|torsdag|fredag|lørdag|søndag)/i, weight: 4 },
    { pattern: /\b\d{1,2}[\/.\-]\d{1,2}([\/.\-]\d{2,4})?\b/, weight: 3 }
  ],
  risks: [
    { pattern: /(risiko|blokering|afhængighed|problem|issue|flaskehals|mangler|uklar|usikker|constraint)/i, weight: 4 },
    { pattern: /(hvis|ellers|kan fejle|forsink|forsinkelse)/i, weight: 2 }
  ],
  nextSteps: [
    { pattern: /(næste skridt|next step|todo|to-do|action|opfølgning|afklar|book|send|ring|mød)/i, weight: 4 },
    { pattern: /(skal|bør|lav|gør|start)/i, weight: 2 }
  ]
};

const fallbackOrder = ['goals', 'deliverables', 'timeline', 'risks', 'nextSteps'];

function normalizeLines(rawText) {
  return rawText
    .split(/\n|•|\t/)
    .flatMap((line) => line.split(/[.;!?]+/))
    .map((line) => line.replace(/^[-*]\s*/, '').trim())
    .filter(Boolean);
}

function detectSignals(line) {
  return {
    hasDate: /\b\d{1,2}[\/.\-]\d{1,2}([\/.\-]\d{2,4})?\b/.test(line),
    hasResponsibility: /(team|ansvarlig|owner|ejer|pm|dev|designer|salg)/i.test(line),
    hasMeasure: /\b\d+\s*(%|procent|kr|dage|uger|brugere|kunder)\b/i.test(line)
  };
}

function scoreLine(line) {
  const score = Object.fromEntries(Object.keys(categoryRules).map((key) => [key, 0]));

  Object.entries(categoryRules).forEach(([category, rules]) => {
    rules.forEach((rule) => {
      if (rule.pattern.test(line)) {
        score[category] += rule.weight;
      }
    });
  });

  const signals = detectSignals(line);
  if (signals.hasDate) score.timeline += 2;
  if (signals.hasResponsibility) score.nextSteps += 1;
  if (signals.hasMeasure) score.goals += 1;

  return score;
}

function chooseCategory(score, index) {
  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const [bestCategory, bestScore] = sorted[0];

  if (bestScore > 0) {
    return bestCategory;
  }

  return fallbackOrder[index % fallbackOrder.length];
}

function cleanPrefix(line) {
  return line
    .replace(/^(mål|goal|formål|leverance|deliverable|tidslinje|risiko|næste skridt|todo|action|deadline)\s*:?\s*/i, '')
    .trim();
}

function categorize(lines) {
  const output = {
    goals: [],
    deliverables: [],
    timeline: [],
    risks: [],
    nextSteps: []
  };

  lines.forEach((line, index) => {
    const cleaned = cleanPrefix(line);
    if (!cleaned) return;

    const score = scoreLine(cleaned);
    const category = chooseCategory(score, index);
    output[category].push(cleaned);
  });

  return addSystemSuggestions(output);
}

function addSystemSuggestions(output) {
  const enriched = JSON.parse(JSON.stringify(output));

  if (enriched.goals.length > 0 && enriched.deliverables.length === 0) {
    enriched.deliverables.push('Definér 1-2 konkrete leverancer, der realiserer målet.');
  }

  if (enriched.timeline.length === 0 && (enriched.deliverables.length > 0 || enriched.nextSteps.length > 0)) {
    enriched.timeline.push('Sæt første milepæl og deadline for den vigtigste leverance.');
  }

  if (enriched.risks.length === 0 && enriched.deliverables.length > 0) {
    enriched.risks.push('Vurdér vigtigste afhængigheder og hvad der kan blokere leverancen.');
  }

  if (enriched.nextSteps.length === 0 && enriched.deliverables.length > 0) {
    enriched.nextSteps.push('Book et 30 min kickoff og fordel ansvar på første leverance.');
  }

  return enriched;
}

function renderList(node, items) {
  node.innerHTML = '';

  if (items.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty';
    empty.textContent = 'Ingen noter endnu';
    node.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    node.appendChild(li);
  });
}

function renderAll(result) {
  Object.entries(sections).forEach(([key, node]) => {
    renderList(node, result[key]);
  });
}

function resetView() {
  noteInput.value = '';
  renderAll({ goals: [], deliverables: [], timeline: [], risks: [], nextSteps: [] });
}

generateBtn.addEventListener('click', () => {
  const rawText = noteInput.value.trim();
  const lines = normalizeLines(rawText);
  const result = categorize(lines);
  renderAll(result);
});

clearBtn.addEventListener('click', resetView);

resetView();
