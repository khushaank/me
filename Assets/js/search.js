document.addEventListener("DOMContentLoaded", async () => {
  let posts = [];
  try {
    const res = await fetch("./thoughts/index.json");
    if (res.ok) posts = await res.json();
  } catch (err) {
    console.warn("Failed to load index.json", err);
  }

  // CSS
  const css = `
#searchOverlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 15vh;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 5000;
}
#searchOverlay.show { opacity: 1; pointer-events: all; }

#searchOverlay input {
  width: 80%;
  max-width: 600px;
  font-size: 1.3rem;
  padding: 0.6rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid rgba(255,255,255,0.6);
  color: #fff;
  text-align: center;
}
#searchOverlay input::placeholder {
  color: rgba(255,255,255,0.4);
  font-style: italic;
}
#searchOverlay input:focus {
  outline: none;
  border-bottom-color: #fff;
}

#searchOverlay ul {
  list-style: none;
  padding: 0;
  margin: 2rem 0 0;
  width: 80%;
  max-width: 600px;
}
#searchOverlay li {
  background: rgba(255,255,255,0.08);
  color: #fff;
  padding: 1rem;
  margin-bottom: 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s ease;
}
#searchOverlay li:hover {
  background: rgba(255,255,255,0.2);
}

#closeSearch {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.6rem;
  color: #aaa;
  cursor: pointer;
}
#closeSearch:hover { color: #fff; }

#openSearch {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: #000;
  color: #fff;
  border-radius: 50%;
  width: 55px;
  height: 55px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3rem;
  border: 1px solid rgba(255,255,255,0.2);
  box-shadow: 0 4px 12px rgba(0,0,0,0.6);
  cursor: pointer;
  z-index: 5100;
  transition: transform 0.25s ease, background 0.25s ease;
}
#openSearch:hover {
  transform: scale(1.1);
  background: #111;
}
`;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // Open button
  const openBtn = document.createElement("button");
  openBtn.id = "openSearch";
  openBtn.innerHTML = `<i class="fas fa-search"></i>`;
  document.body.appendChild(openBtn);

  // Overlay
  const overlay = document.createElement("div");
  overlay.id = "searchOverlay";
  overlay.innerHTML = `
    <span id="closeSearch"><i class="fas fa-times"></i></span>
    <input type="text" placeholder="Search here...">
    <ul></ul>
  `;
  document.body.appendChild(overlay);

  const input = overlay.querySelector("input");
  const resultsList = overlay.querySelector("ul");
  const closeBtn = overlay.querySelector("#closeSearch");

  function openOverlay() {
    overlay.classList.add("show");
    input.value = "";
    resultsList.innerHTML = "";
    input.focus();
    document.body.style.overflow = "hidden";
  }
  function closeOverlay() {
    overlay.classList.remove("show");
    document.body.style.overflow = "";
  }

  openBtn.addEventListener("click", openOverlay);
  closeBtn.addEventListener("click", closeOverlay);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeOverlay();
  });
  // Ctrl+F opens search
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === "f") {
      e.preventDefault();
      openOverlay();
    }
  });

  // Search
  function search(query) {
    query = query.toLowerCase().trim();
    return posts.filter((file) => file.toLowerCase().includes(query));
  }

  function renderResults(items, query) {
    resultsList.innerHTML = "";
    if (!query) return;
    if (!items.length) {
      resultsList.innerHTML = "<li>No results</li>";
      return;
    }
    items.forEach((file) => {
      const title = file.replace(/\.md$/, "").replace(/-/g, " ");
      const li = document.createElement("li");
      li.innerHTML = title;
      li.addEventListener("click", () => {
        window.location.href = `blog.html?post=${encodeURIComponent(file)}`;
      });
      resultsList.appendChild(li);
    });
  }

  input.addEventListener("input", () => {
    renderResults(search(input.value), input.value);
  });

  // Enter = first result
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const first = resultsList.querySelector("li");
      if (first) first.click();
    }
  });
});
