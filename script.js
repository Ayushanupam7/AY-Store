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

// Store app likes and initialize with default values
let appLikes = Object.fromEntries(apps.map(app => [app.name, 0]));

// ✅ Check if link is downloadable
function isDownloadable(link) {
  return link.startsWith("uploads/") || link.endsWith(".exe") || link.endsWith(".zip");
}

// ==========================
// 📦 Render App Card Grid
// ==========================
function renderApps(filteredApps = apps) {
  const grid = document.getElementById("appGrid");
  grid.innerHTML = "";

  filteredApps.forEach(app => {
    const card = document.createElement("div");
    card.className = "app-card";

    const isDownload = isDownloadable(app.link);
    const buttonHTML = isDownload
      ? `<button onclick="downloadApp('${app.link}')">Download</button>`
      : `<a href="${app.link}" class="visit-btn" target="_blank">Visit Site</a>`;

    const likeCount = appLikes[app.name] || 0;
    
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
            <button onclick="openReviewModal('${app.name}')">Review</button>
            <button class="like-btn" onclick="likeApp('${app.name}')" id="like-${app.name.replace(/\s+/g, '-')}">
              ❤️ <span class="like-count">${likeCount}</span>
            </button>
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

    const isDownload = isDownloadable(app.link);
    const buttonHTML = isDownload
      ? `<button onclick="downloadApp('${app.link}')">Download</button>`
      : `<a href="${app.link}" class="visit-btn" target="_blank">Visit Site</a>`;

    const likeCount = appLikes[app.name] || 0;
    
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
            <button onclick="openReviewModal('${app.name}')">Review</button>
            <button class="like-btn" onclick="likeApp('${app.name}')" id="like-${app.name.replace(/\s+/g, '-')}">
              ❤️ <span class="like-count">${likeCount}</span>
            </button>
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
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

// =====================
// 🔎 Search Functionality
// =====================
document.getElementById("searchBar").addEventListener("input", debounce(function () {
  const val = this.value.toLowerCase();
  const filtered = apps.filter(app => 
    app.name.toLowerCase().includes(val) || 
    app.description.toLowerCase().includes(val)
  );
  renderApps(filtered);
}, 300));

function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// ========================
// 💬 Review Modal Section
// ========================
let currentApp = null;

async function openReviewModal(appName) {
  const app = apps.find(a => a.name === appName);
  currentApp = app;

  // Load fresh comments from database
  try {
    const response = await fetch(`/.netlify/functions/get-app?name=${encodeURIComponent(appName)}`);
    if (response.ok) {
      const data = await response.json();
      if (data.comments) app.comments = data.comments;
      if (data.rating) app.rating = data.rating;
    }
  } catch (error) {
    console.error('Error fetching app data:', error);
  }

  document.getElementById("reviewAppName").textContent = `Reviews for ${app.name}`;
  document.getElementById("commentList").innerHTML =
    app.comments.map(c => `<p>💬 ${c}</p>`).join("");

  renderRatingStars(app.rating);
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

async function setReviewRating(rating) {
  if (!currentApp) return;
  currentApp.rating = rating;

  // Update in database
  try {
    await fetch('/.netlify/functions/update-rating', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        appName: currentApp.name,
        rating 
      })
    });
  } catch (error) {
    console.error('Error updating rating:', error);
  }

  trendingApps = [...apps].sort((a, b) => b.rating - a.rating);
  renderApps();
  renderTrendingApps();
}

function closeReviewModal() {
  document.getElementById("reviewModal").style.display = "none";
}

async function submitComment() {
  const comment = document.getElementById("newComment").value.trim();
  if (comment && currentApp) {
    currentApp.comments.push(comment);
    
    // Update in database
    try {
      await fetch('/.netlify/functions/add-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          appName: currentApp.name,
          comment 
        })
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
    
    document.getElementById("newComment").value = "";
    openReviewModal(currentApp.name);
  }
}

// ==================
// 🎞 Banner Slider
// ==================
const banners = [
  {
    image: "uploads/banners/banner1.jpg",
    link: "https://ayushanupamportfolio.netlify.app/",
    
  },
  {
    image: "uploads/banners/banner2.jpg",
    link: "#trendingGrid",
    text: "Trending Apps",
    description: "Check out what's popular this week"
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
let bannerInterval;

function showBanner(index) {
  const banner = banners[index];
  const bannerImage = document.getElementById("bannerImage");
  
  // Preload next banner image
  const nextIndex = (index + 1) % banners.length;
  const nextBanner = banners[nextIndex];
  const preloadImage = new Image();
  preloadImage.src = nextBanner.image;

  bannerImage.src = banner.image;
  bannerImage.alt = banner.text || "Banner";
  document.getElementById("bannerText").textContent = banner.text || "";
  document.getElementById("bannerDesc").textContent = banner.description || "";
  document.getElementById("bannerLinkWrapper").href = banner.link;

  // Update dots
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

// ===================
// ❤️ Like Functionality (Updated)
// ===================
async function fetchLikes() {
  try {
    const response = await fetch('/.netlify/functions/get-likes');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    appLikes = data;
    
    // Update all like buttons
    Object.entries(appLikes).forEach(([appName, likes]) => {
      updateLikeButton(appName, likes);
    });
  } catch (error) {
    console.error('Error fetching likes:', error);
    // Fallback to local storage if DB fails
    const localLikes = localStorage.getItem('appLikes');
    if (localLikes) {
      appLikes = JSON.parse(localLikes);
    }
  }
}

async function likeApp(appName) {
  const likeButton = document.getElementById(`like-${appName.replace(/\s+/g, '-')}`);
  if (!likeButton) return;
  
  // Optimistic UI update
  const likeCountElement = likeButton.querySelector('.like-count');
  const currentCount = parseInt(likeCountElement.textContent) || 0;
  likeCountElement.textContent = currentCount + 1;
  likeButton.classList.add('heart-animation');
  likeButton.disabled = true;

  try {
    const response = await fetch('/.netlify/functions/update-likes', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ appName })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update likes');
    }

    const data = await response.json();
    appLikes[appName] = data.newCount;
    
    // Save to local storage as backup
    localStorage.setItem('appLikes', JSON.stringify(appLikes));
  } catch (error) {
    console.error('Like error:', error);
    // Revert optimistic update
    likeCountElement.textContent = currentCount;
    alert(error.message || 'Failed to save your like. Please try again.');
  } finally {
    setTimeout(() => {
      likeButton.classList.remove('heart-animation');
      likeButton.disabled = false;
    }, 1000);
  }
}

function updateLikeButton(appName, likes) {
  const likeElement = document.getElementById(`like-${appName.replace(/\s+/g, '-')}`);
  if (likeElement) {
    likeElement.querySelector('.like-count').textContent = likes;
  }
}

// ===================
// 🚀 Initialize App
// ===================
document.addEventListener('DOMContentLoaded', () => {
  // Set dark mode if preferred
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }

  // Initial renders
  renderApps();
  renderTrendingApps();
  showBanner(currentBanner);
  resetBannerInterval();

  // Fetch initial data
  fetchLikes();

  // Pause banner on hover
  const banner = document.querySelector('.banner-slider');
  banner.addEventListener('mouseenter', () => clearInterval(bannerInterval));
  banner.addEventListener('mouseleave', resetBannerInterval);
});