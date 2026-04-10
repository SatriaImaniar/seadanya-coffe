// Data Menu Kopi
const coffeeMenu = [
    { id: 1, name: ' Kopi Susu Late "HAZELNUT"', price: 11000, img: 'images/img-1.png' },
    { id: 2, name: ' Kopi Susu Late "TIRAMISU"', price: 11000, img: 'images/img-2.png' },
    { id: 3, name: ' Kopi Susu Late "No Sugar"', price: 11000, img: 'images/img-3.png' },
    { id: 4, name: ' Kopi Susu Late "Durian"', price: 11000, img: 'images/img-4.png' },
    { id: 5, name: ' Kopi Susu Late "Almond"', price: 11000, img: 'images/img-5.png' },
    { id: 6, name: ' Kopi Susu Late "Dauble Es Hot"', price: 11000, img: 'images/img-6.png' },
    { id: 7, name: ' Kopi Susu "No Sugar"', price: 10000, img: 'images/img-7.png' },
    { id: 8, name: ' Kopi Susu "Lees Sugar"', price: 12000, img: 'images/img-8.png' },
    { id: 9, name: ' Kopi Susu "Doubleshot Less Sugar (Strong Coffe)"', price: 24000, img: 'images/img-9.png' },
    { id: 10, name: ' Kopi Susu "Sweet Soft Coffe"', price: 24000, img: 'images/img-10.png' }
    
];

// State Management
let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];
let currentUser = localStorage.getItem('currentUser') || 'pelanggan'; // Default: pelanggan
let orders = JSON.parse(localStorage.getItem('orders')) || [];

// DOM Elements
const menuGrid = document.getElementById('menuGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.querySelector('.close-cart');
const cartItemsContainer = document.getElementById('cartItems');
const totalPriceEl = document.getElementById('totalPrice');
const cartCountEl = document.getElementById('cartCount');
const checkoutBtn = document.getElementById('checkoutBtn');
const loginBtn = document.getElementById('loginBtn');
const userDropdown = document.getElementById('userDropdown');
const loginCustomer = document.getElementById('loginCustomer');
const loginAdmin = document.getElementById('loginAdmin');
const logoutBtn = document.getElementById('logoutBtn');
const userStatus = document.getElementById('userStatus');
const adminSection = document.getElementById('admin-dashboard');
const adminDashLink = document.getElementById('adminDashLink');
const orderTableBody = document.getElementById('orderTableBody');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const toast = document.getElementById('toast');

// New Modal Elements
const checkoutModal = document.getElementById('checkoutModal');
const closeModal = document.querySelector('.close-modal');
const checkoutForm = document.getElementById('checkoutForm');
const paymentMethod = document.getElementById('paymentMethod');
const qrisSection = document.getElementById('qrisSection');

// --- Initialization ---
function init() {
    renderMenu();
    updateCartUI();
    checkAuth();
    if (currentUser === 'barista') renderAdminDashboard();
}

// --- Auth Mock Logic ---
loginBtn.addEventListener('click', () => userDropdown.classList.toggle('show'));

loginCustomer.addEventListener('click', () => {
    setUser('pelanggan');
    showToast('Masuk sebagai Pelanggan');
});

loginAdmin.addEventListener('click', () => {
    setUser('barista');
    showToast('Masuk sebagai Barista (Admin)');
});

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    currentUser = 'pelanggan';
    setUser('pelanggan');
    showToast('Berhasil Logout');
});

function setUser(role) {
    currentUser = role;
    localStorage.setItem('currentUser', role);
    userDropdown.classList.remove('show');
    checkAuth();
    location.reload(); // Refresh to update view
}

function checkAuth() {
    if (currentUser === 'barista') {
        userStatus.innerText = 'Admin Barista';
        adminSection.style.display = 'block';
        adminDashLink.style.display = 'block';
        logoutBtn.style.display = 'block';
    } else {
        userStatus.innerText = 'Login';
        adminSection.style.display = 'none';
        adminDashLink.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}

// --- Menu Rendering ---
function renderMenu() {
    menuGrid.innerHTML = '';
    coffeeMenu.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p class="price">Rp ${item.price.toLocaleString()}</p>
            <button class="btn-add" onclick="addToCart(${item.id})">Add to Cart</button>
        `;
        menuGrid.appendChild(card);
    });
}

// --- Cart Logic ---
window.addToCart = (id) => {
    if (currentUser === 'barista') {
        showToast('Admin tidak bisa memesan!');
        return;
    }
    const product = coffeeMenu.find(p => p.id === id);
    cart.push(product);
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    updateCartUI();
    showToast(`${product.name} ditambahkan ke keranjang`);
};

function updateCartUI() {
    cartCountEl.innerText = cart.length;
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>Rp ${item.price.toLocaleString()}</p>
            </div>
            <i class="fas fa-trash" style="margin-left:auto; cursor:pointer; color:#ff4d4d;" onclick="removeFromCart(${index})"></i>
        `;
        cartItemsContainer.appendChild(div);
    });

    totalPriceEl.innerText = `Rp ${total.toLocaleString()}`;
}

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    updateCartUI();
};

cartBtn.addEventListener('click', () => cartModal.classList.add('active'));
closeCart.addEventListener('click', () => cartModal.classList.remove('active'));

// --- Checkout Flow ---
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Keranjang masih kosong!');
        return;
    }
    cartModal.classList.remove('active');
    checkoutModal.classList.add('active');
});

closeModal.addEventListener('click', () => checkoutModal.classList.remove('active'));

paymentMethod.addEventListener('change', (e) => {
    if (e.target.value === 'QRIS') {
        qrisSection.style.display = 'block';
    } else {
        qrisSection.style.display = 'none';
    }
});

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const customerName = document.getElementById('customerName').value;
    const customerAddress = document.getElementById('customerAddress').value;
    const customerWA = document.getElementById('customerWA').value;
    const method = paymentMethod.value;

    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const itemNames = cart.map(item => item.name).join(', ');

    const newOrder = {
        id: Date.now(),
        customer: customerName,
        address: customerAddress,
        phone: customerWA,
        items: itemNames,
        total: total,
        method: method,
        status: 'Diproses'
    };

    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    // WhatsApp Integration
    const waMessage = `Halo Seadanya Kopi, saya *${customerName}* ingin konfirmasi pesanan:
    
*Pesanan:* ${itemNames}
*Total:* Rp ${total.toLocaleString()}
*Alamat:* ${customerAddress}
*Metode Bayar:* ${method}

Mohon segera diproses ya, terima kasih!`;

    const waUrl = `https://wa.me/6285693154900?text=${encodeURIComponent(waMessage)}`; // Ganti dengan nomor asli jika perlu
    window.open(waUrl, '_blank');

    // Reset State
    cart = [];
    localStorage.removeItem('coffeeCart');
    updateCartUI();
    checkoutModal.classList.remove('active');
    checkoutForm.reset();
    qrisSection.style.display = 'none';

    showToast('Pesanan Terkirim ke WhatsApp & Barista!');
    if (currentUser === 'barista') renderAdminDashboard();
});

// --- Admin Dashboard Logic ---
function renderAdminDashboard() {
    orderTableBody.innerHTML = '';
    orders.forEach((order, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${order.items}</td>
            <td>Rp ${order.total.toLocaleString()}</td>
            <td>${order.address || '-'}</td>
            <td>${order.method || '-'}</td>
            <td><span class="badge">${order.status}</span></td>
            <td>
                <button class="btn-serve" onclick="completeOrder(${order.id})">Sajikan/Selesai</button>
            </td>
        `;
        orderTableBody.appendChild(tr);
    });
}

window.completeOrder = (id) => {
    orders = orders.filter(o => o.id !== id);
    localStorage.setItem('orders', JSON.stringify(orders));
    renderAdminDashboard();
    showToast('Pesanan telah disajikan!');
};

// --- UI Helpers ---
function showToast(message) {
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Hamburger Menu
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        navLinks.classList.remove('active');
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Close search/dropdown on click outside
window.addEventListener('click', (e) => {
    if (!loginBtn.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove('show');
    }
});

init();
