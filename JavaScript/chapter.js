// ---------------- GET CHAPTER INFO FROM URL ----------------
const urlParams = new URLSearchParams(window.location.search);
const chapterNumber = urlParams.get("chapter");
const chapterName = urlParams.get("name");

// Display chapter name
document.getElementById("chapterTitle").textContent = `${chapterNumber}. ${chapterName}`;

let currentPage = 1;
const shlokasPerPage = 5; // number of shlokas per page
let allShlokas = [];

// ---------------- FETCH SHLOKAS ----------------
async function loadShlokas() {
      try {
        const url = `https://vedicscriptures.github.io/slok/${chapterNumber}.json`;
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Failed to fetch ${url} (status ${res.status})`);
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          allShlokas = data.slice(); 
        } else if (data && data.slok) {
          allShlokas = [data];
        } else if (data && typeof data === "object") {
          // convert object with numeric keys to array
          allShlokas = Object.values(data);
        } else {
          allShlokas = [];
        }

        allShlokas = allShlokas
          .filter(s => s && s.slok && String(s.slok).trim() !== "")
          .map(s => ({ slok: s.slok || "", translation: s.translation || "" }));

        allShlokas = allShlokas.filter((s, i, arr) => i === arr.findIndex(t => t.slok === s.slok));

        if (allShlokas.length === 0) {
          containerEl.innerHTML = `<p class="text-center text-danger">⚠️ No shlokas found for this chapter.</p>`;
          prevBtn.disabled = true;
          nextBtn.disabled = true;
          return;
        }

        const totalPages = Math.ceil(allShlokas.length / shlokasPerPage);
        if (currentPage > totalPages) currentPage = totalPages;

        renderShlokas();
      } catch (err) {
        console.error("Error in loadShlokas():", err);
        containerEl.innerHTML = `<p class="text-center text-danger">⚠️ Error loading shlokas. ${err.message}</p>`;
        prevBtn.disabled = true;
        nextBtn.disabled = true;
      }
    }

// ---------------- DISPLAY SHLOKAS ----------------
function renderShlokas() {
  const container = document.getElementById("shlokasContainer");
  container.innerHTML = "";

  const startIndex = (currentPage - 1) * shlokasPerPage;
  const endIndex = Math.min(startIndex + shlokasPerPage, allShlokas.length);
  const pageShlokas = allShlokas.slice(startIndex, endIndex);

  pageShlokas.forEach((shloka, i) => {
    const div = document.createElement("div");
    div.classList.add("p-3", "mb-3", "border", "rounded", "bg-white", "shadow-sm");

    div.innerHTML = `
      <h6 class="fw-bold">Shloka ${startIndex + i + 1}</h6>
      <p class="fs-5 text-dark" style="font-family: 'Noto Serif Devanagari', serif;">
        ${shloka.slok}
      </p>
      <button class="btn btn-outline-warning btn-sm toggle-meaning">Show Meaning</button>
      <p class="text-muted fst-italic mt-2 meaning" style="display:none;">
        "${shloka.translation || 'Meaning not available.'}"
      </p>
    `;

    container.appendChild(div);
  });

  updateButtons();
  attachMeaningToggle();
}

// ---------------- PREVIOUS & NEXT BUTTON ----------------
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderShlokas();
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  const totalPages = Math.ceil(allShlokas.length / shlokasPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderShlokas();
  }
});

function updateButtons() {
  const totalPages = Math.ceil(allShlokas.length / shlokasPerPage);
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

// ---------------- TOGGLE MEANING ----------------
function attachMeaningToggle() {
  document.querySelectorAll(".toggle-meaning").forEach(btn => {
    btn.addEventListener("click", e => {
      const meaning = e.target.nextElementSibling;
      const isVisible = meaning.style.display === "block";
      meaning.style.display = isVisible ? "none" : "block";
      e.target.textContent = isVisible ? "Show Meaning" : "Hide Meaning";
    });
  });
}

// ---------------- INITIAL CALL ----------------
loadShlokas();
