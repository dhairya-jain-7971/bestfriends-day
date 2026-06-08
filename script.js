// ==========================================
// BACKGROUND DECORATIONS (FLOATING HEARTS)
// ==========================================
const floatingDecorations = document.getElementById('floatingDecorations');

function createFloatingHeart() {
    if (!floatingDecorations) return;

    const heart = document.createElement('div');
    heart.classList.add('floating-heart');

    // Randomize styling
    const size = Math.random() * 30 + 15; // 15px to 45px
    const left = Math.random() * 100; // 0% to 100%
    const duration = Math.random() * 6 + 5; // 5s to 11s
    const delay = Math.random() * 3; // 0s to 3s

    // Set soft pastel colors for the hearts
    const pastelColors = ['#ffccd5', '#bceef5', '#d6e4fa', '#ebd6fa', '#fbfad6'];
    heart.style.backgroundColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];

    heart.style.width = `${size}px`;
    heart.style.height = `${size}px`;
    heart.style.left = `${left}%`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;

    floatingDecorations.appendChild(heart);

    // Remove heart after animation completes
    setTimeout(() => {
        heart.remove();
    }, (duration + delay) * 1000);
}

// Generate initial batch of hearts
for (let i = 0; i < 15; i++) {
    createFloatingHeart();
}
// Keep spawning hearts
setInterval(createFloatingHeart, 600);


// ==========================================
// CANVAS PARTICLE SYSTEM (EXPLOSIVE HEARTS)
// ==========================================
const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class HeartParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 12 + 6;
        this.speedX = Math.random() * 10 - 5;
        this.speedY = Math.random() * -10 - 3; // Initial burst upwards
        this.gravity = 0.25;
        this.opacity = 1;
        this.fade = Math.random() * 0.015 + 0.01;
        const pastelColors = ['#ffccd5', '#bceef5', '#d6e4fa', '#ebd6fa', '#fbfad6'];
        this.color = pastelColors[Math.floor(Math.random() * pastelColors.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.spin = Math.random() * 0.1 - 0.05;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.speedY += this.gravity;
        this.opacity -= this.fade;
        this.angle += this.spin;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = Math.max(0, this.opacity);
        ctx.fillStyle = this.color;

        // Draw Heart Shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        // Top left curve
        ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, 0, 0, this.size);
        // Top right curve
        ctx.bezierCurveTo(this.size, 0, this.size / 2, -this.size / 2, 0, 0);
        ctx.fill();

        ctx.restore();
    }
}

function spawnExplosion(x, y, count = 40) {
    for (let i = 0; i < count; i++) {
        particles.push(new HeartParticle(x, y));
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].opacity <= 0) {
            particles.splice(i, 1);
        }
    }

    requestAnimationFrame(animateParticles);
}
animateParticles();

// Trigger a small burst on clicking anywhere on screen
window.addEventListener('click', (e) => {
    // Avoid triggering full explosion on simple button clicks to preserve custom triggers
    if (e.target.tagName !== 'BUTTON') {
        spawnExplosion(e.clientX, e.clientY, 8);
    }
});


// ==========================================
// SLIDES NAVIGATION & STATE MANAGEMENT
// ==========================================
function goToSlide(currentSlideId, nextSlideId) {
    const current = document.getElementById(currentSlideId);
    const next = document.getElementById(nextSlideId);

    if (!current || !next) return;

    // Fade out current slide
    current.style.opacity = '0';
    current.style.transform = 'translateY(-20px) scale(0.95)';
    current.style.filter = 'blur(10px)';
    current.style.pointerEvents = 'none';

    setTimeout(() => {
        current.classList.remove('active');
        current.style.display = 'none';

        // Prepare and display next slide
        next.style.display = 'block';

        // Force reflow
        next.offsetHeight;

        next.classList.add('active');

        // Clear inline style overrides so CSS classes can govern
        next.style.opacity = '';
        next.style.transform = '';
        next.style.filter = '';
        next.style.pointerEvents = '';
    }, 800);
}


// ==========================================
// PHASE 1: PROPOSAL INTERACTIVE LOGIC
// ==========================================
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const proposalTitle = document.getElementById('proposalTitle');

let noClicksCount = 0;
let yesScale = 1;

const noPrompts = [
    "Are you sure? 🥺",
    "Really? Think again! 😭",
    "But we are perfect together! 🌸",
    "Pleaseee? 🧸",
    "already gave you enough chances , now press yes only you dont have any other choice 💖"
];

noBtn.addEventListener('click', (e) => {
    noClicksCount++;

    // Particle burst from "No" button
    const rect = noBtn.getBoundingClientRect();
    spawnExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);

    if (noClicksCount <= 4) {
        // Change text on the no button
        noBtn.textContent = noPrompts[noClicksCount - 1];

        // Grow yes button via padding and font-size to affect document flow and wrap correctly
        const padY = 14 + noClicksCount * 8;
        const padX = 32 + noClicksCount * 14;
        const fontSz = 1.05 + noClicksCount * 0.18;
        
        yesBtn.style.padding = `${padY}px ${padX}px`;
        yesBtn.style.fontSize = `${fontSz}rem`;

        // Shift colors slightly warmer on each "No"
        yesBtn.style.boxShadow = `0 0 ${15 + noClicksCount * 12}px rgba(255, 76, 143, ${0.3 + noClicksCount * 0.15})`;

        // Change title to be more pleading
        const titles = [
            "Wait, you clicked no? 🥺👉👈",
            "Don't do this to me! 💔",
            "Is that your final answer? 😢",
            "Last warning... 🧸"
        ];
        proposalTitle.textContent = titles[Math.min(noClicksCount - 1, titles.length - 1)];
    } else {
        // Ultimate State: Remove No button and force Yes
        noBtn.remove();

        // Reset scale and make YES fill the space with custom text
        yesBtn.style.transform = 'none';
        yesBtn.style.width = '100%';
        yesBtn.style.padding = '20px';
        yesBtn.style.fontSize = '1.15rem';
        yesBtn.style.borderRadius = '16px';
        yesBtn.textContent = noPrompts[4]; // Ultimatum text
        proposalTitle.textContent = "You don't have a choice anymore! 😉💖";
    }
});

yesBtn.addEventListener('click', (e) => {
    // Large explosion burst centered on yes button
    const rect = yesBtn.getBoundingClientRect();
    spawnExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, 80);

    // After short delay, transition to Phase 2
    setTimeout(() => {
        goToSlide('proposalSlide', 'adoreSlide');
        // Spawn additional celebratory hearts
        setTimeout(() => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            spawnExplosion(width * 0.25, height * 0.4, 30);
            spawnExplosion(width * 0.75, height * 0.4, 30);
        }, 900);
    }, 600);
});


// ==========================================
// PHASE 2: ADORE SECTION LOGIC
// ==========================================
const adoreNextBtn = document.getElementById('adoreNextBtn');
adoreNextBtn.addEventListener('click', (e) => {
    const rect = adoreNextBtn.getBoundingClientRect();
    spawnExplosion(rect.left + rect.width / 2, rect.top + rect.height / 2, 30);

    setTimeout(() => {
        goToSlide('adoreSlide', 'tributeSlide');
        // Spawn final celebratory explosion
        setTimeout(() => {
            const width = window.innerWidth;
            const height = window.innerHeight;
            spawnExplosion(width * 0.5, height * 0.3, 50);
        }, 900);
    }, 500);
});


// ==========================================
// PHASE 3: TRIBUTE & 3D POLAROID TILT
// ==========================================
const polaroidLeft = document.getElementById('polaroidLeft');
const polaroidRight = document.getElementById('polaroidRight');

function setupPolaroidTilt(element, defaultRotation) {
    if (!element) return;

    const polaroid = element.querySelector('.polaroid');

    element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();

        // Mouse coordinate offsets from element center
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Calculate rotation limits (-15 to 15 degrees)
        const rotX = -(y / (rect.height / 2)) * 12;
        const rotY = (x / (rect.width / 2)) * 12;

        // Apply 3D tilt
        polaroid.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.08, 1.08, 1.08)`;
        polaroid.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.6)';
        polaroid.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
    });

    element.addEventListener('mouseleave', () => {
        // Reset to original tilt rotation defined in CSS
        polaroid.style.transform = '';
        polaroid.style.boxShadow = '';
        polaroid.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.6s cubic-bezier(0.25, 1, 0.5, 1)';
    });
}

// Set up tilts with default layout tilt adjustments
const polaroidAdore = document.getElementById('polaroidAdore');
setupPolaroidTilt(polaroidAdore, 3);
setupPolaroidTilt(polaroidLeft, -5);
setupPolaroidTilt(polaroidRight, 5);

// ==========================================
// BACKGROUND MUSIC LOGIC (LOCAL AUDIO PLAYER)
// ==========================================
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isMusicPlaying = false;
let hasInteracted = false;

function playAudio() {
    if (bgMusic) {
        return bgMusic.play().then(() => {
            isMusicPlaying = true;
            musicToggle.classList.add('playing');
        });
    }
    return Promise.reject("No audio element");
}

function pauseAudio() {
    if (bgMusic) {
        bgMusic.pause();
        isMusicPlaying = false;
        musicToggle.classList.remove('playing');
    }
}

// Attempt play immediately on load (in case browser allows it)
window.addEventListener('DOMContentLoaded', () => {
    playAudio().then(() => {
        hasInteracted = true;
        document.body.removeEventListener('click', initiateMusic);
    }).catch(err => {
        console.log("Autoplay blocked by browser. Music will play on first click.");
    });
});

// Attempt to play music on user interaction
function initiateMusic() {
    if (hasInteracted) return;
    hasInteracted = true;
    playAudio().catch(e => console.log("Play failed on interaction:", e));
    document.body.removeEventListener('click', initiateMusic);
}

// Start music on first click anywhere on screen
document.body.addEventListener('click', initiateMusic);

// Toggle button functionality
musicToggle.addEventListener('click', (e) => {
    e.stopPropagation(); // Avoid triggering document click listener
    hasInteracted = true;
    
    if (isMusicPlaying) {
        pauseAudio();
    } else {
        playAudio().catch(e => console.error("Toggle play failed:", e));
    }
});
