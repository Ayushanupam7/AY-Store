// theme.js

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark");
  document.documentElement.classList.toggle("dark", isDark); // Apply to :root for CSS variables

  localStorage.setItem("darkMode", isDark);

  const toggleBtn = document.getElementById("darkModeToggle");
  if (toggleBtn) {
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
  }
}

// Apply dark mode on page load based on localStorage
document.addEventListener("DOMContentLoaded", () => {
  const isDarkStored = localStorage.getItem("darkMode") === "true";
  if (isDarkStored) {
    document.body.classList.add("dark");
    document.documentElement.classList.add("dark");
  }

  const toggleBtn = document.getElementById("darkModeToggle");
  if (toggleBtn) {
    toggleBtn.textContent = isDarkStored ? "☀️" : "🌙";
  }
});
