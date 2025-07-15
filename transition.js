// transition.js

// Create loader element
const loader = document.createElement("div");
loader.id = "pageLoader";
loader.innerHTML = `<div class="spinner"></div>`;
document.body.appendChild(loader);

// Hide loader after page load
window.addEventListener("load", () => {
  loader.style.display = "none";
});

// Handle loader display during link navigation
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("a[href]");

  links.forEach(link => {
    const href = link.getAttribute("href");

    // Allow only valid links (not anchor, JS, tel, mail)
    if (
      href &&
      !href.startsWith("#") &&
      !href.startsWith("javascript:") &&
      !href.startsWith("mailto:") &&
      !href.startsWith("tel:")
    ) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        loader.style.display = "flex";

        setTimeout(() => {
          window.location.href = href;
        }, 400); // Loader visible briefly before navigation
      });
    }
  });
});
