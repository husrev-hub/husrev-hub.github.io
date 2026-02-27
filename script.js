// Photo list - add new photo names here and place them in the photos folder
const photos = [
    '1.jpg',
    '2.jpg', 
    '3.jpg',
    'kid.jpg'
];

// DOM elements
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const themeToggle = document.getElementById('themeToggle');
const photoGallery = document.getElementById('photoGallery');
const fullscreenViewer = document.getElementById('fullscreenViewer');
const fullscreenImage = document.getElementById('fullscreenImage');
const closeBtn = document.getElementById('closeBtn');

// Initialize theme from localStorage
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }
}

// Toggle settings panel
settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('open');
    
    // Hide/show photo gallery when settings are open
    if (settingsPanel.classList.contains('open')) {
        photoGallery.classList.add('hidden');
    } else {
        photoGallery.classList.remove('hidden');
    }
});

// Close settings panel when clicking outside
document.addEventListener('click', (e) => {
    if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
        settingsPanel.classList.remove('open');
        photoGallery.classList.remove('hidden');
    }
});

// Theme toggle functionality
themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    }
});

// Load photos into gallery
function loadPhotos() {
    photoGallery.innerHTML = '';
    
    photos.forEach(photoName => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        
        // Extract name without extension
        const displayName = photoName.split('.')[0];
        
        photoItem.innerHTML = `
            <img src="photos/${photoName}" alt="${displayName}" loading="lazy" onclick="openFullscreen('photos/${photoName}')">
            <div class="photo-info">
                <span class="photo-name">${displayName}</span>
                <button class="download-btn" onclick="downloadPhoto('${photoName}', '${displayName}')" title="İndir">
                    <img src="icons/download.png" alt="İndir">
                </button>
            </div>
        `;
        
        photoGallery.appendChild(photoItem);
    });
}

// Download photo function
function downloadPhoto(photoName, displayName) {
    const link = document.createElement('a');
    link.href = `photos/${photoName}`;
    link.download = `${displayName}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Fullscreen viewer functions
let currentScale = 1;
let isZoomed = false;

function openFullscreen(imageSrc) {
    fullscreenImage.src = imageSrc;
    fullscreenViewer.classList.add('active');
    currentScale = 1;
    isZoomed = false;
    fullscreenImage.style.transform = 'scale(1)';
    fullscreenImage.classList.remove('zoomed');
    document.body.style.overflow = 'hidden';
}

function closeFullscreen() {
    fullscreenViewer.classList.remove('active');
    document.body.style.overflow = '';
    currentScale = 1;
    isZoomed = false;
}

function toggleZoom() {
    if (isZoomed) {
        currentScale = 1;
        isZoomed = false;
        fullscreenImage.style.transform = 'scale(1)';
        fullscreenImage.classList.remove('zoomed');
    } else {
        currentScale = 2;
        isZoomed = true;
        fullscreenImage.style.transform = 'scale(2)';
        fullscreenImage.classList.add('zoomed');
    }
}

// Event listeners for fullscreen viewer
fullscreenImage.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleZoom();
});

closeBtn.addEventListener('click', closeFullscreen);

fullscreenViewer.addEventListener('click', (e) => {
    if (e.target === fullscreenViewer) {
        closeFullscreen();
    }
});

// Mouse wheel zoom for desktop
fullscreenImage.addEventListener('wheel', (e) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(Math.max(0.5, currentScale + delta), 3);
    
    if (newScale !== currentScale) {
        currentScale = newScale;
        fullscreenImage.style.transform = `scale(${currentScale})`;
        
        if (currentScale > 1) {
            isZoomed = true;
            fullscreenImage.classList.add('zoomed');
        } else {
            isZoomed = false;
            fullscreenImage.classList.remove('zoomed');
        }
    }
});

// Touch zoom for mobile
let touchStartDistance = 0;

fullscreenImage.addEventListener('touchstart', (e) => {
    if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDistance = Math.sqrt(dx * dx + dy * dy);
    }
});

fullscreenImage.addEventListener('touchmove', (e) => {
    if (e.touches.length === 2) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        const scale = Math.min(Math.max(0.5, distance / touchStartDistance * currentScale), 3);
        
        if (Math.abs(scale - currentScale) > 0.1) {
            currentScale = scale;
            fullscreenImage.style.transform = `scale(${currentScale})`;
            
            if (currentScale > 1) {
                isZoomed = true;
                fullscreenImage.classList.add('zoomed');
            } else {
                isZoomed = false;
                fullscreenImage.classList.remove('zoomed');
            }
        }
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (fullscreenViewer.classList.contains('active')) {
        if (e.key === 'Escape') {
            closeFullscreen();
        }
    }
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadPhotos();
});

// Handle escape key to close settings
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (settingsPanel.classList.contains('open')) {
            settingsPanel.classList.remove('open');
            photoGallery.classList.remove('hidden');
        }
    }
});