// script.js  — full file for home.html
// Purpose:
// - Unified login/navbar behavior (uses localStorage.currentUser)
// - Cart functionality (sessionStorage 'cart')
// - Morphing search button (dot -> expanded) with suggestions & redirect to books.html?search=...
// - Quote card rotation on hover (uses a larger quotes array)
// - Navbar scroll effect
// - Keeps other UI (carousel, sections) untouched
// ---------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
  /* ===========================
     Helper / Small utilities
     =========================== */
  function qs(selector, root = document) { return root.querySelector(selector); }
  function qsa(selector, root = document) { return Array.from((root || document).querySelectorAll(selector)); }
  function safeText(s) { return String(s ?? ''); }

  /* ===========================
     NAVBAR: login state + cart visibility
     - Uses localStorage.currentUser as single source of truth
     - Cart button is hidden unless user is logged in
     =========================== */
  const navbarUserEl = qs('#navbarUser');
  const cartBtnEl = qs('#cartBtn'); // anchor that opens offcanvas cart
  function updateNavbar() {
    try {
      const currentUser = localStorage.getItem('currentUser');
      if (!navbarUserEl) return;

      if (currentUser) {
        // show Welcome user and wire logout confirmation
        navbarUserEl.innerHTML = `<a href="#" id="welcomeUser" class="nav-link text-white fs-5 fw-light">Welcome, ${escapeHtml(currentUser)}</a>`;
        if (cartBtnEl) cartBtnEl.classList.remove('d-none');

        const welcome = qs('#welcomeUser');
        if (welcome) {
          welcome.addEventListener('click', function (ev) {
            ev.preventDefault();
            const ok = confirm('Do you want to logout?');
            if (ok) {
              localStorage.removeItem('currentUser');
              // optionally clear cart or keep it — keeping it per sessionStorage
              location.reload();
            }
          });
        }
      } else {
        navbarUserEl.innerHTML = `<a href="login.html" class="nav-link text-white fs-5 fw-light">Sign in</a>`;
        if (cartBtnEl) cartBtnEl.classList.add('d-none');
      }
    } catch (err) {
      console.error('updateNavbar error', err);
    }
  }
  updateNavbar();

  /* ===========================
     NAVBAR scroll effect
     - Adds/removes #mainNavbar.scrolled class depending on hero size
     =========================== */
  const navbar = qs('#mainNavbar');
  const hero = qs('.hero-section');
  function handleNavbarScroll() {
    if (!navbar) return;
    const heroHeight = hero ? hero.offsetHeight : 0;
    const navHeight = navbar.offsetHeight || 0;
    if (window.scrollY > Math.max(0, heroHeight - navHeight - 10)) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll);
  window.addEventListener('resize', handleNavbarScroll);

  /* ===========================
     Quote card rotation
     - Uses an expanded list of quotes (40)
     - Rotates on mouseenter; also cycles every 10s (gentle autoplay)
     =========================== */
  const quotes = [
    { text: "It always seems impossible until it’s done.", author: "Nelson Mandela" },
    { text: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
    { text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Act as if what you do makes a difference. It does.", author: "William James" },
    { text: "The best way to predict the future is to create it.", author: "Peter Drucker" },
    { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { text: "Quality is not an act, it is a habit.", author: "Aristotle" },
    { text: "Everything you’ve ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Opportunities don't happen — you create them.", author: "Chris Grosser" },
    { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
    { text: "Don't be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
    { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
    { text: "The man who moves a mountain begins by carrying away small stones.", author: "Confucius" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "Whether you think you can or you think you can’t, you’re right.", author: "Henry Ford" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "If you can dream it, you can do it.", author: "Walt Disney" },
    { text: "Courage is resistance to fear, mastery of fear — not absence of fear.", author: "Mark Twain" },
    { text: "What we think, we become.", author: "Buddha" },
    { text: "The mind is everything. What you think you become.", author: "Buddha" },
    { text: "When you have a dream, you've got to grab it and never let go.", author: "Carol Burnett" },
    { text: "A goal is a dream with a deadline.", author: "Napoleon Hill" },
    { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
    { text: "The only person you are destined to become is the person you decide to be.", author: "Ralph Waldo Emerson" },
    { text: "If you want to lift yourself up, lift up someone else.", author: "Booker T. Washington" },
    { text: "We become what we think about most of the time.", author: "Earl Nightingale" },
    { text: "If you do what you always did, you will get what you always got.", author: "Tony Robbins" },
    { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
    { text: "Small deeds done are better than great deeds planned.", author: "Peter Marshall" },
    { text: "Act as if what you do makes a difference. It does.", author: "William James" },
    { text: "Keep your eyes on the stars, and your feet on the ground.", author: "Theodore Roosevelt" },
    { text: "Fill your house with stacks of books, in all the crannies and all the nooks.", author: "Dr. Seuss" }
  ];
  let quoteIndex = 0;
  const quoteCard = qs('#quote-card');
  const quoteText = qs('#quote-text');
  const quoteAuthor = qs('#quote-author');

  function showQuote(idx) {
    if (!quoteText || !quoteAuthor) return;
    const q = quotes[idx % quotes.length];
    quoteText.style.opacity = 0;
    quoteAuthor.style.opacity = 0;
    setTimeout(() => {
      quoteText.textContent = `“${q.text}”`;
      quoteAuthor.textContent = `- ${q.author}`;
      quoteText.style.opacity = 1;
      quoteAuthor.style.opacity = 1;
    }, 180);
  }

  if (quoteCard && quoteText && quoteAuthor) {
    quoteCard.addEventListener('mouseenter', () => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      showQuote(quoteIndex);
    });

    // Gentle auto-rotate every 10 seconds
    setInterval(() => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      showQuote(quoteIndex);
    }, 10000);
  }

  /* ===========================
     SEARCH: morphing dot -> expand animation and suggestions
     - CSS classes used: #searchWrapper.show, #searchBar.dot, #searchBar.expanded, #suggestions.show
     - Clicking a suggestion or pressing Go/Enter redirects to books.html?search=<title>
     =========================== */
  const toggleSearchBtn = qs('#toggleSearch');
  const searchWrapper = qs('#searchWrapper');
  const searchBar = qs('#searchBar');
  const suggestionsDiv = qs('#suggestions');
  const goBtn = qs('#goBtn');

  // Full book list used for home suggestions (keep synchronized with books.js)
  // 36 titles (objects with title + author)
  const booksList = [
    { title: "Atomic Habits", author: "James Clear" },
    { title: "The Alchemist", author: "Paulo Coelho" },
    { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki" },
    { title: "Thinking, Fast and Slow", author: "Daniel Kahneman" },
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald" },
    { title: "Moby Dick", author: "Herman Melville" },
    { title: "Brave New World", author: "Aldous Huxley" },
    { title: "The Catcher in the Rye", author: "J.D. Salinger" },
    { title: "Jane Eyre", author: "Charlotte Brontë" },
    { title: "Sapiens", author: "Yuval Noah Harari" },
    { title: "Educated", author: "Tara Westover" },
    { title: "The Wright Brothers", author: "David McCullough" },
    { title: "Becoming", author: "Michelle Obama" },
    { title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot" },
    { title: "Quiet", author: "Susan Cain" },
    { title: "Into the Wild", author: "Jon Krakauer" },
    { title: "Freakonomics", author: "Steven D. Levitt & Stephen J. Dubner" },
    { title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey" },
    { title: "How to Win Friends and Influence People", author: "Dale Carnegie" },
    { title: "The Power of Habit", author: "Charles Duhigg" },
    { title: "Mindset", author: "Carol S. Dweck" },
    { title: "Grit", author: "Angela Duckworth" },
    { title: "You Are a Badass", author: "Jen Sincero" },
    { title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson" },
    { title: "Drive", author: "Daniel H. Pink" },
    { title: "A Brief History of Time", author: "Stephen Hawking" },
    { title: "The Gene", author: "Siddhartha Mukherjee" },
    { title: "The Innovators", author: "Walter Isaacson" },
    { title: "Cosmos", author: "Carl Sagan" },
    { title: "The Wright Way", author: "David McCullough" },
    { title: "Deep Work", author: "Cal Newport" },
    { title: "Clean Code", author: "Robert C. Martin" },
    { title: "The Pragmatic Programmer", author: "Andrew Hunt & David Thomas" },
    { title: "Artificial Intelligence Basics", author: "Tom Taulli" },
    { title: "Zero to One", author: "Peter Thiel" }
  ];

  // animation timers (so we can cancel/clear)
  let _dotTimer = null;
  let _expandTimer = null;
  let _closeTimer = null;
  let searchOpen = false;

  function openSearchAnimated() {
    if (!searchWrapper || !searchBar) return;
    if (searchOpen) return;
    searchOpen = true;

    // show wrapper for transition
    searchWrapper.style.display = 'flex';
    // small delay to allow layout
    requestAnimationFrame(() => {
      searchWrapper.classList.add('show');
    });

    // start dot then expand sequence
    clearTimeout(_dotTimer); clearTimeout(_expandTimer); clearTimeout(_closeTimer);
    // ensure classes clean
    searchBar.classList.remove('expanded', 'dot');
    // dot after 80ms
    _dotTimer = setTimeout(() => {
      searchBar.classList.add('dot');
      // expand after 280ms
      _expandTimer = setTimeout(() => {
        searchBar.classList.add('expanded');
        // focus for typing
        try { searchBar.focus(); searchBar.setSelectionRange(searchBar.value.length, searchBar.value.length); } catch (e) {}
      }, 280);
    }, 80);
  }

  function closeSearchAnimated() {
    if (!searchWrapper || !searchBar) return;
    if (!searchOpen) return;

    clearTimeout(_dotTimer); clearTimeout(_expandTimer);
    // remove expanded first (reverse of expand)
    searchBar.classList.remove('expanded');
    // hide suggestions
    if (suggestionsDiv) { suggestionsDiv.innerHTML = ''; suggestionsDiv.classList.remove('show'); }
    // after transition, remove dot and hide wrapper
    _closeTimer = setTimeout(() => {
      searchBar.classList.remove('dot');
      searchWrapper.classList.remove('show');
      // small delay then hide (keeps the transition neat)
      setTimeout(() => { searchWrapper.style.display = 'none'; }, 80);
      searchOpen = false;
    }, 300); // match CSS transition times
  }

  // Toggle handler
  if (toggleSearchBtn) {
    toggleSearchBtn.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (!searchOpen) openSearchAnimated();
      else closeSearchAnimated();
    });
  }

  // Build suggestions list (keyboard & click)
  function buildSuggestions(query) {
    if (!suggestionsDiv) return;
    suggestionsDiv.innerHTML = '';
    if (!query || !query.trim()) {
      suggestionsDiv.classList.remove('show');
      return;
    }
    const q = query.trim().toLowerCase();
    const matches = booksList.filter(b => (b.title && b.title.toLowerCase().includes(q)) || (b.author && b.author.toLowerCase().includes(q))).slice(0, 8);
    if (matches.length === 0) {
      suggestionsDiv.classList.remove('show');
      return;
    }

    matches.forEach((m, idx) => {
      const item = document.createElement('div');
      item.className = 'list-group-item suggestion-item';
      item.setAttribute('role', 'option');
      item.setAttribute('tabindex', '0');
      item.innerHTML = `<strong>${escapeHtml(m.title)}</strong><div style="font-size:.85rem;color:#666">${escapeHtml(m.author)}</div>`;
      // click -> redirect to books.html?search=title
      item.addEventListener('click', () => {
        const dest = `books.html?search=${encodeURIComponent(safeText(m.title))}`;
        // small UX: close animation then navigate
        closeSearchAnimated();
        setTimeout(() => window.location.href = dest, 180);
      });
      // keyboard accessibility: Enter key
      item.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter') {
          ev.preventDefault();
          item.click();
        }
      });
      suggestionsDiv.appendChild(item);
    });

    // make suggestions visible (CSS .show)
    suggestionsDiv.classList.add('show');
  }

  if (searchBar) {
    searchBar.addEventListener('input', (e) => {
      buildSuggestions(e.target.value || '');
    });

    // Enter key -> redirect to books.html?search=value
    searchBar.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const val = (searchBar.value || '').trim();
        if (val) {
          closeSearchAnimated();
          setTimeout(() => {
            window.location.href = `books.html?search=${encodeURIComponent(val)}`;
          }, 160);
        }
      } else if (e.key === 'Escape') {
        closeSearchAnimated();
      }
    });
  }

  if (goBtn) {
    goBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      const val = (searchBar && searchBar.value || '').trim();
      if (!val) return;
      closeSearchAnimated();
      setTimeout(() => {
        window.location.href = `books.html?search=${encodeURIComponent(val)}`;
      }, 160);
    });
  }

  // Close search if clicked outside
  document.addEventListener('click', (ev) => {
    const target = ev.target;
    if (!searchWrapper || !toggleSearchBtn) return;
    if (searchOpen && !searchWrapper.contains(target) && target !== toggleSearchBtn && !toggleSearchBtn.contains(target)) {
      closeSearchAnimated();
    }
  });

  /* ===========================
     CART: sessionStorage-backed cart + UI rendering
     - getCart / saveCart
     - renderCartUI populates #cartItems and updates #cartCount
     - Exposes window.addToCart(bookObject)
     =========================== */
  const cartItemsContainer = qs('#cartItems');
  const cartCountBadge = qs('#cartCount');
  const proceedBtn = qs('#proceedCheckout');

  function getCart() {
    try {
      return JSON.parse(sessionStorage.getItem('cart') || '[]');
    } catch (e) {
      console.warn('bad cart JSON, clearing');
      sessionStorage.removeItem('cart');
      return [];
    }
  }
  function saveCart(cart) {
    try { sessionStorage.setItem('cart', JSON.stringify(cart)); } catch (e) { console.error('Failed to save cart', e); }
  }
  function updateCartBadge() {
    if (!cartCountBadge) return;
    const cart = getCart();
    cartCountBadge.textContent = cart.length;
  }

  function renderCartUI() {
    if (!cartItemsContainer) return;
    const cart = getCart();
    cartItemsContainer.innerHTML = '';

    if (!cart || cart.length === 0) {
      const li = document.createElement('li');
      li.className = 'list-group-item text-muted';
      li.textContent = 'Your cart is empty';
      cartItemsContainer.appendChild(li);
      updateCartBadge();
      return;
    }

    // render each item
    cart.forEach((b, idx) => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex align-items-center justify-content-between';
      const imgHtml = b.img ? `<img src="${escapeHtml(b.img)}" alt="${escapeHtml(b.title)}" style="width:48px;height:auto;object-fit:cover;">` : '';
      li.innerHTML = `
        <div class="d-flex align-items-center">
          ${imgHtml}
          <div class="ms-2">
            <div style="font-weight:600">${escapeHtml(b.title)}</div>
            <div style="font-size:.85rem;color:#666">₹${b.price ? Number(b.price).toLocaleString('en-IN') : '0'} • ${escapeHtml(b.author || '')}</div>
          </div>
        </div>
        <div>
          <button class="btn btn-sm btn-outline-danger remove-item" data-idx="${idx}" aria-label="Remove">Remove</button>
        </div>
      `;
      cartItemsContainer.appendChild(li);
    });

    // total and proceed
    const total = cart.reduce((s, it) => s + (Number(it.price) || 0), 0);
    const footerLi = document.createElement('li');
    footerLi.className = 'list-group-item';
    footerLi.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <strong>Total:</strong><strong>₹${Number(total).toLocaleString('en-IN')}</strong>
      </div>
      <div class="mt-3">
        <button id="proceedCheckoutLocal" class="btn btn-dark w-100">Proceed to Checkout</button>
      </div>
    `;
    cartItemsContainer.appendChild(footerLi);

    // wire remove buttons
    qsa('.remove-item', cartItemsContainer).forEach(btn => {
      btn.addEventListener('click', () => {
        const i = Number(btn.getAttribute('data-idx'));
        if (Number.isNaN(i)) return;
        const c = getCart();
        c.splice(i, 1);
        saveCart(c);
        renderCartUI();
        updateCartBadge();
      });
    });

    // wire proceed button inside rendered UI
    const proceedLocal = qs('#proceedCheckoutLocal');
    if (proceedLocal) {
      proceedLocal.addEventListener('click', function (ev) {
        ev.preventDefault();
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) {
          alert('Please sign in to continue to checkout.');
          window.location.href = 'login.html';
          return;
        }
        // placeholder behaviour
        proceedLocal.disabled = true;
        proceedLocal.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...`;
        setTimeout(() => {
          proceedLocal.disabled = false;
          proceedLocal.innerHTML = 'Proceed to Checkout';
          alert('Checkout flow is not implemented. This is a placeholder.');
        }, 1500);
      });
    }

    updateCartBadge();
  }

  // expose global for other pages/components to use (books.js can call window.addToCart(book))
  window.addToCart = function (book) {
    if (!book || !book.title) {
      console.warn('addToCart called with invalid book', book);
      return;
    }
    // require login to add to cart
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      // small UX: ask to login
      alert('Please sign in to add items to cart.');
      window.location.href = 'login.html';
      return;
    }
    const cart = getCart();
    cart.push(book);
    saveCart(cart);
    renderCartUI();
    updateCartBadge();

    // try to show a toast if exists
    const toastEl = qs('#cartToast');
    if (toastEl && window.bootstrap && bootstrap.Toast) {
      try { new bootstrap.Toast(toastEl).show(); } catch (e) {}
    }
  };

  // initial cart render
  renderCartUI();
  updateCartBadge();

  /* ===========================
     Proceed button (if you also have #proceedCheckout outside of list)
     This is just an extra safety/wire in case your HTML uses a dedicated proceed button.
     =========================== */
  if (proceedBtn) {
    proceedBtn.addEventListener('click', (ev) => {
      ev.preventDefault();
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        alert('Please sign in to continue to checkout.');
        window.location.href = 'login.html';
        return;
      }
      proceedBtn.disabled = true;
      proceedBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Processing...`;
      setTimeout(() => {
        proceedBtn.disabled = false;
        proceedBtn.innerHTML = 'Proceed to Checkout';
        alert('Checkout flow is not implemented. This is a placeholder.');
      }, 1500);
    });
  }

  /* ===========================
     Accessibility niceties: keyboard handling for search & suggestions
     - Up/Down to move between suggestions
     - Enter on suggestion triggers it (handled above)
     =========================== */
  (function suggestionKeyboardNav() {
    let focusedIndex = -1;
    document.addEventListener('keydown', (ev) => {
      if (!searchOpen) return;
      if (!suggestionsDiv || !suggestionsDiv.classList.contains('show')) return;

      const items = qsa('.suggestion-item', suggestionsDiv);
      if (!items.length) return;

      if (ev.key === 'ArrowDown') {
        ev.preventDefault();
        focusedIndex = Math.min(items.length - 1, focusedIndex + 1);
        items.forEach((it, i) => it.classList.toggle('active', i === focusedIndex));
        items[focusedIndex].focus();
      } else if (ev.key === 'ArrowUp') {
        ev.preventDefault();
        focusedIndex = Math.max(0, focusedIndex - 1);
        items.forEach((it, i) => it.classList.toggle('active', i === focusedIndex));
        items[focusedIndex].focus();
      } else if (ev.key === 'Escape') {
        closeSearchAnimated();
      }
    });
  })();

  /* ===========================
     Safety: expose a small developer helper to simulate login during dev
     (optional) - you can remove this if you want
     =========================== */
  window.__loginAs = (name) => {
    if (!name) return;
    localStorage.setItem('currentUser', String(name));
    updateNavbar();
    // show cart if present
    if (cartBtnEl) cartBtnEl.classList.remove('d-none');
  };

  /* ===========================
     Utility: escape HTML (small helper)
     =========================== */
  function escapeHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  /* ===========================
     DEBUG INFO (console)
     =========================== */
  console.info('script.js initialized — navbar/login/cart/search wired.');
});
