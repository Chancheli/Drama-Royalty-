const scenesData = [
  {
    id: 'soraya_01',
    title: 'Maldita Lisiada! (Soraya Montenegro)',
    category: 'mexican',
    duration: '01:15',
    roles: 'Soraya, Alicia, Nando',
    difficulty: '🔥 🔥 🔥 🔥 🔥',
    videoUrl: 'media/soraya_01/video.mp4',
    subtitlesUrl: 'media/soraya_01/subtitles.vtt',
    thumb: 'https://via.placeholder.com/400x225/1f2833/e91e63?text=Soraya+Montenegro'
  },
  {
    id: 'dragonball_intro',
    title: 'Dragon Ball Intro - Prepei kai Mporo',
    category: 'anime',
    duration: '01:20',
    roles: 'Oli i Parea',
    difficulty: '🔥 🔥 🔥 🔥',
    videoUrl: 'media/dragonball/video.mp4',
    subtitlesUrl: 'media/dragonball/subtitles.vtt',
    thumb: 'https://via.placeholder.com/400x225/1f2833/00f5d4?text=Dragon+Ball+Intro'
  }
];

const shopProducts = [
  { id: 'photo_magnet', name: '📸 Fotografikos Magnitis Skinis', price: 6.00, desc: 'Anamnistikos magnitis me tin fotografia sas!' },
  { id: 'vip_cocktail', name: '🍸 Drama Royalty Signature Cocktail', price: 8.00, desc: 'Drosistiko kokteil gia ta potaria sas.' }
];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  renderScenes('all');
  renderShop();
  setupEventListeners();
});

function renderScenes(category) {
  const grid = document.getElementById('scenesGrid');
  grid.innerHTML = '';
  const filtered = category === 'all' ? scenesData : scenesData.filter(s => s.category === category);
  filtered.forEach(scene => {
    const card = document.createElement('div');
    card.className = 'scene-card';
    card.onclick = () => openPlayerModal(scene);
    card.innerHTML = `
      <div class="scene-thumb">
        <img src="${scene.thumb}" alt="${scene.title}">
        <span class="scene-duration">${scene.duration}</span>
      </div>
      <div class="scene-details">
        <h3 class="scene-title">${scene.title}</h3>
        <div class="scene-meta">
          <span>👥 ${scene.roles}</span>
          <span>${scene.difficulty}</span>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });
}

function openPlayerModal(scene) {
  const modal = document.getElementById('playerModal');
  const video = document.getElementById('dubbingVideo');
  const track = document.getElementById('videoTrack');
  document.getElementById('modalSceneTitle').innerText = scene.title;
  document.getElementById('modalSceneRoles').innerText = `Xaraktires: ${scene.roles}`;
  video.src = scene.videoUrl;
  track.src = scene.subtitlesUrl;
  modal.style.display = 'flex';
}

function closePlayerModal() {
  const modal = document.getElementById('playerModal');
  const video = document.getElementById('dubbingVideo');
  video.pause();
  video.currentTime = 0;
  modal.style.display = 'none';
}

function renderShop() {
  const grid = document.getElementById('shopGrid');
  if(!grid) return;
  grid.innerHTML = '';
  shopProducts.forEach(prod => {
    const item = document.createElement('div');
    item.style.cssText = 'background: #111827; padding: 15px; border-radius: 12px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;';
    item.innerHTML = `
      <div>
        <h4 style="color: #00f5d4;">${prod.name}</h4>
        <p style="font-size: 0.85rem; color: #94a3b8;">${prod.desc}</p>
        <strong style="color: #ffb703;">${prod.price.toFixed(2)}€</strong>
      </div>
      <button class="btn btn-primary" onclick="addToCart('${prod.id}')">+ Prosthiki</button>
    `;
    grid.appendChild(item);
  });
}

function addToCart(prodId) {
  const prod = shopProducts.find(p => p.id === prodId);
  if (prod) {
    cart.push(prod);
    updateCartUI();
  }
}

function updateCartUI() {
  document.getElementById('cartCount').innerText = cart.length;
  const total = cart.reduce((sum, item) => sum + item.price, 0);
  document.getElementById('cartTotal').innerText = `${total.toFixed(2)}€`;
}

function setupEventListeners() {
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      renderScenes(e.target.dataset.category);
    });
  });

  const closePlayer = document.getElementById('closePlayerBtn');
  if(closePlayer) closePlayer.onclick = closePlayerModal;

  const shopModal = document.getElementById('shopModal');
  const cartBtn = document.getElementById('cartBtn');
  if(cartBtn && shopModal) {
    cartBtn.onclick = () => shopModal.style.display = 'flex';
  }
  const closeShop = document.getElementById('closeShopBtn');
  if(closeShop && shopModal) {
    closeShop.onclick = () => shopModal.style.display = 'none';
  }

  const video = document.getElementById('dubbingVideo');
  const playBtn = document.getElementById('playPauseBtn');
  if(playBtn && video) {
    playBtn.onclick = () => {
      if (video.paused) {
        video.play();
        playBtn.innerText = '⏸️ Pausi';
      } else {
        video.pause();
        playBtn.innerText = '▶️ Enarxi';
      }
    };
  }

  const restartBtn = document.getElementById('restartBtn');
  if(restartBtn && video) {
    restartBtn.onclick = () => {
      video.currentTime = 0;
      video.play();
    };
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
  if(checkoutBtn && shopModal) {
    checkoutBtn.onclick = () => {
      if (cart.length === 0) {
        alert('To kalathi sou einai adeio!');
        return;
      }
      alert('I paraggelia estaile! Enas ypallilos tha sas ferei ta anamnistika sto Domatio 01.');
      cart = [];
      updateCartUI();
      shopModal.style.display = 'none';
    };
  }
}
