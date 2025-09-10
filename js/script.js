// Toggle class active untuk hamburger menu
const navbarNav = document.querySelector('.navbar-nav');
document.querySelector('#hamburger-menu').onclick = () => {
  navbarNav.classList.toggle('active');
};

// Toggle class active untuk search form
const searchForm = document.querySelector('.search-form');
const searchBox = document.querySelector('#search-box');
document.querySelector('#search-button').onclick = (e) => {
  searchForm.classList.toggle('active');
  searchBox.focus();
  e.preventDefault();
};

// Toggle class active untuk shopping cart
const shoppingCart = document.querySelector('.shopping-cart');
document.querySelector('#shopping-cart-button').onclick = (e) => {
  shoppingCart.classList.toggle('active');
  e.preventDefault();
};

// Klik di luar elemen
const hm = document.querySelector('#hamburger-menu');
const sb = document.querySelector('#search-button');
const sc = document.querySelector('#shopping-cart-button');
document.addEventListener('click', function (e) {
  if (!hm.contains(e.target) && !navbarNav.contains(e.target)) {
    navbarNav.classList.remove('active');
  }
  if (!sb.contains(e.target) && !searchForm.contains(e.target)) {
    searchForm.classList.remove('active');
  }
  if (!sc.contains(e.target) && !shoppingCart.contains(e.target)) {
    shoppingCart.classList.remove('active');
  }
});

// Modal Box
const itemDetailModal = document.querySelector('#item-detail-modal');
const itemDetailButtons = document.querySelectorAll('.item-detail-button');
itemDetailButtons.forEach((btn) => {
  btn.onclick = (e) => {
    itemDetailModal.style.display = 'flex';
    e.preventDefault();
  };
});

// klik tombol close modal
document.querySelector('.modal .close-icon').onclick = (e) => {
  itemDetailModal.style.display = 'none';
  e.preventDefault();
};

// Modal item detail
const modal = document.getElementById('item-detail-modal');
const modalImg = modal.querySelector('.modal-content img');
const modalTitle = modal.querySelector('.product-content h3');
const modalDesc = modal.querySelector('.product-content p');
const modalPrice = modal.querySelector('.product-price');

let lastClickedMenuCard = null;

// Saat gambar menu diklik, simpan referensi menu-card
document.querySelectorAll('.menu-card-img.item-detail-button').forEach(img => {
  img.addEventListener('click', function() {
    lastClickedMenuCard = img.closest('.menu-card');
    modal.style.display = 'block';
    modalImg.src = img.src;
    modalTitle.textContent = img.getAttribute('data-title') || 'Menu Detail';
    modalDesc.textContent = img.getAttribute('data-desc') || '';
    modalPrice.textContent = img.getAttribute('data-price') || '';
  });
});

// Optional: klik di luar modal untuk close
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Fitur Search Menu
const menuCards = document.querySelectorAll('.menu-card');
searchBox.addEventListener('input', function() {
  const keyword = this.value.toLowerCase();
  menuCards.forEach(card => {
    const title = card.querySelector('.menu-card-title')?.textContent.toLowerCase() || '';
    const desc = card.querySelector('.menu-card-img')?.getAttribute('data-desc')?.toLowerCase() || '';
    if (title.includes(keyword) || desc.includes(keyword)) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
});
searchBox.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') {
    e.preventDefault();
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

document.getElementById('buy-btn').onclick = function() {
  alert('Terima kasih sudah membeli!');
};


// Fitur Add to Cart
const addToCartBtn = document.querySelector('.modal-content a');
const cartContainer = document.querySelector('.shopping-cart');

function addCartItem(imgSrc, title, price) {
  const cartItem = document.createElement('div');
  cartItem.className = 'cart-item';
  cartItem.innerHTML = `
    <img src="${imgSrc}" alt="${title}">
    <div class="item-detail">
      <h3>${title}</h3>
      <div class="item-price">${price}</div>
    </div>
    <i data-feather="trash-2" class="remove-item"></i>
  `;
  cartContainer.appendChild(cartItem);
  feather.replace();
  updateCartBadge();
  updateCartTotal();
  showCartSuccessNotif();
}

document.getElementById('buy-btn').onclick = function() {
  alert('Terima kasih sudah membeli!');
};

// Add to cart dari modal
addToCartBtn.addEventListener('click', function(e) {
  e.preventDefault();
  let price = '', title = '', imgSrc = '';
  if (lastClickedMenuCard) {
    price = lastClickedMenuCard.querySelector('.menu-card-price').textContent;
    title = lastClickedMenuCard.querySelector('.menu-card-title').textContent;
    imgSrc = lastClickedMenuCard.querySelector('img').src;
  } else {
    imgSrc = modalImg.src;
    title = modalTitle.textContent;
    price = modalPrice.textContent;
  }
  addCartItem(imgSrc, title, price);
  modal.style.display = 'none';
});

// Add to cart dari produk section
document.querySelectorAll('.add-to-cart-product').forEach(btn => {
  btn.addEventListener('click', function(e) {
    e.preventDefault();
    const productCard = btn.closest('.product-card');
    const imgSrc = productCard.querySelector('.product-image img').src;
    const title = productCard.querySelector('.product-content h2').textContent;
    const price = productCard.querySelector('.product-price').childNodes[0].textContent.trim();
    addCartItem(imgSrc, title, price);
  });
});

// Hapus item dari cart
cartContainer.addEventListener('click', function(e) {
  if (e.target.classList.contains('remove-item')) {
    e.target.parentElement.remove();
    updateCartBadge();
    updateCartTotal();
  }
});

// Update badge jumlah cart
function updateCartBadge() {
  const cartBadge = document.getElementById('cart-badge');
  const cartCount = document.querySelectorAll('.shopping-cart .cart-item').length;
  if (cartBadge) {
    cartBadge.textContent = cartCount;
    cartBadge.style.display = cartCount > 0 ? 'inline-block' : 'none';
  }
}

// Update total harga cart
function updateCartTotal() {
  const cartItems = document.querySelectorAll('.shopping-cart .cart-item .item-price');
  let total = 0;
  cartItems.forEach(item => {
    const priceText = item.textContent.replace(/[^0-9]/g, '');
    const price = parseInt(priceText) || 0;
    total += price;
  });
  const totalEl = document.getElementById('cart-total');
  if (totalEl) {
    totalEl.textContent = `Total: IDR ${total}K`;
  }
}

// Notifikasi sukses tambah ke cart
function showCartSuccessNotif() {
  const notif = document.getElementById('cart-success-notif');
  if (!notif) return;
  notif.style.display = 'block';
  notif.style.opacity = '1';
  setTimeout(() => {
    notif.style.opacity = '0';
    setTimeout(() => {
      notif.style.display = 'none';
    }, 400);
  }, 1200);
}

// Scroll Animation
function scrollAnimateElements() {
  const elements = document.querySelectorAll('.scroll-animate');
  const triggerBottom = window.innerHeight * 0.9;
  elements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add('visible');
    } else {
      el.classList.remove('visible');
    }
  });
}

window.addEventListener('scroll', scrollAnimateElements);
window.addEventListener('load', scrollAnimateElements);