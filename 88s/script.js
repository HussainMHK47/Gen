/* ═══════════════════════════════════════════
   HOTEL BOOKING FORM
   ═══════════════════════════════════════════ */
const fields = {
  name: {
    el: document.getElementById('name'),
    group: document.getElementById('g-name'),
    err: document.getElementById('e-name'),
    validate(v) {
      v = v.trim();
      if (!v) return 'Name is required';
      if (v.length < 3) return 'At least 3 characters';
      if (!/^[A-Za-z\s.'-]+$/.test(v)) return 'Letters, spaces and . only';
      return '';
    }
  },
  guests: {
    el: document.getElementById('age'),
    group: document.getElementById('g-guests'),
    err: document.getElementById('e-age'),
    validate(v) {
      if (!v) return 'Number of items required';
      const n = +v;
      if (n < 1) return 'Minimum 1 guest';
      if (n > 9) return 'Maximum 6 guests';
      return '';
    }
  },
  roomType: {
    el: document.getElementById('gender'),
    group: document.getElementById('g-type'),
    err: document.getElementById('e-gender'),
    validate(v) { return v ? '' : 'Please select a room type'; }
  },
  phone: {
    el: document.getElementById('phone'),
    group: document.getElementById('g-phone'),
    err: document.getElementById('e-phone'),
    validate(v) {
      if (!v) return 'Phone is required';
      if (!/^\d{10}$/.test(v)) return 'Enter a valid 10-digit number';
      return '';
    }
  },
  email: {
    el: document.getElementById('email'),
    group: document.getElementById('g-email'),
    err: document.getElementById('e-email'),
    validate(v) {
      if (!v) return 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return 'Enter a valid email';
      return '';
    }
  },
  duration: {
    el: document.getElementById('plan'),
    group: document.getElementById('g-plan'),
    err: document.getElementById('e-plan'),
    validate(v) { return v ? '' : 'Please choose a duration'; }
  },
  requests: {
    el: document.getElementById('address'),
    group: document.getElementById('g-address'),
    err: document.getElementById('e-address'),
    validate(v) {
      v = v.trim();
      if (!v) return 'Please add special requests or write "None"';
      if (v.length < 10) return 'At least 10 characters';
      return '';
    }
  }
};

const bar = document.getElementById('bar');
const progressText = document.getElementById('progressText');

function check(key, showOk = true) {
  const f = fields[key];
  const msg = f.validate(f.el.value);
  f.group.classList.remove('error', 'success');
  if (msg) {
    f.group.classList.add('error');
    f.err.textContent = msg;
  } else if (showOk) {
    f.group.classList.add('success');
  }
  updateBar();
  return !msg;
}

function updateBar() {
  const total = Object.keys(fields).length;
  const done = Object.keys(fields).filter(k => {
    const f = fields[k];
    return !f.validate(f.el.value) && f.el.value.trim() !== '';
  }).length;
  bar.style.width = (done / total * 100) + '%';
  progressText.textContent = `${done}/${total} completed`;
}

Object.keys(fields).forEach(key => {
  const f = fields[key];
  f.el.addEventListener('input', () => check(key));
  f.el.addEventListener('blur', () => check(key));
});

document.getElementById('gymForm').addEventListener('submit', function (e) {
  e.preventDefault();
  let allValid = true;
  Object.keys(fields).forEach(k => { if (!check(k)) allValid = false; });
  if (allValid) {
    const name = fields.name.el.value.trim();
    alert('🏔️ Welcome, ' + name + '!\n\nYour stay at Alpenrose Hotel is confirmed.\nWe look forward to hosting you in the Swiss Alps!');
    this.reset();
    Object.keys(fields).forEach(k => fields[k].group.classList.remove('success', 'error'));
    bar.style.width = '0%';
    progressText.textContent = '0/7 completed';
  }
});


/* ═══════════════════════════════════════════
   HOTEL SHOP – SEARCH, FILTER & CART
   ═══════════════════════════════════════════ */
const products = [
  { id: 1,  name: "Lindt Dark Chocolate 70%", category: "Swiss Sweets", price: 899 },
  { id: 2,  name: "Ricola Caramel Drops",     category: "Swiss Sweets", price: 449 },
  { id: 3,  name: "Swiss Chocolate Fondue Set", category: "Swiss Sweets", price: 1499 },
  { id: 4,  name: "Alpenrose Truffle Box",     category: "Swiss Sweets", price: 1299 },
  { id: 5,  name: "Gruyère AOP 200g",          category: "Cheese",       price: 799 },
  { id: 6,  name: "Emmental Classic 250g",     category: "Cheese",       price: 699 },
  { id: 7,  name: "Raclette Cheese Wheel",     category: "Cheese",       price: 1899 },
  { id: 8,  name: "Swiss Cheese Platter Kit",  category: "Cheese",       price: 2499 },
  { id: 9,  name: "Alpine Lavender Body Oil",  category: "Spa",          price: 1599 },
  { id: 10, name: "Birch & Pine Bath Salts",   category: "Spa",          price: 999 },
  { id: 11, name: "Swiss Honey Face Mask",     category: "Spa",          price: 1199 },
  { id: 12, name: "Herbal Foot Soak Set",      category: "Spa",          price: 799 },
  { id: 13, name: "Matterhorn Keychain",       category: "Souvenirs",    price: 349 },
  { id: 14, name: "Swiss Cross Scarf",         category: "Souvenirs",    price: 1299 },
  { id: 15, name: "Alpenrose Ceramic Mug",     category: "Souvenirs",    price: 599 }
];

let cart = [];

const searchInput    = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
const clearBtn       = document.getElementById("clearBtn");
const filterError    = document.getElementById("filterError");
const productGrid    = document.getElementById("productGrid");
const productForm    = document.getElementById("productForm");
const cartBar        = document.getElementById("cartBar");
const cartCount      = document.getElementById("cartCount");
const cartTotal      = document.getElementById("cartTotal");
const checkoutBtn    = document.getElementById("checkoutBtn");

const validPattern = /^[a-zA-Z\s]*$/;

function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 2000);
}

function updateCartUI() {
  const count = cart.length;
  const total = cart.reduce((s, id) => s + products.find(p => p.id === id).price, 0);
  cartCount.textContent = count;
  cartTotal.textContent = total.toLocaleString("en-IN");
  cartBar.classList.toggle("visible", count > 0);
}

function toggleCart(id, btn) {
  if (cart.includes(id)) {
    cart = cart.filter(cid => cid !== id);
    btn.textContent = "Add to Cart";
    btn.classList.remove("added");
    updateCartUI();
    showToast("Removed from cart");
  } else {
    cart.push(id);
    btn.textContent = "✓ Remove";
    btn.classList.add("added");
    updateCartUI();
    showToast("Added to cart!");
  }
}

function renderProducts(list) {
  productGrid.innerHTML = "";
  if (!list.length) {
    productGrid.innerHTML = '<p class="no-results">No products found.</p>';
    return;
  }
  list.forEach(p => {
    const inCart = cart.includes(p.id);
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p class="cat">${p.category}</p>
      <p class="price">₹${p.price.toLocaleString("en-IN")}</p>
      <button class="btn-buy ${inCart ? "added" : ""}" data-id="${p.id}">
        ${inCart ? "✓ Remove" : "Add to Cart"}
      </button>`;
    card.querySelector(".btn-buy").addEventListener("click", function () {
      toggleCart(p.id, this);
    });
    productGrid.appendChild(card);
  });
}

function filterProducts() {
  const val = searchInput.value;
  if (val && !validPattern.test(val)) {
    filterError.textContent = "Error: Only letters and spaces are allowed.";
    return;
  }
  filterError.textContent = "";
  const q = val.trim().toLowerCase();
  const cat = categorySelect.value;
  renderProducts(products.filter(p =>
    (q === "" || p.name.toLowerCase().includes(q)) &&
    (cat === "" || p.category === cat)
  ));
}

searchInput.addEventListener("input", filterProducts);
categorySelect.addEventListener("change", filterProducts);
clearBtn.addEventListener("click", () => {
  searchInput.value = "";
  categorySelect.value = "";
  filterError.textContent = "";
  renderProducts(products);
});
productForm.addEventListener("submit", e => {
  e.preventDefault();
  filterProducts();
});

checkoutBtn.addEventListener("click", () => {
  const total = cart.reduce((s, id) => s + products.find(p => p.id === id).price, 0);
  alert(`🏔️ Order Placed!\n\nItems: ${cart.length}\nTotal: ₹${total.toLocaleString("en-IN")}\n\nThank you for shopping at Alpenrose Hotel!`);
  cart = [];
  updateCartUI();
  renderProducts(products);
});

renderProducts(products);
updateCartUI();     