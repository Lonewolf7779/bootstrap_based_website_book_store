document.addEventListener('DOMContentLoaded', function () {
  // ---------------- Navbar scroll effect ----------------
  const navbar = document.getElementById('mainNavbar'); // 👈 targets the navbar added id
  const hero = document.querySelector('.hero-section');

  function handleNavbarScroll() {
    if (!navbar) return;
    const heroHeight = hero ? hero.offsetHeight : 0;
    const navHeight = navbar.offsetHeight || 0;
    // when we've scrolled past the hero section, add 'scrolled'
    if (window.scrollY > Math.max(0, heroHeight - navHeight - 10)) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // run on load and on scroll/resize
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll);
  window.addEventListener('resize', handleNavbarScroll);

  // ---------------- Quote hover logic ----------------
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
    { text: "Your time is limited, so don’t waste it living someone else’s life.", author: "Steve Jobs" },
    { text: "Don’t be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
    { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
    { text: "Opportunities don't happen. You create them.", author: "Chris Grosser" },
    { text: "Dream big and dare to fail.", author: "Norman Vaughan" },
    { text: "Don’t let yesterday take up too much of today.", author: "Will Rogers" },
    { text: "You miss 100% of the shots you don’t take.", author: "Wayne Gretzky" },
    { text: "The harder you work for something, the greater you’ll feel when you achieve it.", author: "Unknown" },
    { text: "Dream it. Wish it. Do it.", author: "Unknown" },
    { text: "Success doesn’t just find you. You have to go out and get it.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Sometimes we’re tested not to show our weaknesses, but to discover our strengths.", author: "Unknown" },
    { text: "The key to success is to focus on goals, not obstacles.", author: "Unknown" },
    { text: "Don’t wait for opportunity. Create it.", author: "Unknown" },
    { text: "Little things make big days.", author: "Unknown" },
    { text: "It’s going to be hard, but hard does not mean impossible.", author: "Unknown" },
    { text: "Don’t stop when you’re tired. Stop when you’re done.", author: "Unknown" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Success is not how high you have climbed, but how you make a positive difference to the world.", author: "Roy T. Bennett" }
  ];

  let currentIndex = 0;
  const quoteCard = document.getElementById('quote-card');
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');

  if (quoteCard && quoteText && quoteAuthor) {
    quoteCard.addEventListener('mouseenter', () => {
      currentIndex = (currentIndex + 1) % quotes.length;

      // fade-out -> update -> fade-in
      quoteText.style.opacity = 0;
      quoteAuthor.style.opacity = 0;

      setTimeout(() => {
        quoteText.textContent = `“${quotes[currentIndex].text}”`;
        quoteAuthor.textContent = `- ${quotes[currentIndex].author}`;
        quoteText.style.opacity = 1;
        quoteAuthor.style.opacity = 1;
      }, 180);
    });
  }

});
