// API Configuration
const API_BASE = 'http://localhost:3000/api';

// State Management
let currentUser = null;
let currentProfile = null;
let allContent = [];
let player = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
    checkAuth();
});

async function initializeApp() {
    try {
        await loadContent();
        await loadTrending();
        await loadGenres();
        setupHero();
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
}

// Event Listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            filterContent(page);
        });
    });

    // Search
    document.getElementById('searchInput').addEventListener('input', debounce(handleSearch, 500));

    // Profile Button
    document.getElementById('profileBtn').addEventListener('click', () => {
        if (currentUser) {
            showProfileModal();
        } else {
            showAuthModal();
        }
    });

    // Auth Modal
    const authModal = document.getElementById('authModal');
    authModal.querySelector('.close').addEventListener('click', () => {
        authModal.style.display = 'none';
    });

    document.getElementById('authToggleLink').addEventListener('click', (e) => {
        e.preventDefault();
        toggleAuthMode();
    });

    document.getElementById('authForm').addEventListener('submit', handleAuth);

    // Player Modal
    const playerModal = document.getElementById('playerModal');
    playerModal.querySelector('.close-player').addEventListener('click', () => {
        closePlayer();
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
        currentUser = JSON.parse(user);
        updateUIForAuth();
    }
}

function showAuthModal() {
    document.getElementById('authModal').style.display = 'block';
}

function toggleAuthMode() {
    const title = document.getElementById('authTitle');
    const submit = document.getElementById('authSubmit');
    const toggleText = document.getElementById('authToggleText');
    const toggleLink = document.getElementById('authToggleLink');
    
    if (title.textContent === 'Sign In') {
        title.textContent = 'Sign Up';
        submit.textContent = 'Sign Up';
        toggleText.textContent = 'Already have an account?';
        toggleLink.textContent = 'Sign In';
    } else {
        title.textContent = 'Sign In';
        submit.textContent = 'Sign In';
        toggleText.textContent = 'New user?';
        toggleLink.textContent = 'Sign Up';
    }
}

async function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const isSignUp = document.getElementById('authTitle').textContent === 'Sign Up';
    
    try {
        const endpoint = isSignUp ? '/auth/register' : '/auth/login';
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            if (!isSignUp) {
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));
                currentUser = data.user;
            }
            
            document.getElementById('authModal').style.display = 'none';
            updateUIForAuth();
            
            if (isSignUp) {
                alert('Account created! Please sign in.');
                toggleAuthMode();
                showAuthModal();
            } else {
                showProfileModal();
            }
        } else {
            alert(data.message || 'Authentication failed');
        }
    } catch (error) {
        console.error('Auth error:', error);
        alert('Authentication failed. Please try again.');
    }
}

function updateUIForAuth() {
    document.getElementById('profileBtn').textContent = '👤';
}

// Profile Management
async function showProfileModal() {
    const modal = document.getElementById('profileModal');
    const profileList = document.getElementById('profileList');
    
    try {
        const response = await fetch(`${API_BASE}/auth/profiles`, {
            headers: {
                'x-user-id': currentUser.id
            }
        });
        
        const profiles = await response.json();
        
        profileList.innerHTML = profiles.map(profile => `
            <div class="profile-item" onclick="selectProfile('${profile.id}', '${profile.name}')">
                <div class="profile-avatar">${profile.name.charAt(0).toUpperCase()}</div>
                <p>${profile.name}</p>
            </div>
        `).join('');
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Failed to load profiles:', error);
    }
}

function selectProfile(id, name) {
    currentProfile = { id, name };
    document.getElementById('profileModal').style.display = 'none';
    document.getElementById('profileBtn').textContent = name.charAt(0).toUpperCase();
    loadContinueWatching();
}

// Content Loading
async function loadContent() {
    try {
        const response = await fetch(`${API_BASE}/catalog/content`);
        allContent = await response.json();
        
        // Display all content
        displayContent(allContent, 'allContentList');
        
        // Separate by type
        const movies = allContent.filter(item => item.type === 'movie');
        const tvShows = allContent.filter(item => item.type === 'tv_show');
        
        displayContent(movies, 'moviesList');
        displayContent(tvShows, 'tvShowsList');
    } catch (error) {
        console.error('Failed to load content:', error);
    }
}

async function loadTrending() {
    try {
        const response = await fetch(`${API_BASE}/catalog/trending`);
        const trending = await response.json();
        displayContent(trending, 'trendingList');
    } catch (error) {
        console.error('Failed to load trending:', error);
    }
}

async function loadGenres() {
    try {
        const response = await fetch(`${API_BASE}/catalog/genres`);
        const genres = await response.json();
        
        const genreList = document.getElementById('genreList');
        genreList.innerHTML = genres.map(genre => `
            <div class="genre-tag" onclick="filterByGenre('${genre.slug}')">
                ${genre.name}
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load genres:', error);
    }
}

async function loadContinueWatching() {
    if (!currentUser || !currentProfile) return;
    
    try {
        const response = await fetch(
            `${API_BASE}/stream/continue-watching/${currentUser.id}/${currentProfile.id}`
        );
        const continueWatching = await response.json();
        
        if (continueWatching.length > 0) {
            document.getElementById('continueWatching').style.display = 'block';
            // Display continue watching items
        }
    } catch (error) {
        console.error('Failed to load continue watching:', error);
    }
}

// Content Display
function displayContent(content, containerId) {
    const container = document.getElementById(containerId);
    
    container.innerHTML = content.map((item, index) => {
        // Generate better placeholder images based on content type
        const placeholderImage = getPlaceholderImage(item, index);
        const imageUrl = item.poster_url || item.thumbnail_url || placeholderImage;
        
        return `
        <div class="content-card" onclick='playContent(${JSON.stringify(item).replace(/'/g, "&apos;")})'>
            <div class="content-card-image">
                <img src="${imageUrl}" 
                     alt="${item.title}"
                     onload="this.classList.add('loaded')"
                     onerror="this.src='${placeholderImage}'; this.classList.add('loaded')">
                <div class="content-card-overlay">
                    <div class="content-card-title">${item.title}</div>
                    <div class="content-card-meta">
                        <span class="badge badge-type">${item.type.replace('_', ' ').toUpperCase()}</span>
                        <span class="badge ${item.tier_requirement === 'free' ? 'badge-free' : 'badge-premium'}">
                            ${item.tier_requirement === 'free' ? '🆓' : '⭐'}
                        </span>
                        ${item.maturity_rating ? `<span>${item.maturity_rating}</span>` : ''}
                        ${item.duration_minutes ? `<span>${item.duration_minutes}m</span>` : ''}
                    </div>
                    <div class="content-card-actions">
                        <button class="card-action-btn primary" onclick="event.stopPropagation(); playContent(${JSON.stringify(item).replace(/'/g, "&apos;")})">▶</button>
                        <button class="card-action-btn" onclick="event.stopPropagation(); addToWatchlist('${item.id}')">+</button>
                        <button class="card-action-btn" onclick="event.stopPropagation(); showContentInfo(${JSON.stringify(item).replace(/'/g, "&apos;")})">ℹ</button>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');
}

// Generate placeholder images based on content
function getPlaceholderImage(item, index) {
    // Use Picsum Photos for high-quality random images
    // Each content gets a unique seed based on its title
    const seed = item.title ? item.title.replace(/\s+/g, '-').toLowerCase() : `content-${index}`;
    
    // Add blur and grayscale for a cinematic look
    return `https://picsum.photos/seed/${seed}/280/420?grayscale&blur=1`;
}

// Get hero background image
function getHeroPlaceholderImage(item) {
    const seed = item.title ? item.title.replace(/\s+/g, '-').toLowerCase() : 'hero';
    return `https://picsum.photos/seed/${seed}/1920/1080?grayscale`;
}

// Carousel Navigation
function scrollCarousel(carouselId, direction) {
    const carousel = document.getElementById(carouselId);
    const scrollAmount = 300 * 3; // Scroll 3 items at a time
    carousel.scrollBy({
        left: direction * scrollAmount,
        behavior: 'smooth'
    });
}

// Add to Watchlist
async function addToWatchlist(contentId) {
    if (!currentUser || !currentProfile) {
        showAuthModal();
        return;
    }
    
    // Show feedback
    alert('Added to your watchlist!');
    console.log('Added to watchlist:', contentId);
}

// Hero Section
function setupHero() {
    if (allContent.length === 0) return;

    const featured = allContent[0];
    const hero = document.getElementById('heroSection');

    // Use a high-quality spotlight image (landscape format for hero banner)
    const spotlightSeed = `spotlight-${featured.id || 'hero'}`;
    const spotlightImage = `https://picsum.photos/seed/${spotlightSeed}/1920/800`;

    hero.style.backgroundImage = `linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.8) 100%), url(${spotlightImage})`;
    document.getElementById('heroTitle').textContent = featured.title;
    document.getElementById('heroDescription').textContent = featured.description || 'No description available';

    document.getElementById('heroPlayBtn').onclick = () => playContent(featured);
    document.getElementById('heroInfoBtn').onclick = () => showContentInfo(featured);
}


// Video Player
let currentContent = null;
let playbackInterval = null;

async function playContent(content) {
    currentContent = content;
    const modal = document.getElementById('playerModal');
    const videoElement = document.getElementById('videoPlayer');
    const loadingSpinner = document.querySelector('.loading-spinner');
    const centerPlayBtn = document.querySelector('.center-play-btn');
    
    // Set video info
    document.getElementById('videoTitle').textContent = content.title;
    document.getElementById('videoDescription').textContent = content.description || 'No description available';
    document.getElementById('videoRating').textContent = content.maturity_rating || 'Not Rated';
    document.getElementById('videoGenres').textContent = content.genres ? content.genres.map(g => g.name).join(', ') : 'N/A';
    document.getElementById('videoDuration').textContent = content.duration_minutes ? `${content.duration_minutes} min` : 'N/A';
    document.getElementById('videoTier').textContent = content.tier_requirement === 'free' ? '🆓 Free' : '⭐ Premium';
    
    // Show loading
    loadingSpinner.classList.add('show');
    centerPlayBtn.classList.remove('show');
    
    // Get video manifest
    try {
        const response = await fetch(`${API_BASE}/stream/${content.id}/manifest`);
        const manifest = await response.json();
        
        // Set video source
        videoElement.src = manifest.manifestUrl;
        
        // Setup player controls
        setupPlayerControls(videoElement);
        
        // Track playback
        if (currentUser && currentProfile) {
            startPlaybackTracking(content.id);
        }
        
        modal.style.display = 'block';
        
        // Hide loading when ready
        videoElement.addEventListener('loadeddata', () => {
            loadingSpinner.classList.remove('show');
            centerPlayBtn.classList.add('show');
        }, { once: true });
        
    } catch (error) {
        console.error('Failed to load video:', error);
        alert('Failed to load video. Please try again.');
        loadingSpinner.classList.remove('show');
    }
}

function setupPlayerControls(video) {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const centerPlayBtn = document.querySelector('.center-play-btn');
    const rewindBtn = document.getElementById('rewindBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeLevel = document.getElementById('volumeLevel');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsDropdown = document.getElementById('settingsDropdown');
    const progressContainer = document.getElementById('progressContainer');
    const progressBar = document.getElementById('progressBar');
    const bufferBar = document.getElementById('bufferBar');
    const currentTimeEl = document.getElementById('currentTime');
    const durationEl = document.getElementById('duration');
    const customControls = document.querySelector('.custom-controls');
    const videoWrapper = document.querySelector('.video-wrapper');
    
    // Play/Pause
    function togglePlay() {
        if (video.paused) {
            video.play();
            playPauseBtn.textContent = '⏸';
            centerPlayBtn.classList.remove('show');
        } else {
            video.pause();
            playPauseBtn.textContent = '▶';
            centerPlayBtn.classList.add('show');
        }
    }
    
    playPauseBtn.addEventListener('click', togglePlay);
    centerPlayBtn.addEventListener('click', togglePlay);
    video.addEventListener('click', togglePlay);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('playerModal').style.display !== 'block') return;
        
        switch(e.key) {
            case ' ':
            case 'k':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                video.currentTime -= 10;
                break;
            case 'ArrowRight':
                e.preventDefault();
                video.currentTime += 10;
                break;
            case 'ArrowUp':
                e.preventDefault();
                video.volume = Math.min(1, video.volume + 0.1);
                break;
            case 'ArrowDown':
                e.preventDefault();
                video.volume = Math.max(0, video.volume - 0.1);
                break;
            case 'f':
                toggleFullscreen();
                break;
            case 'm':
                toggleMute();
                break;
        }
    });
    
    // Rewind/Forward
    rewindBtn.addEventListener('click', () => {
        video.currentTime -= 10;
    });
    
    forwardBtn.addEventListener('click', () => {
        video.currentTime += 10;
    });
    
    // Volume
    function updateVolume(volume) {
        video.volume = volume;
        volumeLevel.style.width = (volume * 100) + '%';
        
        if (volume === 0) {
            volumeBtn.textContent = '🔇';
        } else if (volume < 0.5) {
            volumeBtn.textContent = '🔉';
        } else {
            volumeBtn.textContent = '🔊';
        }
    }
    
    function toggleMute() {
        if (video.volume > 0) {
            video.dataset.lastVolume = video.volume;
            updateVolume(0);
        } else {
            updateVolume(parseFloat(video.dataset.lastVolume) || 0.5);
        }
    }
    
    volumeBtn.addEventListener('click', toggleMute);
    
    volumeSlider.addEventListener('click', (e) => {
        const rect = volumeSlider.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        updateVolume(percent);
    });
    
    // Progress bar
    video.addEventListener('timeupdate', () => {
        const percent = (video.currentTime / video.duration) * 100;
        progressBar.style.width = percent + '%';
        currentTimeEl.textContent = formatTime(video.currentTime);
    });
    
    video.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(video.duration);
    });
    
    video.addEventListener('progress', () => {
        if (video.buffered.length > 0) {
            const bufferedEnd = video.buffered.end(video.buffered.length - 1);
            const percent = (bufferedEnd / video.duration) * 100;
            bufferBar.style.width = percent + '%';
        }
    });
    
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        video.currentTime = percent * video.duration;
    });
    
    // Fullscreen
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            videoWrapper.requestFullscreen().catch(err => {
                console.error('Fullscreen error:', err);
            });
            fullscreenBtn.textContent = '⛶';
        } else {
            document.exitFullscreen();
            fullscreenBtn.textContent = '⛶';
        }
    }
    
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    
    // Settings menu
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        settingsDropdown.classList.toggle('show');
    });
    
    document.addEventListener('click', () => {
        settingsDropdown.classList.remove('show');
    });
    
    // Show/hide controls
    let controlsTimeout;
    
    function showControls() {
        customControls.classList.add('show');
        videoWrapper.style.cursor = 'default';
        
        clearTimeout(controlsTimeout);
        if (!video.paused) {
            controlsTimeout = setTimeout(() => {
                customControls.classList.remove('show');
                videoWrapper.style.cursor = 'none';
            }, 3000);
        }
    }
    
    videoWrapper.addEventListener('mousemove', showControls);
    videoWrapper.addEventListener('touchstart', showControls);
    
    video.addEventListener('play', () => {
        showControls();
    });
    
    video.addEventListener('pause', () => {
        customControls.classList.add('show');
        videoWrapper.style.cursor = 'default';
        clearTimeout(controlsTimeout);
    });
}

function changePlaybackSpeed(speed) {
    const video = document.getElementById('videoPlayer');
    video.playbackRate = speed;
    
    // Update checkmarks
    ['0.5', '1', '1.5', '2'].forEach(s => {
        const el = document.getElementById(`speed-${s}`);
        if (el) el.textContent = s === speed.toString() ? '✓' : '';
    });
}

function changeQuality(quality) {
    // Update checkmarks
    ['auto', '1080p', '720p', '480p'].forEach(q => {
        const el = document.getElementById(`quality-${q}`);
        if (el) el.textContent = q === quality ? '✓' : '';
    });
    
    // In a real implementation, you would switch video sources here
    console.log('Quality changed to:', quality);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function closePlayer() {
    const modal = document.getElementById('playerModal');
    const video = document.getElementById('videoPlayer');
    
    modal.style.display = 'none';
    video.pause();
    video.src = '';
    
    // Clear playback tracking
    if (playbackInterval) {
        clearInterval(playbackInterval);
        playbackInterval = null;
    }
}

async function startPlaybackTracking(contentId) {
    try {
        await fetch(`${API_BASE}/stream/playback/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: currentUser.id,
                profileId: currentProfile.id,
                contentId: contentId
            })
        });
        
        // Update position every 10 seconds
        const video = document.getElementById('videoPlayer');
        playbackInterval = setInterval(async () => {
            if (video && !video.paused && video.currentTime > 0) {
                await fetch(`${API_BASE}/stream/playback/position`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: currentUser.id,
                        profileId: currentProfile.id,
                        contentId: contentId,
                        position: Math.floor(video.currentTime)
                    })
                });
            }
        }, 10000);
    } catch (error) {
        console.error('Failed to track playback:', error);
    }
}

// Search & Filter
async function handleSearch(e) {
    const query = e.target.value.trim();
    
    if (query.length < 2) {
        displayContent(allContent, 'allContentList');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE}/catalog/search?q=${encodeURIComponent(query)}`);
        const results = await response.json();
        displayContent(results, 'allContentList');
    } catch (error) {
        console.error('Search failed:', error);
    }
}

function filterContent(type) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (type === 'home') {
        displayContent(allContent, 'allContentList');
    } else {
        const filtered = allContent.filter(item => {
            if (type === 'movies') return item.type === 'movie';
            if (type === 'tvshows') return item.type === 'tv_show';
            if (type === 'sports') return item.type === 'sports';
            return true;
        });
        displayContent(filtered, 'allContentList');
    }
}

function filterByGenre(genreSlug) {
    const filtered = allContent.filter(item => 
        item.genres && item.genres.some(g => g.slug === genreSlug)
    );
    displayContent(filtered, 'allContentList');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Hero Section
function setupHero() {
    if (allContent.length === 0) return;
    
    const featured = allContent[0];
    const hero = document.getElementById('heroSection');
    
    // Use actual image or high-quality placeholder
    const heroImage = featured.poster_url || featured.thumbnail_url || getHeroPlaceholderImage(featured);
    hero.style.backgroundImage = `url(${heroImage})`;
    
    document.getElementById('heroTitle').textContent = featured.title;
    document.getElementById('heroDescription').textContent = featured.description || 'No description available';
    
    // Set hero metadata
    const releaseYear = featured.release_date ? new Date(featured.release_date).getFullYear() : '2024';
    document.getElementById('heroYear').textContent = releaseYear;
    document.getElementById('heroRating').textContent = featured.maturity_rating || 'PG-13';
    document.getElementById('heroDuration').textContent = featured.duration_minutes ? 
        `${Math.floor(featured.duration_minutes / 60)}h ${featured.duration_minutes % 60}m` : 
        '2h 15m';
    
    document.getElementById('heroPlayBtn').onclick = () => playContent(featured);
    document.getElementById('heroInfoBtn').onclick = () => showContentInfo(featured);
}

function showContentInfo(content) {
    const genres = content.genres ? content.genres.map(g => g.name).join(', ') : 'N/A';
    const info = `
${content.title}

${content.description || 'No description available'}

Type: ${content.type.replace('_', ' ').toUpperCase()}
Rating: ${content.maturity_rating || 'Not Rated'}
Duration: ${content.duration_minutes ? content.duration_minutes + ' minutes' : 'N/A'}
Genres: ${genres}
Tier: ${content.tier_requirement === 'free' ? 'Free' : 'Premium'}
    `.trim();
    
    alert(info);
}

// Utility Functions
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

function showContentInfo(content) {
    alert(`${content.title}\n\n${content.description || 'No description available'}\n\nType: ${content.type}\nRating: ${content.maturity_rating}\nTier: ${content.tier_requirement}`);
}
