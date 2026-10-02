// Активная подсветка навигации
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href === path) item.classList.add('active');
  });
})();

// Аккордеон тем в Академии
document.querySelectorAll('.topic-header').forEach(header => {
  header.addEventListener('click', () => {
    const topic = header.closest('.topic');
    topic.classList.toggle('open');
  });
});

// Автоподсчёт гайдов в каждой теме
document.querySelectorAll('.topic').forEach(topic => {
  const count = topic.querySelectorAll('.topic-guides a').length;
  const counter = topic.querySelector('.topic-count');
  if (counter) counter.textContent = count;
});
