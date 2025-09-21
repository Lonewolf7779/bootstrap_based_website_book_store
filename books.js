// books.js
// Integrated script for books.html
// ------------------------------------------------------------------

/* =======================
   Configuration & Data
   ======================= */
const booksPerPage = 12;
const categories = ["fiction", "non-fiction", "self-help", "science-tech"];

// Full 36 books dataset
const books = [
  {
    id: 1,
    title: "Atomic Habits",
    author: "James Clear",
    price: 499,
    category: "self-help",
    img: "https://images-na.ssl-images-amazon.com/images/I/51-nXsSRfZL._SX329_BO1,204,203,200_.jpg",
    description: "An easy & proven way to build good habits & break bad ones."
  },
  {
    id: 2,
    title: "The Alchemist",
    author: "Paulo Coelho",
    price: 399,
    category: "fiction",
    img: "https://images-na.ssl-images-amazon.com/images/I/51Z0nLAfLmL._SX320_BO1,204,203,200_.jpg",
    description: "A novel about following your dreams and listening to your heart."
  },
  {
    id: 3,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    price: 349,
    category: "self-help",
    img: "https://images-na.ssl-images-amazon.com/images/I/51x5d4sN6vL._SX329_BO1,204,203,200_.jpg",
    description: "A guide to financial literacy and wealth building."
  },
  {
    id: 4,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    price: 599,
    category: "science-tech",
    img: "https://images-na.ssl-images-amazon.com/images/I/41o2TR-6bHL._SX322_BO1,204,203,200_.jpg",
    description: "Insights into how our mind works, slow thinking vs fast thinking."
  },
  { id: 5, title: "The Great Gatsby", author: "F. Scott Fitzgerald", price: 219, category: "fiction", img: "https://picsum.photos/seed/book5/400/600", description: "A tale of wealth, love, and the American dream in the Roaring Twenties." },
  { id: 6, title: "Moby Dick", author: "Herman Melville", price: 269, category: "fiction", img: "https://picsum.photos/seed/book6/400/600", description: "An epic sea adventure of obsession and revenge." },
  { id: 7, title: "Brave New World", author: "Aldous Huxley", price: 249, category: "fiction", img: "https://picsum.photos/seed/book7/400/600", description: "A futuristic dystopia exploring technology, control, and human nature." },
  { id: 8, title: "The Catcher in the Rye", author: "J.D. Salinger", price: 199, category: "fiction", img: "https://picsum.photos/seed/book8/400/600", description: "A teenage rebellion story highlighting identity and alienation." },
  { id: 9, title: "Jane Eyre", author: "Charlotte Brontë", price: 229, category: "fiction", img: "https://picsum.photos/seed/book9/400/600", description: "A gothic romance and tale of a strong, independent woman." },

  // Non-Fiction
  { id: 10, title: "Sapiens", author: "Yuval Noah Harari", price: 399, category: "non-fiction", img: "https://picsum.photos/seed/book10/400/600", description: "A brief history of humankind, exploring evolution and culture." },
  { id: 11, title: "Educated", author: "Tara Westover", price: 349, category: "non-fiction", img: "https://picsum.photos/seed/book11/400/600", description: "A memoir of growing up in a strict family and pursuing education." },
  { id: 12, title: "The Wright Brothers", author: "David McCullough", price: 299, category: "non-fiction", img: "https://picsum.photos/seed/book12/400/600", description: "The inspiring story of the pioneers of aviation." },
  { id: 13, title: "Becoming", author: "Michelle Obama", price: 399, category: "non-fiction", img: "https://picsum.photos/seed/book13/400/600", description: "A memoir reflecting on life, career, and the White House." },
  { id: 14, title: "The Immortal Life of Henrietta Lacks", author: "Rebecca Skloot", price: 329, category: "non-fiction", img: "https://picsum.photos/seed/book14/400/600", description: "The story behind the HeLa cells that changed medicine." },
  { id: 15, title: "Quiet", author: "Susan Cain", price: 279, category: "non-fiction", img: "https://picsum.photos/seed/book15/400/600", description: "The power of introverts in a world that can't stop talking." },
  { id: 16, title: "Into the Wild", author: "Jon Krakauer", price: 259, category: "non-fiction", img: "https://picsum.photos/seed/book16/400/600", description: "A true story of adventure, risk, and self-discovery." },
  { id: 17, title: "Freakonomics", author: "Steven D. Levitt & Stephen J. Dubner", price: 229, category: "non-fiction", img: "https://picsum.photos/seed/book17/400/600", description: "Exploring the hidden side of everything using economics and data." },
  { id: 18, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", price: 389, category: "non-fiction", img: "https://picsum.photos/seed/book18/400/600", description: "Insights into human decision-making and cognitive biases." },

  // Self-Help
  { id: 19, title: "Atomic Habits", author: "James Clear", price: 299, category: "self-help", img: "https://picsum.photos/seed/book19/400/600", description: "A guide to building good habits and breaking bad ones." },
  { id: 20, title: "The 7 Habits of Highly Effective People", author: "Stephen R. Covey", price: 349, category: "self-help", img: "https://picsum.photos/seed/book20/400/600", description: "Principles for personal and professional effectiveness." },
  { id: 21, title: "How to Win Friends and Influence People", author: "Dale Carnegie", price: 199, category: "self-help", img: "https://picsum.photos/seed/book21/400/600", description: "Timeless techniques for communication and persuasion." },
  { id: 22, title: "The Power of Habit", author: "Charles Duhigg", price: 279, category: "self-help", img: "https://picsum.photos/seed/book22/400/600", description: "Understanding the science behind habits and how to change them." },
  { id: 23, title: "Mindset", author: "Carol S. Dweck", price: 319, category: "self-help", img: "https://picsum.photos/seed/book23/400/600", description: "The psychology of growth vs fixed mindset and personal success." },
  { id: 24, title: "Grit", author: "Angela Duckworth", price: 289, category: "self-help", img: "https://picsum.photos/seed/book24/400/600", description: "Why passion and perseverance are key to achievement." },
  { id: 25, title: "You Are a Badass", author: "Jen Sincero", price: 249, category: "self-help", img: "https://picsum.photos/seed/book25/400/600", description: "A motivational guide to embracing your inner power." },
  { id: 26, title: "The Subtle Art of Not Giving a F*ck", author: "Mark Manson", price: 299, category: "self-help", img: "https://picsum.photos/seed/book26/400/600", description: "A counterintuitive approach to living a good life." },
  { id: 27, title: "Drive", author: "Daniel H. Pink", price: 269, category: "self-help", img: "https://picsum.photos/seed/book27/400/600", description: "The surprising truth about motivation and what drives us." },

  // Science & Tech
  { id: 28, title: "A Brief History of Time", author: "Stephen Hawking", price: 399, category: "science-tech", img: "https://picsum.photos/seed/book28/400/600", description: "Exploring the universe, black holes, and the nature of time." },
  { id: 29, title: "The Gene", author: "Siddhartha Mukherjee", price: 359, category: "science-tech", img: "https://picsum.photos/seed/book29/400/600", description: "An exploration of genetics and human heredity." },
  { id: 30, title: "The Innovators", author: "Walter Isaacson", price: 329, category: "science-tech", img: "https://picsum.photos/seed/book30/400/600", description: "The history of technology and the people who made it possible." },
  { id: 31, title: "Cosmos", author: "Carl Sagan", price: 379, category: "science-tech", img: "https://picsum.photos/seed/book31/400/600", description: "A journey through space, science, and the human mind." },
  { id: 32, title: "The Wright Way", author: "David McCullough", price: 289, category: "science-tech", img: "https://picsum.photos/seed/book32/400/600", description: "Engineering feats and innovations that changed the world." },
  { id: 33, title: "Deep Work", author: "Cal Newport", price: 319, category: "science-tech", img: "https://picsum.photos/seed/book33/400/600", description: "Focus, productivity, and mastering the art of deep work." },
  { id: 34, title: "Clean Code", author: "Robert C. Martin", price: 349, category: "science-tech", img: "https://picsum.photos/seed/book34/400/600", description: "A handbook of best practices for writing maintainable code." },
  { id: 35, title: "The Pragmatic Programmer", author: "Andrew Hunt & David Thomas", price: 329, category: "science-tech", img: "https://picsum.photos/seed/book35/400/600", description: "Principles for effective and pragmatic software development." },
  { id: 36, title: "Artificial Intelligence Basics", author: "Tom Taulli", price: 299, category: "science-tech", img: "https://picsum.photos/seed/book36/400/600", description: "An introductory guide to AI and its real-world applications." }
];

function cap(s){ return s.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase()); }

/* =======================
   State
   ======================= */
let currentPage = 1;
let currentSearch = "";
let currentFilters = { categories: [], maxPrice: null };
let isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0);

let cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
let currentUser = sessionStorage.getItem('currentUser') || "";

/* =======================
   DOM Refs
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

const cartNav = document.getElementById('cartNav');
const cartCount = document.getElementById('cartCount');
const cartItemsContainer = document.getElementById('cartItems');

const bookModalEl = document.getElementById('bookModal');
const bsModal = new bootstrap.Modal(bookModalEl);
const modalTitle = document.getElementById('bookModalLabel');
const modalBody = bookModalEl.querySelector('.modal-body');
const modalAddCart = document.getElementById('modalAddCart');
const modalBuyNow = document.getElementById('modalBuyNow');

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
   Navbar User Update
   ======================= */
function updateNavbarUser() {
  const signInLink = document.getElementById('signInLink');
  const loginNav = document.getElementById('loginNav');
  const welcomeUser = document.getElementById('welcomeUser');
  const usernameDisplay = document.getElementById('usernameDisplay');

  currentUser = sessionStorage.getItem('currentUser') || "";
  if (currentUser) {
    loginNav.classList.add('d-none');
    welcomeUser.classList.remove('d-none');
    usernameDisplay.textContent = currentUser;
    cartNav.classList.remove('d-none');
    document.getElementById("welcomeUser").addEventListener("click", (e) => {
      e.preventDefault();
      if (confirm("Do you want to logout?")) {
        sessionStorage.removeItem("currentUser");
        location.reload();
      }
    });
  } else {
    loginNav.classList.remove('d-none');
    welcomeUser.classList.add('d-none');
    cartNav.classList.add('d-none');
  }
}

/* =======================
   Initialize
   ======================= */
(function init() {
  const maxPrice = Math.max(...books.map(b => b.price));
  const sliderMax = Math.max(maxPrice, Number(priceRange.max || 1000));
  priceRange.max = sliderMax;
  priceRange.value = sliderMax;
  priceRangeValue.textContent = sliderMax;
  currentFilters.maxPrice = sliderMax;

  updateNavbarUser();
  updateCartBadge();
  renderCartUI();
  renderBooks(1);
  wireGlobalEvents();
})();

/* =======================
   Render Books
   ======================= */
function renderBooks(page = 1) {
  currentPage = page;
  booksContainer.innerHTML = '';

  let filtered = books.slice();

  if (currentSearch && currentSearch.trim() !== '') {
    const q = currentSearch.trim().toLowerCase();
    filtered = filtered.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }

  if (currentFilters.categories && currentFilters.categories.length > 0) {
    filtered = filtered.filter(b => currentFilters.categories.includes(b.category));
  }

  if (currentFilters.maxPrice !== null && currentFilters.maxPrice !== undefined) {
    filtered = filtered.filter(b => b.price <= Number(currentFilters.maxPrice));
  }

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / booksPerPage));
  if (page > totalPages) page = totalPages, currentPage = page;

  const start = (page - 1) * booksPerPage;
  const slice = filtered.slice(start, start + booksPerPage);

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
    card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openModalForBook(book); });
    card.addEventListener('click', () => openModalForBook(book));
  });

  renderPagination(totalPages, page);
}

/* =======================
   Pagination
   ======================= */
function renderPagination(totalPages, activePage) {
  pagination.innerHTML = '';
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
   Modal
   ======================= */
let lastOpenedBookId = null;
function openModalForBook(book) {
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

  modalAddCart.onclick = () => {
    if (!currentUser) {
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
    cart.push(book);
    saveCart();
    updateCartBadge();
    renderCartUI();
    const offEl = document.getElementById('offcanvasCart');
    const off = new bootstrap.Offcanvas(offEl);
    off.show();
  };

  bsModal.show();
}

/* =======================
   Cart UI
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

  cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = Number(btn.getAttribute('data-idx'));
      if (!Number.isNaN(i)) {
        cart.splice(i, 1);
        saveCart();
        updateCartBadge();
        renderCartUI();
      }
    });
  });

  const proceed = document.getElementById('proceedCheckout');
  if (proceed) {
    proceed.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentUser) {
        alert('Please sign in to continue to checkout.');
        window.location.href = 'login.html';
        return;
      }
      proceed.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Processing...`;
      proceed.disabled = true;
      setTimeout(() => {
        proceed.innerHTML = "Proceed to Checkout";
        proceed.disabled = false;
        alert("Checkout flow is not fully implemented. This is just a placeholder.");
      }, 2000);
    });
  }
}
// Handle search param from URL
const urlParams = new URLSearchParams(window.location.search);
const initialSearch = urlParams.get("search");
if (initialSearch) {
  currentSearch = initialSearch;
  searchBar.value = initialSearch;
  renderBooks(1);
}


/* =======================
   Search, Filters
   ======================= */
function wireGlobalEvents() {
  let searchOpen = false;

  toggleSearch.addEventListener('click', (e) => {
    e.preventDefault();
    searchOpen = !searchOpen;
    if (searchOpen) {
      searchWrapper.style.display = 'flex';
      requestAnimationFrame(() => {
        searchWrapper.classList.add('active');
        searchBar.classList.add('expanded');
        searchBar.focus();
      });
    } else closeSearch();
  });

  function closeSearch() {
    searchWrapper.classList.remove('active');
    searchBar.classList.remove('expanded');
    setTimeout(() => { searchWrapper.style.display = 'none'; }, 400);
    searchBar.value = '';
    currentSearch = '';
    suggestions.innerHTML = '';
    searchOpen = false;
    renderBooks(1);
  }

  clearSearchBtn.addEventListener('click', (e) => { e.preventDefault(); closeSearch(); });
  goBtn.addEventListener('click', (e) => { e.preventDefault(); currentSearch = searchBar.value.trim(); suggestions.innerHTML = ''; renderBooks(1); });
  searchBar.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); currentSearch = searchBar.value.trim(); suggestions.innerHTML = ''; renderBooks(1); } });

  searchBar.addEventListener('input', () => {
    const q = searchBar.value.trim().toLowerCase();
    suggestions.innerHTML = '';
    if (!q) return;
    const matches = books.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)).slice(0, 6);
    matches.forEach(m => {
      const div = document.createElement('div');
      div.textContent = `${m.title} — ${m.author}`;
      div.tabIndex = 0;
      div.addEventListener('click', () => { searchBar.value = m.title; currentSearch = m.title; suggestions.innerHTML = ''; renderBooks(1); });
      div.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') div.click(); });
      suggestions.appendChild(div);
    });
  });

  categoryInputs.forEach(cb => {
    cb.addEventListener('change', () => {
      currentFilters.categories = Array.from(categoryInputs).filter(i => i.checked).map(i => i.value);
      renderBooks(1);
    });
  });

  priceRange.addEventListener('input', () => {
    priceRangeValue.textContent = priceRange.value;
    currentFilters.maxPrice = priceRange.value;
    renderBooks(1);
  });
}

/* =======================
   Utilities
   ======================= */
function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

console.info(`Books script loaded. ${books.length} books available. Touch device: ${isTouch}.`);
