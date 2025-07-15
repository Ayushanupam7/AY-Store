// transition.js

// Create the loader element
const loader = document.createElement("div");
loader.id = "pageLoader";
loader.innerHTML = `<div class="loader-ay">AY</div>`;

// Check and apply dark mode from localStorage
if (localStorage.getItem("darkMode") === "true") {
  loader.classList.add("dark");
}

document.body.appendChild(loader);

// Hide loader after page load
window.addEventListener("load", () => {
  loader.style.display = "none";
});

// Add loader on link click before navigation
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a[href]");

  links.forEach(link => {
    const href = link.getAttribute("href");

    if (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("javascript:") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:")
    ) {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        // Sync dark mode state to loader if changed after DOMContentLoaded
        if (localStorage.getItem("darkMode") === "true") {
          loader.classList.add("dark");
        } else {
          loader.classList.remove("dark");
        }

        loader.style.display = "flex";

        setTimeout(() => {
          window.location.href = href;
        }, 900); // delay to show loader
      });
    }
  });
});
