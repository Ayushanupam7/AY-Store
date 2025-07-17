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
    description: "A powerful time tracking tool for project management with advanced analytics and reporting features.",
    comments: ["Super fast!", "Clean UI."],
    screenshots: [
      "uploads/screenshots/chrono1.jpg",
      "uploads/screenshots/chrono2.jpg",
      "uploads/screenshots/chrono3.jpg",
      "uploads/screenshots/chrono4.jpg",
      "uploads/screenshots/chrono5.jpg",
      "uploads/screenshots/chrono6.jpg",
      "uploads/screenshots/chrono7.jpg",
    ],
    developer: "Ayush Anupam ",
    version: "2.1.4",
    size: "38.2 MB",
    updated: "2025-04-06",
    downloads: 100
  },
  {
    name: "Mini Web Portfolio",
    category: "Tools",
    link: "https://ayushanupamportfolio.netlify.app/",
    icon: "uploads/icons/web.png",
    rating: 4.2,
    description: "A powerful time tracking tool for project management with advanced analytics and reporting features.",
    comments: [],
    screenshots: [
      "uploads/screenshots/portfolio1.jpg",
      "uploads/screenshots/portfolio3.jpg",
      "uploads/screenshots/portfolio2.jpg",
    ],
    developer: "WebTools Inc.",
    version: "1.0.3",
    size: "8 MB",
    updated: "2023-10-28",
    downloads: 890
  }
];

const storedApps = JSON.parse(localStorage.getItem('allApps') || '[]');
const apps = storedApps.length ? storedApps : defaultApps;
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

  // Render rating stars
  const ratingContainer = document.getElementById("detailAppRating");
  ratingContainer.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = i <= Math.floor(app.rating) ? "★" : "☆";
    star.style.color = i <= app.rating ? "gold" : "#ccc";
    ratingContainer.appendChild(star);
  }

  // Render screenshots with error handling
  const screenshotsContainer = document.getElementById("appScreenshots");
  screenshotsContainer.innerHTML = '';
  app.screenshots?.forEach(screenshot => {
    const img = document.createElement("img");
    img.src = screenshot;
    img.alt = `${app.name} screenshot`;
    img.loading = "lazy";
    img.onerror = function() {
      console.error("Failed to load screenshot:", screenshot);
      this.style.display = "none";
    };
    screenshotsContainer.appendChild(img);
  });

  // Set up download/visit button
  const downloadBtn = document.getElementById("detailDownloadBtn");
  if (isDownloadable(app.link)) {
    downloadBtn.textContent = `Download (${app.downloads.toLocaleString()}+)`;
    downloadBtn.onclick = () => downloadApp(app.link, app.name);
    downloadBtn.classList.remove('visit-btn');
  } else {
    downloadBtn.textContent = "Visit Site";
    downloadBtn.onclick = () => window.open(app.link, '_blank');
    downloadBtn.classList.add('visit-btn');
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
      : `<button onclick="event.stopPropagation();window.open('${app.link}','_blank')">Visit Site</button>`;

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
      : `<button onclick="event.stopPropagation();window.open('${app.link}','_blank')">Visit Site</button>`;

    card.innerHTML = `
      <div class="trending-rank">#${index + 1}</div>
      <div class="card-content minimal">
        <img src="${app.icon}" alt="${app.name}" class="app-icon" loading="lazy" />
        <h1>${app.name}</h1>
        <div class="buttons">
          ${buttonHTML}
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
// 🔍 SEARCH & SUGGESTIONS
// ==============================
const suggestionBox = document.getElementById("searchSuggestions");

document.getElementById("searchBar").addEventListener("input",
  debounce(function () {
    const val = this.value.toLowerCase().trim();
    const suggestionBox = document.getElementById("searchSuggestions");

    if (!val) {
      suggestionBox.style.display = "none";
      return;
    }

    const filtered = apps.filter(app =>
      app.name.toLowerCase().includes(val)
    );

    if (filtered.length === 0) {
      suggestionBox.style.display = "none";
      return;
    }

    suggestionBox.innerHTML = filtered
      .map(app => `
        <p onclick="selectSuggestion('${app.name}')">
          <img src="${app.icon}" alt="${app.name}" class="suggestion-icon" />
          ${app.name}
        </p>
      `)
      .join("");

    suggestionBox.style.display = "block";
  }, 200)
);

function selectSuggestion(appName) {
  document.getElementById("searchBar").value = appName;
  document.getElementById("searchSuggestions").style.display = "none";
  openAppDetailsPage(appName);
}

function filterApps(category) {
  if (category === "All") return renderApps();
  const filtered = apps.filter(app => app.category === category);
  renderApps(filtered);
}

// ==============================
// 🌙 DARK MODE
// ==============================
function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark");
  localStorage.setItem('darkMode', isDark);

  const toggleBtn = document.getElementById("darkModeToggle");
  toggleBtn.textContent = isDark ? "☀️" : "🌙";
}

// ==============================
// 💬 REVIEW SYSTEM
// ==============================
let currentApp = null;

function openReviewModal(appName) {
  currentApp = apps.find(a => a.name === appName);
  if (!currentApp) return;

  document.getElementById("reviewAppName").textContent = `Reviews for ${appName}`;
  document.getElementById("commentList").innerHTML = currentApp.comments.map(c => `<p>💬 ${c}</p>`).join("");

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
  const index = allApps.findIndex(app => app.name === currentApp.name);
  if (index !== -1) {
    allApps[index].rating = rating;
    localStorage.setItem('allApps', JSON.stringify(allApps));
  }

  trendingApps = [...apps].sort((a, b) => b.rating - a.rating);
  renderApps();
  renderTrendingApps();
  renderRatingStars(rating);
}

function submitComment() {
  const comment = document.getElementById("newComment").value.trim();
  if (comment && currentApp) {
    currentApp.comments.push(comment);
    const allApps = JSON.parse(localStorage.getItem('allApps') || '[]');
    const index = allApps.findIndex(app => app.name === currentApp.name);
    if (index !== -1) {
      allApps[index].comments.push(comment);
      localStorage.setItem('allApps', JSON.stringify(allApps));
    }
    document.getElementById("newComment").value = "";
    openReviewModal(currentApp.name);
  }
}

function closeReviewModal() {
  document.getElementById("reviewModal").style.display = "none";
}

const banners = [
  
  {
    imageDesktop: "uploads/banners/banner1.jpg",
    imageMobile: "uploads/banners/banner1.jpg",
    link: "https://ayushanupamportfolio.netlify.app/",
    // text: "My Portfolio",
    // description: "Explore my work and skills"
  },{
    videoDesktop: "uploads/banners/banner1.mp4",
    
    link: "https://ayushanupamportfolio.netlify.app/",
    // text: "My Portfolio",
    // description: "Explore my work and skills"
  },
  {
    imageDesktop: "uploads/banners/scanner.jpg",
    imageMobile: "uploads/banners/banner2M.jpg",
    link: "#trendingGrid",
    // text: "Trending Now",
    // description: "Check the latest updates"
  }
];

let currentBanner = 0;
let bannerInterval;

function showBanner(index) {
  const banner = banners[index];
  const isMobile = window.innerWidth <= 768;

  const imageSrc = isMobile ? banner.imageMobile : banner.imageDesktop;
  const videoSrc = isMobile ? banner.videoMobile : banner.videoDesktop;

  const bannerImg = document.getElementById("bannerImage");
  const bannerVideo = document.getElementById("bannerVideo");

  if (videoSrc) {
    bannerImg.style.display = "none";
    bannerVideo.style.display = "block";
    bannerVideo.src = videoSrc;
    bannerVideo.load();
  } else if (imageSrc) {
    bannerVideo.style.display = "none";
    bannerImg.style.display = "block";
    bannerImg.src = imageSrc;
  }

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

function addBannerSwipeSupport() {
  const banner = document.querySelector(".banner-slider");
  const bannerImage = document.getElementById("bannerImage");
  let startX = 0;

  banner.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
  });

  banner.addEventListener("touchmove", e => {
    const moveX = e.touches[0].clientX;
    const diffX = moveX - startX;
    bannerImage.style.transform = `translateX(${diffX * 0.2}px)`;
  });

  banner.addEventListener("touchend", e => {
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    bannerImage.style.transition = "transform 0.2s ease-out";
    bannerImage.style.transform = "translateX(0px)";
    setTimeout(() => {
      bannerImage.style.transition = "";
    }, 200);

    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextBanner();
      } else {
        currentBanner = (currentBanner - 1 + banners.length) % banners.length;
        showBanner(currentBanner);
      }
    }
  });
}

function initBannerSlider() {
  showBanner(currentBanner);
  resetBannerInterval();
  addBannerSwipeSupport();

  const banner = document.querySelector('.banner-slider');
  banner.addEventListener('mouseenter', () => clearInterval(bannerInterval));
  banner.addEventListener('mouseleave', resetBannerInterval);
}
// ==============================
// 🚀 INITIALIZATION
// ==============================
function initializeApp() {
  // Dark-mode
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
    document.getElementById("darkModeToggle").textContent = "☀️";
  }

  // Check if we're on the app details page
  if (window.location.pathname.includes('app-details.html')) {
    loadAppDetailsPage();
    return;
  }

  // Initialize main page components
  renderApps();
  renderTrendingApps();
  initBannerSlider();

  // Check for review modal request
  const urlParams = new URLSearchParams(window.location.search);
  const reviewApp = urlParams.get('review');
  if (reviewApp) {
    openReviewModal(reviewApp);
  }
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);