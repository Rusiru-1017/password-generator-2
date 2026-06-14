// Generate date options
const daySelect = document.getElementById('day');
const monthSelect = document.getElementById('month');
const yearSelect = document.getElementById('year');

for (let i = 1; i <= 31; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = i;
  daySelect.appendChild(option);
}

for (let i = 2024; i >= 1920; i--) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = i;
  yearSelect.appendChild(option);
}

// Canvas setup
const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Colorful Star class
class Star {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 3 + 1.5;
    this.baseOpacity = Math.random() * 0.6 + 0.4;
    this.opacity = this.baseOpacity;
    this.twinkleSpeed = Math.random() * 0.04 + 0.02;
    this.color = this.getRandomColor();
  }

  getRandomColor() {
    const colors = [
      { r: 255, g: 255, b: 255 },
      { r: 255, g: 240, b: 200 },
      { r: 200, g: 220, b: 255 },
      { r: 255, g: 200, b: 200 },
      { r: 200, g: 255, b: 255 },
      { r: 255, g: 220, b: 150 },
      { r: 220, g: 200, b: 255 },
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  draw() {
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.radius * 3
    );
    
    gradient.addColorStop(0, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity})`);
    gradient.addColorStop(0.3, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.6})`);
    gradient.addColorStop(0.7, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${this.opacity * 0.2})`);
    gradient.addColorStop(1, `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity + 0.2})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.opacity = this.baseOpacity + Math.sin(Date.now() * this.twinkleSpeed) * 0.4;
    if (this.opacity < 0.3) this.opacity = 0.3;
    if (this.opacity > 1) this.opacity = 1;
  }
}

// Shooting star
class ShootingStar {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height * 0.5;
    this.length = Math.random() * 100 + 30;
    this.speed = Math.random() * 12 + 6;
    this.angle = Math.random() * Math.PI * 0.5 + Math.PI * 0.25;
    this.opacity = 0;
    this.active = false;
    this.waitTime = Math.random() * 300 + 150;
  }

  update() {
    if (!this.active) {
      this.waitTime--;
      if (this.waitTime <= 0) {
        this.active = true;
        this.opacity = 1;
      }
    } else {
      this.x += Math.cos(this.angle) * this.speed;
      this.y += Math.sin(this.angle) * this.speed;
      this.opacity -= 0.015;

      if (this.opacity <= 0 || this.x > canvas.width || this.y > canvas.height) {
        this.reset();
      }
    }
  }

  draw() {
    if (!this.active) return;

    const endX = this.x - Math.cos(this.angle) * this.length;
    const endY = this.y - Math.sin(this.angle) * this.length;

    const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
    gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
    gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
}

class Nebula {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 250 + 200;
    this.opacity = Math.random() * 0.35 + 0.15;
    this.drift = Math.random() * 0.3 - 0.15;
  }

  draw() {
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size
    );
    gradient.addColorStop(0, `rgba(255, 100, 200, ${this.opacity})`);
    gradient.addColorStop(0.5, `rgba(100, 200, 255, ${this.opacity * 0.6})`);
    gradient.addColorStop(1, `rgba(0, 100, 255, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.x += this.drift;
    if (this.x < -this.size) this.x = canvas.width + this.size;
    if (this.x > canvas.width + this.size) this.x = -this.size;
  }
}

const stars = Array(325).fill().map(() => new Star());
const nebulas = Array(6).fill().map(() => new Nebula());
const shootingStars = Array(4).fill().map(() => new ShootingStar());

function animateSpace() {
  ctx.fillStyle = '#0a0e27';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  nebulas.forEach(nebula => {
    nebula.update();
    nebula.draw();
  });

  stars.forEach(star => {
    star.update();
    star.draw();
  });

  shootingStars.forEach(star => {
    star.update();
    star.draw();
  });

  requestAnimationFrame(animateSpace);
}

animateSpace();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Security Key Generation
function generateSecurityKey(name, day, month, year) {
  let hash = 0;
  const str = name + day + month + year;

  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_-+=';
  let key = '';
  let temp = Math.abs(hash);

  for (let i = 0; i < 24; i++) {
    key += chars[temp % chars.length];
    temp = Math.floor(temp / chars.length);
  }

  return key;
}

// Form Handling
const keyForm = document.getElementById('keyForm');
const nameInput = document.getElementById('name');
const dayInput = document.getElementById('day');
const monthInput = document.getElementById('month');
const yearInput = document.getElementById('year');
const securityKeyDisplay = document.getElementById('securityKey');
const resultSection = document.getElementById('resultSection');
const copyBtn = document.getElementById('copyBtn');

keyForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = nameInput.value.trim();
  const day = dayInput.value;
  const month = monthInput.value;
  const year = yearInput.value;

  if (!name || !day || !month || !year) {
    alert('Please fill in all fields');
    return;
  }

  const key = generateSecurityKey(name, day, month, year);
  securityKeyDisplay.textContent = key;
  resultSection.style.display = 'block';
  resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

copyBtn.addEventListener('click', () => {
  const key = securityKeyDisplay.textContent;
  navigator.clipboard.writeText(key).then(() => {
    const originalText = copyBtn.textContent;
    copyBtn.textContent = 'Copied! ✓';
    setTimeout(() => {
      copyBtn.textContent = originalText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy:', err);
  });
});

console.log('Galactic Security Key Generator loaded');
