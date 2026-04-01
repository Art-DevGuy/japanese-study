const englishEl = document.getElementById("english");
const jpInfEl = document.getElementById("jp-present-aff-informal");
const jpFormEl = document.getElementById("jp-present-aff-formal");
const jpTeEl = document.getElementById("jp-te-form");

const radios = document.getElementsByName("mode");
const STORAGE_KEY = "verbsData";

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
  } else {
    jpInfEl.classList.remove("hidden");
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

(async () => {
  await fetchAndStoreVerbs();  // refresh storage every page load
  updateVisibility();
})();
