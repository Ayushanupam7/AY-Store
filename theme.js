function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark");
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem("darkMode", isDark);

  const toggleBtn = document.getElementById("darkModeToggle");
  if (toggleBtn) {
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
  }
}

// Apply dark mode on load
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
    e.preventDefault();
    toggleDarkMode();
  }
});

// ✅ Mobile Z Gesture Detection
let touchPoints = [];

document.addEventListener("touchstart", (e) => {
  touchPoints = [{ x: e.touches[0].clientX, y: e.touches[0].clientY }];
});

document.addEventListener("touchmove", (e) => {
  const point = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  touchPoints.push(point);
});

document.addEventListener("touchend", () => {
  if (touchPoints.length < 3) return;

  const [start, middle, end] = [
    touchPoints[0],
    touchPoints[Math.floor(touchPoints.length / 2)],
    touchPoints[touchPoints.length - 1]
  ];

  const isRight1 = middle.x > start.x && Math.abs(middle.y - start.y) < 50;
  const isDiag = middle.x > end.x && end.y > middle.y;
  const isRight2 = end.x > start.x && Math.abs(end.y - middle.y) < 50;

  if (isRight1 && isDiag && isRight2) {
    toggleDarkMode();
  }
});
