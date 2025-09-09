// custom-menu.js
document.addEventListener("DOMContentLoaded", () => {
  // ===============================
  // Inject Font Awesome (if not present)
  // ===============================
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const fa = document.createElement("link");
    fa.rel = "stylesheet";
    fa.href =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css";
    document.head.appendChild(fa);
  }

  // ===============================
  // Create Custom Context Menu
  // ===============================
  const menu = document.createElement("div");
  menu.id = "custom-menu";
  menu.innerHTML = `
    <ul>
      <li data-link="/"><i class="fa-solid fa-house"></i> Home</li>
      <li data-link="/about.html"><i class="fa-solid fa-circle-info"></i> About</li>
      <li data-link="/though.html"><i class="fa-solid fa-lightbulb"></i> Thoughts</li>
      <li data-link="gallery.html" id="galleryContext" style="display:none;">
        <i class="fa-solid fa-image"></i> Gallery
      </li>
      <li data-link="mailto:khushaankgupta@gmail.com?subject=Let%27s%20Connect&body=Hi%20Khushaank...">
        <i class="fa-solid fa-envelope"></i> Contact
      </li>
      <hr>
      <li data-action="refresh"><i class="fa-solid fa-rotate-right"></i> Refresh</li>
    </ul>
  `;
  document.body.appendChild(menu);

  // ===============================
  // Inject Styles (light theme only)
  // ===============================
  const style = document.createElement("style");
  style.textContent = `
    #custom-menu {
      position: absolute;
      display: none;
      background: #fff;
      border-radius: 10px;
      min-width: 220px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.15);
      border: 1px solid #ddd;
      z-index: 9999;
      font-family: Arial, sans-serif;
      font-size: 15px;
      animation: fadeIn 0.15s ease-out;
      overflow: hidden;
      color: #111;
    }
    #custom-menu ul {
      list-style: none;
      margin: 0;
      padding: 6px 0;
    }
    #custom-menu ul li {
      padding: 12px 18px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: background 0.2s ease;
      margin: 0 4px;
      border-radius: 6px;
    }
    #custom-menu ul li:hover {
      background: #f0f0f0;
    }
    #custom-menu ul li.active {
      font-weight: 600;
      color: #007aff;
    }
    #custom-menu hr {
      margin: 6px 10px;
      border: none;
      border-top: 1px solid #ddd;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `;
  document.head.appendChild(style);

  // ===============================
  // Detect Active Page
  // ===============================
  const path = window.location.pathname.replace(/\/$/, "");
  menu.querySelectorAll("li[data-link]").forEach((li) => {
    if (path === li.dataset.link || (path === "" && li.dataset.link === "/")) {
      li.classList.add("active");
    }
  });

  // ===============================
  // Show Menu (Right Click + Double Click + Long Press)
  // ===============================
  function showMenu(x, y) {
    menu.style.display = "block";
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
  }

  // Right click
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    showMenu(e.pageX, e.pageY);
  });

  // Double click
  document.addEventListener("dblclick", (e) => {
    showMenu(e.pageX, e.pageY);
  });

  // Long press (mobile)
  let pressTimer;
  document.addEventListener("touchstart", (e) => {
    pressTimer = setTimeout(() => {
      e.preventDefault();
      showMenu(e.touches[0].pageX, e.touches[0].pageY);
    }, 600);
  });
  document.addEventListener("touchend", () => clearTimeout(pressTimer));

  // Close menu
  document.addEventListener("click", () => (menu.style.display = "none"));
  window.addEventListener("scroll", () => (menu.style.display = "none"));
  window.addEventListener("resize", () => (menu.style.display = "none"));

  // ===============================
  // Handle Menu Clicks
  // ===============================
  menu.addEventListener("click", (e) => {
    const li = e.target.closest("li");
    if (!li) return;
    if (li.dataset.link) {
      window.location.href = li.dataset.link;
    } else if (li.dataset.action === "refresh") {
      location.reload();
    }
  });

  // ===============================
  // Firebase Auth → Show Gallery for any logged-in user
  // ===============================
  import("https://www.gstatic.com/firebasejs/12.2.0/firebase-auth.js").then(
    ({ onAuthStateChanged }) => {
      import("./auth.js").then(({ auth }) => {
        const galleryContext = document.getElementById("galleryContext");
        if (!galleryContext) return;

        onAuthStateChanged(auth, (user) => {
          if (user) {
            galleryContext.style.display = "block";
          } else {
            galleryContext.style.display = "none";
          }
        });
      });
    }
  );
});
