// auth.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/12.2.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDFUIf6LbaYWwZiBQZE7Q5Pjof3pGUNMws",
  authDomain: "khushaank-gupta.firebaseapp.com",
  projectId: "khushaank-gupta",
  storageBucket: "khushaank-gupta.appspot.com",
  messagingSenderId: "990728002144",
  appId: "1:990728002144:web:406cd5d6c7c7bc5b174105",
  measurementId: "G-H3FG512R3C",
};

// Init Firebase (only here)
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// switchForm exposed for inline onclick
window.switchForm = function (form) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const forgotForm = document.getElementById("forgotForm");
  const title = document.getElementById("authTitle");
  const links = document.getElementById("authLinks");

  if (!loginForm || !signupForm || !forgotForm) return;

  loginForm.style.display = "none";
  signupForm.style.display = "none";
  forgotForm.style.display = "none";

  if (form === "signup") {
    signupForm.style.display = "block";
    title.innerText = "Sign Up";
    links.innerHTML = `<a onclick="switchForm('login')">Login</a> | <a onclick="switchForm('forgot')">Forgot password?</a>`;
  } else if (form === "forgot") {
    forgotForm.style.display = "block";
    title.innerText = "Forgot Password";
    links.innerHTML = `<a onclick="switchForm('login')">Back to login</a>`;
  } else {
    loginForm.style.display = "block";
    title.innerText = "Login";
    links.innerHTML = `<a onclick="switchForm('signup')">Sign up</a> | <a onclick="switchForm('forgot')">Forgot password?</a>`;
  }
};

function redirectAfterAuth() {
  const fromStorage =
    localStorage.getItem("referrer") || sessionStorage.getItem("referrer");
  if (fromStorage) {
    localStorage.removeItem("referrer");
    sessionStorage.removeItem("referrer");
    return fromStorage;
  }
  const fromReferrer =
    document.referrer && !document.referrer.includes("user.html")
      ? document.referrer
      : null;
  return fromReferrer || "index.html";
}

// Login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("seenLogin", "true");
    window.location.href = redirectAfterAuth();
  } catch (error) {
    alert(error.message);
  }
});

// Signup
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(auth.currentUser, { displayName: name });
    localStorage.setItem("seenLogin", "true");
    window.location.href = redirectAfterAuth();
  } catch (error) {
    alert(error.message);
  }
});

// Forgot password
document.getElementById("forgotForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("forgotEmail").value;
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent!");
    switchForm("login");
  } catch (error) {
    alert(error.message);
  }
});
// End of auth.js
