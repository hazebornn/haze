// Particle System
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let mouse = { x: null, y: null, radius: 150 };

// Detect mobile device
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
        this.color = `rgba(88, 101, 242, ${Math.random() * 0.5 + 0.3})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Mouse interaction
        if (mouse.x && mouse.y) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                let force = (mouse.radius - distance) / mouse.radius;
                let directionX = dx / distance;
                let directionY = dy / distance;
                
                this.x -= directionX * force * 3;
                this.y -= directionY * force * 3;
            }
        }

        // Bounce off edges
        if (this.x > canvas.width || this.x < 0) {
            this.speedX = -this.speedX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.speedY = -this.speedY;
        }
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    // Reduce particles on mobile for better performance
    let divisor = isMobile ? 18000 : 9000;
    let numberOfParticles = (canvas.width * canvas.height) / divisor;
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                let opacity = 1 - (distance / 100);
                ctx.strokeStyle = `rgba(88, 101, 242, ${opacity * 0.3})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let particle of particles) {
        particle.update();
        particle.draw();
    }
    
    connectParticles();
    requestAnimationFrame(animateParticles);
}

// Mouse tracking (disable on mobile for better performance)
if (!isMobile) {
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
}

// Resize handler
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Initialize
initParticles();
animateParticles();

// Add touch interaction for mobile
if (isMobile) {
    let touchTimeout;
    canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
        
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
            mouse.x = null;
            mouse.y = null;
        }, 2000);
    });
    
    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
        
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
            mouse.x = null;
            mouse.y = null;
        }, 2000);
    });
    
    canvas.addEventListener('touchend', () => {
        clearTimeout(touchTimeout);
        touchTimeout = setTimeout(() => {
            mouse.x = null;
            mouse.y = null;
        }, 500);
    });
}

// Enhanced button hover effects for desktop
if (!isMobile) {
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-6px) scale(1.02)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}
