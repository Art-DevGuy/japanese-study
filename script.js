const englishEl = document.getElementById("english");
const jpInfEl = document.getElementById("jp-present-aff-informal");
const jpFormEl = document.getElementById("jp-present-aff-formal");
const jpTeEl = document.getElementById("jp-te-form");

const radios = document.getElementsByName("mode");
const STORAGE_KEY = "verbsData";

const vocabEnglishEl = document.getElementById("vocab-english");
const vocabJapaneseEl = document.getElementById("vocab-japanese");
const vocabRadios = document.getElementsByName("vocab-mode");
const VOCAB_STORAGE_KEY = "vocabularyData";

function getSelectedMode() {
  for (let r of radios) {
    if (r.checked) return r.value;
  }
}

function updateVisibility() {
  const mode = getSelectedMode();

  englishEl.classList.add("hidden");
  jpInfEl.classList.add("hidden");
  jpFormEl.classList.add("hidden");
  jpTeEl.classList.add("hidden");

  if (mode === "english") {
    englishEl.classList.remove("hidden");
  } else if (mode === "japanese-base") {
    jpInfEl.classList.remove("hidden");
  } else if (mode === "japanese-te") {
    jpTeEl.classList.remove("hidden");
  }
}

function getStoredVerbs() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Invalid stored verbs content:", e);
    return [];
  }
}

async function fetchAndStoreVerbs() {
  try {
    const response = await fetch("verbs.json");
    const data = await response.json();
    const verbs = data.verbs || [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(verbs));
    return verbs;
  } catch (err) {
    console.error("Error loading verbs.json:", err);
    return [];
  }
}

function fillVerb(randomVerb) {
  englishEl.textContent = randomVerb.english || "";
  jpInfEl.textContent = randomVerb["jp-present-aff-informal"] || "";
  jpFormEl.textContent = randomVerb["jp-present-aff-formal"] || "";
  jpTeEl.textContent = randomVerb["jp-te-form"] || "";
  updateVisibility();
}

function getVocabSelectedMode() {
  for (let r of vocabRadios) {
    if (r.checked) return r.value;
  }
}

function updateVocabVisibility() {
  const mode = getVocabSelectedMode();
  vocabEnglishEl.classList.add("hidden");
  vocabJapaneseEl.classList.add("hidden");
  if (mode === "english") {
    vocabEnglishEl.classList.remove("hidden");
  } else if (mode === "japanese") {
    vocabJapaneseEl.classList.remove("hidden");
  }
}

function getStoredVocab() {
  const raw = localStorage.getItem(VOCAB_STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Invalid stored vocabulary content:", e);
    return [];
  }
}

async function fetchAndStoreVocab() {
  try {
    const response = await fetch("vocabulary.json");
    const data = await response.json();
    const vocab = data.vocabulary || [];
    localStorage.setItem(VOCAB_STORAGE_KEY, JSON.stringify(vocab));
    return vocab;
  } catch (err) {
    console.error("Error loading vocabulary.json:", err);
    return [];
  }
}

function fillVocab(randomVocab) {
  vocabEnglishEl.textContent = randomVocab.english || "";
  vocabJapaneseEl.textContent = randomVocab.japanese || "";
  updateVocabVisibility();
}

function show_line(id) {
  document.getElementById(id).classList.remove("hidden");
}

function openTab(tabName) {
  // Hide all tab contents
  const contents = document.querySelectorAll('.tab-content');
  contents.forEach(content => content.classList.remove('active'));
  // Show the selected tab
  document.getElementById(tabName).classList.add('active');
  // Update button active class
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

document.getElementById("loadBtn").addEventListener("click", () => {
  const verbs = getStoredVerbs();
  if (!verbs.length) {
    console.warn("No verbs in storage. Reload or check fetch.");
    return;
  }
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
  fillVerb(randomVerb);
});

document.getElementById("showBtn").addEventListener("click", () => {
  englishEl.classList.remove("hidden");
  jpInfEl.classList.remove("hidden");
  jpFormEl.classList.remove("hidden");
  jpTeEl.classList.remove("hidden");
});

radios.forEach(radio => {
  radio.addEventListener("change", updateVisibility);
});

document.getElementById("loadVocabBtn").addEventListener("click", () => {
  const vocab = getStoredVocab();
  if (!vocab.length) {
    console.warn("No vocabulary in storage. Reload or check fetch.");
    return;
  }
  const randomVocab = vocab[Math.floor(Math.random() * vocab.length)];
  fillVocab(randomVocab);
});

document.getElementById("showVocabBtn").addEventListener("click", () => {
  vocabEnglishEl.classList.remove("hidden");
  vocabJapaneseEl.classList.remove("hidden");
});

vocabRadios.forEach(radio => {
  radio.addEventListener("change", updateVocabVisibility);
});

(async () => {
  await fetchAndStoreVerbs();
  await fetchAndStoreVocab();
  updateVisibility();
  updateVocabVisibility();
})();
