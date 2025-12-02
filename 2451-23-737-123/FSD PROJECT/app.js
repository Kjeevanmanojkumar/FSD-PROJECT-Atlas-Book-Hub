// Atlas Book Hub - Compact JS

function isUserAuthenticated() {
  return localStorage.getItem('user_authenticated') === 'true';
}
function setUserAuthenticated() {
  localStorage.setItem('user_authenticated', 'true');
  localStorage.setItem('auth_timestamp', new Date().getTime());
}
function logoutUser() {
  localStorage.removeItem('user_authenticated');
  localStorage.removeItem('auth_timestamp');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_name');
  window.location.href = 'auth.html';
}
function checkAuthentication() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const protectedPages = ['index.html', 'catalogue.html', 'cart.html', 'checkout.html'];
  if (protectedPages.includes(currentPage) && !isUserAuthenticated()) {
    window.location.href = 'auth.html';
  }
}

const CURRENCY_CONFIG = {
  IN: { code: 'INR', symbol: '₹', rate: 83.5, country: 'India' },
  US: { code: 'USD', symbol: '$', rate: 1, country: 'United States' },
  GB: { code: 'GBP', symbol: '£', rate: 0.79, country: 'United Kingdom' },
  CA: { code: 'CAD', symbol: 'C$', rate: 1.35, country: 'Canada' },
  AU: { code: 'AUD', symbol: 'A$', rate: 1.53, country: 'Australia' },
  SG: { code: 'SGD', symbol: 'S$', rate: 1.34, country: 'Singapore' },
  MY: { code: 'MYR', symbol: 'RM', rate: 4.75, country: 'Malaysia' },
  PK: { code: 'PKR', symbol: '₨', rate: 277.5, country: 'Pakistan' },
  BD: { code: 'BDT', symbol: '৳', rate: 109.5, country: 'Bangladesh' },
  EU: { code: 'EUR', symbol: '€', rate: 0.92, country: 'Europe' },
  JP: { code: 'JPY', symbol: '¥', rate: 149.5, country: 'Japan' },
  DEFAULT: { code: 'USD', symbol: '$', rate: 1, country: 'Other' }
};
let userCountry = 'US';
let userCurrency = CURRENCY_CONFIG.US;
// Force site to always use USD when true
const FORCE_USD = true;

function detectUserCountry() {
  // If developer/user requested USD-only, force it and skip geo lookup
  if (FORCE_USD) {
    userCountry = 'US';
    userCurrency = CURRENCY_CONFIG.US;
    localStorage.setItem('user_country', 'US');
    updateAllPrices();
    updateCurrencyDisplay();
    return;
  }
  const stored = localStorage.getItem('user_country');
  if (stored && CURRENCY_CONFIG[stored]) {
    userCountry = stored;
    userCurrency = CURRENCY_CONFIG[stored];
    updateCurrencyDisplay();
    return;
  }
  fetch('https://ipapi.co/json/')
    .then(r => r.json())
    .then(data => {
      const country = data.country_code;
      userCountry = country && CURRENCY_CONFIG[country] ? country : 'US';
      userCurrency = CURRENCY_CONFIG[userCountry];
      localStorage.setItem('user_country', userCountry);
      updateAllPrices();
      updateCurrencyDisplay();
    })
    .catch(() => {
      userCountry = 'US';
      userCurrency = CURRENCY_CONFIG.US;
      updateCurrencyDisplay();
    });
}
function convertPrice(p) {
  return p * userCurrency.rate;
}
function formatPrice(priceUsd) {
  const convertedPrice = convertPrice(priceUsd);
  let decimals = 2;
  if (['JPY', 'PKR', 'BDT', 'INR', 'MYR'].includes(userCurrency.code)) decimals = 0;
  return `${userCurrency.symbol}${convertedPrice.toFixed(decimals)}`;
}
function updateCurrencyDisplay() {
  const el = document.getElementById('currency-display');
  if (el) el.textContent = `${userCurrency.code} (${userCurrency.country})`;
}
function updateAllPrices() {
  renderPreview();
  renderCatalogueTable();
  renderCartTable();
  if (document.getElementById('checkout-items')) displayCheckoutItems();
}

const BOOKS = [
  { id: 'b1', cat: 'CSE', title: 'Data Structures Using Java', author: 'Mark Allen Weiss', pub: 'Pearson', price: 45.99 },
  { id: 'b2', cat: 'CSE', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson, Rivest', pub: 'MIT Press', price: 89.99 },
  { id: 'b3', cat: 'CSE', title: 'Design Patterns: Elements of Reusable OO Software', author: 'Gang of Four', pub: 'Addison-Wesley', price: 54.99 },
  { id: 'b4', cat: 'CSE', title: 'Clean Code: A Handbook', author: 'Robert C. Martin', pub: 'Prentice Hall', price: 49.99 },
  { id: 'b5', cat: 'CSE', title: 'Operating Systems: Three Easy Pieces', author: 'Remzi Arpaci-Dusseau', pub: 'Arpaci-Dusseau', price: 39.99 },
  { id: 'b6', cat: 'ECE', title: 'Digital Signal Processing', author: 'Sanjit K. Mitra', pub: 'Academic Press', price: 125.99 },
  { id: 'b7', cat: 'ECE', title: 'Microelectronics: Circuit Analysis and Design', author: 'Donald Neamen', pub: 'McGraw-Hill', price: 165.0 },
  { id: 'b8', cat: 'ECE', title: 'Fundamentals of Digital Logic', author: 'Stephen Brown, Zvonko Vranesic', pub: 'McGraw-Hill', price: 145.5 },
  { id: 'b9', cat: 'ECE', title: 'Communication Systems Engineering', author: 'John G. Proakis', pub: 'Prentice Hall', price: 155.0 },
  { id: 'b10', cat: 'ECE', title: 'Electromagnetics for Engineers', author: 'Ulaby, Michielssen, Ravaioli', pub: 'Pearson', price: 135.5 },
  { id: 'b11', cat: 'EEE', title: 'Electric Machinery and Transformers', author: 'Bhag S. Guru', pub: 'Oxford University Press', price: 98.0 },
  { id: 'b12', cat: 'EEE', title: 'Power System Analysis and Design', author: 'J. Duncan Glover', pub: 'Cengage Learning', price: 175.0 },
  { id: 'b13', cat: 'EEE', title: 'Electric Circuits', author: 'James W. Nilsson, Susan A. Riedel', pub: 'Prentice Hall', price: 120.0 },
  { id: 'b14', cat: 'EEE', title: 'Control Systems Engineering', author: 'Norman S. Nise', pub: 'Wiley', price: 128.99 },
  { id: 'b15', cat: 'EEE', title: 'Fundamentals of Electrical Engineering', author: 'Giorgio Rizzoni', pub: 'McGraw-Hill', price: 110.5 },
  { id: 'b16', cat: 'CIVIL', title: 'Structural Analysis', author: 'R.C. Hibbler', pub: 'Prentice Hall', price: 95.0 },
  { id: 'b17', cat: 'CIVIL', title: 'Design of Concrete Structures', author: 'Arthur H. Nilson', pub: 'McGraw-Hill', price: 138.0 },
  { id: 'b18', cat: 'CIVIL', title: 'Mechanics of Materials', author: 'James M. Gere', pub: 'Cengage Learning', price: 115.99 },
  { id: 'b19', cat: 'CIVIL', title: 'Soil Mechanics and Foundation Engineering', author: 'K.R. Arora', pub: 'Standard Publishers', price: 48.99 },
  { id: 'b20', cat: 'CIVIL', title: 'Transportation Engineering', author: 'C. Jotin Khisty', pub: 'Prentice Hall', price: 105.5 }
];

const CART_KEY = 'atlas_cart_v2';
const ORDER_KEY = 'atlas_orders_v1';

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDER_KEY) || '[]');
  } catch (e) {
    console.error('Error reading orders:', e);
    return [];
  }
}
function saveOrder(order) {
  try {
    const orders = getOrders();
    orders.unshift(order);
    localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
  } catch (e) {
    console.error('Error saving order:', e);
  }
}
function buildOrderObject(paymentMethod) {
  const cart = getCart();
  const items = [];
  let subtotal = 0;
  for (const bookId in cart) {
    const book = BOOKS.find(b => b.id === bookId);
    if (!book) continue;
    const qty = cart[bookId];
    const itemTotal = book.price * qty;
    subtotal += itemTotal;
    items.push({ id: book.id, title: book.title, price_usd: book.price, qty, itemTotalUsd: +itemTotal.toFixed(2) });
  }
  const tax = +(subtotal * 0.1).toFixed(2);
  const total = +(subtotal + tax).toFixed(2);
  const address = {
    name: document.getElementById('addr-name')?.value || '',
    email: document.getElementById('addr-email')?.value || '',
    phone: document.getElementById('addr-phone')?.value || '',
    address: document.getElementById('addr-address')?.value || '',
    city: document.getElementById('addr-city')?.value || '',
    state: document.getElementById('addr-state')?.value || '',
    zip: document.getElementById('addr-zip')?.value || '',
    country: document.getElementById('addr-country')?.value || ''
  };
  return {
    id: 'ORD-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 900 + 100),
    createdAt: new Date().toISOString(),
    items,
    subtotalUsd: +subtotal.toFixed(2),
    taxUsd: tax,
    totalUsd: total,
    currency: userCurrency.code,
    currencySymbol: userCurrency.symbol,
    totalFormatted: formatPrice(total),
    paymentMethod,
    status: 'Confirmed',
    address,
    userEmail: localStorage.getItem('user_email') || null
  };
}
function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  } catch (e) {
    console.error('Error reading cart:', e);
    return {};
  }
}
function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();
  } catch (e) {
    console.error('Error saving cart:', e);
  }
}
function addToCart(bookId, quantity = 1) {
  const book = BOOKS.find(b => b.id === bookId);
  if (!book) {
    alert('Book not found');
    return;
  }
  const cart = getCart();
  cart[bookId] = (cart[bookId] || 0) + quantity;
  saveCart(cart);
  showNotification(`"${book.title}" added to cart`);
}
function removeFromCart(bookId) {
  const cart = getCart();
  delete cart[bookId];
  saveCart(cart);
  renderCartTable();
}
function updateCartQuantity(bookId, quantity) {
  const cart = getCart();
  quantity = Number(quantity);
  if (quantity <= 0) delete cart[bookId];
  else cart[bookId] = quantity;
  saveCart(cart);
  renderCartTable();
}
function updateCartCount() {
  const cart = getCart();
  const count = Object.values(cart).reduce((s, q) => s + q, 0);
  document.querySelectorAll('#cart-count-top').forEach(el => {
    el.textContent = count;
    // brief bounce to draw attention
    el.classList.remove('badge-bounce');
    // trigger reflow then add
    void el.offsetWidth;
    el.classList.add('badge-bounce');
    setTimeout(() => el.classList.remove('badge-bounce'), 700);
  });
}
function showNotification(msg) {
  alert(msg);
}

let otpData = { email: '', phone: '', otp: '', method: '', attempts: 0, maxAttempts: 3, expiryTime: 600 };
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
function sendOTPViaEmail(email) {
  const otp = generateOTP();
  otpData = { email, phone: '', otp, method: 'email', attempts: 0, maxAttempts: 3, expiryTime: 600 };
  console.log(`[SIMULATED EMAIL] OTP sent to ${email}: ${otp}`);
  alert(`✓ OTP sent to ${email}\n\nFor demo: OTP is ${otp}\n\n(Check browser console for verification)`);
  startOTPExpiry();
  return true;
}
function sendOTPViaSMS(phone) {
  const otp = generateOTP();
  otpData = { email: '', phone, otp, method: 'sms', attempts: 0, maxAttempts: 3, expiryTime: 600 };
  console.log(`[SIMULATED SMS] OTP sent to ${phone}: ${otp}`);
  alert(`✓ OTP sent to ${phone}\n\nFor demo: OTP is ${otp}\n\n(Check browser console for verification)`);
  startOTPExpiry();
  return true;
}
function startOTPExpiry() {
  let timeLeft = otpData.expiryTime;
  const timer = setInterval(() => {
    timeLeft--;
    const timerEl = document.getElementById('otp-timer');
    if (timerEl) {
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }
    if (timeLeft <= 0) {
      clearInterval(timer);
      otpData.otp = '';
      showOTPMessage('OTP expired. Request a new one.', 'error');
    }
  }, 1000);
}
function verifyOTP(enteredOTP) {
  if (!otpData.otp) {
    showOTPMessage('No active OTP. Request one first.', 'error');
    return false;
  }
  otpData.attempts++;
  if (enteredOTP === otpData.otp) {
    showOTPMessage('✓ OTP verified successfully!', 'success');
    return true;
  }
  if (otpData.attempts >= otpData.maxAttempts) {
    showOTPMessage(`❌ Too many incorrect attempts (${otpData.attempts}/${otpData.maxAttempts}). Request a new OTP.`, 'error');
    otpData.otp = '';
    return false;
  }
  showOTPMessage(`❌ Incorrect OTP. Attempts remaining: ${otpData.maxAttempts - otpData.attempts}`, 'error');
  return false;
}
function showOTPMessage(message, type) {
  const el = document.getElementById('otp-message');
  if (el) {
    el.textContent = message;
    el.className = `otp-message otp-${type}`;
    el.style.display = 'block';
  }
}

function renderCatalogueTable(filter = 'ALL') {
  const tableBody = document.querySelector('#catalogueTable tbody');
  const noResults = document.getElementById('no-results');
  const bookCount = document.getElementById('book-count');
  if (!tableBody) return;
  tableBody.innerHTML = '';
  const filtered = BOOKS.filter(b => filter === 'ALL' || b.cat === filter);
  if (filtered.length === 0) {
    if (noResults) noResults.style.display = 'block';
    if (bookCount) bookCount.textContent = 'No books found';
    return;
  }
  if (noResults) noResults.style.display = 'none';
  if (bookCount) bookCount.textContent = `Showing ${filtered.length} book(s)`;
  filtered.forEach((book, i) => {
    const tr = document.createElement('tr');
    const col = getBookCoverColor(book.cat, i);
    tr.innerHTML = `
      <td>
        <div class="book-cover" style="background:linear-gradient(135deg,${col[0]} 0%,${col[1]} 100%);">
          <span class="book-title-short">${book.title.substring(0,3).toUpperCase()}</span>
        </div>
      </td>
      <td><strong>${book.title}</strong></td>
      <td>${book.author}</td>
      <td>${book.pub}</td>
      <td style="text-align:center;font-weight:600;color:var(--primary);">${formatPrice(book.price)}</td>
      <td style="text-align:center;">
        <button class="btn btn-small" onclick="addToCart('${book.id}')">Add to Cart</button>
      </td>`;
    tableBody.appendChild(tr);
  });
}
function getBookCoverColor(category, index) {
  const colors = {
    CSE: [['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe']],
    ECE: [['#fa709a', '#fee140'], ['#30cfd0', '#330867'], ['#a8edea', '#fed6e3']],
    EEE: [['#ff9a56', '#ff6a88'], ['#ffecd2', '#fcb69f'], ['#ff6e7f', '#bfe9ff']],
    CIVIL: [['#a1c4fd', '#c2e9fb'], ['#ffecd2', '#fcb69f'], ['#ff9a9e', '#fecfef']]
  };
  const catColors = colors[category] || colors.CSE;
  return catColors[index % catColors.length];
}
function renderPreview(category = 'ALL') {
  const container = document.getElementById('catalogue-preview');
  if (!container) return;
  container.innerHTML = '';
  const filtered = BOOKS.filter(b => category === 'ALL' || b.cat === category).slice(0, 4);
  filtered.forEach(book => {
    const div = document.createElement('div');
    div.className = 'preview-item';
    div.innerHTML = `
      <strong>${book.title}</strong>
      <p style="margin:6px 0;font-size:13px;color:var(--text-light);">by ${book.author}</p>
      <p style="margin:6px 0;font-size:12px;color:var(--muted);">${book.pub}</p>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;">
        <span style="font-size:16px;font-weight:700;color:var(--primary);">${formatPrice(book.price)}</span>
        <button class="btn btn-small" onclick="addToCart('${book.id}')">Add</button>
      </div>`;
    container.appendChild(div);
  });
}
function renderCartTable() {
  const tbody = document.querySelector('#cartTable tbody');
  const emptyCart = document.getElementById('empty-cart');
  if (!tbody) return;
  tbody.innerHTML = '';
  const cart = getCart();
  const items = Object.keys(cart);
  if (items.length === 0) {
    if (tbody.parentElement) tbody.parentElement.style.display = 'none';
    if (emptyCart) emptyCart.style.display = 'block';
    updateCartTotals(0);
    return;
  }
  if (tbody.parentElement) tbody.parentElement.style.display = 'table';
  if (emptyCart) emptyCart.style.display = 'none';
  let subtotal = 0;
  items.forEach(bookId => {
    const book = BOOKS.find(b => b.id === bookId);
    if (!book) return;
    const qty = cart[bookId];
    const amount = book.price * qty;
    subtotal += amount;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${book.cat}</td>
      <td>${book.title}</td>
      <td style="text-align:center;">${formatPrice(book.price)}</td>
      <td style="text-align:center;">
        <input type="number" min="1" value="${qty}" onchange="updateCartQuantity('${book.id}',this.value)" style="width:50px;padding:4px;">
      </td>
      <td style="text-align:center;">${formatPrice(amount)}</td>`;
    tbody.appendChild(tr);
  });
  updateCartTotals(subtotal);
}
function updateCartTotals(subtotal) {
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const subEl = document.getElementById('subtotal');
  const taxEl = document.getElementById('tax');
  const totEl = document.getElementById('cartTotal');
  if (subEl) subEl.textContent = formatPrice(subtotal);
  if (taxEl) taxEl.textContent = formatPrice(tax);
  if (totEl) totEl.textContent = formatPrice(total);
}
function proceedCheckout() {
  const cart = getCart();
  if (!Object.keys(cart).length) {
    alert('Your cart is empty');
    return;
  }
  window.location.href = 'checkout.html';
}

function initRegistrationValidation() {
  const form = document.getElementById('registerForm');
  if (!form) return;
  populateDateSelects();
  form.addEventListener('submit', e => {
    const messages = validateRegistration();
    const msgElement = document.getElementById('registerMsg');
    if (messages.length > 0) {
      e.preventDefault();
      msgElement.textContent = messages[0];
      msgElement.classList.add('error');
      return false;
    }
    msgElement.textContent = 'Account created successfully! Redirecting...';
    msgElement.classList.remove('error');
    msgElement.style.color = 'var(--success)';
    setTimeout(() => {
      msgElement.textContent = '';
    }, 2000);
    e.preventDefault();
  });
}
function validateRegistration() {
  const errors = [];
  const name = document.getElementById('name')?.value.trim() || '';
  if (!/^[A-Za-z\s]+$/.test(name) || name.length < 6) errors.push('Name must contain only letters and be at least 6 characters.');
  const password = document.getElementById('password')?.value || '';
  if (password.length < 6) errors.push('Password must be at least 6 characters.');
  const confirmPassword = document.getElementById('confirm-password')?.value || '';
  if (password !== confirmPassword) errors.push('Passwords do not match.');
  const email = document.getElementById('email')?.value.trim() || '';
  if (!/^\S+@\S+\.\S+$/.test(email)) errors.push('Please enter a valid email address.');
  const phone = document.getElementById('phone')?.value.trim() || '';
  if (!/^\d{10}$/.test(phone)) errors.push('Phone number must be exactly 10 digits.');
  const sex = document.querySelector('input[name="sex"]:checked');
  if (!sex) errors.push('Please select your gender.');
  const dobDay = document.getElementById('dob-day')?.value;
  const dobMonth = document.getElementById('dob-month')?.value;
  const dobYear = document.getElementById('dob-year')?.value;
  if (!dobDay || !dobMonth || !dobYear) errors.push('Please enter your date of birth.');
  const languages = document.querySelectorAll('input[name="lang[]"]:checked');
  if (!languages.length) errors.push('Please select at least one language.');
  const address = document.getElementById('address')?.value.trim() || '';
  if (address.length < 10) errors.push('Please enter a valid address.');
  const terms = document.querySelector('input[name="terms"]:checked');
  if (!terms) errors.push('You must agree to the terms and conditions.');
  return errors;
}
function populateDateSelects() {
  const daySelect = document.getElementById('dob-day');
  const monthSelect = document.getElementById('dob-month');
  const yearSelect = document.getElementById('dob-year');
  if (!daySelect || !monthSelect || !yearSelect) return;
  for (let d = 1; d <= 31; d++) {
    const o = document.createElement('option');
    o.value = d;
    o.textContent = d;
    daySelect.appendChild(o);
  }
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  months.forEach((m, i) => {
    const o = document.createElement('option');
    o.value = i + 1;
    o.textContent = m;
    monthSelect.appendChild(o);
  });
  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1950; y--) {
    const o = document.createElement('option');
    o.value = y;
    o.textContent = y;
    yearSelect.appendChild(o);
  }
}

function initHomeFrame() {
  document.querySelectorAll('.dept-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.dept-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      renderPreview(this.dataset.cat);
    });
  });
  renderPreview('ALL');
}
function initCataloguePage() {
  const filter = document.getElementById('catFilter');
  if (filter) {
    filter.addEventListener('change', () => renderCatalogueTable(filter.value));
    renderCatalogueTable('ALL');
  }
}
function initCartPage() {
  renderCartTable();
}
function initLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    if (!email || !password) {
      alert('Please enter both email and password');
      return;
    }
    alert('Login successful! (Demo mode)');
  });
}

function initCheckoutPage() {
  displayCheckoutItems();
  const loginLocation = localStorage.getItem('login_location');
  const registerLocation = localStorage.getItem('register_location');
  const savedLocation = loginLocation || registerLocation;
  if (savedLocation && savedLocation !== userCountry) {
    const warning = document.createElement('div');
    warning.style.cssText = 'background:#fff3cd;border:1px solid #ffc107;padding:12px;margin-bottom:16px;border-radius:6px;color:#856404;font-size:13px;';
    warning.innerHTML = `⚠️ <strong>Location Change Detected:</strong> You registered from ${CURRENCY_CONFIG[savedLocation].country}, but currently in ${userCurrency.country}. Prices and payment will be in ${userCurrency.code}.`;
    const checkoutPage = document.querySelector('.checkout-page');
    if (checkoutPage) checkoutPage.insertBefore(warning, checkoutPage.firstChild);
  }
}
function displayCheckoutItems() {
  const container = document.getElementById('checkout-items');
  if (!container) return;
  const cart = getCart();
  const items = Object.keys(cart);
  if (!items.length) {
    container.innerHTML = '<p style="text-align:center;color:var(--text-light);">Your cart is empty</p>';
    return;
  }
  let subtotal = 0;
  container.innerHTML = '';
  items.forEach(bookId => {
    const book = BOOKS.find(b => b.id === bookId);
    if (!book) return;
    const qty = cart[bookId];
    const amount = book.price * qty;
    subtotal += amount;
    const div = document.createElement('div');
    div.className = 'summary-item';
    div.innerHTML = `
      <div>
        <strong>${book.title}</strong><br/>
        <small style="color:var(--text-light);">Qty: ${qty}</small>
      </div>
      <span style="font-weight:600;">${formatPrice(amount)}</span>`;
    container.appendChild(div);
  });
  updateCheckoutTotals(subtotal);
}
function updateCheckoutTotals(subtotal) {
  const tax = subtotal * 0.1;
  const total = subtotal + tax;
  const s = document.getElementById('checkout-subtotal');
  const t = document.getElementById('checkout-tax');
  const tot = document.getElementById('checkout-total');
  if (s) s.textContent = formatPrice(subtotal);
  if (t) t.textContent = formatPrice(tax);
  if (tot) tot.textContent = formatPrice(total);
  const btn = document.getElementById('checkout-btn');
  if (btn) btn.textContent = `Place Order — ${formatPrice(total)}`;
}
function placeOrderCOD() {
  const cart = getCart();
  if (!Object.keys(cart).length) {
    alert('Your cart is empty');
    return;
  }
  if (!validateAddressForm()) {
    alert('Please fill all delivery address fields');
    return;
  }
  const order = buildOrderObject('Cash on Delivery');
  saveOrder(order);
  localStorage.removeItem(CART_KEY);
  updateCartCount();
  showPaymentMessage(`✓ Order placed! Total: ${order.totalFormatted}. Payment on delivery.`, 'success');
  setTimeout(() => {
    alert('Thank you for your order! Redirecting to Orders page...');
    window.location.href = 'order-history.html';
  }, 1200);
}
// Payment UI handlers (card/paypal/upi) removed — using COD flow only.

function updateLoginLocationDisplay() {
  const display = document.getElementById('login-detected-country');
  const input = document.getElementById('login-user-country');
  if (display && input) {
    display.textContent = `${userCurrency.code} (${userCurrency.country})`;
    input.value = userCountry;
    const form = document.getElementById('loginForm');
    if (form) {
      form.addEventListener('submit', () => {
        localStorage.setItem('login_location', userCountry);
        localStorage.setItem('login_timestamp', new Date().toISOString());
      }, { once: true });
    }
  }
}
function updateRegisterLocationDisplay() {
  const display = document.getElementById('register-detected-country');
  const input = document.getElementById('register-user-country');
  if (display && input) {
    display.textContent = `${userCurrency.code} (${userCurrency.country})`;
    input.value = userCountry;
    const form = document.getElementById('registerForm');
    if (form) {
      form.addEventListener('submit', () => {
        localStorage.setItem('register_location', userCountry);
        localStorage.setItem('register_timestamp', new Date().toISOString());
      }, { once: true });
    }
  }
}
// Legacy online payment functions removed (PayPal/UPI/Card). Using COD.

function updateOrderStatus(orderId, newStatus) {
  const orders = getOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) return false;
  orders[idx].status = newStatus;
  localStorage.setItem(ORDER_KEY, JSON.stringify(orders));
  return true;
}
function cancelOrder(orderId) {
  if (!confirm('Are you sure you want to cancel this order?')) return;
  const ok = updateOrderStatus(orderId, 'Cancelled');
  if (ok) {
    alert('Order cancelled successfully.');
    if (window.location.pathname.split('/').pop().includes('order-history')) {
      window.location.reload();
    }
  } else alert('Unable to cancel order (order not found).');
}
function renderOrderWithActions(order) {
  const el = document.createElement('div');
  el.className = 'card order-card';
  el.style.marginBottom = '16px';
  let html = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <div><strong>${order.id}</strong><div style="font-size:13px;color:var(--muted)">${new Date(order.createdAt).toLocaleString()}</div></div>
      <div style="text-align:right">
        <div style="font-weight:700">${order.totalFormatted}</div>
        <div style="font-size:12px;color:var(--muted)">${order.paymentMethod} • ${order.status}</div>
      </div>
    </div>
    <hr style="margin:12px 0;opacity:.06;"/>
    <div>`;
  for (const it of order.items) {
    html += `<div style="margin-bottom:6px;">${it.qty} × ${it.title} — ${formatPrice(it.itemTotalUsd)}</div>`;
  }
  html += `</div>
    <div style="margin-top:12px;font-size:13px;color:var(--muted);">
      <div><strong>Deliver to:</strong> ${order.address.name || order.userEmail || ''}</div>
    </div>
    <div style="margin-top:12px;display:flex;gap:8px;">`;
  const cancellable = ['Confirmed', 'Processing'];
  if (cancellable.includes(order.status)) {
    html += `<button class="btn btn-ghost" onclick="cancelOrder('${order.id}')">Cancel Order</button>`;
  } else {
    html += `<button class="btn btn-ghost" disabled>${order.status}</button>`;
  }
  html += '</div>';
  el.innerHTML = html;
  return el;
}

function validateAddressForm() {
  const fields = ['addr-name','addr-email','addr-phone','addr-address','addr-city','addr-state','addr-zip','addr-country'];
  for (const f of fields) {
    const input = document.getElementById(f);
    if (!input || !input.value.trim()) return false;
  }
  const email = document.getElementById('addr-email')?.value;
  if (!/^\S+@\S+\.\S+$/.test(email)) return false;
  const phone = document.getElementById('addr-phone')?.value;
  if (!/^\d{10}$/.test(phone)) return false;
  return true;
}
function calculateTotal() {
  const cart = getCart();
  let subtotal = 0;
  for (const bookId in cart) {
    const book = BOOKS.find(b => b.id === bookId);
    if (book) subtotal += book.price * cart[bookId];
  }
  return subtotal + subtotal * 0.1;
}
function showPaymentMessage(message, type) {
  const el = document.getElementById('payment-message');
  if (el) {
    el.textContent = message;
    el.className = `payment-message ${type}`;
  }
}

// Init lightweight entrance/stagger animations
function initAnimations() {
  try {
    // stagger preview items
    const previews = Array.from(document.querySelectorAll('.preview-item'));
    previews.forEach((el, i) => {
      el.style.animationDelay = `${i * 80}ms`;
      el.classList.add('anim-fade-up');
    });

    // summary items
    const summaries = Array.from(document.querySelectorAll('.summary-item'));
    summaries.forEach((el, i) => {
      el.style.animationDelay = `${i * 50}ms`;
      el.classList.add('anim-fade-up');
    });

    // trust badges
    const badges = Array.from(document.querySelectorAll('.trust-badge'));
    badges.forEach((el, i) => {
      el.style.animationDelay = `${i * 90}ms`;
      el.classList.add('anim-bounce-in');
    });

    // header/logo quick entrance
    const top = document.querySelector('.top-frame');
    if (top) top.classList.add('anim-fade-up');

    // checkout right column entrance
    const right = document.querySelector('.checkout-right');
    if (right) right.classList.add('anim-fade-up');

    // buttons: subtle pulse on load for primary CTAs
    const ctas = document.querySelectorAll('.btn-primary');
    ctas.forEach((b, i) => {
      setTimeout(() => b.classList.add('anim-pulse'), 600 + i * 140);
      setTimeout(() => b.classList.remove('anim-pulse'), 1600 + i * 140);
    });

    // expand to all pages
    expandAnimations();
  } catch (e) {
    // fail silently
    console.warn('initAnimations failed', e);
  }
}

// Expand animations to all pages and interactive elements
function expandAnimations() {
  try {
    // Form sections (login, register, auth, checkout)
    const forms = Array.from(document.querySelectorAll('form'));
    forms.forEach((form) => {
      if (!form.classList.contains('anim-fade-up')) form.classList.add('anim-fade-up');
    });

    // Form inputs and labels with stagger
    const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="tel"], textarea, select'));
    inputs.forEach((input, i) => {
      const label = input.previousElementSibling;
      if (label && (label.tagName === 'LABEL' || label.className.includes('label'))) {
        label.style.animationDelay = `${i * 40}ms`;
        label.classList.add('anim-fade-up');
      }
      input.style.animationDelay = `${i * 40}ms`;
      input.classList.add('anim-fade-up');
    });

    // Table rows (cart, catalogue, orders)
    const tableRows = Array.from(document.querySelectorAll('tbody tr'));
    tableRows.forEach((tr, i) => {
      tr.style.animationDelay = `${i * 60}ms`;
      tr.classList.add('anim-fade-up');
    });

    // Catalogue cards/items in grid
    const cards = Array.from(document.querySelectorAll('.preview-item, .book-cover, .order-card, .checkout-section'));
    cards.forEach((card, i) => {
      if (!card.classList.contains('anim-fade-up')) {
        card.style.animationDelay = `${i * 70}ms`;
        card.classList.add('anim-fade-up');
      }
    });

    // Department buttons (home page)
    const deptBtns = Array.from(document.querySelectorAll('.dept-btn'));
    deptBtns.forEach((btn, i) => {
      btn.style.animationDelay = `${i * 90}ms`;
      btn.classList.add('anim-fade-up');
    });

    // Breadcrumbs
    const breadcrumb = document.querySelector('.breadcrumb');
    if (breadcrumb) breadcrumb.classList.add('anim-fade-up');

    // Filter/dropdown controls
    const controls = Array.from(document.querySelectorAll('.filter-control, .form-row'));
    controls.forEach((ctrl, i) => {
      ctrl.style.animationDelay = `${i * 50}ms`;
      ctrl.classList.add('anim-fade-up');
    });

    // Auth page boxes
    const authBoxes = Array.from(document.querySelectorAll('.auth-box, .card'));
    authBoxes.forEach((box, i) => {
      if (!box.classList.contains('anim-fade-up')) {
        box.style.animationDelay = `${i * 80}ms`;
        box.classList.add('anim-fade-up');
      }
    });

    // Section headings
    const headings = Array.from(document.querySelectorAll('h1, h2, h3'));
    headings.forEach((h, i) => {
      if (!h.classList.contains('anim-fade-up')) {
        h.style.animationDelay = `${i * 60}ms`;
        h.classList.add('anim-fade-up');
      }
    });

    // Order totals row entrance
    const totalsRow = document.querySelector('.order-totals');
    if (totalsRow) {
      const rows = Array.from(totalsRow.querySelectorAll('.total-row'));
      rows.forEach((row, i) => {
        row.style.animationDelay = `${i * 50}ms`;
        row.classList.add('anim-fade-up');
      });
    }
  } catch (e) {
    console.warn('expandAnimations failed', e);
  }
}

// Enable button interactions: ripple effect and stop initial pulse when interacted
function enableButtonInteractions() {
  try {
    document.querySelectorAll('.btn').forEach(btn => {
      // ensure proper positioning for ripple
      const cs = window.getComputedStyle(btn);
      if (cs.position === 'static') btn.style.position = 'relative';
      btn.style.overflow = 'hidden';

      btn.addEventListener('pointerdown', (e) => {
        // remove pulse if present
        btn.classList.remove('anim-pulse');

        // create ripple
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.2;
        const span = document.createElement('span');
        span.className = 'ripple';
        span.style.width = span.style.height = `${size}px`;
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        span.style.left = `${x}px`;
        span.style.top = `${y}px`;
        btn.appendChild(span);
        // cleanup after animation
        span.addEventListener('animationend', () => { try { span.remove(); } catch (err) {} });
        setTimeout(() => { if (span.parentNode) span.remove(); }, 800);
      });

      btn.addEventListener('click', () => {
        btn.classList.remove('anim-pulse');
      });
    });
  } catch (e) {
    console.warn('enableButtonInteractions failed', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
  updateCartCount();
  initHomeFrame();
  initRegistrationValidation();
  initCataloguePage();
  initCartPage();
  initCheckoutPage();
  // Initialize animations after rendering
  if (typeof initAnimations === 'function') initAnimations();
  if (typeof enableButtonInteractions === 'function') enableButtonInteractions();
  initLoginForm();
  const checkoutBtn = document.getElementById('checkout-btn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', placeOrderCOD);
    const total = calculateTotal();
    checkoutBtn.textContent = `Place Order — ${formatPrice(total)}`;
  }
  if (!localStorage.getItem('user_country')) {
    detectUserCountry();
  } else {
    const stored = localStorage.getItem('user_country');
    if (stored && CURRENCY_CONFIG[stored]) {
      userCountry = stored;
      userCurrency = CURRENCY_CONFIG[stored];
      updateCurrencyDisplay();
    }
  }
  const ordersListEl = document.getElementById('orders-list');
  if (ordersListEl) {
    const orders = getOrders();
    ordersListEl.innerHTML = '';
    if (!orders || !orders.length) {
      const noOrders = document.getElementById('no-orders');
      if (noOrders) noOrders.style.display = 'block';
    } else {
      for (const o of orders) ordersListEl.appendChild(renderOrderWithActions(o));
    }
  }
});
