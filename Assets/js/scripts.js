document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // Load Header Dynamically
  // ===============================
  const isBlogPage = window.location.pathname.endsWith("blog.html");
  if (!isBlogPage) {
    fetch("fragments/header.html")
      .then((res) => res.text())
      .then(async (html) => {
        document.getElementById("header").innerHTML = html;

        // After header is injected, import navbar auth (scripts inside innerHTML won't run)
        const mod = await import("./navbar-auth.js");
        if (typeof mod.initNavbarAuth === "function") {
          mod.initNavbarAuth();
        }

        // Sidebar / Hamburger Toggle
        const sideMenu = document.getElementById("sideMenu");
        const menuOpen = document.getElementById("menuOpen");
        const menuClose = document.getElementById("menuClose");

        if (menuOpen) {
          menuOpen.addEventListener("click", () =>
            sideMenu.classList.add("open")
          );
        }
        if (menuClose) {
          menuClose.addEventListener("click", () =>
            sideMenu.classList.remove("open")
          );
        }
        document.addEventListener("click", (event) => {
          if (
            sideMenu &&
            sideMenu.classList.contains("open") &&
            !sideMenu.contains(event.target) &&
            !(menuOpen && menuOpen.contains(event.target))
          ) {
            sideMenu.classList.remove("open");
          }
        });
      });
  }

  // ===============================
  // Load Footer Dynamically
  // ===============================
  fetch("fragments/footer.html")
    .then((res) => res.text())
    .then((html) => {
      document.getElementById("footer").innerHTML = html;
    });

  // ===============================
  // Parallax & Blob Motion
  // ===============================
  const layers = document.querySelectorAll(".layer");
  const blobs = document.querySelectorAll(".blob");

  let sy = 0,
    eased = 0,
    t = 0;
  const lerp = (a, b, n) => a + (b - a) * n;

  window.addEventListener("scroll", () => (sy = window.scrollY), {
    passive: true,
  });

  function animate() {
    eased = lerp(eased, sy, 0.07);
    t += 0.01;

    layers.forEach((el) => {
      const depth = parseFloat(el.dataset.depth || "0");
      const y = eased * depth;
      const driftX = Math.sin(t * (1 + depth * 3)) * 6 * depth * 10;
      const driftY = Math.cos(t * (1.2 + depth * 2)) * 6 * depth * 8;
      el.style.transform = `translate3d(${driftX}px, ${y + driftY}px, 0)`;
    });

    blobs.forEach((blob) => {
      const depth = parseFloat(blob.dataset.depth || "0");
      const y = eased * depth;
      const driftX = Math.sin(t * (2 + depth * 5)) * 25 * depth;
      const driftY = Math.cos(t * (1.5 + depth * 4)) * 20 * depth;
      blob.style.transform = `translate3d(${driftX}px, ${y + driftY}px, 0)`;
    });

    requestAnimationFrame(animate);
  }
  animate();

  // ===============================
  // Timeline Tabs
  // ===============================
  const tabs = document.querySelectorAll(".tab-btn");
  const timelines = document.querySelectorAll(".timeline");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");
      timelines.forEach((tl) => tl.classList.remove("active"));
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // ===============================
  // Blog Loader
  // ===============================
  async function loadPosts() {
    try {
      const res = await fetch("./thoughts/index.json");
      if (!res.ok) throw new Error("Failed to load thoughts/index.json");
      const list = await res.json();

      const container = document.getElementById("blogCards");
      if (!container) return;

      let mdFiles = list.filter((f) => f.endsWith(".md"));

      // On homepage (index.html) → show only 3
      if (
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/"
      ) {
        mdFiles = mdFiles.slice(0, 3);
      }

      const posts = await Promise.all(
        mdFiles.map(async (file) => {
          const mdRes = await fetch(`./thoughts/${file}`);
          const md = await mdRes.text();
          const title = file.replace(/\.md$/i, "");
          const previewLine = (
            md.split("\n").find((line) => line.trim()) || ""
          ).trim();
          const preview =
            previewLine.length > 200
              ? previewLine.slice(0, 200) + "..."
              : previewLine;
          const imgUrl = `https://picsum.photos/seed/${encodeURIComponent(
            title
          )}/600/400`;
          return { title, preview, file, imgUrl };
        })
      );

      const frag = document.createDocumentFragment();
      posts.forEach((post) => {
        const card = document.createElement("div");
        card.className = "blog-card";
        card.innerHTML = `
          <div class="blog-card-image-wrapper">
            <div class="image-skeleton"></div>
            <img alt="${
              post.title
            }" class="blog-card-image" loading="lazy" decoding="async"/>
          </div>
          <h3>${post.title}</h3>
          <p>${post.preview}</p>
          <a href="blog.html?post=${encodeURIComponent(
            post.file
          )}" class="read-more">Read More →</a>
          <span class="ripple"></span>
        `;

        const img = card.querySelector("img.blog-card-image");
        const skeleton = card.querySelector(".image-skeleton");
        img.addEventListener("load", () => {
          skeleton.remove();
          img.style.opacity = "1";
        });
        img.addEventListener("error", () => skeleton.remove());
        img.src = post.imgUrl;

        // Card click → navigate (except when clicking Read More directly)
        card.addEventListener("click", function (e) {
          const ripple = this.querySelector(".ripple");
          ripple.classList.remove("active");
          const rect = this.getBoundingClientRect();
          ripple.style.left = `${e.clientX - rect.left}px`;
          ripple.style.top = `${e.clientY - rect.top}px`;
          ripple.classList.add("active");

          const readMoreLink = this.querySelector(".read-more");
          if (!e.target.closest(".read-more")) {
            window.location.href = readMoreLink.href;
          }
        });

        // Stop propagation when clicking "Read More" so card click won’t double fire
        card
          .querySelector(".read-more")
          .addEventListener("click", (e) => e.stopPropagation());

        frag.appendChild(card);
      });

      container.textContent = "";
      container.appendChild(frag);
    } catch (err) {
      console.error("[loadPosts] error:", err);
    }
  }
  loadPosts();

  // ===============================
  // Disable Copy / Drag / Drop
  // ===============================
  document.addEventListener("copy", (event) => event.preventDefault());
  document.addEventListener("dragstart", (event) => event.preventDefault());
  document.addEventListener("drop", (event) => event.preventDefault());
});

// music player
// ===============================
// Floating Music Player (Persistent, Movable)
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // Ensure audio element exists globally
  let audio = document.getElementById("bgAudio");
  if (!audio) {
    audio = document.createElement("audio");
    audio.id = "bgAudio";
    audio.src = "Assets/music/background.mp3"; // <-- My file
    audio.loop = true;
    audio.preload = "auto";
    document.body.appendChild(audio);
  }

  // Restore play state
  if (localStorage.getItem("musicPlaying") !== "false") {
    audio.play().catch(() => {}); // try autoplay
    localStorage.setItem("musicPlaying", "true");
  }

  // Prevent duplicate UI
  if (document.getElementById("musicPlayer")) return;

  // Create Player UI
  const player = document.createElement("div");
  player.id = "musicPlayer";
  player.innerHTML = `
    <div class="music-info">
      <span id="musicTitle">Lazzarella</span>
      <span id="musicArtist">Domenico Modugno</span>
    </div>
    <button id="musicBtn">
      ${
        audio.paused
          ? '<i class="fa-solid fa-play"></i>'
          : '<i class="fa-solid fa-pause"></i>'
      }
    </button>
  `;
  document.body.appendChild(player);

  // Styles
  const style = document.createElement("style");
  style.textContent = `
    #musicPlayer {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #000;
      color: #fff;
      border-radius: 12px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 14px;
      z-index: 99999;
      font-family: Arial, sans-serif;
      max-width: 250px;
      cursor: grab;
      user-select: none;
    }
    #musicPlayer .music-info {
      flex: 1;
      font-size: 13px;
      line-height: 1.3;
      overflow: hidden;
    }
    #musicPlayer .music-info span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    #musicPlayer #musicTitle { font-weight: 600; }
    #musicPlayer button {
      background: #1db954;
      border: none;
      border-radius: 50%;
      width: 42px; height: 42px;
      display: flex;
      align-items: center; justify-content: center;
      color: #fff; font-size: 18px; cursor: pointer;
    }
    #musicPlayer button:hover { background: #17a44b; }
    @media (max-width: 600px) {
      #musicPlayer { bottom: 10px; right: 10px; max-width: 180px; padding: 8px 10px; }
      #musicPlayer button { width: 36px; height: 36px; font-size: 16px; }
      #musicPlayer .music-info { font-size: 11px; }
    }
  `;
  document.head.appendChild(style);

  // Button toggle
  const musicBtn = document.getElementById("musicBtn");
  musicBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      musicBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
      localStorage.setItem("musicPlaying", "true");
    } else {
      audio.pause();
      musicBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
      localStorage.setItem("musicPlaying", "false");
    }
  });

  // Dragging
  let offsetX,
    offsetY,
    isDragging = false;
  player.addEventListener("mousedown", (e) => {
    if (e.target.tagName === "BUTTON") return; // don't drag on button
    isDragging = true;
    offsetX = e.clientX - player.offsetLeft;
    offsetY = e.clientY - player.offsetTop;
  });
  document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    player.style.left = e.clientX - offsetX + "px";
    player.style.top = e.clientY - offsetY + "px";
    player.style.bottom = "auto";
    player.style.right = "auto";
  });
  document.addEventListener("mouseup", () => {
    if (isDragging) {
      isDragging = false;
      localStorage.setItem(
        "musicPlayerPos",
        JSON.stringify({ left: player.style.left, top: player.style.top })
      );
    }
  });

  // Restore last position
  const savedPos = localStorage.getItem("musicPlayerPos");
  if (savedPos) {
    const { left, top } = JSON.parse(savedPos);
    player.style.left = left;
    player.style.top = top;
    player.style.bottom = "auto";
    player.style.right = "auto";
  }
});
