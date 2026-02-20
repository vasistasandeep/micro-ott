// API Configuration
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api';

console.log('🚀 App initialized with API:', API_BASE);

// State
let allContent = [];
let currentFilter = 'all';
let currentVideo = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 DOM loaded, initializing app...');
    initApp();
    setupEventListeners();
});

async function initApp() {
    showLoading(true);
    
    try {
        console.log('📡 Fetching content...');
        await loadAllContent();
        await loadHero();
        renderContent();
        
        console.log('✅ App initialized successfully');
    } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        showError('Failed to load content. Please refresh the page.');
    } finally {
        showLoading(false);
    }
}

// Load Content
async function loadAllContent() {
    try {
        const response = await fetch(`${API_BASE}/catalog/content?limit=100`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Loaded content:', data);
        
        if (data.success && data.data) {
            allContent = data.data;
            console.log(`✅ Loaded ${allContent.length} items`);
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('❌ Error loading content:', error);
        throw error;
    }
}

// Load Hero
async function loadHero() {
    try {
        const response = await fetch(`${API_BASE}/catalog/trending?limit=1`);
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
            const hero = data.data[0];
            updateHero(hero);
        } else if (allContent.length > 0) {
            // Fallback to first content item
            updateHero(allContent[0]);
        }
    } catch (error) {
        console.error('Error loading hero:', error);
        if (allContent.length > 0) {
            updateHero(allContent[0]);
        }
    }
}

function updateHero(content) {
    const hero = document.getElementById('hero');
    const title = document.getElementById('heroTitle');
    const description = document.getElementById('heroDescription');
    const meta = document.getElementById('heroMeta');
    
    // Set background image
    if (content.poster_url) {
        hero.style.backgroundImage = `url(${content.poster_url})`;
    }
    
    // Set title
    title.textContent = content.title;
    
    // Set description
    description.textContent = content.description || 'No description available.';
    
    // Set metadata
    const year = content.release_date ? new Date(content.release_date).getFullYear() : '2024';
    const rating = content.maturity_rating || 'PG-13';
    const duration = content.duration_minutes ? `${Math.floor(content.duration_minutes / 60)}h ${content.duration_minutes % 60}m` : '2h 15m';
    
    meta.innerHTML = `
        <span class="match-score">98% Match</span>
        <span class="year">${year}</span>
        <span class="rating">${rating}</span>
        <span class="duration">${duration}</span>
    `;
    
    // Set play button action
    document.getElementById('heroPlayBtn').onclick = () => playContent(content);
    document.getElementById('heroInfoBtn').onclick = () => showContentInfo(content);
}

// Render Content
function renderContent() {
    const filtered = currentFilter === 'all' 
        ? allContent 
        : allContent.filter(item => item.type === currentFilter);
    
    console.log(`🎬 Rendering ${filtered.length} items (filter: ${currentFilter})`);
    
    // Trending
    const trending = filtered.slice(0, 10);
    renderSlider('trendingSlider', trending);
    
    // Movies
    const movies = allContent.filter(item => item.type === 'movie').slice(0, 10);
    renderSlider('moviesSlider', movies);
    
    // TV Shows
    const tvShows = allContent.filter(item => item.type === 'tv_show').slice(0, 10);
    renderSlider('tvShowsSlider', tvShows);
    
    // Sports
    const sports = allContent.filter(item => item.type === 'sports').slice(0, 10);
    renderSlider('sportsSlider', sports);
}

function renderSlider(sliderId, items) {
    const slider = document.getElementById(sliderId);
    
    if (!items || items.length === 0) {
        slider.innerHTML = '<div class="slider-loading"><p>No content available</p></div>';
        return;
    }
    
    slider.innerHTML = items.map(item => createContentCard(item)).join('');
}

function createContentCard(content) {
    const year = content.release_date ? new Date(content.release_date).getFullYear() : '';
    const rating = content.maturity_rating || 'PG-13';
    const type = content.type === 'tv_show' ? 'TV Show' : content.type === 'sports' ? 'Sports' : 'Movie';
    
    return `
        <div class="content-card" onclick="playContent(${JSON.stringify(content).replace(/"/g, '&quot;')})">
            <img src="${content.thumbnail_url || content.poster_url}" alt="${content.title}" loading="lazy">
            <div class="card-overlay">
                <div class="card-title">${content.title}</div>
                <div class="card-meta">
                    <span>${type}</span>
                    ${year ? `<span>${year}</span>` : ''}
                    <span>${rating}</span>
                </div>
                <div class="card-actions">
                    <button class="card-btn" onclick="event.stopPropagation(); playContent(${JSON.stringify(content).replace(/"/g, '&quot;')})">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M4 2l10 6-10 6V2z"/>
                        </svg>
                    </button>
                    <button class="card-btn" onclick="event.stopPropagation(); addToList(${JSON.stringify(content).replace(/"/g, '&quot;')})">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 2v12M2 8h12" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Play Content
function playContent(content) {
    console.log('▶️ Playing content:', content);
    
    const modal = document.getElementById('playerModal');
    const video = document.getElementById('videoPlayer');
    
    // For demo, use a sample video URL
    // In production, this would come from your video_variants table
    const videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    
    video.src = videoUrl;
    modal.classList.add('show');
    video.play();
    
    currentVideo = content;
    setupVideoControls();
}

function setupVideoControls() {
    const video = document.getElementById('videoPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progressBar = document.getElementById('progressBar');
    const progressFilled = document.getElementById('progressFilled');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const volumeBtn = document.getElementById('volumeBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    // Play/Pause
    playPauseBtn.onclick = () => {
        if (video.paused) {
            video.play();
            playPauseBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor"><path d="M10 8h4v16h-4V8zm8 0h4v16h-4V8z"/></svg>';
        } else {
            video.pause();
            playPauseBtn.innerHTML = '<svg width="32" height="32" viewBox="0 0 32 32" fill="currentColor"><path d="M10 8l12 8-12 8V8z"/></svg>';
        }
    };
    
    // Progress
    video.ontimeupdate = () => {
        const percent = (video.currentTime / video.duration) * 100;
        progressFilled.style.width = `${percent}%`;
        currentTimeEl.textContent = formatTime(video.currentTime);
    };
    
    video.onloadedmetadata = () => {
        durationEl.textContent = formatTime(video.duration);
    };
    
    progressBar.onclick = (e) => {
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
    };
    
    // Volume
    volumeBtn.onclick = () => {
        video.muted = !video.muted;
        volumeBtn.innerHTML = video.muted 
            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>'
            : '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/></svg>';
    };
    
    // Fullscreen
    fullscreenBtn.onclick = () => {
        if (!document.fullscreenElement) {
            document.querySelector('.player-container').requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };
}

function closePlayer() {
    const modal = document.getElementById('playerModal');
    const video = document.getElementById('videoPlayer');
    
    video.pause();
    video.src = '';
    modal.classList.remove('show');
    currentVideo = null;
}

// Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active state
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            // Filter content
            currentFilter = link.dataset.filter;
            renderContent();
        });
    });
    
    // Search
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.toLowerCase();
        
        if (query.length === 0) {
            renderContent();
            return;
        }
        
        const filtered = allContent.filter(item => 
            item.title.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query))
        );
        
        renderSlider('trendingSlider', filtered.slice(0, 10));
        renderSlider('moviesSlider', []);
        renderSlider('tvShowsSlider', []);
        renderSlider('sportsSlider', []);
    }, 300));
    
    // Close player
    document.getElementById('closePlayer').onclick = closePlayer;
    
    // Navbar scroll
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Close player on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && currentVideo) {
            closePlayer();
        }
    });
}

// Utilities
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.add('show');
    } else {
        overlay.classList.remove('show');
    }
}

function showError(message) {
    alert(message); // In production, use a better notification system
}

function showContentInfo(content) {
    alert(`Title: ${content.title}\n\nDescription: ${content.description || 'No description available'}`);
}

function addToList(content) {
    console.log('➕ Added to list:', content.title);
    alert(`Added "${content.title}" to your list!`);
}

// Make functions globally available
window.playContent = playContent;
window.addToList = addToList;
window.showContentInfo = showContentInfo;
