// =========================
// 🔧 App Data Configuration
// =========================
const apps = [
  {
    name: "ChronoTrackPro",
    category: "Productivity",
    link: "uploads/ChronoTrackPro.exe",
    icon: "uploads/icons/chrono.png",
    rating: 4.5,
    description: "A powerful time tracking tool for project management.",
    comments: ["Super fast!", "Clean UI."]
  },
  {
    name: "TrackPro",
    category: "Productivity",
    link: "uploads/ChronoTrackPro.exe",
    icon: "uploads/icons/chrono.png",
    rating: 1.0,
    description: "Another time tracker with minimal features.",
    comments: ["Needs improvement."]
  },
  {
    name: "Pro",
    category: "Productivity",
    link: "uploads/ChronoTrackPro.exe",
    icon: "uploads/icons/chrono.png",
    rating: 5.0,
    description: "Top-rated time tracking tool with AI integration.",
    comments: ["Perfect for my work!"]
  },
  {
    name: "Mini Web Portfolio",
    category: "Tools",
    link: "https://ayushanupamportfolio.netlify.app/",
    icon: "uploads/icons/web.png",
    rating: 4.2,
    description: "A simple personal portfolio template for developers.",
    comments: []
  }
];


// 📈 Sort Trending by Rating Descending
let trendingApps = [...apps].sort((a, b) => b.rating - a.rating);

// ==========================
// 📦 Render App Card Grid
// ==========================
function renderApps(filteredApps = apps) {
  const grid = document.getElementById("appGrid");
  grid.innerHTML = "";

  filteredApps.forEach(app => {
    const card = document.createElement("div");
    card.className = "app-card";
    card.innerHTML = `
      <div class="card-content">
        <div class="star-badge">⭐ ${app.rating}</div>
        <img src="${app.icon}" alt="${app.name}" class="app-icon" />
        <div class="app-details">
          <h3>${app.name}</h3>
          <p>${app.category}</p>
          <p class="description">${app.description}</p>
          <div class="buttons">
            <button onclick="downloadApp('${app.link}')">Download</button>
            <button onclick="openReviewModal('${app.name}')">Review</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ========================================
// 🚀 Render Trending Apps in Scrollable Row
// ========================================
function renderTrendingApps() {
  const trendingGrid = document.getElementById("trendingGrid");
  if (!trendingGrid) return;
  trendingGrid.innerHTML = "";

  trendingApps.forEach((app, index) => {
    const card = document.createElement("div");
    card.className = "app-card trending-card";
    card.innerHTML = `
      <div class="trending-rank">#${index + 1}</div>
      <div class="card-content">
        <img src="${app.icon}" alt="${app.name}" class="app-icon" />
        <div class="app-details">
          <h3>${app.name}</h3>
          <p>${app.category}</p>
          <p class="description">${app.description}</p>
          <div class="buttons">
            <button onclick="downloadApp('${app.link}')">Download</button>
            <button onclick="openReviewModal('${app.name}')">Review</button>
          </div>
        </div>
      </div>
    `;
    trendingGrid.appendChild(card);
  });
}

// ======================
// ⬇️ File Download Logic
// ======================
function downloadApp(link) {
  const a = document.createElement("a");
  a.href = link;
  a.target = "_blank";
  a.download = link.split("/").pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// =====================
// 🔍 Category Filtering
// =====================
function filterApps(category) {
  if (category === "All") return renderApps();
  const filtered = apps.filter(app => app.category === category);
  renderApps(filtered);
}

// ===================
// 🌗 Dark Mode Toggle
// ===================
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// =====================
// 🔎 Search Functionality
// =====================
document.getElementById("searchBar").addEventListener("input", function () {
  const val = this.value.toLowerCase();
  const filtered = apps.filter(app => app.name.toLowerCase().includes(val));
  renderApps(filtered);
});

// ========================
// 💬 Review Modal Section
// ========================
let currentApp = null;

function openReviewModal(appName) {
  const app = apps.find(a => a.name === appName);
  currentApp = app;

  document.getElementById("reviewAppName").textContent = `Reviews for ${app.name}`;
  document.getElementById("commentList").innerHTML =
    app.comments.map(c => `<p>💬 ${c}</p>`).join("");

  const starsContainer = document.getElementById("reviewRatingStars");
  starsContainer.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.classList.add("review-star");
    if (i <= app.rating) star.classList.add("active");

    star.addEventListener("click", () => setReviewRating(i));
    starsContainer.appendChild(star);
  }

  document.getElementById("newComment").value = "";
  document.getElementById("reviewModal").style.display = "flex";
}

function setReviewRating(rating) {
  if (!currentApp) return;
  currentApp.rating = rating;

  const stars = document.querySelectorAll("#reviewRatingStars .review-star");
  stars.forEach((star, index) => {
    star.classList.toggle("active", index < rating);
  });

  trendingApps = [...apps].sort((a, b) => b.rating - a.rating);
  renderApps();
  renderTrendingApps();
}

function closeReviewModal() {
  document.getElementById("reviewModal").style.display = "none";
}

function submitComment() {
  const comment = document.getElementById("newComment").value.trim();
  if (comment && currentApp) {
    currentApp.comments.push(comment);
    openReviewModal(currentApp.name);
  }
}

// ==================
// 🎞 Banner Slider
// ==================
const banners = [
  {
    image: "uploads/banners/banner1.jpg",
    text: "Discover Amazing Tools for Developers",
    description: "Explore tools that help you code faster and better.",
    link: "https://yourwebsite.com/developer-tools",
    linkText: "Click to visit"
  },
  {
    image: "uploads/banners/banner2.jpg",
    text: "Build Your Next Portfolio Easily",
    description: "Use templates and apps to design professional portfolios.",
    link: "https://yourwebsite.com/portfolio-builder",
    linkText: "Click to visit"
  },
  {
    image: "uploads/banners/banner3.jpg",
    text: "Download Lightweight Useful Apps",
    description: "Boost productivity with small but powerful tools.",
    link: "https://yourwebsite.com/light-apps",
    linkText: "Click to visit"
  }
];

let currentBanner = 0;

function showBanner(index) {
  const bannerImage = document.getElementById("bannerImage");
  const bannerText = document.getElementById("bannerText");
  const bannerDesc = document.getElementById("bannerDesc");
  const bannerLink = document.getElementById("bannerLink");
  const bannerDots = document.getElementById("bannerDots");

  if (!banners[index]) return;

  bannerImage.src = banners[index].image;
  bannerText.textContent = banners[index].text || "";
  bannerDesc.textContent = banners[index].description || "";
  bannerLink.href = banners[index].link || "#";
  bannerLink.textContent = banners[index].linkText || "Click to visit";

  bannerDots.innerHTML = banners.map((_, i) =>
    `<span class="${i === index ? 'active' : ''}" onclick="setBanner(${i})"></span>`
  ).join("");
}

function nextBanner() {
  currentBanner = (currentBanner + 1) % banners.length;
  showBanner(currentBanner);
}

function setBanner(index) {
  currentBanner = index;
  showBanner(currentBanner);
}

setInterval(nextBanner, 4000);

// ===================
// 🚀 Initialize App
// ===================
renderApps();
renderTrendingApps();
showBanner(currentBanner);
