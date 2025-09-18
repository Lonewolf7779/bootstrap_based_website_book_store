// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('mainNavbar');
    if(window.scrollY > 50){
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Search toggle
const toggleSearch = document.getElementById('toggleSearch');
const searchWrapper = document.getElementById('searchWrapper');
toggleSearch.addEventListener('click', () => {
    searchWrapper.classList.toggle('show');
    const input = document.getElementById('searchBar');
    input.classList.toggle('expanded');
});

// Sample book data
const books = [
    {id:1, title:"Book One", price:120, category:"fiction", img:"https://via.placeholder.com/200x300"},
    {id:2, title:"Book Two", price:220, category:"nonfiction", img:"https://via.placeholder.com/200x300"},
    {id:3, title:"Book Three", price:150, category:"fiction", img:"https://via.placeholder.com/200x300"},
    {id:4, title:"Book Four", price:300, category:"nonfiction", img:"https://via.placeholder.com/200x300"},
];

const booksPerPage = 4;
let currentPage = 1;

// Populate books
function displayBooks(page=1){
    const container = document.getElementById("booksContainer");
    container.innerHTML = "";

    let start = (page-1)*booksPerPage;
    let end = start + booksPerPage;
    const paginatedBooks = books.slice(start,end);

    paginatedBooks.forEach(book=>{
        const card = document.createElement("div");
        card.classList.add("col-md-3","mb-4");
        card.innerHTML = `
            <div class="card book-card" data-bs-toggle="tooltip" title="Click to see details">
                <img src="${book.img}" class="card-img-top" alt="${book.title}">
                <div class="card-body">
                    <h5 class="card-title">${book.title}</h5>
                    <p class="card-text">₹${book.price}</p>
                    <button class="btn btn-primary add-to-cart">Add to Cart</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(el => new bootstrap.Tooltip(el));
}

// Pagination
function setupPagination(){
    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";
    const totalPages = Math.ceil(books.length/booksPerPage);

    for(let i=1;i<=totalPages;i++){
        const li = document.createElement("li");
        li.classList.add("page-item", i===currentPage?"active":"");
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener("click",(e)=>{
            e.preventDefault();
            currentPage = i;
            displayBooks(currentPage);
            setupPagination();
        });
        pagination.appendChild(li);
    }
}

// Add to Cart with toast & alert
document.addEventListener("click",(e)=>{
    if(e.target.classList.contains("add-to-cart")){
        const loggedIn = false; // Replace with real login check
        if(loggedIn){
            const toastEl = document.getElementById("cartToast");
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
        } else {
            alert("Please login to add books to cart!");
            window.location.href = "login.html";
        }
    }
});

// Initial Load
displayBooks();
setupPagination();
