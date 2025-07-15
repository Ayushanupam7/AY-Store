// transition.js

const loader = document.createElement("div");
loader.id = "pageLoader";
loader.innerHTML = `<div class="loader-ay">AY</div>`;
document.body.appendChild(loader);

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
        loader.style.display = "flex";
        setTimeout(() => {
          window.location.href = href;
        }, 300);
      });
    }
  });
});
