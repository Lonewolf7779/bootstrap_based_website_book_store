// books.js
// Fully integrated script for books.html
// - Populates books (online images)
// - Hover on desktop / click on touch to open modal
// - Reusable modal population
// - Filters (categories + real-time price slider)
// - Search suggestions, Enter-to-search, clear
// - Pagination (retains filters/search state)
// - Cart with sessionStorage (badge, offcanvas, remove, total)
// - Toast notifications (Add to cart)
// ------------------------------------------------------------------

/* =======================
   Configuration & Data
   ======================= */
const booksPerPage = 12;
const categories = ["fiction", "non-fiction", "self-help", "science-tech"];
const books = []; // will fill with sample data (36 items)

// create sample books with online cover images (picsum.photos seeded)
for (let i = 1; i <= 36; i++) {
  // choose category cycling through categories
  const cat = categories[(i - 1) % categories.length];
  books.push({
    id: i,
    title: `${cap(cat)} Book ${i}`,
    author: `Author ${i}`,
    price: Math.floor(Math.random() * 450) + 50, // 50 - 499
    category: cat,
    // picsum seeded image for consistent images across reloads
    img: `https://picsum.photos/seed/book${i}/400/600`,
    description: `This is a detailed description for ${cap(cat)} Book ${i}. It includes a summary, author background and short reviews. A great read for curious minds.`
  });
}
function cap(s){ return s.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase()); }

/* =======================
   State
   ======================= */
let currentPage = 1;
let currentSearch = "";
let currentFilters = { categories: [], maxPrice: null };
let isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

/* Cart persisted to sessionStorage */
let cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
let currentUser = sessionStorage.getItem('currentUser') || ""; // placeholder for login logic

/* =======================
   DOM refs (must match books.html)
   ======================= */
const booksContainer = document.getElementById('booksContainer');
const pagination = document.getElementById('pagination');
const searchWrapper = document.getElementById('searchWrapper');
const searchBar = document.getElementById('searchBar');
const toggleSearch = document.getElementById('toggleSearch');
const goBtn = document.getElementById('goBtn');
const clearSearchBtn = document.getElementById('clearSearch');
const suggestions = document.getElementById('suggestions');

const priceRange = document.getElementById('priceRange');
const priceRangeValue = document.getElementById('priceRangeValue');
const categoryInputs = document.querySelectorAll('#offcanvasFilters input[type="checkbox"]');

const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItems');

const bookModalEl = document.getElementById('bookModal');
const bsModal = new bootstrap.Modal(bookModalEl);
const modalTitle = document.getElementById('bookModalLabel');
const modalBody = bookModalEl.querySelector('.modal-body');
const modalAddCart = document.getElementById('modalAddCart');
const modalBuyNow = document.getElementById('modalBuyNow');
const modalCancel = document.getElementById('modalCancel');

const cartToastEl = document.getElementById('cartToast');
const cartToast = new bootstrap.Toast(cartToastEl);

/* =======================
   Helpers
   ======================= */
function saveCart() {
  sessionStorage.setItem('cart', JSON.stringify(cart));
}
function updateCartBadge() {
  cartCount.textContent = cart.length;
}
function formatRs(n){ return n.toLocaleString('en-IN'); }

/* =======================
   Initialize UI (price slider max based on data)
   ======================= */
(function init() {
  const maxPrice = Math.max(...books.map(b => b.price));
  // set slider max to either detected max or slider's existing max attribute
  const sliderMax = Math.max(maxPrice, Number(priceRange.max || 1000));
  priceRange.max = sliderMax;
  priceRange.value = sliderMax;
  priceRangeValue.textContent = sliderMax;
  currentFilters.maxPrice = sliderMax;

  updateCartBadge();
  renderCartUI();
  renderBooks(1);
  wireGlobalEvents();
})();

/* =======================
   Render books grid with current filters/search/pagination
   ======================= */
function renderBooks(page = 1) {
  currentPage = page;
  booksContainer.innerHTML = '';

  let filtered = books.slice();

  // search filter
  if (currentSearch && currentSearch.trim() !== '') {
    const q = currentSearch.trim().toLowerCase();
    filtered = filtered.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }

  // categories filter
  if (currentFilters.categories && currentFilters.categories.length > 0) {
    filtered = filtered.filter(b => currentFilters.categories.includes(b.category));
  }

  // price filter
  if (currentFilters.maxPrice !== null && currentFilters.maxPrice !== undefined) {
    filtered = filtered.filter(b => b.price <= Number(currentFilters.maxPrice));
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / booksPerPage));
  if (page > totalPages) page = totalPages, currentPage = page;

  const start = (page - 1) * booksPerPage;
  const slice = filtered.slice(start, start + booksPerPage);

// create cards
slice.forEach(book => {
  const col = document.createElement('div');
  col.className = 'col-lg-3 col-md-4 col-sm-6 mb-4';
  col.innerHTML = `
    <div class="card h-100 book-card" tabindex="0" data-id="${book.id}">
      <img src="${book.img}" class="card-img-top" alt="${escapeHtml(book.title)}">
      <div class="card-body">
        <div class="card-title">${escapeHtml(book.title)}</div>
        <div class="card-price">₹${formatRs(book.price)}</div>
      </div>
    </div>
  `;
  booksContainer.appendChild(col);

  const card = col.querySelector('.book-card');

  // accessible keyboard activation
  card.addEventListener('keydown', (e) => { 
    if (e.key === 'Enter') openModalForBook(book); 
  });

  // ✅ open modal only on click (desktop + touch)
  card.addEventListener('click', () => openModalForBook(book));
});

renderPagination(totalPages, page);
}

//======================
//       SEARCHBAR       
//======================

/* =======================
   Pagination rendering
   ======================= */
function renderPagination(totalPages, activePage) {
  pagination.innerHTML = '';
  // show at least one page link
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${i === activePage ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener('click', (e) => {
      e.preventDefault();
      renderBooks(i);
      window.scrollTo({ top: 160, behavior: 'smooth' });
    });
    pagination.appendChild(li);
  }
}

/* =======================
   Modal open/populate
   ======================= */
let lastOpenedBookId = null;
function openModalForBook(book) {
  // Avoid rapid re-open for same book
  if (lastOpenedBookId === book.id && document.querySelector('.modal.show')) return;
  lastOpenedBookId = book.id;

  modalTitle.textContent = book.title;
  modalBody.innerHTML = `
    <div class="d-flex flex-column flex-md-row align-items-start gap-3">
      <img src="${book.img}" alt="${escapeHtml(book.title)}" style="width:180px; height:auto; object-fit:cover;">
      <div class="details">
        <p><strong>Author:</strong> ${escapeHtml(book.author)}</p>
        <p><strong>Category:</strong> ${escapeHtml(cap(book.category))}</p>
        <p><strong>Price:</strong> ₹${formatRs(book.price)}</p>
        <p style="margin-top:.5rem;">${escapeHtml(book.description)}</p>
      </div>
    </div>
  `;

  // wire modal buttons
  modalAddCart.onclick = () => {
    if (!currentUser) {
      // simple UX: redirect to login
      alert('Please sign in to add to cart.');
      window.location.href = 'login.html';
      return;
    }
    cart.push(book);
    saveCart();
    updateCartBadge();
    renderCartUI();
    cartToast.show();
  };

  modalBuyNow.onclick = () => {
    if (!currentUser) {
      alert('Please sign in to buy.');
      window.location.href = 'login.html';
      return;
    }
    // for now: add to cart and open cart offcanvas as mock checkout
    cart.push(book);
    saveCart();
    updateCartBadge();
    renderCartUI();
    // show cart offcanvas (assumes bootstrap Offcanvas attribute handled via anchor/button, programmatic show:)
    const offEl = document.getElementById('offcanvasCart');
    const off = new bootstrap.Offcanvas(offEl);
    off.show();
  };

  bsModal.show();
}

/* =======================
   Render Cart UI (offcanvas)
   ======================= */
function renderCartUI() {
  cartItemsContainer.innerHTML = '';
  if (!cart || cart.length === 0) {
    cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
    return;
  }

  let total = 0;
  cart.forEach((b, idx) => {
    total += b.price;
    const div = document.createElement('div');
    div.className = 'cart-item d-flex align-items-center justify-content-between';
    div.innerHTML = `
      <div class="d-flex align-items-center">
        <img src="${b.img}" alt="${escapeHtml(b.title)}">
        <div class="cart-info ms-2">
          <div style="font-weight:600">${escapeHtml(b.title)}</div>
          <div style="font-size:.9rem">₹${formatRs(b.price)} • ${escapeHtml(b.author)}</div>
        </div>
      </div>
      <div>
        <button class="btn btn-sm btn-outline-danger remove-item" data-idx="${idx}" aria-label="Remove ${escapeHtml(b.title)}">Remove</button>
      </div>
    `;
    cartItemsContainer.appendChild(div);
  });

  const totalDiv = document.createElement('div');
  totalDiv.className = 'mt-3';
  totalDiv.innerHTML = `
    <hr>
    <div class="d-flex justify-content-between"><strong>Total:</strong><strong>₹${formatRs(total)}</strong></div>
    <div class="mt-3"><a href="#" class="btn btn-primary w-100" id="proceedCheckout">Proceed to Checkout</a></div>
  `;
  cartItemsContainer.appendChild(totalDiv);

  // wire remove buttons
  const removeBtns = cartItemsContainer.querySelectorAll('.remove-item');
  removeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const i = Number(btn.getAttribute('data-idx'));
      if (!Number.isNaN(i)) {
        cart.splice(i, 1);
        saveCart();
        updateCartBadge();
        renderCartUI();
      }
    });
  });

  // proceed checkout click (placeholder)
  const proceed = document.getElementById('proceedCheckout');
  if (proceed) {
    proceed.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentUser) {
        alert('Please sign in to continue to checkout.');
        window.location.href = 'login.html';
        return;
      }
      alert('Checkout flow is not implemented. This is a placeholder.');
    });
  }
}

/* =======================
   Wire filter inputs and search UI
   ======================= */
function wireGlobalEvents() {
  let searchOpen = false;

  // Toggle search overlay
  toggleSearch.addEventListener('click', (e) => {
    e.preventDefault();
    searchOpen = !searchOpen;

    if (searchOpen) {
      searchWrapper.style.display = 'flex';   // show container
      requestAnimationFrame(() => {
        searchWrapper.classList.add('active'); // trigger transition
        searchBar.classList.add('expanded');   // expand input smoothly
        searchBar.focus();
      });
    } else {
      closeSearch();
    }
  });

  function closeSearch() {
    searchWrapper.classList.remove('active');
    searchBar.classList.remove('expanded');
    setTimeout(() => {
      searchWrapper.style.display = 'none';  // hide after transition
    }, 400); // match CSS transition time
    searchBar.value = '';
    currentSearch = '';
    suggestions.innerHTML = '';
    searchOpen = false;
    renderBooks(1);
  }

  // Clear button
  clearSearchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeSearch();
  });

  // Go button
  goBtn.addEventListener('click', (e) => {
    e.preventDefault();
    currentSearch = searchBar.value.trim();
    suggestions.innerHTML = '';
    renderBooks(1);
  });

  // Enter key triggers search
  searchBar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      currentSearch = searchBar.value.trim();
      suggestions.innerHTML = '';
      renderBooks(1);
    }
  });

  // Live suggestions
  searchBar.addEventListener('input', () => {
    const q = searchBar.value.trim().toLowerCase();
    suggestions.innerHTML = '';
    if (!q) return;

    const matches = books
      .filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
      .slice(0, 6);

    matches.forEach(m => {
      const div = document.createElement('div');
      div.textContent = `${m.title} — ${m.author}`;
      div.tabIndex = 0;

      div.addEventListener('click', () => {
        searchBar.value = m.title;
        currentSearch = m.title;
        suggestions.innerHTML = '';
        renderBooks(1);
      });

      div.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') div.click();
      });

      suggestions.appendChild(div);
    });
  });

  // Category checkboxes
  categoryInputs.forEach(cb => {
    cb.addEventListener('change', () => {
      const selected = Array.from(categoryInputs)
        .filter(i => i.checked)
        .map(i => i.value);
      currentFilters.categories = selected;
      renderBooks(1);
    });
  });

  // Price range real-time
  priceRange.addEventListener('input', () => {
    priceRangeValue.textContent = priceRange.value;
    currentFilters.maxPrice = priceRange.value;
    renderBooks(1);
  });
}

/* =======================
   Small utility
   ======================= */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* =======================
   Hook into login UI (optional)
   If you later set sessionStorage.setItem('currentUser', 'Santosh'), UI will behave as logged in.
   This script will not attempt to create real auth — just reflect sessionStorage.
   ======================= */
(function initLoginUI() {
  const signInLink = document.getElementById('signInLink');
  const loginNav = document.getElementById('loginNav');
  const welcomeUser = document.getElementById('welcomeUser');
  const usernameDisplay = document.getElementById('usernameDisplay');

  function refresh() {
    currentUser = sessionStorage.getItem('currentUser') || "";
    if (currentUser) {
      loginNav.classList.add('d-none');
      welcomeUser.classList.remove('d-none');
      usernameDisplay.textContent = currentUser;
    } else {
      loginNav.classList.remove('d-none');
      welcomeUser.classList.add('d-none');
    }
  }
  refresh();
  // Optionally, expose a developer helper:
  window.__loginAs = (name) => {
    sessionStorage.setItem('currentUser', name);
    refresh();
  };
})();

/* =======================
   Utility: show a console summary for quick debugging (optional)
   ======================= */
console.info(`Books script loaded. ${books.length} books available. Touch device: ${isTouch}.`);

/* =======================
   End of file
   ======================= */
