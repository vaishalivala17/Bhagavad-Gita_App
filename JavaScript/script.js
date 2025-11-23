// -------------------- FETCH ALL CHAPTERS --------------------
fetch('https://vedicscriptures.github.io/chapters')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById("chapters-container");

   data.forEach(chapter => {
      const col = document.createElement("div");
      col.classList.add("col-md-4", "col-sm-6", "col-12");

      col.innerHTML = `
        <div class="card shadow-sm h-100 border-0 chapter-card p-3">
          <div class="card-body text-center">
            <h5 class="card-title fw-bold">${chapter.chapter_number}. ${chapter.name}</h5>
            <p class="text-muted mb-3">Total Verses: ${chapter.verses_count}</p>
            <button class="btn btn-warning fw-semibold view-shlokas" 
              data-chapter="${chapter.chapter_number}"  data-name="${chapter.name}">
              📖 View Shlokas
            </button>
          </div>
        </div>
      `;
      container.appendChild(col);
    });
    // Add event listeners for "View Shlokas" buttons
    const buttons = document.querySelectorAll(".view-shlokas");
    buttons.forEach(btn => {
      btn.addEventListener("click", e => {
        const chapterNumber = e.target.getAttribute("data-chapter");
        const chapterName = e.target.getAttribute("data-name");
        loadShlokas(chapterNumber, chapterName);
      });
    });
  })
  .catch(error => console.error("❌ Error loading chapters:", error));


// -------------------- LOAD SHLOKAS IN MODAL --------------------

function loadShlokas(chapterNumber, chapterName) {
  console.log(`📘 Loading Shlokas for Chapter ${chapterNumber}: ${chapterName}`);

  const modalBody = document.getElementById("modal-body-content");
  const modalTitle = document.getElementById("shlokaModalLabel");
modalTitle.innerHTML = `<a href="Pages/chapter.html?chapter=${chapterNumber}&name=${chapterName}" 
                        class="text-decoration-none text-dark">
                        📖 ${chapterNumber}. ${chapterName}
                      </a>`;
 modalBody.innerHTML = `<p class="text-center text-muted">Loading shlokas...</p>`;

  // Try up to 80 shlokas
  let shlokaNumber = 1;
  let foundAny = false;

  const fetchNext = () => {
    fetch(`https://vedicscriptures.github.io/slok/${chapterNumber}/${shlokaNumber}`)
      .then((res) => {
        // If no more verses, stop fetching
        if (!res.ok) throw new Error("No more shlokas");
        return res.json();
      })
      .then((data) => {
        if (data && data.slok) {
          foundAny = true;
          if (shlokaNumber === 1) modalBody.innerHTML = ""; // clear loading text
          modalBody.innerHTML += createShlokaCard(
            shlokaNumber,
            data.slok,
            data.translation
          );
          shlokaNumber++;
          fetchNext(); // Fetch the next shloka
        } else {
          throw new Error("No shloka found");
        }
      })
      .catch(() => {
        if (!foundAny) {
          modalBody.innerHTML = `<p class="text-center text-danger">No shlokas found for this chapter.</p>`;
        }
      });
  };

  // Start fetching first shlok
  fetchNext();

  const modal = new bootstrap.Modal(document.getElementById("shlokaModal"));
  modal.show();
}

function createShlokaCard(number, slokText, translation) {
  return `
    <div class="p-3 mb-3 border rounded bg-light shadow-sm">
      <h6 class="fw-bold">Shloka ${number}</h6>
      <p class="fs-5 text-dark" style="font-family: 'Noto Serif Devanagari', serif;">
        ${slokText}
      </p>
      ${translation ? `<p class="text-muted fst-italic">"${translation}"</p>` : ""}
    </div>
  `;
}

