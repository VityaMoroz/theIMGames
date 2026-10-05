// ===== ТАЙМЕР =====
const targetDate = new Date('2026-10-24T21:00:00').getTime();

function updateTimer() {
  const timerEl = document.getElementById('timer');
  if (!timerEl) return;
  
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff < 0) {
    timerEl.innerHTML = '<p style="font-size:22px;">Стрим уже начался! 🎮</p>';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minutesEl = document.getElementById('minutes');
  const secondsEl = document.getElementById('seconds');
  
  if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
}
setInterval(updateTimer, 1000);
updateTimer();

// ===== TWITCH API (счётчик + статус) =====
const API_URL = 'https://imgames-api.vercel.app/api/followers';
const FALLBACK_FOLLOWERS = 12406;

async function updateTwitchStatus() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    
    updateStatusUI(data.followers, data.isLive);
  } catch (error) {
    updateStatusUI(FALLBACK_FOLLOWERS, false);
  }
}

function updateStatusUI(followers, isLive) {
  const dot = document.getElementById('statusDot');
  const text = document.getElementById('statusText');
  const count = document.getElementById('followersCount');
  
  if (dot) {
    dot.className = 'status-dot ' + (isLive ? 'online' : 'offline');
  }
  if (text) {
    text.textContent = isLive ? 'В ЭФИРЕ' : 'ОФФЛАЙН';
  }
  if (count) {
    count.textContent = followers.toLocaleString('ru-RU');
  }
}

updateTwitchStatus();
setInterval(updateTwitchStatus, 60000);

// ===== КАСТОМНЫЙ АУДИО-ПЛЕЕР =====
const cpAudio = document.getElementById('cpAudio');
const cpPlay = document.getElementById('cpPlay');
const cpProgress = document.getElementById('cpProgress');
const cpFill = document.getElementById('cpFill');
const cpThumb = document.getElementById('cpThumb');
const cpCurrent = document.getElementById('cpCurrent');
const cpDuration = document.getElementById('cpDuration');
const cpVol = document.getElementById('cpVol');
const cpVolBtn = document.getElementById('cpVolBtn');

function cpFormatTime(sec) {
  if (isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ':' + String(s).padStart(2, '0');
}

if (cpAudio && cpPlay) {
  cpPlay.addEventListener('click', () => {
    if (cpAudio.paused) {
      cpAudio.play();
    } else {
      cpAudio.pause();
    }
  });

  cpAudio.addEventListener('play', () => cpPlay.classList.add('playing'));
  cpAudio.addEventListener('pause', () => cpPlay.classList.remove('playing'));

  cpAudio.addEventListener('loadedmetadata', () => {
    cpDuration.textContent = cpFormatTime(cpAudio.duration);
  });

  cpAudio.addEventListener('timeupdate', () => {
    if (!cpAudio.duration) return;
    const pct = (cpAudio.currentTime / cpAudio.duration) * 100;
    cpFill.style.width = pct + '%';
    cpThumb.style.left = pct + '%';
    cpCurrent.textContent = cpFormatTime(cpAudio.currentTime);
  });

  let seeking = false;

  function seekFromEvent(e) {
    const rect = cpProgress.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    let pct = (clientX - rect.left) / rect.width;
    pct = Math.max(0, Math.min(1, pct));
    cpAudio.currentTime = pct * cpAudio.duration;
  }

  cpProgress.addEventListener('mousedown', (e) => {
    seeking = true;
    seekFromEvent(e);
  });
  document.addEventListener('mousemove', (e) => {
    if (seeking) seekFromEvent(e);
  });
  document.addEventListener('mouseup', () => seeking = false);

  cpProgress.addEventListener('touchstart', (e) => {
    seeking = true;
    seekFromEvent(e);
  }, { passive: true });
  document.addEventListener('touchmove', (e) => {
    if (seeking) seekFromEvent(e);
  }, { passive: true });
  document.addEventListener('touchend', () => seeking = false);

  cpVol.addEventListener('input', () => {
    cpAudio.volume = cpVol.value;
    cpVolBtn.classList.toggle('muted', cpAudio.volume == 0);
  });

  let lastVol = 1;
  cpVolBtn.addEventListener('click', () => {
    if (cpAudio.volume > 0) {
      lastVol = cpAudio.volume;
      cpAudio.volume = 0;
      cpVol.value = 0;
      cpVolBtn.classList.add('muted');
    } else {
      cpAudio.volume = lastVol || 1;
      cpVol.value = cpAudio.volume;
      cpVolBtn.classList.remove('muted');
    }
  });
}

// ===== СВОРАЧИВАЕМАЯ ГАЛЕРЕЯ =====
const galleryToggle = document.getElementById('galleryToggle');
const galleryCollapse = document.getElementById('galleryCollapse');

if (galleryToggle && galleryCollapse) {
  galleryToggle.addEventListener('click', () => {
    galleryToggle.classList.toggle('open');
    galleryCollapse.classList.toggle('open');
    
    const text = galleryToggle.querySelector('.toggle-text');
    if (galleryCollapse.classList.contains('open')) {
      text.textContent = 'Скрыть галерею';
    } else {
      text.textContent = 'Показать галерею';
    }
  });
}

// ===== МОДАЛЬНЫЕ ОКНА =====
document.querySelectorAll('.panel').forEach(panel => {
  panel.addEventListener('click', () => {
    const modalId = 'modal-' + panel.dataset.modal;
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  });
});

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => {
    btn.closest('.modal').classList.remove('active');
  });
});

document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
  }
});

// ===== КНОПКА "НАВЕРХ" =====
const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
  
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ===== АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ =====
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});

// ===== АКТИВНАЯ СЕКЦИЯ В НАВИГАЦИИ =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a[href^="#"]');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ===== ПЛАВНЫЙ СКРОЛЛ =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});
