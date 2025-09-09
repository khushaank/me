document.addEventListener("DOMContentLoaded", () => {
  const albumGrid = document.getElementById("albumGrid");
  const searchInput = document.getElementById("albumSearch");
  let photos = [];

  let lightboxOverlay, lightboxImg, downloadBtn;

  // Load JSON
  fetch("album.json")
    .then((res) => res.json())
    .then((data) => {
      photos = data;
      renderPhotos(photos);
      setupLightbox();
      setupPhotoCardListeners();
      populateFilterTags(photos);
    })
    .catch((err) => console.error("Error loading album.json:", err));

  function renderPhotos(list) {
    albumGrid.innerHTML = "";
    list.forEach((photo) => {
      const card = document.createElement("div");
      card.className = "photo-card";
      card.innerHTML = `
        <img src="${photo.src}" alt="${photo.title}">
        <div class="photo-meta">
          <div class="title">${photo.title}</div>
          <div class="tags">
            ${photo.tags
              .map((tag) => `<span class="tag">${tag}</span>`)
              .join("")}
          </div>
        </div>
      `;
      card
        .querySelector("img")
        .addEventListener("click", () => openLightbox(photo));
      albumGrid.appendChild(card);
    });
  }

  // Search filter
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();
    const filtered = photos.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.tags.some((tag) => tag.toLowerCase().includes(q))
    );
    renderPhotos(filtered);
  });

  // Setup lightbox
  function setupLightbox() {
    lightboxOverlay = document.createElement("div");
    lightboxOverlay.className = "lightbox";

    lightboxImg = document.createElement("img");
    lightboxOverlay.appendChild(lightboxImg);

    downloadBtn = document.createElement("a");
    downloadBtn.className = "download-btn";
    downloadBtn.innerHTML = `<i class="fa fa-download"></i>`;
    lightboxOverlay.appendChild(downloadBtn);

    document.body.appendChild(lightboxOverlay);

    lightboxOverlay.addEventListener("click", (e) => {
      if (e.target === lightboxOverlay) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.ctrlKey && e.key.toLowerCase() === "f") {
        e.preventDefault();
        searchInput.focus();
      }
    });
  }

  function openLightbox(photo) {
    lightboxImg.src = photo.src;
    downloadBtn.href = photo.src;
    downloadBtn.download = photo.title.replace(/\s+/g, "_");
    lightboxOverlay.style.display = "flex";
  }

  function closeLightbox() {
    lightboxOverlay.style.display = "none";
  }

  // New function to handle photo card listeners and modal logic
  function setupPhotoCardListeners() {
    const photoCards = document.querySelectorAll(".photo-card");
    const modal = document.getElementById("modal");
    if (!modal) return;
    const modalImg = document.getElementById("modalImg");
    const close = modal.querySelector(".close");

    // --- Modal ---
    photoCards.forEach((card) => {
      card.addEventListener("click", () => {
        modal.classList.add("active");
        modalImg.src = card.querySelector("img").src;
      });
    });
    close.addEventListener("click", () => modal.classList.remove("active"));
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.classList.remove("active");
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") modal.classList.remove("active");
    });
  }
});

// Extract unique tags for filter bar
function populateFilterTags(photos) {
  const tagSet = new Set();
  photos.forEach((p) => p.tags.forEach((tag) => tagSet.add(tag)));
  const filterTagsContainer = document.querySelector(".filter-tags");
  if (!filterTagsContainer) return;

  filterTagsContainer.innerHTML = "";
  tagSet.forEach((tag) => {
    const tagBtn = document.createElement("div");
    tagBtn.className = "filter-tag";
    tagBtn.textContent = tag;
    tagBtn.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-tag")
        .forEach((t) => t.classList.remove("active"));
      tagBtn.classList.add("active");
      const filtered = photos.filter((p) => p.tags.includes(tag));
      renderPhotos(filtered);
    });
    filterTagsContainer.appendChild(tagBtn);
  });
}

// Sorting
document.getElementById("sortSelect")?.addEventListener("change", (e) => {
  const value = e.target.value;
  let sorted = [...photos];
  if (value === "az") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (value === "za") {
    sorted.sort((a, b) => b.title.localeCompare(a.title));
  }
  renderPhotos(sorted);
});
