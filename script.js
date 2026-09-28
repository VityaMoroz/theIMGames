// ===== ТАЙМЕР =====
const targetDate = new Date('2026-10-24T21:00:00').getTime();

function updateTimer() {
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff < 0) {
    document.getElementById('timer').innerHTML = '<p style="font-size:24px;">Стрим уже начался! 🎮</p>';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('days').textContent = String(days).padStart(2, '0');
  document.getElementById('hours').textContent = String(hours).padStart(2, '0');
  document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}
setInterval(updateTimer, 1000);
updateTimer();

// ===== ОПРОС =====
const votes = { serial: 0, kino: 0, talk: 0, dota: 0 };
const labels = {
  serial: '📺 Сериал',
  kino: '🎬 Кино',
  talk: '🗣 Поговорим, посидим',
  dota: '🎮 Дота 2'
};
let hasVoted = false;

document.querySelectorAll('.poll-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (hasVoted) { alert('Ты уже голосовал!'); return; }
    const choice = btn.dataset.vote;
    votes[choice]++;
    hasVoted = true;
    btn.classList.add('voted');
    renderResults();
  });
});

function renderResults() {
  const total = Object.values(votes).reduce((a, b) => a + b, 0);
  const container = document.getElementById('pollResults');
  if (total === 0) { container.innerHTML = ''; return; }

  let html = '<h3>Результаты:</h3>';
  for (const key in votes) {
    const percent = total > 0 ? Math.round((votes[key] / total) * 100) : 0;
    html += `
      <div class="poll-bar">
        <div class="poll-bar-fill" style="width: ${percent}%"></div>
        <div class="poll-bar-label">${labels[key]} — ${votes[key]} голосов (${percent}%)</div>
      </div>
    `;
  }
  container.innerHTML = html;
}

// ===== РУЛЕТКА =====
const rouletteResults = [
  '🎮 Сыграть в Доту!',
  '📺 Посмотреть сериал!',
  '🎬 Устроить киновечер!',
  '🗣 Просто поболтать!',
  '🔥 Что-то эпичное!',
  '😂 Ржака на весь вечер!'
];

document.getElementById('spinBtn').addEventListener('click', () => {
  const wheel = document.getElementById('wheel');
  const result = document.getElementById('rouletteResult');
  wheel.classList.add('spinning');
  result.textContent = 'Крутим...';

  setTimeout(() => {
    wheel.classList.remove('spinning');
    const random = rouletteResults[Math.floor(Math.random() * rouletteResults.length)];
    wheel.textContent = '🎯';
    result.textContent = random;
  }, 1500);
});

// ===== ПЛАВНЫЙ СКРОЛЛ =====
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});