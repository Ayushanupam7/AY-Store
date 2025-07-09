// ==============================
// 🏗️ APPLICATION CONFIGURATION
// ==============================
/**
 * Core application data structure containing:
 * - App name, category, download link
 * - Icon path, rating, description
 * - User comments array
 */
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

// Pre-sort trending apps by rating (descending) for immediate display
let trendingApps = [...apps].sort((a, b) => b.rating - a.rating);

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
    
    // Determine if the app is downloadable or external link
    const isDownload = isDownloadable(app.link);
    const buttonHTML = isDownload
      ? `<button onclick="downloadApp('${app.link}')">Download</button>`
      : `<a href="${app.link}" class="visit-btn" target="_blank">Visit Site</a>`;

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
            <button onclick="openReviewModal('${app.name}')">Review</button>
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
    
    const isDownload = isDownloadable(app.link);
    const buttonHTML = isDownload
      ? `<button onclick="downloadApp('${app.link}')">Download</button>`
      : `<a href="${app.link}" class="visit-btn" target="_blank">Visit Site</a>`;

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
 */
function downloadApp(link) {
  const a = document.createElement("a");
  a.href = link;
  a.target = "_blank";
  a.download = link.split("/").pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// // ==============================
// # 🔍 SEARCH & FILTERING
// # ==============================

// /**
//  * Filters apps by category and re-renders grid
//  * @param {string} category - Category to filter by ("All" shows all apps)
//  */
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
      app.description.toLowerCase().includes(val)
    );
    renderApps(filtered);
  }, 300)
);

// // ==============================
// # 🌙 DARK MODE HANDLING
// # ==============================

// /**
//  * Toggles dark mode and persists preference in localStorage
//  */
function toggleDarkMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem('darkMode', document.body.classList.contains('dark'));
}

// // ==============================
// # 💬 REVIEW SYSTEM
// # ==============================

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

//  ==============================
// # 🖼️ BANNER SLIDER SYSTEM
// # ==============================

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
    link: "#trendingGrid",
    text: "Trending Apps",
    description: "Check out what's popular this week"
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

// // ==============================
// # 🚀 INITIALIZATION
// # ==============================


//  * Main initialization function when DOM is loaded
//  *
document.addEventListener('DOMContentLoaded', () => {
  // Restore dark mode preference
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark');
  }

  // Initial renders
  renderApps();
  renderTrendingApps();
  showBanner(currentBanner);
  resetBannerInterval();

  // Pause banner auto-rotation on hover
  const banner = document.querySelector('.banner-slider');
  banner.addEventListener('mouseenter', () => clearInterval(bannerInterval));
  banner.addEventListener('mouseleave', resetBannerInterval);
});