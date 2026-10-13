const scenesData = [
  {
    id: 'soraya_01',
    title: 'Maldita Lisiada! (Σοράγια Montenegro)',
    category: 'mexican',
    duration: '01:15',
    roles: 'Σοράγια, Αλίσια, Νάντο',
    difficulty: '🔥 🔥 🔥 🔥 🔥',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumb: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=400&auto=format&fit=crop&q=80'
  },
  {
    id: 'dragonball_intro',
    title: 'Dragon Ball Intro - Πρέπει και Μπορώ',
    category: 'anime',
    duration: '01:20',
    roles: 'Όλη η Παρέα',
    difficulty: '🔥 🔥 🔥 🔥',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumb: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=400&auto=format&fit=crop&q=80'
  }
];

const shopProducts = [
  { id: 'photo_magnet', name: '📸 Φωτογραφικός Μαγνήτης Σκηνής', price: 6.00, desc: 'Αναμνηστικός μαγνήτης με τη φωτογραφία σας!' },
  { id: 'vip_cocktail', name: '🍸 Drama Royalty Signature Cocktail', price: 8.00, desc: 'Δροσιστικό κοκτέιλ για τις φωνητικές χορδές.' }
];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  renderScenes('all');
  renderShop();
  setupEventListeners();
});

function renderScenes(category) {
  const grid = document.getElementById('scenesGrid');
  if(!grid) return;
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
  const playBtn = document.getElementById('playPauseBtn');

  document.getElementById('modalSceneTitle').innerText = scene.title;
  document.getElementById('modalSceneRoles').innerText = `Χαρακτήρες: ${scene.roles}`;

  if(playBtn) playBtn.innerText = '▶️ Έναρξη';

  video.src = scene.videoUrl;
  video.load();
  modal.style.display = 'flex';
}

function closePlayerModal() {
  const modal = document.getElementById('playerModal');
  const video = document.getElementById('dubbingVideo');
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
  if (modal) modal.style.display = 'none';
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
      <button class="btn btn-primary" onclick="addToCart('${prod.id}')">+ Προσθήκη</button>
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
  const countEl = document.getElementById('cartCount');
  const totalEl = document.getElementById('cartTotal');
  if(countEl) countEl.innerText = cart.length;
  if(totalEl) {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    totalEl.innerText = `${total.toFixed(2)}€`;
  }
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
        video.play().then(() => {
          playBtn.innerText = '⏸️ Παύση';
        }).catch(err => {
          console.error("Σφάλμα:", err);
        });
      } else {
        video.pause();
        playBtn.innerText = '▶️ Έναρξη';
      }
    };

    video.onended = () => {
      playBtn.innerText = '▶️ Έναρξη';
    };
  }

  const restartBtn = document.getElementById('restartBtn');
  if(restartBtn && video) {
    restartBtn.onclick = () => {
      video.currentTime = 0;
      video.play().then(() => {
        if(playBtn) playBtn.innerText = '⏸️ Παύση';
      });
    };
  }

  const checkoutBtn = document.getElementById('checkoutBtn');
  if(checkoutBtn && shopModal) {
    checkoutBtn.onclick = () => {
      if (cart.length === 0) {
        alert('Το καλάθι σου είναι άδειο!');
        return;
      }
      alert('Η παραγγελία εστάλη! Ένας υπάλληλος θα σας φέρει τα αναμνηστικά στο Δωμάτιο 01.');
      cart = [];
      updateCartUI();
      shopModal.style.display = 'none';
    };
  }
}
