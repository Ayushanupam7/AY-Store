// ==============================
// 🏗️ APPLICATION CONFIGURATION
// ==============================
/**
 * Core application data structure containing:
 * - App name, category, download link
 * - Icon path, rating, description
 * - User comments array
 * - Additional details for app details page
 */
const apps = [
  {
    name: "ChronoTrackPro",
    category: "Productivity",
    link: "uploads/ChronoTrackPro.exe",
    icon: "uploads/icons/chrono.png",
    rating: 4.5,
    description: "A powerful time tracking tool for project management with advanced analytics and reporting features. Perfect for teams and individual professionals.",
    comments: ["Super fast!", "Clean UI."],
    screenshots: [
      "uploads/screenshots/chrono1.jpg",
      "uploads/screenshots/chrono2.jpg"
    ],
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
    screenshots: [
      "uploads/screenshots/portfolio1.jpg",
      "uploads/screenshots/portfolio2.jpg"
    ],
    developer: "WebTools Inc.",
    version: "1.0.3",
    size: "8 MB",
    updated: "2023-10-28",
    downloads: 890
  },
  {
    name: "PixelArt Studio",
    category: "Games",
    link: "uploads/PixelArtStudio.exe",
    icon: "uploads/icons/pixelart.png",
    rating: 4.8,
    description: "Create beautiful pixel art with this intuitive studio app. Includes animation tools and palette customization.",
    comments: ["Love the brushes!", "Great for beginners"],
    screenshots: [
      "uploads/screenshots/pixelart1.jpg",
      "uploads/screenshots/pixelart2.jpg",
      "uploads/screenshots/pixelart3.jpg"
    ],
    developer: "GameDev Studios",
    version: "3.2.0",
    size: "120 MB",
    updated: "2023-11-10",
    downloads: 3200
  }
];

// Pre-sort trending apps by rating (descending) for immediate display
let trendingApps = [...apps].sort((a, b) => b.rating - a.rating);

// ==============================
// 📱 APP DETAILS PAGE FUNCTIONS
// ==============================

/**
 * Opens app details in a new page
 * @param {string} appName - Name of app to show details for
 */
function openAppDetailsPage(appName) {
  // Save apps to localStorage so details page can access
  localStorage.setItem('allApps', JSON.stringify(apps));
  window.location.href = `app-details.html?app=${encodeURIComponent(appName)}`;
}

/**
 * Loads app details on the details page
 */
function loadAppDetailsPage() {
  const params = new URLSearchParams(window.location.search);
  const appName = params.get('app');
  if (!appName) return;

  const apps = JSON.parse(localStorage.getItem('allApps') || []);
  const app = apps.find(a => a.name === appName);
  if (!app) return;

  // Set basic info
  document.getElementById("detailAppName").textContent = app.name;
  document.getElementById("detailAppIcon").src = app.icon;
  document.getElementById("detailAppDescription").textContent = app.description;
  document.getElementById("detailAppCategory").textContent = app.category;
  document.getElementById("detailAppSize").textContent = app.size;
  document.getElementById("detailAppVersion").textContent = `v${app.version}`;
  document.getElementById("detailAppDeveloper").textContent = app.developer;
  document.getElementById("detailAppUpdated").textContent = new Date(app.updated).toLocaleDateString();
  document.getElementById("detailAppDownloads").textContent = `${app.downloads.toLocaleString()}+ downloads`;

  // Set rating stars
  const ratingContainer = document.getElementById("detailAppRating");
  ratingContainer.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = i <= Math.floor(app.rating) ? "★" : "☆";
    ratingContainer.appendChild(star);
  }

  // Set screenshots
  const screenshotsContainer = document.getElementById("appScreenshots");
  screenshotsContainer.innerHTML = '';
  app.screenshots?.forEach(screenshot => {
    const img = document.createElement("img");
    img.src = screenshot;
    img.alt = `${app.name} screenshot`;
    img.loading = "lazy";
    screenshotsContainer.appendChild(img);
  });

  // Set download button
  const downloadBtn = document.getElementById("detailDownloadBtn");
  if (isDownloadable(app.link)) {
    downloadBtn.textContent = `Download (${app.downloads.toLocaleString()}+)`;
    downloadBtn.onclick = () => {
      // Track download
      app.downloads++;
      localStorage.setItem('allApps', JSON.stringify(apps));
      // Start download
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

  // Set review button
  document.getElementById("detailReviewBtn").onclick = () => {
    window.location.href = `index.html?review=${encodeURIComponent(app.name)}`;
  };
}

// ==============================
// 🖥️ UI RENDERING COMPONENTS
// ==============================

/**
 * Renders the main app grid with filtering capability
 * @param {Array} filteredApps - Optional filtered app list (defaults to all apps)
 */
function renderApps(filteredApps = apps) {
  const grid = document.getElementById("appGrid");
  grid.innerHTML = "";

  filteredApps.forEach(app => {
    const card = document.createElement("div");
    card.className = "app-card";
    card.onclick = () => openAppDetailsPage(app.name);
    
    // Determine if the app is downloadable or external link
    const isDownload = isDownloadable(app.link);
    const buttonHTML = isDownload
      ? `<button onclick="event.stopPropagation();downloadApp('${app.link}','${app.name}')">Download</button>`
      : `<a href="${app.link}" class="visit-btn" target="_blank" onclick="event.stopPropagation()">Visit Site</a>`;

    // Build card HTML structure
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

/**
 * Renders trending apps in a horizontal scrollable section
 * Includes ranking indicators (1st, 2nd, etc.)
 */
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

/**
 * Checks if a link is downloadable based on URL pattern
 * @param {string} link - The URL to check
 * @returns {boolean} True if downloadable
 */
function isDownloadable(link) {
  return link.startsWith("uploads/") || 
         link.endsWith(".exe") || 
         link.endsWith(".zip");
}

/**
 * Debounce function to limit rapid firing of events
 * @param {Function} func - Function to debounce
 * @param {number} wait - Delay in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// ==============================
// 📥 DOWNLOAD HANDLING
// ==============================

/**
 * Handles file downloads by creating temporary anchor element
 * @param {string} link - Download URL
 * @param {string} appName - Name of app being downloaded
 */
function downloadApp(link, appName) {
  const app = apps.find(a => a.name === appName);
  if (app) {
    app.downloads++;
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

/**
 * Filters apps by category and re-renders grid
 * @param {string} category - Category to filter by ("All" shows all apps)
 */
function filterApps(category) {
  if (category === "All") return renderApps();
  const filtered = apps.filter(app => app.category === category);
  renderApps(filtered);
}

// Search functionality with debounce
document.getElementById("searchBar").addEventListener("input", 
  debounce(function() {
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
// 🌙 DARK MODE HANDLING
// ==============================

/**
 * Toggles dark mode and persists preference in localStorage
 */
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

// ==============================
// 💬 REVIEW SYSTEM
// ==============================

let currentApp = null; // Currently selected app for reviews

/**
 * Opens review modal and fetches latest data from server
 * @param {string} appName - Name of app to review
 */
async function openReviewModal(appName) {
  const app = apps.find(a => a.name === appName);
  currentApp = app;

  try {
    // Fetch updated app data from server
    const response = await fetch(`/.netlify/functions/get-app?name=${encodeURIComponent(appName)}`);
    if (response.ok) {
      const data = await response.json();
      if (data.comments) app.comments = data.comments;
      if (data.rating) app.rating = data.rating;
    }
  } catch (error) {
    console.error('Error fetching app data:', error);
  }

  // Update modal UI
  document.getElementById("reviewAppName").textContent = `Reviews for ${app.name}`;
  document.getElementById("commentList").innerHTML =
    app.comments.map(c => `<p>💬 ${c}</p>`).join("");

  renderRatingStars(app.rating);
  document.getElementById("newComment").value = "";
  document.getElementById("reviewModal").style.display = "flex";
}

/**
 * Renders interactive rating stars
 * @param {number} rating - Current rating (1-5)
 */
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

/**
 * Updates rating and syncs with server
 * @param {number} rating - New rating (1-5)
 */
async function setReviewRating(rating) {
  if (!currentApp) return;
  currentApp.rating = rating;

  try {
    const response = await fetch('/.netlify/functions/update-rating', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        appName: currentApp.name,
        rating 
      })
    });
    
    if (!response.ok) throw new Error('Failed to update rating');
    
    // Update trending list and re-render
    trendingApps = [...apps].sort((a, b) => b.rating - a.rating);
    renderApps();
    renderTrendingApps();
  } catch (error) {
    console.error('Error updating rating:', error);
    alert('Failed to update rating. Please try again.');
  }
}

/**
 * Submits new comment to server and updates UI
 */
async function submitComment() {
  const comment = document.getElementById("newComment").value.trim();
  if (comment && currentApp) {
    try {
      const response = await fetch('/.netlify/functions/add-comment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          appName: currentApp.name,
          comment 
        })
      });
      
      if (!response.ok) throw new Error('Failed to add comment');
      
      currentApp.comments.push(comment);
      document.getElementById("newComment").value = "";
      openReviewModal(currentApp.name); // Refresh modal
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
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
    link: "https://ayushanupamportfolio.netlify.app/",
    text: "New Release",
    description: "Check out our latest productivity tools"
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

/**
 * Displays specified banner and preloads next one
 * @param {number} index - Banner index to show
 */
function showBanner(index) {
  const banner = banners[index];
  
  // Preload next banner for smoother transitions
  const nextIndex = (index + 1) % banners.length;
  const nextBanner = banners[nextIndex];
  const preloadImage = new Image();
  preloadImage.src = nextBanner.image;

  // Update DOM elements
  document.getElementById("bannerImage").src = banner.image;
  document.getElementById("bannerText").textContent = banner.text || "";
  document.getElementById("bannerDesc").textContent = banner.description || "";
  document.getElementById("bannerLinkWrapper").href = banner.link;

  // Update navigation dots
  document.getElementById("bannerDots").innerHTML = banners
    .map((_, i) => `<span class="${i === index ? 'active' : ''}" onclick="setBanner(${i})"></span>`)
    .join("");
}

/**
 * Sets specific banner and resets auto-rotation timer
 * @param {number} index - Banner index to display
 */
function setBanner(index) {
  currentBanner = index;
  showBanner(index);
  resetBannerInterval();
}

/**
 * Advances to next banner in sequence
 */
function nextBanner() {
  currentBanner = (currentBanner + 1) % banners.length;
  showBanner(currentBanner);
}

/**
 * Resets auto-rotation interval
 */
function resetBannerInterval() {
  clearInterval(bannerInterval);
  bannerInterval = setInterval(nextBanner, 5000);
}

// ==============================
// 🚀 INITIALIZATION
// ==============================

/**
 * Main initialization function when DOM is loaded
 */
function initializeApp() {
  // Restore dark mode preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }

  // Check if we're on the details page
  if (window.location.pathname.includes('app-details.html')) {
    loadAppDetailsPage();
    return;
  }

  // Initial renders for main page
  renderApps();
  renderTrendingApps();
  showBanner(currentBanner);
  resetBannerInterval();

  // Pause banner auto-rotation on hover
  const banner = document.querySelector('.banner-slider');
  banner.addEventListener('mouseenter', () => clearInterval(bannerInterval));
  banner.addEventListener('mouseleave', resetBannerInterval);

  // Handle review parameter in URL
  const urlParams = new URLSearchParams(window.location.search);
  const reviewApp = urlParams.get('review');
  if (reviewApp) {
    openReviewModal(reviewApp);
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);