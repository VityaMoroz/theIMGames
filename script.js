// ===== ТАЙМЕР =====
const targetDate = new Date('2026-10-24T21:00:00').getTime();

function updateTimer() {
  const now = new Date().getTime();
  const diff = targetDate - now;

  if (diff < 0) {
    document.getElementById('timer').innerHTML = '<p style="font-size:22px;">Стрим уже начался! 🎮</p>';
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

  let html = '<h3 style="margin-bottom:15px;font-size:20px;">Результаты:</h3>';
  for (const key in votes) {
    const percent = total > 0 ? Math.round((votes[key] / total) * 100) : 0;
    html += `
      <div class="poll-bar">
        <div class="
