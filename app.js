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

const rules = [
  { key: 'goals', pattern: /(mål|goal|formål|succeskriterie)/i },
  { key: 'deliverables', pattern: /(leverance|deliverable|output|resultat|feature)/i },
  { key: 'timeline', pattern: /(tidslinje|deadline|uge|måned|q[1-4]|dato|senest|milepæl)/i },
  { key: 'risks', pattern: /(risiko|blokering|afhængighed|problem|issue)/i },
  { key: 'nextSteps', pattern: /(næste skridt|next step|action|todo|to-do|opfølgning)/i }
];

function normalizeLines(rawText) {
  return rawText
    .split(/\n|\.|;|•|- /)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function categorize(lines) {
  const output = {
    goals: [],
    deliverables: [],
    timeline: [],
    risks: [],
    nextSteps: []
  };

  const fallbackOrder = ['goals', 'deliverables', 'timeline', 'risks', 'nextSteps'];

  lines.forEach((line, index) => {
    const matchedRule = rules.find((rule) => rule.pattern.test(line));

    if (matchedRule) {
      output[matchedRule.key].push(cleanPrefix(line));
      return;
    }

    const fallbackKey = fallbackOrder[index % fallbackOrder.length];
    output[fallbackKey].push(line);
  });

  return output;
}

function cleanPrefix(line) {
  return line.replace(/^(mål|goal|formål|leverance|deliverable|tidslinje|risiko|næste skridt)\s*:?\s*/i, '').trim();
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
