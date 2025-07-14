// theme.js
(function () {
  if (localStorage.getItem("darkMode") === "true") {
    document.documentElement.classList.add("dark");
    document.body.classList.add("dark");
  }
})();

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}
