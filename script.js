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
// ==== ГЕНЕРАТОР КАРТОЧКИ ====
(function () {
  const photoInput = document.getElementById('photoInput');
  if (!photoInput) return;

  const preview = document.getElementById('photoPreview');
  const rankGrid = document.getElementById('rankGrid');
  const generateBtn = document.getElementById('generateBtn');
  const resultSection = document.getElementById('resultSection');
  const canvas = document.getElementById('cardCanvas');
  const cardPreview = document.getElementById('cardPreview');
  const downloadBtn = document.getElementById('downloadBtn');
  const sendBtn = document.getElementById('sendBtn');

  let photoImg = null;
  let selectedRank = null;

  // Ранги: число
  const RANK_NUMS = {
    Sub5: 2.5, LTN: 3.8, LTB: 4.7, MTN: 5.5,
    HTN: 6.5, HTB: 7.4, ChadLite: 8.1, Chad: 8.8, AdamLite: 9.5
  };

  // Число → ранг
  function numToRank(n) {
    if (n < 3.0) return 'Sub5';
    if (n < 4.5) return 'LTN';
    if (n < 5.0) return 'LTB';
    if (n < 6.0) return 'MTN';
    if (n < 7.0) return 'HTN';
    if (n < 7.8) return 'HTB';
    if (n < 8.5) return 'ChadLite';
    if (n < 9.2) return 'Chad';
    if (n < 9.8) return 'AdamLite';
    return 'True Adam';
  }

  // Загрузка фото
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        photoImg = img;
        preview.innerHTML = '';
        const p = document.createElement('img');
        p.src = ev.target.result;
        preview.appendChild(p);
        checkReady();
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });

  // Выбор ранга
  rankGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.rank-btn');
    if (!btn) return;
    rankGrid.querySelectorAll('.rank-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    selectedRank = btn.dataset.rank;
    checkReady();
  });

  function checkReady() {
    generateBtn.disabled = !(photoImg && selectedRank);
  }

  // Генерация карточки
  generateBtn.addEventListener('click', () => {
    const scoreNum = RANK_NUMS[selectedRank];
    // Рандом от 0.3 до 2.3
    let bonus = 0.3 + Math.random() * 2.0;
    let potNum = scoreNum + bonus;
    if (potNum > 9.8) potNum = 9.8;
    potNum = Math.round(potNum * 10) / 10;

    const potRank = numToRank(potNum);

    document.getElementById('scoreNum').textContent = scoreNum.toFixed(1);
    document.getElementById('scoreRank').textContent = selectedRank;
    document.getElementById('potNum').textContent = potNum.toFixed(1);
    document.getElementById('potRank').textContent = potRank;

    drawCard(photoImg, scoreNum.toFixed(1), selectedRank, potNum.toFixed(1), potRank);
    resultSection.style.display = 'block';
  });

  // Рисуем карточку на canvas
  function drawCard(img, scoreNum, scoreRank, potNum, potRank) {
    const ctx = canvas.getContext('2d');
    const W = 1080, H = 1080;

    // Фон
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(0, 0, W, H);

    // Зелёное свечение сверху
    const grad = ctx.createRadialGradient(W/2, 0, 0, W/2, 0, W);
    grad.addColorStop(0, 'rgba(74,222,128,0.15)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Заголовок сверху
    ctx.fillStyle = '#f0f0f0';
    ctx.font = 'bold 42px -apple-system, Helvetica, Arial';
    ctx.textAlign = 'center';
    ctx.fillText('@ascendfl_robot', W/2, 90);

    // Фото в круге
    const cx = W/2, cy = 420, r = 260;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    // Рисуем фото по центру круга (обрезка под квадрат)
    const size = Math.min(img.width, img.height);
    const sx = (img.width - size) / 2;
    const sy = (img.height - size) / 2;
    ctx.drawImage(img, sx, sy, size, size, cx - r, cy - r, r * 2, r * 2);
    ctx.restore();

    // Обводка круга
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Панели снизу
    const panelY = 760, panelH = 240, panelW = 440, gap = 40;
    const leftX = W/2 - panelW - gap/2;
    const rightX = W/2 + gap/2;

    drawPanel(ctx, leftX, panelY, panelW, panelH, 'ОЦЕНКА', scoreNum, scoreRank);
    drawPanel(ctx, rightX, panelY, panelW, panelH, 'ПОТЕНЦИАЛ', potNum, potRank);

    // Показать в превью
    cardPreview.src = canvas.toDataURL('image/png');
  }

  function drawPanel(ctx, x, y, w, h, label, num, rank) {
    // Фон панели
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    roundRect(ctx, x, y, w, h, 24);
    ctx.fill();

    // Обводка
    ctx.strokeStyle = 'rgba(74,222,128,0.4)';
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, w, h, 24);
    ctx.stroke();

    // Заголовок
    ctx.fillStyle = '#888';
    ctx.font = 'bold 24px -apple-system, Helvetica, Arial';
    ctx.textAlign = 'left';
    ctx.fillText(label, x + 30, y + 55);

    // Число
    ctx.fillStyle = '#f0f0f0';
    ctx.font = 'bold 80px -apple-system, Helvetica, Arial';
    ctx.fillText(num, x + 30, y + 160);

    // Ранг
    ctx.fillStyle = '#5eead4';
    ctx.font = 'bold 32px -apple-system, Helvetica, Arial';
    const numWidth = ctx.measureText(num).width;
    ctx.fillText(rank, x + 30 + numWidth + 20, y + 160);
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Скачать PNG
  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'afl-card.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  // Отправить в чат (текстом через Telegram WebApp)
  sendBtn.addEventListener('click', () => {
    const scoreNum = document.getElementById('scoreNum').textContent;
    const scoreRank = document.getElementById('scoreRank').textContent;
    const potNum = document.getElementById('potNum').textContent;
    const potRank = document.getElementById('potRank').textContent;

    const msg = `Оценка: ${scoreRank} — ${scoreNum}\nПотенциал: ${potRank} — ${potNum}`;

    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.sendData(msg);
    } else {
      alert('Открой из Telegram, чтобы отправить в чат:\n\n' + msg);
    }
  });
})();
// Автоподсчёт гайдов в каждой теме
document.querySelectorAll('.topic').forEach(topic => {
  const links = topic.querySelectorAll('.topic-guides a');
  const counter = topic.querySelector('.topic-count');
  if (counter) counter.textContent = links.length;
});
