const toggleBtn = document.querySelector(".feed-toggle");

toggleBtn.addEventListener("click", (e) => {
  e.preventDefault();
  document.body.classList.toggle("dark");

  // Save preference in localStorage
  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
});

// Load saved preference
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}
