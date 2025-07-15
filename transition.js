// transition.js

// Add loader element to body
const loader = document.createElement("div");
loader.id = "pageLoader";
loader.innerHTML = `<div class="spinner"></div>`;
document.body.appendChild(loader);

// Initially hide loader after page load
window.addEventListener("load", () => {
  loader.style.display = "none";
});

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

        // Show loader immediately
        loader.style.display = "flex";

        // Wait 300ms to feel smoother
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      });
    }
  });
});
