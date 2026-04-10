const galleryImages = [
  { src: 'assets/images/image00001.png', alt: 'Exhibition Photo 1', title: 'Бүтээл #1' },
  { src: 'assets/images/image00002.png', alt: 'Exhibition Photo 2', title: 'Бүтээл #2' },
  { src: 'assets/images/image00003.png', alt: 'Exhibition Photo 3', title: 'Бүтээл #3' },
  { src: 'assets/images/image00004.png', alt: 'Exhibition Photo 4', title: 'Бүтээл #4' },
  { src: 'assets/images/image00005.png', alt: 'Exhibition Photo 5', title: 'Бүтээл #5' },
  { src: 'assets/images/image00006.png', alt: 'Exhibition Photo 6', title: 'Бүтээл #6' },
  { src: 'assets/images/buteel (1).jpg',  alt: 'Exhibition Photo', title: 'Бүтээл #7' },
  { src: 'assets/images/buteel (2).jpg',  alt: 'Exhibition Photo', title: 'Бүтээл #8' },
  { src: 'assets/images/buteel (3).jpg',  alt: 'Exhibition Photo', title: 'Бүтээл #9' },
  { src: 'assets/images/buteel (4).jpg',  alt: 'Exhibition Photo', title: 'Бүтээл #10' },
  { src: 'assets/images/buteel (5).jpg',  alt: 'Exhibition Photo', title: 'Бүтээл #11' },
  { src: 'assets/images/buteel (6).jpg',  alt: 'Exhibition Photo', title: 'Бүтээл #12' },
  { src: 'assets/images/buteel (7).jpg',  alt: 'Exhibition Photo', title: 'Бүтээл #13' },
  { src: 'assets/images/buteel (8).jpg',  alt: 'Exhibition Photo', title: 'Бүтээл #14' },
  { src: 'assets/images/buteel (9).jpg',  alt: 'Exhibition Photo', title: 'Бүтээл #15' },
  { src: 'assets/images/buteel (10).jpg', alt: 'Exhibition Photo', title: 'Бүтээл #16' },
  { src: 'assets/images/buteel (11).jpg', alt: 'Exhibition Photo', title: 'Бүтээл #17' },
  { src: 'assets/images/buteel (12).jpg', alt: 'Exhibition Photo', title: 'Бүтээл #18' },
  { src: 'assets/images/buteel (13).jpg', alt: 'Exhibition Photo', title: 'Бүтээл #19' },
  { src: 'assets/images/buteel (14).jpg', alt: 'Exhibition Photo', title: 'Бүтээл #20' },
  { src: 'assets/images/buteel (15).jpg', alt: 'Exhibition Photo', title: 'Бүтээл #21' },
  { src: 'assets/images/muis.jpg',        alt: 'Exhibition Photo', title: 'Бүтээл #22' },
  { src: 'assets/images/muis2.jpg',       alt: 'Exhibition Photo', title: 'Бүтээл #23' },
  { src: 'assets/images/_MG_5770.jpg',   alt: 'Exhibition Photo', title: 'Бүтээл #24' },
];


// Нэг хуудсанд харуулах зургийн тоо
const PAGE_SIZE = 8;

// ── LIKES ──
function getLikes() {
  return JSON.parse(localStorage.getItem('gallery-likes') || '{}');
}
function saveLikes(likes) {
  localStorage.setItem('gallery-likes', JSON.stringify(likes));
}
function toggleLike(index) {
  const likes = getLikes();
  likes[index] = !likes[index];
  saveLikes(likes);
  return likes[index];
} 

// ── LIGHTBOX ──
let currentLbIndex = 0;

function buildLightbox() {
  if (document.getElementById('fgp-lightbox')) return;
  const lb = document.createElement('div');
  lb.id = 'fgp-lightbox';
  lb.className = 'fgp-lightbox';
  lb.innerHTML = `
    <button class="fgp-lb-close" id="fgp-lb-close">&times;</button>
    <button class="fgp-lb-nav fgp-lb-prev" id="fgp-lb-prev">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
    </button>
    <div class="fgp-lb-content">
      <img src="" alt="" id="fgp-lb-img">
      <div class="fgp-lb-footer">
        <span class="fgp-lb-title" id="fgp-lb-title"></span>
        <button class="fgp-lb-like" id="fgp-lb-like">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span id="fgp-lb-like-count">0</span>
        </button>
      </div>
    </div>
    <button class="fgp-lb-nav fgp-lb-next" id="fgp-lb-next">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
    </button>
  `;
  document.body.appendChild(lb);

  lb.addEventListener('click', (e) => { if (e.target === lb) closeLightbox(); });
  document.getElementById('fgp-lb-close').addEventListener('click', closeLightbox);
  document.getElementById('fgp-lb-prev').addEventListener('click', () => navigateLb(-1));
  document.getElementById('fgp-lb-next').addEventListener('click', () => navigateLb(1));
  document.getElementById('fgp-lb-like').addEventListener('click', () => {
    const isLiked = toggleLike(currentLbIndex);
    updateLbLikeBtn(currentLbIndex, isLiked);
    syncLikeButtons(currentLbIndex, isLiked);
  });

  document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('fgp-lightbox');
    if (!lb || !lb.classList.contains('open')) return;
    if (e.key === 'ArrowLeft')  navigateLb(-1);
    if (e.key === 'ArrowRight') navigateLb(1);
    if (e.key === 'Escape')     closeLightbox();
  });
}

function openLightbox(idx) {
  buildLightbox();
  currentLbIndex = idx;
  const img   = document.getElementById('fgp-lb-img');
  const title = document.getElementById('fgp-lb-title');
  img.src = galleryImages[idx].src;
  img.alt = galleryImages[idx].alt;
  title.textContent = galleryImages[idx].title;
  updateLbLikeBtn(idx, getLikes()[idx]);
  document.getElementById('fgp-lightbox').classList.add('open');
}

function closeLightbox() {
  const lb = document.getElementById('fgp-lightbox');
  if (lb) lb.classList.remove('open');
}

function navigateLb(dir) {
  currentLbIndex = (currentLbIndex + dir + galleryImages.length) % galleryImages.length;
  const img   = document.getElementById('fgp-lb-img');
  const title = document.getElementById('fgp-lb-title');
  img.src = galleryImages[currentLbIndex].src;
  img.alt = galleryImages[currentLbIndex].alt;
  title.textContent = galleryImages[currentLbIndex].title;
  updateLbLikeBtn(currentLbIndex, getLikes()[currentLbIndex]);
}

function updateLbLikeBtn(idx, isLiked) {
  const btn = document.getElementById('fgp-lb-like');
  if (!btn) return;
  btn.classList.toggle('liked', !!isLiked);
  btn.querySelector('svg').setAttribute('fill', isLiked ? 'currentColor' : 'none');
  document.getElementById('fgp-lb-like-count').textContent = isLiked ? 1 : 0;
}

function syncLikeButtons(idx, isLiked) {
  document.querySelectorAll(`.fgp-like-btn[data-index="${idx}"]`).forEach(b => {
    b.classList.toggle('liked', isLiked);
    b.querySelector('svg').setAttribute('fill', isLiked ? 'currentColor' : 'none');
    b.querySelector('.fgp-like-count').textContent = isLiked ? 1 : 0;
  });
}

// ── FULL GALLERY PAGE (Pagination хувилбар) ──
let fgpCurrentPage = 0; // 0-based page index
let gridObserver = null; // Хадгалсан IntersectionObserver

function getTotalPages() {
  return Math.ceil(galleryImages.length / PAGE_SIZE);
}

function getPageImages(page) {
  const start = page * PAGE_SIZE;
  return galleryImages.slice(start, start + PAGE_SIZE).map((img, i) => ({
    ...img,
    globalIndex: start + i,
  }));
}

/**
 * Зөвхөн .fgp-grid-н контентийг шинэчилнэ (анимациtай).
 * DocumentFragment ашиглаж DOM-ийг оновчтой үүсгэнэ.
 */
function renderPage(page, direction = 0) {
  const grid = document.querySelector('.fgp-grid');
  if (!grid) return;

  fgpCurrentPage = page;
  const likes = getLikes();
  const images = getPageImages(page);
  const totalPages = getTotalPages();

  // Slide анимацийн чиглэл
  const slideOut = direction > 0 ? 'slide-out-left' : direction < 0 ? 'slide-out-right' : '';
  const slideIn  = direction > 0 ? 'slide-in-right'  : direction < 0 ? 'slide-in-left'  : '';

  const doRender = () => {
    // DocumentFragment ашиглаж DOM-г нэг удаа үүсгэнэ
    const fragment = document.createDocumentFragment();

    images.forEach(({ src, alt, title, globalIndex }) => {
      const liked = likes[globalIndex];
      
      const item = document.createElement('div');
      item.className = 'fgp-item';
      item.dataset.index = globalIndex;

      const imgWrap = document.createElement('div');
      imgWrap.className = 'fgp-img-wrap';

      const img = document.createElement('img');
      img.dataset.src = src;
      img.alt = alt;

      const overlay = document.createElement('div');
      overlay.className = 'fgp-img-overlay';

      imgWrap.appendChild(img);
      imgWrap.appendChild(overlay);

      const footer = document.createElement('div');
      footer.className = 'fgp-item-footer';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'fgp-item-title';
      titleSpan.textContent = title;

      const likeBtn = document.createElement('button');
      likeBtn.className = `fgp-like-btn ${liked ? 'liked' : ''}`;
      likeBtn.dataset.index = globalIndex;

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('fill', liked ? 'currentColor' : 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z');
      svg.appendChild(path);

      const likeCount = document.createElement('span');
      likeCount.className = 'fgp-like-count';
      likeCount.textContent = liked ? 1 : 0;

      likeBtn.appendChild(svg);
      likeBtn.appendChild(likeCount);

      footer.appendChild(titleSpan);
      footer.appendChild(likeBtn);

      item.appendChild(imgWrap);
      item.appendChild(footer);

      fragment.appendChild(item);
    });

    grid.innerHTML = '';
    grid.appendChild(fragment);

    // Lazy load — зөвхөн энэ хуудасны зургуудыг
    initGridLazyLoad(grid);

    // Event delegation - grid-ийн дээр нэг listener нэмнэ
    setupGridEventDelegation(grid);

    // Slide-in анимаци
    if (slideIn) {
      grid.classList.add(slideIn);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => grid.classList.remove(slideIn));
      });
    }
  };

  // Slide-out → render → slide-in
  if (slideOut && grid.children.length > 0) {
    grid.classList.add(slideOut);
    grid.addEventListener('animationend', function handler() {
      grid.removeEventListener('animationend', handler);
      grid.classList.remove(slideOut);
      doRender();
    }, { once: true });
  } else {
    doRender();
  }

  // Pagination товчнуудыг шинэчлэх
  updatePaginationControls(page, totalPages);
}

/**
 * Event delegation - Grid дээр нэг listener нэмэж бүх үйлдлийг удирдана
 */
function setupGridEventDelegation(grid) {
  // Өмнөх listener аль байдал хүлээхүүлэхгүй шалгалт хийнэ
  const existingHandler = grid.dataset.delegationSetup;
  if (existingHandler === 'true') return;
  
  grid.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.fgp-like-btn');
    const imgWrap = e.target.closest('.fgp-img-wrap');

    if (likeBtn) {
      e.stopPropagation();
      const idx = parseInt(likeBtn.dataset.index);
      const isLiked = toggleLike(idx);
      syncLikeButtons(idx, isLiked);
      updateLbLikeBtn(idx, isLiked);
    } else if (imgWrap) {
      const idx = parseInt(imgWrap.closest('[data-index]').dataset.index);
      openLightbox(idx);
    }
  });

  grid.dataset.delegationSetup = 'true';
}

function updatePaginationControls(page, totalPages) {
  const prevBtn = document.getElementById('fgp-page-prev');
  const nextBtn = document.getElementById('fgp-page-next');
  const counter = document.getElementById('fgp-page-counter');

  if (prevBtn) prevBtn.disabled = page === 0;
  if (nextBtn) nextBtn.disabled = page >= totalPages - 1;
  if (counter) {
    counter.textContent = `${page + 1} / ${totalPages}`;
  }
}

/**
 * IntersectionObserver ашиглаж lazy load хийнэ.
 * Observer-ийг хадгалж бүх хуудсанд ашиглана (дахин үүсгэхгүй).
 */
function initGridLazyLoad(container) {
  // Observer эхлүүлээгүй бол үүсгэнэ
  if (!gridObserver) {
    gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        // dataset.src байгаа бөгөөд src-г оршин байхыг проверка хийнэ (давтан ачаал эхлүүлэхгүй)
        if (img.dataset.src && !img.src) {
          img.src = img.dataset.src;
          delete img.dataset.src;
          gridObserver.unobserve(img);
        }
      });
    }, {
      root: null,
      rootMargin: '100px',
      threshold: 0,
    });
  }

  // Энэ хуудасны зургуудыг observer-д нэмнэ
  container.querySelectorAll('img[data-src]').forEach(img => {
    gridObserver.observe(img);
  });
}

function createFullGalleryPage() {
  const existing = document.getElementById('full-gallery-page');
  if (existing) { openFullGallery(); return; }

  fgpCurrentPage = 0;
  const totalPages = getTotalPages();

  const page = document.createElement('div');
  page.id = 'full-gallery-page';
  
  const backdrop = document.createElement('div');
  backdrop.className = 'fgp-backdrop';

  const panel = document.createElement('div');
  panel.className = 'fgp-panel';

  const left = document.createElement('div');
  left.className = 'fgp-left';

  const header = document.createElement('div');
  header.className = 'fgp-header';

  const headerLeft = document.createElement('div');
  const label = document.createElement('p');
  label.className = 'fgp-label';
  label.textContent = '— Гэрэл зургийн үзэсгэлэн';
  const title = document.createElement('h2');
  title.className = 'fgp-title';
  title.textContent = 'Манай бүтээлүүд';
  headerLeft.appendChild(label);
  headerLeft.appendChild(title);

  const headerRight = document.createElement('div');
  headerRight.className = 'fgp-header-right';

  const pagination = document.createElement('div');
  pagination.className = 'fgp-pagination';

  const prevBtn = document.createElement('button');
  prevBtn.className = 'fgp-page-btn';
  prevBtn.id = 'fgp-page-prev';
  prevBtn.disabled = true;
  prevBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>';

  const counter = document.createElement('span');
  counter.className = 'fgp-page-counter';
  counter.id = 'fgp-page-counter';
  counter.textContent = `1 / ${totalPages}`;

  const nextBtn = document.createElement('button');
  nextBtn.className = 'fgp-page-btn';
  nextBtn.id = 'fgp-page-next';
  if (totalPages <= 1) nextBtn.disabled = true;
  nextBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>';

  pagination.appendChild(prevBtn);
  pagination.appendChild(counter);
  pagination.appendChild(nextBtn);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'fgp-close';
  closeBtn.id = 'fgp-close';
  closeBtn.textContent = '×';

  headerRight.appendChild(pagination);
  headerRight.appendChild(closeBtn);

  header.appendChild(headerLeft);
  header.appendChild(headerRight);

  const grid = document.createElement('div');
  grid.className = 'fgp-grid';

  left.appendChild(header);
  left.appendChild(grid);

  panel.appendChild(left);
  page.appendChild(backdrop);
  page.appendChild(panel);

  document.body.appendChild(page);
  requestAnimationFrame(() => page.classList.add('open'));
  document.body.style.overflow = 'hidden';

  // Эхний хуудсыг render
  renderPage(0, 0);

  // Pagination товчнууд (нэг удаа нэмнэ)
  prevBtn.addEventListener('click', () => {
    if (fgpCurrentPage > 0) renderPage(fgpCurrentPage - 1, -1);
  });
  nextBtn.addEventListener('click', () => {
    if (fgpCurrentPage < getTotalPages() - 1) renderPage(fgpCurrentPage + 1, 1);
  });

  // Keyboard навигаци (нэг удаа нэмнэ)
  const fgpKeyHandlerWrapper = (e) => {
    if (!page.classList.contains('open')) return;
    const lb = document.getElementById('fgp-lightbox');
    if (lb && lb.classList.contains('open')) return;

    if (e.key === 'ArrowRight') {
      if (fgpCurrentPage < getTotalPages() - 1) renderPage(fgpCurrentPage + 1, 1);
    }
    if (e.key === 'ArrowLeft') {
      if (fgpCurrentPage > 0) renderPage(fgpCurrentPage - 1, -1);
    }
    if (e.key === 'Escape') closeFullGallery();
  };

  // Хаах
  closeBtn.addEventListener('click', closeFullGallery);
  backdrop.addEventListener('click', closeFullGallery);

  document.addEventListener('keydown', fgpKeyHandlerWrapper);
  page.dataset.keyHandler = true;
}

function openFullGallery() {
  const page = document.getElementById('full-gallery-page');
  if (page) { page.classList.add('open'); document.body.style.overflow = 'hidden'; }
}

function closeFullGallery() {
  const page = document.getElementById('full-gallery-page');
  if (page) {
    page.classList.remove('open');
    document.body.style.overflow = '';
    // Дараагийн нээлтэд эхний хуудсаас эхлэх
    setTimeout(() => {
      page.remove();
    }, 350);
  }
}

// ── PREVIEW GALLERY ──
document.getElementById('gallery').innerHTML = `
  <div class="section-header">
    <div class="section-header-left">
      <p class="section-label">— Гэрэл зургийн үзэсгэлэн</p>
      <h2>Манай бүтээлүүд</h2>
    </div>
    <a href="#" class="view-all-btn" id="view-all-btn">Бүгдийг үзэх</a>
  </div>
  <div class="gallery-grid">
    ${galleryImages.slice(0, PAGE_SIZE).map((img, i) => `
      <div class="gallery-item" data-index="${i}">
        <img src="${img.src}" alt="${img.alt}" loading="lazy">
        <div class="gallery-item-overlay"></div>
      </div>
    `).join('')}
  </div>
  <div class="lightbox" id="lightbox">
    <button class="lightbox-close" id="lightbox-close">&times;</button>
    <img src="" alt="" id="lightbox-img">
  </div>
`;

document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    const index = parseInt(item.dataset.index);
    document.getElementById('lightbox-img').src = galleryImages[index].src;
    document.getElementById('lightbox-img').alt = galleryImages[index].alt;
    document.getElementById('lightbox').classList.add('open');
  });
});
document.getElementById('lightbox-close').addEventListener('click', () => {
  document.getElementById('lightbox').classList.remove('open');
});
document.getElementById('lightbox').addEventListener('click', (e) => {
  if (e.target === document.getElementById('lightbox'))
    document.getElementById('lightbox').classList.remove('open');
});

document.getElementById('view-all-btn').addEventListener('click', (e) => {
  e.preventDefault();
  createFullGalleryPage();
});