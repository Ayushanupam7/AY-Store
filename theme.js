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

// ✅ Keyboard shortcut: Ctrl + D
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key.toLowerCase() === "d") {
    e.preventDefault(); // prevent bookmark shortcut in browsers
    toggleDarkMode();
  }
});

// ✅ Mobile Gesture: Quick Vertical Swipe Down (like V)
let touchStartY = 0;
let touchEndY = 0;

document.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
});

document.addEventListener("touchend", (e) => {
  touchEndY = e.changedTouches[0].clientY;
  const swipeDistance = touchEndY - touchStartY;

  // Detect quick downward swipe (greater than 100px)
  if (swipeDistance > 100) {
    toggleDarkMode();
  }
});
