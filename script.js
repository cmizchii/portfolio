// ===== CUSTOM CURSOR =====
const dot = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX - 4 + 'px';
  dot.style.top = mouseY - 4 + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX - 20 + 'px';
  ring.style.top = ringY - 20 + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover state for interactive elements (delegated for cloned elements)
document.addEventListener('mouseover', (e) => {
  if (e.target.closest('a, button, .project-card, .footer-big')) {
    dot.classList.add('hovering');
    ring.classList.add('hovering');
  }
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest('a, button, .project-card, .footer-big')) {
    dot.classList.remove('hovering');
    ring.classList.remove('hovering');
  }
});


// ===== PAGE LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelector('.loader').classList.add('done');

    // Stagger hero reveals
    const reveals = document.querySelectorAll('.reveal-up');
    reveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 150);
    });
  }, 1300);
});


// ===== HERO PARALLAX ON MOUSE MOVE =====
const heroImage = document.querySelector('.hero-image');
const heroContent = document.querySelector('.hero-content');
const heroSection = document.querySelector('.hero');

let heroTargetX = 0, heroTargetY = 0;
let heroCurrentX = 0, heroCurrentY = 0;

document.addEventListener('mousemove', (e) => {
  heroTargetX = e.clientX / window.innerWidth - 0.5;
  heroTargetY = e.clientY / window.innerHeight - 0.5;
});

function animateHeroParallax() {
  heroCurrentX += (heroTargetX * 15 - heroCurrentX) * 0.04;
  heroCurrentY += (heroTargetY * 10 - heroCurrentY) * 0.04;

  heroImage.style.transform = `translate(${heroCurrentX}px, ${heroCurrentY}px)`;
  heroContent.style.transform = `translate(${heroCurrentX}px, ${heroCurrentY}px)`;

  requestAnimationFrame(animateHeroParallax);
}
animateHeroParallax();


// ===== CAT EYES FOLLOW CURSOR (SVG pupils — lerped) =====
const pupilRight = document.getElementById('pupil-right');
const pupilLeft = document.getElementById('pupil-left');
const heroSvg = document.querySelector('.hero-svg');

const eyes = [
  { el: pupilRight, cx: 133, cy: 304, currentX: 0, currentY: 0 },
  { el: pupilLeft,  cx: 97,  cy: 298, currentX: 0, currentY: 0 }
];

const MAX_MOVE = 3.5;
const LERP_SPEED = 0.08;
let targetCursorX = 0, targetCursorY = 0;

document.addEventListener('mousemove', (e) => {
  targetCursorX = e.clientX;
  targetCursorY = e.clientY;
});

function animateEyes() {
  if (!heroSvg) { requestAnimationFrame(animateEyes); return; }

  const svgRect = heroSvg.getBoundingClientRect();
  const scaleX = 433 / svgRect.width;
  const scaleY = 561 / svgRect.height;

  const cursorSvgX = (targetCursorX - svgRect.left) * scaleX;
  const cursorSvgY = (targetCursorY - svgRect.top) * scaleY;

  eyes.forEach(eye => {
    const dx = cursorSvgX - eye.cx;
    const dy = cursorSvgY - eye.cy;
    const angle = Math.atan2(dy, dx);
    const dist = Math.sqrt(dx * dx + dy * dy);
    const t = Math.min(dist / 80, 1);

    const targetX = Math.cos(angle) * MAX_MOVE * t;
    const targetY = Math.sin(angle) * MAX_MOVE * t;

    // Lerp toward target
    eye.currentX += (targetX - eye.currentX) * LERP_SPEED;
    eye.currentY += (targetY - eye.currentY) * LERP_SPEED;

    eye.el.style.transform = `translate(${eye.currentX}px, ${eye.currentY}px)`;
  });

  requestAnimationFrame(animateEyes);
}
animateEyes();


// ===== CAT TAIL SWAY =====
const catTail = document.getElementById('cat-tail');

function swayTail() {
  catTail.classList.add('swaying');
  catTail.addEventListener('animationend', () => {
    catTail.classList.remove('swaying');
  }, { once: true });
}

function scheduleTailSway() {
  const delay = 3000 + Math.random() * 5000; // 3–8 seconds
  setTimeout(() => {
    swayTail();
    scheduleTailSway();
  }, delay);
}
scheduleTailSway();


// ===== SCROLL REVEAL =====
const scrollEls = document.querySelectorAll('.scroll-reveal');

function checkScrollReveal() {
  const windowHeight = window.innerHeight;
  scrollEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < windowHeight * 0.85) {
      el.classList.add('visible');
    }
  });
}


// ===== QUOTE HIGHLIGHT SCROLL =====
const highlights = document.querySelectorAll('.highlight');

function updateHighlights() {
  const windowHeight = window.innerHeight;
  highlights.forEach((el, i) => {
    const rect = el.getBoundingClientRect();
    const startTrigger = windowHeight * 0.95;
    const endTrigger = windowHeight * 0.65;
    const range = startTrigger - endTrigger;
    const stagger = i * 40;
    const adjustedCenter = rect.top + rect.height / 2 + stagger;
    let progress = (startTrigger - adjustedCenter) / range;
    progress = Math.min(Math.max(progress, 0), 1);
    el.style.setProperty('--fill', (progress * 100) + '%');
  });
}


// ===== PROCESS CARDS FLOAT =====
const processCards = document.querySelectorAll('.process-card');

processCards.forEach((card, i) => {
  let isHovering = false;
  const offset = i * 1.3;

  function idleFloat() {
    if (!isHovering) {
      const t = Date.now() / 1000 + offset;
      const y = Math.sin(t * 0.6) * 3;
      card.style.transform = `translateY(${y}px)`;
    }
    requestAnimationFrame(idleFloat);
  }
  idleFloat();

  card.addEventListener('mousemove', (e) => {
    isHovering = true;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (-y / rect.height) * 12;
    const rotateY = (x / rect.width) * 12;
    const translateX = (x / rect.width) * 8;
    const translateY = (y / rect.height) * 8;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${translateX}px, ${translateY}px)`;
  });

  card.addEventListener('mouseleave', () => {
    isHovering = false;
  });
});



// ===== MAGNETIC "LET'S TALK" =====
const footerBig = document.querySelector('.footer-big');
const footerH2 = footerBig.querySelector('h2');

footerBig.addEventListener('mousemove', (e) => {
  const rect = footerBig.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5;
  const y = (e.clientY - rect.top) / rect.height - 0.5;
  footerH2.style.transform = `translate(${x * 25}px, ${y * 15}px)`;
});

footerBig.addEventListener('mouseleave', () => {
  footerH2.style.transform = 'translate(0, 0)';
});



// ===== WORK NAV SCROLL =====
document.querySelector('.nav a[href="#work"]').addEventListener('click', (e) => {
  e.preventDefault();
  const filters = document.querySelector('.project-filters');
  const filtersBottom = window.scrollY + filters.getBoundingClientRect().bottom;
  const scrollTo = filtersBottom - window.innerHeight + 40;
  window.scrollTo({ top: scrollTo, behavior: 'smooth' });
});

// ===== BACK TO TOP =====
document.querySelector('.back-to-top').addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


// ===== INFINITE CAROUSEL =====
const carouselTrack = document.querySelector('.carousel-track');
const carousel = document.querySelector('.carousel');
const originalItems = Array.from(carouselTrack.querySelectorAll('.project-item'));
const GAP = 16;

let carouselX = 0;
let carouselTargetX = 0;
let oneSetWidth = 0;

function buildCarousel(filter) {
  // Remove all clones
  const allItems = carouselTrack.querySelectorAll('.project-item');
  allItems.forEach(item => {
    if (!originalItems.includes(item)) item.remove();
  });

  // Show/hide originals based on filter
  originalItems.forEach(item => {
    if (filter === 'all' || item.dataset.type === filter) {
      item.classList.remove('filtered-out');
    } else {
      item.classList.add('filtered-out');
    }
  });

  // Get visible items
  const visibleItems = originalItems.filter(item => !item.classList.contains('filtered-out'));
  if (visibleItems.length === 0) return;

  // Clone visible items for infinite loop
  for (let i = 0; i < 2; i++) {
    visibleItems.forEach(item => {
      const clone = item.cloneNode(true);
      carouselTrack.appendChild(clone);
    });
  }

  const itemWidth = visibleItems[0].offsetWidth;
  oneSetWidth = visibleItems.length * (itemWidth + GAP);

  carouselX = -(oneSetWidth - carousel.offsetWidth / 2 + itemWidth / 2);
  carouselTargetX = carouselX;
  carouselTrack.style.transform = `translateX(${carouselX}px)`;
}

buildCarousel('all');

function wrapCarouselX(x) {
  if (x > -oneSetWidth + oneSetWidth) {
    x -= oneSetWidth;
  } else if (x < -oneSetWidth * 2) {
    x += oneSetWidth;
  }
  return x;
}

function animateCarousel() {
  carouselX += (carouselTargetX - carouselX) * 0.008;
  carouselX = wrapCarouselX(carouselX);
  carouselTargetX = wrapCarouselX(carouselTargetX);
  carouselTrack.style.transform = `translateX(${carouselX}px)`;
  requestAnimationFrame(animateCarousel);
}
animateCarousel();

// On hover, nudge toward center
carouselTrack.addEventListener('mouseenter', handleCardHover, true);
carouselTrack.addEventListener('mouseover', handleCardHover, true);

function handleCardHover(e) {
  const item = e.target.closest('.project-item');
  if (!item) return;

  const trackRect = carouselTrack.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  const carouselRect = carousel.getBoundingClientRect();

  const viewportCenter = carouselRect.width / 2;
  const itemCenter = (itemRect.left - carouselRect.left) + itemRect.width / 2;
  const shift = (viewportCenter - itemCenter) * 0.75;

  carouselTargetX = carouselX + shift;
}

// ===== FILTER BUTTONS =====
const filterBtns = document.querySelectorAll('.filter-btn');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    buildCarousel(btn.dataset.filter);
  });
});


// ===== COMBINED SCROLL =====
window.addEventListener('scroll', () => {
  updateHighlights();
  checkScrollReveal();
});

// Initial check
checkScrollReveal();
updateHighlights();


// ===== DRAWING TOOL =====
const drawCanvas = document.querySelector('.draw-canvas');
const drawCtx = drawCanvas.getContext('2d');
const drawColors = document.querySelectorAll('.draw-color');
const drawUndoBtn = document.querySelector('.draw-undo');
let drawColor = '#2B2B2B';
let isDrawing = false;
let strokes = [];
let currentStroke = [];

function resizeDrawCanvas() {
  const hero = document.querySelector('.hero');
  const saved = drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
  drawCanvas.width = hero.offsetWidth;
  drawCanvas.height = hero.offsetHeight;
  drawCtx.putImageData(saved, 0, 0);
  redrawStrokes();
}
resizeDrawCanvas();
window.addEventListener('resize', resizeDrawCanvas);

function redrawStrokes() {
  drawCtx.clearRect(0, 0, drawCanvas.width, drawCanvas.height);
  strokes.forEach(stroke => {
    if (stroke.points.length < 2) return;
    drawCtx.beginPath();
    drawCtx.strokeStyle = stroke.color;
    drawCtx.lineWidth = 3;
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';
    drawCtx.moveTo(stroke.points[0].x, stroke.points[0].y);
    for (let i = 1; i < stroke.points.length; i++) {
      drawCtx.lineTo(stroke.points[i].x, stroke.points[i].y);
    }
    drawCtx.stroke();
  });
}

// Color selection — click again to deselect
drawColors.forEach(el => {
  el.addEventListener('click', () => {
    if (el.classList.contains('active')) {
      el.classList.remove('active');
      drawCanvas.classList.remove('active');
    } else {
      drawColors.forEach(c => c.classList.remove('active'));
      el.classList.add('active');
      drawColor = el.dataset.color;
      drawCanvas.classList.add('active');
    }
  });
});

// Drawing events
drawCanvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  const rect = drawCanvas.getBoundingClientRect();
  currentStroke = [{ x: e.clientX - rect.left, y: e.clientY - rect.top }];
});

drawCanvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  const rect = drawCanvas.getBoundingClientRect();
  const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  currentStroke.push(point);

  drawCtx.beginPath();
  drawCtx.strokeStyle = drawColor;
  drawCtx.lineWidth = 3;
  drawCtx.lineCap = 'round';
  drawCtx.lineJoin = 'round';
  const prev = currentStroke[currentStroke.length - 2];
  drawCtx.moveTo(prev.x, prev.y);
  drawCtx.lineTo(point.x, point.y);
  drawCtx.stroke();
});

drawCanvas.addEventListener('mouseup', () => {
  if (isDrawing && currentStroke.length > 1) {
    strokes.push({ color: drawColor, points: currentStroke });
  }
  isDrawing = false;
  currentStroke = [];
});

drawCanvas.addEventListener('mouseleave', () => {
  if (isDrawing && currentStroke.length > 1) {
    strokes.push({ color: drawColor, points: currentStroke });
  }
  isDrawing = false;
  currentStroke = [];
});

// Undo
drawUndoBtn.addEventListener('click', () => {
  strokes.pop();
  redrawStrokes();
});


// ===== PERSIST DRAWINGS (5 HOURS) =====
const DRAW_KEY = 'portfolio_drawings';
const DRAW_EXPIRY = 5 * 60 * 60 * 1000; // 5 hours

function saveDrawings() {
  const data = {
    strokes: strokes,
    timestamp: Date.now()
  };
  localStorage.setItem(DRAW_KEY, JSON.stringify(data));
}

function loadDrawings() {
  const raw = localStorage.getItem(DRAW_KEY);
  if (!raw) return;
  const data = JSON.parse(raw);
  if (Date.now() - data.timestamp > DRAW_EXPIRY) {
    localStorage.removeItem(DRAW_KEY);
    return;
  }
  strokes = data.strokes || [];
  redrawStrokes();
}

// Override undo to also save
const origUndo = drawUndoBtn.onclick;
drawUndoBtn.addEventListener('click', saveDrawings);

// Save after each stroke
drawCanvas.addEventListener('mouseup', saveDrawings);
drawCanvas.addEventListener('mouseleave', saveDrawings);

// Load on init
loadDrawings();


// ===== PROJECT INQUIRY MODAL =====
(() => {
  const overlay = document.getElementById('inquiry-overlay');
  const openBtn = document.getElementById('start-project-btn');
  const closeBtn = document.getElementById('inquiry-close');
  const backBtn = document.getElementById('inquiry-back');
  const nextBtn = document.getElementById('inquiry-next');
  const form = document.getElementById('inquiry-form');
  const progressFill = overlay.querySelector('.inquiry-progress-fill');
  const navBar = overlay.querySelector('.inquiry-nav');

  const answers = {};
  let currentStep = 1;
  const totalSteps = 4;

  function showStep(n) {
    overlay.querySelectorAll('.inquiry-step').forEach(s => s.classList.remove('active'));
    const step = overlay.querySelector(`.inquiry-step[data-step="${n}"]`);
    if (step) step.classList.add('active');

    if (n === 'done') {
      navBar.style.display = 'none';
      return;
    }

    navBar.style.display = 'flex';
    backBtn.disabled = n <= 1;
    progressFill.style.width = ((n / totalSteps) * 100) + '%';

    // Enable next if this step already has a selection
    if (n < 4) {
      const opts = step.querySelector('.inquiry-options');
      const name = opts.dataset.name;
      nextBtn.disabled = !answers[name];
    } else {
      nextBtn.style.display = 'none';
    }
  }

  // Open / Close
  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentStep = 1;
    overlay.classList.add('open');
    showStep(1);
    document.body.style.overflow = 'hidden';
  });

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  // Option selection
  overlay.addEventListener('click', (e) => {
    const opt = e.target.closest('.inquiry-opt');
    if (!opt) return;
    const parent = opt.closest('.inquiry-options');
    parent.querySelectorAll('.inquiry-opt').forEach(o => o.classList.remove('selected'));
    opt.classList.add('selected');
    answers[parent.dataset.name] = opt.dataset.value;
    nextBtn.disabled = false;
  });

  // Navigation
  nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) {
      currentStep++;
      showStep(currentStep);
    }
  });

  backBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      nextBtn.style.display = '';
      showStep(currentStep);
    }
  });

  // Form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    answers.name = formData.get('name');
    answers.email = formData.get('email');
    answers.details = formData.get('details');

    // Build mailto
    const subject = encodeURIComponent('New Project Inquiry');
    const body = encodeURIComponent(
      `Name: ${answers.name}\n` +
      `Email: ${answers.email}\n` +
      `Service: ${answers.service || '—'}\n` +
      `Scope: ${answers.scope || '—'}\n` +
      `Budget: ${answers.budget || '—'}\n` +
      `Details: ${answers.details || '—'}`
    );
    window.open(`mailto:info@shaimaaJamal.com?subject=${subject}&body=${body}`, '_self');

    currentStep = 'done';
    showStep('done');
  });
})();
