/* =========================================================
   1. STARFIELD CANVAS ANIMATION ENGINE
   ========================================================= */
const canvas = document.getElementById('starfield');
const ctx = canvas ? canvas.getContext('2d') : null;
let stars = [];
let mouse = { x: null, y: null, radius: 120 };

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStars() {
  if (!canvas) return;
  stars = [];
  const density = Math.floor((canvas.width * canvas.height) / 8500);
  for (let i = 0; i < density; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1.5 + 0.3,
      baseAlpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
      phase: Math.random() * Math.PI * 2,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15
    });
  }
}

let step = 0;
function animateStarfield() {
  if (!canvas || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  step += 1;

  for (let i = 0; i < stars.length; i++) {
    const s = stars[i];
    s.x += s.vx;
    s.y += s.vy;

    if (s.x < 0) s.x = canvas.width;
    if (s.x > canvas.width) s.x = 0;
    if (s.y < 0) s.y = canvas.height;
    if (s.y > canvas.height) s.y = 0;

    const alpha = s.baseAlpha + Math.sin(step * s.twinkleSpeed + s.phase) * 0.25;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(234, 231, 245, ${Math.max(0, Math.min(1, alpha))})`;
    ctx.fill();

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - s.x;
      const dy = mouse.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(mouse.x, mouse.y);
        const lineAlpha = (1 - dist / mouse.radius) * 0.22;
        ctx.strokeStyle = `rgba(216, 179, 108, ${lineAlpha})`;
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(animateStarfield);
}

window.addEventListener('resize', () => { resizeCanvas(); createStars(); });
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

if (canvas) {
  resizeCanvas();
  createStars();
  requestAnimationFrame(animateStarfield);
}

/* =========================================================
   2. DYNAMIC COLOR THEME SWITCHER
   ========================================================= */
function setTheme(themeName) {
  document.body.classList.remove('theme-violet', 'theme-cyan', 'theme-emerald');
  if (themeName !== 'default') {
    document.body.classList.add(themeName);
  }
  playCosmicChime(520, 0.05);
  showToast('Paleta visual actualizada');
}

/* =========================================================
   3. HERO INTERACTIVE CHART RENDERING
   ========================================================= */
const chartCanvas = document.getElementById('heroMetricsChart');
const chartCtx = chartCanvas ? chartCanvas.getContext('2d') : null;

const chartDataSets = {
  onboarding: { labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], values: [28, 24, 20, 16, 14, 12], color: '#D8B36C' },
  enps: { labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], values: [74, 78, 82, 85, 88, 92], color: '#5EEAD4' },
  rotacion: { labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'], values: [24, 22, 19, 18, 16, 14], color: '#7C6CF6' }
};

let activeMetric = 'onboarding';

function drawHeroChart() {
  if (!chartCanvas || !chartCtx) return;
  const rect = chartCanvas.getBoundingClientRect();
  chartCanvas.width = rect.width * window.devicePixelRatio;
  chartCanvas.height = rect.height * window.devicePixelRatio;

  const data = chartDataSets[activeMetric];
  const width = chartCanvas.width;
  const height = chartCanvas.height;
  
  chartCtx.clearRect(0, 0, width, height);

  const padding = 25;
  const chartW = width - padding * 2;
  const chartH = height - padding * 2;

  const maxVal = Math.max(...data.values) * 1.2;
  const minVal = 0;

  chartCtx.beginPath();
  const points = [];

  data.values.forEach((val, idx) => {
    const x = padding + (idx / (data.values.length - 1)) * chartW;
    const y = height - padding - ((val - minVal) / (maxVal - minVal)) * chartH;
    points.push({ x, y });
    if (idx === 0) chartCtx.moveTo(x, y);
    else chartCtx.lineTo(x, y);
  });

  chartCtx.strokeStyle = data.color;
  chartCtx.lineWidth = 3.5 * window.devicePixelRatio;
  chartCtx.stroke();

  chartCtx.lineTo(points[points.length - 1].x, height - padding);
  chartCtx.lineTo(points[0].x, height - padding);
  chartCtx.closePath();

  const gradient = chartCtx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, data.color + '44');
  gradient.addColorStop(1, data.color + '00');
  chartCtx.fillStyle = gradient;
  chartCtx.fill();

  points.forEach((pt) => {
    chartCtx.beginPath();
    chartCtx.arc(pt.x, pt.y, 5 * window.devicePixelRatio, 0, Math.PI * 2);
    chartCtx.fillStyle = '#03050D';
    chartCtx.fill();
    chartCtx.lineWidth = 2 * window.devicePixelRatio;
    chartCtx.strokeStyle = data.color;
    chartCtx.stroke();
  });
}

function switchChartMetric(metric) {
  activeMetric = metric;
  document.querySelectorAll('.chart-tab').forEach(btn => {
    btn.classList.remove('bg-[var(--accent-gold)]', 'text-black');
    btn.classList.add('text-gray-400');
  });
  const activeTab = document.getElementById(`tab-${metric}`);
  if (activeTab) {
    activeTab.classList.add('bg-[var(--accent-gold)]', 'text-black');
    activeTab.classList.remove('text-gray-400');
  }
  playCosmicChime(600, 0.04);
  drawHeroChart();
}

window.addEventListener('resize', drawHeroChart);

/* =========================================================
   4. INTERACTIVE ROI CALCULATOR
   ========================================================= */
function calculateROI() {
  const empCountInput = document.getElementById('empCount');
  const avgSalaryInput = document.getElementById('avgSalary');
  const turnoverRateInput = document.getElementById('turnoverRate');
  if (!empCountInput || !avgSalaryInput || !turnoverRateInput) return;

  const empCount = parseInt(empCountInput.value);
  const avgSalary = parseInt(avgSalaryInput.value);
  const turnoverRate = parseInt(turnoverRateInput.value) / 100;

  document.getElementById('empCountVal').textContent = empCount;
  document.getElementById('avgSalaryVal').textContent = '$' + avgSalary.toLocaleString();
  document.getElementById('turnoverRateVal').textContent = Math.round(turnoverRate * 100) + '%';

  const replacementCostPerEmp = avgSalary * 5;
  const currentTurnoverEmps = empCount * turnoverRate;
  
  const avoidedTurnoverEmps = Math.round(currentTurnoverEmps * 0.25);
  const annualSavings = avoidedTurnoverEmps * replacementCostPerEmp;
  const hoursSaved = Math.round(empCount * 2.2);

  document.getElementById('roiSavingsOutput').textContent = '$' + annualSavings.toLocaleString();
  document.getElementById('hoursSavedOutput').textContent = hoursSaved + ' hrs';
  document.getElementById('turnoverAvoidedOutput').textContent = avoidedTurnoverEmps + ' colaboradores';
}

/* =========================================================
   5. SKILLS FILTER & SEARCH LOGIC
   ========================================================= */
function filterSkills(category, e) {
  const evt = e || window.event;
  const cards = document.querySelectorAll('.skill-card');
  const buttons = document.querySelectorAll('.skill-btn');

  buttons.forEach(btn => {
    btn.classList.remove('bg-[var(--accent-gold)]', 'text-black');
    btn.classList.add('glass-panel', 'text-gray-300');
  });

  if (evt && evt.target) {
    evt.target.classList.add('bg-[var(--accent-gold)]', 'text-black');
    evt.target.classList.remove('glass-panel', 'text-gray-300');
  }

  cards.forEach(card => {
    if (category === 'all' || card.classList.contains(category)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
  playCosmicChime(480, 0.03);
}

function searchSkills() {
  const searchInput = document.getElementById('skillSearch');
  if (!searchInput) return;
  const query = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll('.skill-card');

  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (text.includes(query)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

/* =========================================================
   6. SCROLL REVEAL & KPI COUNTER ANIMATION
   ========================================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal-node').forEach(el => revealObserver.observe(el));

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1200;
      const start = performance.now();

      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.kpi-counter').forEach(el => counterObserver.observe(el));

/* =========================================================
   7. TOAST NOTIFICATIONS & COPY CLIPBOARD
   ========================================================= */
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  const msgEl = document.getElementById('toastMessage');
  if (!toast || !msgEl) return;
  msgEl.textContent = message;

  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
    toast.classList.remove('translate-y-0', 'opacity-100');
  }, 3000);
}

function copyToClipboard(text, successMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(successMsg);
      playCosmicChime(700, 0.05);
    });
  } else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(successMsg);
    playCosmicChime(700, 0.05);
  }
}

function handleFormSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('formName').value;
  const email = document.getElementById('formEmail').value;
  const subject = document.getElementById('formSubject').value;
  const message = document.getElementById('formMessage').value;

  const mailtoUrl = `mailto:mattius1.21@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`De: ${name} (${email})\n\n${message}`)}`;
  
  showToast('Iniciando cliente de correo...');
  playCosmicChime(800, 0.08);

  setTimeout(() => {
    window.location.href = mailtoUrl;
  }, 800);
}

/* =========================================================
   8. WEB AUDIO SOUND FX SYNTHESIZER
   ========================================================= */
let audioCtx = null;
let soundEnabled = false;

const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundIconOn = document.getElementById('soundIconOn');
const soundIconOff = document.getElementById('soundIconOff');

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundEnabled) {
      if (soundIconOn) soundIconOn.classList.remove('hidden');
      if (soundIconOff) soundIconOff.classList.add('hidden');
      showToast('Efectos de sonido activados');
      playCosmicChime(600, 0.08);
    } else {
      if (soundIconOn) soundIconOn.classList.add('hidden');
      if (soundIconOff) soundIconOff.classList.remove('hidden');
      showToast('Efectos de sonido desactivados');
    }
  });
}

function playCosmicChime(freq = 520, volume = 0.05) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + 0.3);

    gain.gain.setValueAtTime(volume, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.36);
  } catch(e) {}
}

/* Mobile Navigation Drawer Toggle */
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const menuIcon = document.getElementById('menuIcon');
const closeIcon = document.getElementById('closeIcon');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    const isHidden = mobileDrawer.classList.contains('hidden');
    if (isHidden) {
      mobileDrawer.classList.remove('hidden');
      if (menuIcon) menuIcon.classList.add('hidden');
      if (closeIcon) closeIcon.classList.remove('hidden');
    } else {
      mobileDrawer.classList.add('hidden');
      if (menuIcon) menuIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
    }
  });
}

document.querySelectorAll('.mobile-nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (mobileDrawer) mobileDrawer.classList.add('hidden');
    if (menuIcon) menuIcon.classList.remove('hidden');
    if (closeIcon) closeIcon.classList.add('hidden');
  });
});

/* Initialization on DOM Load */
window.addEventListener('load', () => {
  drawHeroChart();
  calculateROI();
});