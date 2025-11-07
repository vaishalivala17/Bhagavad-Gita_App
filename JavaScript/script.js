// // ----- FETCH ALL CHAPTERS -----
// fetch('https://vedicscriptures.github.io/chapters')
//   .then(response => response.json())
//   .then(data => {
//     const container = document.getElementById("chapters-container");

//     data.forEach(chapter => {
//       const col = document.createElement("div");
//       col.classList.add("col-md-4", "col-sm-6", "col-12");

//       col.innerHTML = `
//         <div class="card shadow-sm h-100 p-3 border-warning-subtle">
//           <div class="card-body text-center">
//             <h5 class="card-title fw-bold">${chapter.chapter_number}. ${chapter.name}</h5>
//             <p class="text-muted mb-3">Total Verses: ${chapter.verses_count}</p>
//            <button class="btn btn-warning fw-semibold view-shlokas" data-chapter="${chapter.chapter}" data-name="${chapter.name}">
//               View Shlokas
//             </button>
//             <div class="mt-3">
//                 <h5>Meaning :</h5>
//                 <p class="text-muted mt-0">${chapter.meaning.en}</p>
//                 <p class="text-muted"> ${chapter.meaning.hi}</p>
//             </div>
//           </div>
//         </div>
//       `;
//       container.appendChild(col);
//     });

//     // Add event listeners for View Shlokas buttons
//    const buttons = document.querySelectorAll(".view-shlokas");
// buttons.forEach(btn => {
//   btn.addEventListener("click", e => {
//     const chapter = e.target.getAttribute("data-chapter");
//     const name = e.target.getAttribute("data-name");
//     loadShlokas(chapter, name);
//   });
// });

//   })
//   .catch(error => console.error("Error loading chapters:", error));


// // ----- LOAD SHLOKAS -----
// function loadShlokas(chapterNumber, chapterName) {
//   fetch(`https://vedicscriptures.github.io/slok/${chapterId}/1`)
//     .then(response => response.json())
//     .then(data => {
//       const modalBody = document.getElementById("modal-body-content");
//       modalBody.innerHTML = `
//         <h4 class="text-center fw-bold mb-4" style="font-family: 'Noto Serif Devanagari', serif;">
//           📖 ${chapterNumber}. ${chapterName}
//         </h4>
//       `;

//       if (data && data.slok) {
//         modalBody.innerHTML += `
//           <div class="p-3 mb-3 border rounded bg-light">
//             <h6 class="fw-bold">Shloka 1</h6>
//             <p class="fs-5 text-dark" style="font-family: 'Noto Serif Devanagari', serif;">${data.slok}</p>
//             ${data.translation ? `<p class="text-muted fst-italic">"${data.translation}"</p>` : ""}
//           </div>
//         `;
//       } else {
//         modalBody.innerHTML += `<p>No Shlokas found for this chapter.</p>`;
//       }

//       const modal = new bootstrap.Modal(document.getElementById("shlokaModal"));
//       modal.show();
//     })
//     .catch(err => {
//       console.error("Error loading shlokas:", err);
//       document.getElementById("modal-body-content").innerHTML =
//         `<p>Error loading shlokas. Please try again.</p>`;
//     });
// }

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
              data-chapter="${chapter.chapter}" 
              data-name="${chapter.name}">
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
        const chapter = e.target.getAttribute("data-chapter");
        const name = e.target.getAttribute("data-name");
        loadShlokas(chapter, name);
      });
    });
  })
  .catch(error => console.error("❌ Error loading chapters:", error));


// -------------------- LOAD SHLOKAS IN MODAL --------------------
function loadShlokas(chapterNumber, chapterName) {
  fetch(`https://vedicscriptures.github.io/slok/${chapterNumber}/1`)
    .then(response => response.json())
    .then(data => {
      const modalBody = document.getElementById("modal-body-content");
      const modalTitle = document.getElementById("shlokaModalLabel");

      modalTitle.textContent = `📖 ${chapterNumber}. ${chapterName}`;
      modalBody.innerHTML = "";

      // If data contains only one shloka
      if (data && data.slok) {
        modalBody.innerHTML += createShlokaCard(1, data.slok, data.translation);
      } 
      // If multiple shlokas (some chapters might have array data)
      else if (Array.isArray(data)) {
        data.forEach((shloka, index) => {
          modalBody.innerHTML += createShlokaCard(index + 1, shloka.slok, shloka.translation);
        });
      } 
      else {
        modalBody.innerHTML = `<p class="text-center text-danger">No Shlokas found for this chapter.</p>`;
      }

      const modal = new bootstrap.Modal(document.getElementById("shlokaModal"));
      modal.show();
    })
    .catch(err => {
      console.error("❌ Error loading shlokas:", err);
      document.getElementById("modal-body-content").innerHTML = `
        <p class="text-center text-danger">Error loading shlokas. Please try again later.</p>
      `;
    });
}


// -------------------- HELPER FUNCTION --------------------
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
