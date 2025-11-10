// chapter.js
// ---------------- GET CHAPTER INFO FROM URL ----------------
const urlParams = new URLSearchParams(window.location.search);
const chapterNumber = urlParams.get("chapter");
const chapterName = urlParams.get("name");

// FIX 1: Corrected ID from chapter-title to chapterTitle (matching chapter.html)
document.getElementById("chapterTitle").textContent = `${chapterNumber}. ${chapterName}`;

// ---------------- PAGINATION VARIABLES ----------------
let currentPage = 1;
const shlokasPerPage = 5; // number of shlokas per page
let allShlokas = [];

// ---------------- FETCH SHLOKAS ----------------
async function loadShlokas() {
  try {
    // FIX 2: Corrected URL variable from chapter.chapterNumber to chapterNumber (Fixes Line 7 error)
    const shlokaRes = await fetch(`https://vedicscriptures.github.io/slok/${chapterNumber}.json`);
    const shlokaData = await shlokaRes.json();

    // Normalize structure
    if (Array.isArray(shlokaData)) {
      allShlokas = shlokaData.filter(
        s => s && s.slok && s.slok.trim() !== ""
      );
    } else if (shlokaData.slok) {
      allShlokas = [shlokaData];
    } else if (typeof shlokaData === "object") {
      // Some APIs return an object with numbered keys
      allShlokas = Object.values(shlokaData).filter(
        s => s && s.slok && s.slok.trim() !== ""
      );
    }

    // Safety check — remove duplicates
    allShlokas = allShlokas.filter(
      (s, i, arr) =>
        i === arr.findIndex(t => t.slok === s.slok)
    );

    if (allShlokas.length === 0) {
      // FIX 3: Corrected container ID to shlokasContainer (matching chapter.html)
      document.getElementById("shlokasContainer").innerHTML =
        `<p class="text-center text-danger">⚠️ No shlokas found for this chapter.</p>`;
      return;
    }

    renderShlokas();
    
    // 2. Fetch Chapter Details for "Show All Details" button
    const chaptersRes = await fetch('https://vedicscriptures.github.io/chapters');
    const chaptersData = await chaptersRes.json();
    
    // Find the specific chapter details
    const chapterDetails = chaptersData.find(c => c.chapter_number == chapterNumber);
    
    if (chapterDetails) {
        // Set the details content (Hindi and English meanings)
        const detailsContent = document.getElementById("detailsContent");
        detailsContent.innerHTML = `
            <h6 class="fw-bold mt-3">English Summary:</h6>
            <p>${chapterDetails.meaning.en}</p>
            <h6 class="fw-bold mt-3" style="font-family: 'Noto Serif Devanagari', serif;">हिन्दी सारांश:</h6>
            <p style="font-family: 'Noto Serif Devanagari', serif;">${chapterDetails.meaning.hi}</p>
            <h6 class="fw-bold mt-3">Chapter Summary:</h6>
            <p>${chapterDetails.summary.en}</p>
        `;
    }
    
  } catch (err) {
    console.error("Error loading shlokas:", err);
    // FIX 3: Corrected container ID
    document.getElementById("shlokasContainer").innerHTML =
      `<p class="text-center text-danger">⚠️ Error loading shlokas. Please try again later.</p>`;
  }
}

// ---------------- DISPLAY SHLOKAS ----------------
function renderShlokas() {
  // FIX 3: Corrected container ID
  const container = document.getElementById("shlokasContainer");
  container.innerHTML = "";

  const startIndex = (currentPage - 1) * shlokasPerPage;
  const endIndex = Math.min(startIndex + shlokasPerPage, allShlokas.length);
  const pageShlokas = allShlokas.slice(startIndex, endIndex);

  pageShlokas.forEach((shloka, i) => {
    const div = document.createElement("div");
    div.classList.add("shloka-card", "p-3", "mb-3", "border", "rounded", "bg-white", "shadow-sm");

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
  // Line 107 no longer errors because chapterNumber is correctly set
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

// ---------------- TOGGLE FULL DETAILS ----------------
document.getElementById("showDetailsBtn").addEventListener("click", () => {
  const detailsSection = document.getElementById("detailsSection");
  const button = document.getElementById("showDetailsBtn");

  // Toggle display of the section
  if (detailsSection.style.display === 'block') {
    detailsSection.style.display = 'none';
    button.textContent = 'Show All Details';
  } else {
    detailsSection.style.display = 'block';
    button.textContent = 'Hide Details';
  }
});

// ---------------- INITIAL CALL ----------------
loadShlokas();
