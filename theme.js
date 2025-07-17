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
    e.preventDefault(); // prevent bookmark shortcut
    toggleDarkMode();
  }
});

// ✅ Mobile Gesture: Swipe down and hold for 2s
let touchStartY = 0;
let touchStartTime = 0;

document.addEventListener("touchstart", (e) => {
  touchStartY = e.touches[0].clientY;
  touchStartTime = Date.now();
});

document.addEventListener("touchend", (e) => {
  const touchEndY = e.changedTouches[0].clientY;
  const swipeDistance = touchEndY - touchStartY;
  const duration = Date.now() - touchStartTime;

  // Must swipe down more than 100px AND hold for 2 seconds (2000ms)
  if (swipeDistance > 100 && duration >= 1000) {
    toggleDarkMode();
  }
});
