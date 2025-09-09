import { auth } from "./auth.js";
import {
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.2.0/firebase-auth.js";

export function initNavbarAuth() {
  const userGreeting = document.getElementById("userGreeting");
  const userIcon = document.getElementById("userIcon");
  const userIconSidebar = document.getElementById("userIconSidebar");
  const logoutMenu = document.getElementById("logoutMenu");
  const logoutBtn = document.getElementById("logoutBtn");

  onAuthStateChanged(auth, (user) => {
    if (user) {
      const name = user.displayName || user.email.split("@")[0];
      if (userGreeting) userGreeting.textContent = `Hello, ${name}`;

      // Show Gallery for any logged-in user
      const galleryItem = document.getElementById("galleryMenuItem");
      if (galleryItem) {
        galleryItem.style.display = "block";
      }

      // Navbar user icon → toggle dropdown
      if (userIcon) {
        userIcon.style.cursor = "pointer";
        userIcon.onclick = () => {
          if (logoutMenu) {
            logoutMenu.style.display =
              logoutMenu.style.display === "block" ? "none" : "block";
          }
        };
      }

      // Sidebar user icon → just logout directly
      if (userIconSidebar) {
        userIconSidebar.style.cursor = "pointer";
        userIconSidebar.onclick = async () => {
          const confirmLogout = confirm("Do you want to log out?");
          if (confirmLogout) {
            await signOut(auth);
            localStorage.removeItem("seenLogin");
            window.location.href = "user.html";
          }
        };
      }

      if (logoutBtn) {
        logoutBtn.onclick = async () => {
          await signOut(auth);
          localStorage.removeItem("seenLogin");
          window.location.href = "user.html";
        };
      }
    } else {
      if (userGreeting) userGreeting.textContent = "";

      const goLogin = () => {
        // save the current page so we can return here after login
        localStorage.setItem("referrer", window.location.href);
        window.location.href = "user.html";
      };

      if (userIcon) {
        userIcon.style.cursor = "pointer";
        userIcon.onclick = goLogin;
      }
      if (userIconSidebar) {
        userIconSidebar.style.cursor = "pointer";
        userIconSidebar.onclick = goLogin;
      }
    }
  });
}
// ===============================