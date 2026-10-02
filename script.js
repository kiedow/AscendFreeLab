// Подсветка активного пункта нижней навигации
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href === path) item.classList.add('active');
  });
})();

// Аккордеон категорий
document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const list = document.getElementById(btn.dataset.target);
    const isOpen = list.classList.contains('open');

    document.querySelectorAll('.guide-list').forEach(l => l.classList.remove('open'));
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));

    if (!isOpen) {
      list.classList.add('open');
      btn.classList.add('active');
    }
  });
});
