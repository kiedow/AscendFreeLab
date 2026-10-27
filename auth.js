(function() {
  const tg = window.Telegram && window.Telegram.WebApp ? window.Telegram.WebApp : null;
  
  // Если открыто не в Telegram — ничего не проверяем
  if (!tg || !tg.initData) return;

  // Показываем экран загрузки
  const loader = document.createElement('div');
  loader.id = 'auth-loader';
  loader.style = 'position:fixed;top:0;left:0;right:0;bottom:0;background:#0a0a0a;z-index:9999;display:flex;align-items:center;justify-content:center;color:#4ade80;font-family:sans-serif;font-size:1.2rem;flex-direction:column;';
  loader.innerHTML = 'Проверка подписки...';
  document.body.appendChild(loader);

  // Обращаемся к нашему Cloudflare Worker
  fetch('https://afl-bot.azferon94782.workers.dev/api/check-sub', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      initData: tg.initData,
      userId: tg.initDataUnsafe.user.id
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.subscribed) {
      // Всё ок, убираем загрузку
      loader.remove();
    } else {
      // Не подписан — показываем заглушку
      loader.innerHTML = `
        <div style="text-align:center; padding: 20px;">
          <div style="font-size:1.5rem; margin-bottom:10px; color:#fff;">Доступ закрыт</div>
          <div style="color:#888; margin-bottom:20px;">Чтобы пользоваться сайтом, подпишись на канал.</div>
          <a href="https://t.me/ascendfl" target="_blank" style="display:inline-block; padding:12px 24px; background:rgba(74,222,128,0.1); border:1px solid #4ade80; color:#4ade80; text-decoration:none; border-radius:12px; font-weight:bold;">Перейти в канал</a>
        </div>
      `;
    }
  })
  .catch(err => {
    console.error('Auth error:', err);
    loader.remove(); // Если ошибка сети, лучше пустить, чтобы не блокировать
  });
})();
