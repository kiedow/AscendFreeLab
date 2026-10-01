document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const list = document.getElementById(btn.dataset.target);
    const isOpen = list.classList.contains('open');

    document.querySelectorAll('.guide-list').forEach(l => l.classList.remove('open'));
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));

    if (!isOpen) {
      list.classList.add('open');
      btn.classList.add('active');
    }
  });
});
