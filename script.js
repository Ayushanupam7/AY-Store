// ==============================
// 🏗️ APPLICATION CONFIGURATION
// ==============================
const defaultApps = [
  {
    name: "ChronoTrackPro",
    category: "Productivity",
    link: "uploads/ChronoTrackPro.exe",
    icon: "uploads/icons/chrono.png",
    rating: 4.5,
    description: "A powerful time tracking tool for project management with advanced analytics and reporting features. Perfect for teams and individual professionals.",
    comments: ["Super fast!", "Clean UI."],
    screenshots: ["uploads/screenshots/chrono1.jpg", "uploads/screenshots/chrono2.jpg"],
    developer: "AY Studios",
    version: "2.1.4",
    size: "45 MB",
    updated: "2023-11-15",
    downloads: 1250
  },
  {
    name: "Mini Web Portfolio",
    category: "Tools",
    link: "https://ayushanupamportfolio.netlify.app/",
    icon: "uploads/icons/web.png",
    rating: 4.2,
    description: "A simple personal portfolio template for developers with customizable sections and responsive design.",
    comments: [],
    screenshots: ["uploads/screenshots/portfolio1.jpg", "uploads/screenshots/portfolio2.jpg"],
    developer: "WebTools Inc.",
    version: "1.0.3",
    size: "8 MB",
    updated: "2023-10-28",
    downloads: 890
  }
];

const storedApps = JSON.parse(localStorage.getItem('allApps') || '[]');
const apps = storedApps.length > 0 ? storedApps : defaultApps;
let trendingApps = [...apps].sort((a, b) => b.rating - a.rating);

// ==============================
// 📱 APP DETAILS PAGE FUNCTIONS
// ==============================
function openAppDetailsPage(appName) {
  localStorage.setItem('allApps', JSON.stringify(apps));
  window.location.href = `app-details.html?app=${encodeURIComponent(appName)}`;
}

function loadAppDetailsPage() {
  const params = new URLSearchParams(window.location.search);
  const appName = params.get('app');
  if (!appName) return;

  const apps = JSON.parse(localStorage.getItem('allApps') || '[]');
  const app = apps.find(a => a.name === appName);
  if (!app) return;

  document.getElementById("detailAppName").textContent = app.name;
  document.getElementById("detailAppIcon").src = app.icon;
  document.getElementById("detailAppDescription").textContent = app.description;
  document.getElementById("detailAppCategory").textContent = app.category;
  document.getElementById("detailAppSize").textContent = app.size;
  document.getElementById("detailAppVersion").textContent = `v${app.version}`;
  document.getElementById("detailAppDeveloper").textContent = app.developer;
  document.getElementById("detailAppUpdated").textContent = new Date(app.updated).toLocaleDateString();
  document.getElementById("detailAppDownloads").textContent = `${app.downloads.toLocaleString()}+ downloads`;

  const ratingContainer = document.getElementById("detailAppRating");
  ratingContainer.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = i <= Math.floor(app.rating) ? "★" : "☆";
    ratingContainer.appendChild(star);
  }

  const screenshotsContainer = document.getElementById("appScreenshots");
  screenshotsContainer.innerHTML = '';
  app.screenshots?.forEach(screenshot => {
    const img = document.createElement("img");
    img.src = screenshot;
    img.alt = `${app.name} screenshot`;
    img.loading = "lazy";
    screenshotsContainer.appendChild(img);
  });

  const downloadBtn = document.getElementById("detailDownloadBtn");
  if (isDownloadable(app.link)) {
    downloadBtn.textContent = `Download (${app.downloads.toLocaleString()}+)`;
    downloadBtn.onclick = () => {
      app.downloads++;
      localStorage.setItem('allApps', JSON.stringify(apps));
      const a = document.createElement("a");
      a.href = app.link;
      a.download = app.link.split('/').pop();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  } else {
    downloadBtn.textContent = "Visit Site";
    downloadBtn.onclick = () => window.open(app.link, '_blank');
  }

  document.getElementById("detailReviewBtn").onclick = () => {
    window.location.href = `index.html?review=${encodeURIComponent(app.name)}`;
  };
}

// ==============================
// 🖥️ UI RENDERING COMPONENTS
// ==============================
function renderApps(filteredApps = apps) {
  const grid = document.getElementById("appGrid");
  grid.innerHTML = "";

  filteredApps.forEach(app => {
    const card = document.createElement("div");
    card.className = "app-card";
    card.onclick = () => openAppDetailsPage(app.name);

    const isDownload = isDownloadable(app.link);
    const buttonHTML = isDownload
      ? `<button onclick="event.stopPropagation();downloadApp('${app.link}','${app.name}')">Download</button>`
      : `<a href="${app.link}" class="visit-btn" target="_blank" onclick="event.stopPropagation()">Visit Site</a>`;

    card.innerHTML = `
      <div class="card-content">
        <div class="star-badge">⭐ ${app.rating}</div>
        <img src="${app.icon}" alt="${app.name}" class="app-icon" loading="lazy" />
        <div class="app-details">
          <h3>${app.name}</h3>
          <p>${app.category}</p>
          <p class="description">${app.description}</p>
          <div class="buttons">
            ${buttonHTML}
            <button onclick="event.stopPropagation();openReviewModal('${app.name}')">Review</button>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function renderTrendingApps() {
  const trendingGrid = document.getElementById("trendingGrid");
  if (!trendingGrid) return;
  trendingGrid.innerHTML = "";

  trendingApps.forEach((app, index) => {
    const card = document.createElement("div");
    card.className = "app-card trending-card";
    card.onclick = () => openAppDetailsPage(app.name);

    const isDownload = isDownloadable(app.link);
    const buttonHTML = isDownload
      ? `<button onclick="event.stopPropagation();downloadApp('${app.link}','${app.name}')">Download</button>`
      : `<a href="${app.link}" class="visit-btn" target="_blank" onclick="event.stopPropagation()">Visit Site</a>`;

    card.innerHTML = `
      <div class="trending-rank">#${index + 1}</div>
      <div class="card-content">
        <img src="${app.icon}" alt="${app.name}" class="app-icon" loading="lazy" />
        <div class="app-details">
          <h3>${app.name}</h3>
          <p>${app.category}</p>
          <p class="description">${app.description}</p>
          <div class="buttons">
            ${buttonHTML}
            <button onclick="event.stopPropagation();openReviewModal('${app.name}')">Review</button>
          </div>
        </div>
      </div>
    `;
    trendingGrid.appendChild(card);
  });
}

// ==============================
// 🛠️ UTILITY FUNCTIONS
// ==============================
function isDownloadable(link) {
  return link.startsWith("uploads/") || link.endsWith(".exe") || link.endsWith(".zip");
}

function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// ==============================
// 📥 DOWNLOAD HANDLING
// ==============================
function downloadApp(link, appName) {
  const app = apps.find(a => a.name === appName);
  if (app) {
    app.downloads++;
    localStorage.setItem('allApps', JSON.stringify(apps));
    renderApps();
    renderTrendingApps();
  }
  const a = document.createElement("a");
  a.href = link;
  a.target = "_blank";
  a.download = link.split("/").pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ==============================
// 🔍 SEARCH & FILTERING
// ==============================
function filterApps(category) {
  if (category === "All") return renderApps();
  const filtered = apps.filter(app => app.category === category);
  renderApps(filtered);
}

document.getElementById("searchBar").addEventListener("input",
  debounce(function () {
    const val = this.value.toLowerCase();
    const filtered = apps.filter(app =>
      app.name.toLowerCase().includes(val) ||
      app.description.toLowerCase().includes(val) ||
      app.category.toLowerCase().includes(val)
    );
    renderApps(filtered);
  }, 300)
);

// ==============================
// 🌙 DARK MODE
// ==============================
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

// ==============================
// 💬 REVIEW SYSTEM
// ==============================
let currentApp = null;

function openReviewModal(appName) {
  currentApp = apps.find(a => a.name === appName);
  if (!currentApp) return;

  document.getElementById("reviewAppName").textContent = `Reviews for ${appName}`;
  document.getElementById("commentList").innerHTML =
    currentApp.comments.map(c => `<p>💬 ${c}</p>`).join("");

  renderRatingStars(currentApp.rating);
  document.getElementById("newComment").value = "";
  document.getElementById("reviewModal").style.display = "flex";
}

function renderRatingStars(rating) {
  const starsContainer = document.getElementById("reviewRatingStars");
  starsContainer.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = "★";
    star.classList.add("review-star");
    if (i <= rating) star.classList.add("active");
    star.addEventListener("click", () => setReviewRating(i));
    starsContainer.appendChild(star);
  }
}

function setReviewRating(rating) {
  if (!currentApp) return;
  currentApp.rating = rating;

  const allApps = JSON.parse(localStorage.getItem('allApps') || '[]');
  const appIndex = allApps.findIndex(app => app.name === currentApp.name);
  if (appIndex !== -1) {
    allApps[appIndex].rating = rating;
    localStorage.setItem('allApps', JSON.stringify(allApps));
  }

  trendingApps = [...apps].sort((a, b) => b.rating - a.rating);
  renderApps();
  renderTrendingApps();
}

function submitComment() {
  const comment = document.getElementById("newComment").value.trim();
  if (comment && currentApp) {
    currentApp.comments.push(comment);
    const allApps = JSON.parse(localStorage.getItem('allApps') || '[]');
    const appIndex = allApps.findIndex(app => app.name === currentApp.name);
    if (appIndex !== -1) {
      allApps[appIndex].comments.push(comment);
      localStorage.setItem('allApps', JSON.stringify(allApps));
    }
    document.getElementById("newComment").value = "";
    openReviewModal(currentApp.name);
  }
}

function closeReviewModal() {
  document.getElementById("reviewModal").style.display = "none";
}

// ==============================
// 🖼️ BANNER SLIDER SYSTEM
// ==============================
const banners = [
  {
    image: "uploads/banners/banner1.jpg",
    link: "https://ayushanupamportfolio.netlify.app/"
  },
  {
    image: "uploads/banners/banner2.jpg",
    link: "#trendingGrid",
    text: "Trending Apps",
    description: "Check out what's popular this week"
  },
  {
    image: "uploads/banners/banner3.jpg",
    link: "#trendingGrid",
    text: "Special Offers",
    description: "Limited time discounts available"
  }
];

let currentBanner = 0;
let bannerInterval;

function showBanner(index) {
  const banner = banners[index];
  const nextIndex = (index + 1) % banners.length;
  const preloadImage = new Image();
  preloadImage.src = banners[nextIndex].image;

  document.getElementById("bannerImage").src = banner.image;
  document.getElementById("bannerText").textContent = banner.text || "";
  document.getElementById("bannerDesc").textContent = banner.description || "";
  document.getElementById("bannerLinkWrapper").href = banner.link;

  document.getElementById("bannerDots").innerHTML = banners
    .map((_, i) => `<span class="${i === index ? 'active' : ''}" onclick="setBanner(${i})"></span>`)
    .join("");
}

function setBanner(index) {
  currentBanner = index;
  showBanner(index);
  resetBannerInterval();
}

function nextBanner() {
  currentBanner = (currentBanner + 1) % banners.length;
  showBanner(currentBanner);
}

function resetBannerInterval() {
  clearInterval(bannerInterval);
  bannerInterval = setInterval(nextBanner, 5000);
}

// ==============================
// 🚀 INITIALIZATION
// ==============================
function initializeApp() {
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }

  if (window.location.pathname.includes('app-details.html')) {
    loadAppDetailsPage();
    return;
  }

  renderApps();
  renderTrendingApps();
  showBanner(currentBanner);
  resetBannerInterval();

  const banner = document.querySelector('.banner-slider');
  banner.addEventListener('mouseenter', () => clearInterval(bannerInterval));
  banner.addEventListener('mouseleave', resetBannerInterval);

  const urlParams = new URLSearchParams(window.location.search);
  const reviewApp = urlParams.get('review');
  if (reviewApp) {
    openReviewModal(reviewApp);
  }
}

document.addEventListener('DOMContentLoaded', initializeApp);
