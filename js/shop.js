const productos = [
    { id: 1, nombre: 'Tienda Pro-Series', precio: 120, descripcion: 'Resistente al agua y viento, para 2 personas.', detalle: 'Material reforzado y costuras selladas.', esRecomendado: true, categoria: 'tiendas', descuento: 0, rating: 4.9, stock: 8 },
    { id: 2, nombre: 'Saco Térmico -5°C', precio: 85, descripcion: 'Máximo confort en noches frías de montaña.', detalle: 'Aislamiento térmico premium.', esRecomendado: false, categoria: 'sacos', descuento: 10, rating: 4.7, stock: 5 },
    { id: 3, nombre: 'Linterna Solar LED', precio: 30, descripcion: 'Recargable y duradera.', detalle: 'Tres modos de iluminación y carga solar integrada.', esRecomendado: true, categoria: 'iluminacion', descuento: 0, rating: 4.8, stock: 12 },
    { id: 4, nombre: 'Mochila Ergonómica 50L', precio: 95, descripcion: 'Espacio y comodidad para travesías largas.', detalle: 'Soporte lumbar y compartimentos.', esRecomendado: false, categoria: 'mochilas', descuento: 15, rating: 4.6, stock: 6 },
    { id: 5, nombre: 'Tienda Compact 1P', precio: 70, descripcion: 'Ligera y fácil de montar.', detalle: 'Perfecta para rutas rápidas.', esRecomendado: false, categoria: 'tiendas', descuento: 20, rating: 4.5, stock: 4 },
    { id: 6, nombre: 'Saco UltraLight 0°C', precio: 110, descripcion: 'Aislamiento alto con bajo peso.', detalle: 'Diseñado para alta montaña.', esRecomendado: true, categoria: 'sacos', descuento: 0, rating: 4.9, stock: 7 },
    { id: 7, nombre: 'Luz Frontal PRO', precio: 22, descripcion: 'Fuerte y cómoda.', detalle: 'Varios modos y larga duración.', esRecomendado: false, categoria: 'iluminacion', descuento: 25, rating: 4.4, stock: 10 },
    { id: 8, nombre: 'Organizador de Mochila', precio: 18, descripcion: 'Bolsillos y funda impermeable.', detalle: 'Mantén tus objetos ordenados.', esRecomendado: false, categoria: 'accesorios', descuento: 5, rating: 4.3, stock: 9 },
];

const state = {
    cart: JSON.parse(localStorage.getItem('campingCart') || '[]'),
    activeFilter: 'all',
    activeQuery: '',
    activeCategory: 'all',
    selectedProductId: null,
};

function formatPrice(value) {
    return `$${value.toFixed(2)}`;
}

function saveCart() {
    localStorage.setItem('campingCart', JSON.stringify(state.cart));
}

function getCartCount() {
    return state.cart.reduce((total, item) => total + item.quantity, 0);
}

function renderProducts() {
    const grid = document.getElementById('productGrid');
    const detail = document.getElementById('productDetail');
    const cartCount = document.getElementById('cartCount');
    const cartCountInline = document.getElementById('cartCountInline');

    if (!grid) return;

    const list = productos.filter((producto) => {
        if (state.activeFilter === 'recommended' && !producto.esRecomendado) return false;
        if (state.activeCategory !== 'all' && producto.categoria !== state.activeCategory) return false;
        if (state.activeQuery && !(`${producto.nombre} ${producto.descripcion}`).toLowerCase().includes(state.activeQuery)) return false;
        return true;
    });

    const html = list.map((producto) => {
        const recomendado = producto.esRecomendado ? '<span class="product-recommendation">Recomendado</span>' : '';
        const descuentoBadge = producto.descuento ? `<span class="product-discount">-${producto.descuento}%</span>` : '';
        return `
            <article class="product-card">
                ${recomendado}
                ${descuentoBadge}
                <div class="product-image">📸</div>
                <div class="product-body">
                    <h2 class="product-title">${producto.nombre}</h2>
                    <p class="product-description">${producto.descripcion}</p>
                    <p class="product-price">${formatPrice(producto.precio)}</p>
                    <div class="product-actions">
                        <button class="btn btn-secondary" type="button" onclick="window.shop.showProductDetail(${producto.id})">Ver Detalle</button>
                    </div>
                </div>
            </article>
        `;
    }).join('');

    let placeholders = '';
    if (list.length > 0 && list.length < 4) {
        for (let i = 0; i < 4 - list.length; i += 1) {
            placeholders += '<div class="product-card placeholder" aria-hidden="true"></div>';
        }
    }

    grid.innerHTML = html + placeholders;
    if (cartCount) {
        cartCount.textContent = getCartCount();
    }
    if (cartCountInline) {
        cartCountInline.textContent = `${getCartCount()} artículos`;
    }
    if (detail && !state.selectedProductId) {
        detail.classList.add('hidden');
        detail.innerHTML = '';
    }
}

function showProductDetail(id) {
    const producto = productos.find((item) => item.id === id);
    if (!producto) return;

    state.selectedProductId = id;
    const detail = document.getElementById('productDetail');
    if (!detail) return;

    document.body.classList.add('modal-open');
    detail.innerHTML = `
        <div class="product-modal-backdrop" onclick="window.shop.closeProductModal()">
            <div class="product-modal-card" onclick="event.stopPropagation();">
                <button class="detail-close-btn" type="button" onclick="window.shop.closeProductModal()" aria-label="Cerrar ventana">
                    <i class="bi bi-x-lg"></i>
                </button>
                <div class="left">
                    <div class="detalle-imagen">📸</div>
                    <div class="rounded-2xl bg-crema p-4 text-sm text-gray-700">
                        <p class="font-semibold text-bosque">${producto.nombre}</p>
                        <p class="mt-1">${producto.detalle}</p>
                    </div>
                </div>
                <div class="right">
                    <h2 class="text-2xl font-bold text-bosque mb-2">${producto.nombre}</h2>
                    <div class="flex items-center gap-4 mb-4">
                        <div class="text-yellow-400">★★★★★</div>
                        <div class="text-sm text-gray-500">(${producto.stock} disponibles)</div>
                    </div>
                    <p class="text-gray-700 mb-4">${producto.descripcion}</p>
                    <p class="text-3xl font-extrabold text-naranja mb-4">${formatPrice(producto.precio)}</p>
                    <ul class="text-gray-700 list-none mb-6 space-y-2">
                        <li>✓ Temperatura mínima: -5°C</li>
                        <li>✓ Peso: 1.8 kg</li>
                        <li>✓ Impermeable</li>
                        <li>✓ Ideal para montaña</li>
                    </ul>
                    <div class="flex items-center gap-3 mb-6">
                        <label class="text-sm font-semibold text-gray-700" for="quantityInput">Cantidad</label>
                        <input id="quantityInput" type="number" min="1" max="5" value="1" class="w-20 rounded-lg border border-gray-300 px-3 py-2" />
                    </div>
                    <div class="detalle-actions">
                        <button class="btn btn-welcome" type="button" onclick="window.shop.addToCart(${producto.id}, true)"><i class="bi bi-cart-check-fill"></i> Agregar al carrito</button>
                    </div>
                </div>
            </div>
            <div id="addFeedback" class="cart-feedback hidden"><i class="bi bi-cart-check-fill"></i></div>
        </div>
    `;
    detail.classList.remove('hidden');
}

function closeProductModal() {
    state.selectedProductId = null;
    const detail = document.getElementById('productDetail');
    if (detail) {
        detail.classList.add('hidden');
        detail.innerHTML = '';
    }
    document.body.classList.remove('modal-open');
}

function showAddFeedback() {
    const feedback = document.getElementById('addFeedback');
    if (!feedback) return;

    feedback.classList.remove('hidden');
    clearTimeout(feedback.hideTimer);
    feedback.hideTimer = setTimeout(() => {
        feedback.classList.add('hidden');
    }, 1800);
}

function addToCart(productId, showFeedback = false) {
    const producto = productos.find((item) => item.id === productId);
    const quantityInput = document.getElementById('quantityInput');
    const quantity = quantityInput ? Number(quantityInput.value) || 1 : 1;

    if (!producto) return;

    const existing = state.cart.find((item) => item.id === productId);
    if (existing) {
        existing.quantity += quantity;
    } else {
        state.cart.push({ id: productId, name: producto.nombre, price: producto.precio, quantity });
    }

    saveCart();
    renderCart();
    renderProducts();

    if (showFeedback) {
        showAddFeedback();
    }
}

function renderCart() {
    const cartBody = document.getElementById('cartBody');
    const cartSummary = document.getElementById('cartSummary');
    const cartEmpty = document.getElementById('cartEmpty');
    const recommendedProducts = document.getElementById('recommendedProducts');
    const checkoutButton = document.getElementById('checkoutButton');

    if (!cartBody || !cartSummary || !cartEmpty) return;

    if (state.cart.length === 0) {
        cartEmpty.classList.remove('hidden');
        cartBody.innerHTML = '';
        cartSummary.innerHTML = '';
    } else {
        cartEmpty.classList.add('hidden');

        const subtotal = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartBody.innerHTML = state.cart.map((item) => `
            <div class="flex items-center justify-between border-b border-gray-200 py-3">
                <div>
                    <p class="font-semibold text-bosque">${item.name}</p>
                    <p class="text-sm text-gray-500">${formatPrice(item.price)} c/u</p>
                </div>
                <div class="flex items-center gap-2">
                    <button class="rounded-full border px-2 py-1" type="button" onclick="window.shop.changeQuantity(${item.id}, -1)">-</button>
                    <span class="min-w-6 text-center">${item.quantity}</span>
                    <button class="rounded-full border px-2 py-1" type="button" onclick="window.shop.changeQuantity(${item.id}, 1)">+</button>
                    <button class="ml-2 text-sm text-red-500" type="button" onclick="window.shop.removeFromCart(${item.id})">Quitar</button>
                </div>
            </div>
        `).join('');

        cartSummary.innerHTML = `
            <div class="flex items-center justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${formatPrice(subtotal)}</span>
            </div>
            <div class="flex items-center justify-between text-lg font-bold text-bosque">
                <span>Total</span>
                <span>${formatPrice(subtotal)}</span>
            </div>
            <a href="checkout.html" class="btn btn-primary w-full mt-4 inline-flex justify-center" id="checkoutButton">Checkout</a>
        `;
    }

    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {
            closeCart();
        });
    }

    if (recommendedProducts) {
        const recommended = productos.filter((producto) => producto.esRecomendado).slice(0, 3);
        recommendedProducts.innerHTML = recommended.map((producto) => `
            <div class="recommended-card">
                <div class="recommended-avatar"><i class="bi bi-person-circle"></i></div>
                <div class="recommended-content">
                    <h4>${producto.nombre}</h4>
                    <p class="text-sm text-gray-600">${producto.descripcion}</p>
                    <p class="text-sm font-semibold text-naranja mt-2">${formatPrice(producto.precio)}</p>
                </div>
                <button class="btn btn-welcome btn-small" type="button" onclick="window.shop.addToCart(${producto.id})">Agregar</button>
            </div>
        `).join('');
    }
}

function changeQuantity(productId, delta) {
    const item = state.cart.find((entry) => entry.id === productId);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        state.cart = state.cart.filter((entry) => entry.id !== productId);
    }
    saveCart();
    renderCart();
    renderProducts();
}

function removeFromCart(productId) {
    state.cart = state.cart.filter((item) => item.id !== productId);
    saveCart();
    renderCart();
    renderProducts();
}

function openCart() {
    const cartPage = document.getElementById('cartPage');
    if (!cartPage) return;
    cartPage.classList.remove('hidden');
    document.body.classList.add('modal-open');
    document.body.classList.add('cart-open');
    renderCart();
}

function closeCart() {
    const cartPage = document.getElementById('cartPage');
    if (!cartPage) return;
    cartPage.classList.add('hidden');
    document.body.classList.remove('modal-open');
    document.body.classList.remove('cart-open');
}

function showCartPanel() {
    openCart();
}

function toggleCartPanel() {
    const cartPage = document.getElementById('cartPage');
    if (!cartPage) return;
    if (cartPage.classList.contains('hidden')) {
        openCart();
    } else {
        closeCart();
    }
}

function initShop() {
    const searchInput = document.getElementById('searchInput');
    const categorySelect = document.getElementById('categorySelect');
    const filterAll = document.getElementById('filterAll');
    const filterRecommended = document.getElementById('filterRecommended');
    const openCartButton = document.getElementById('openCartButton');
    const closeCartButton = document.getElementById('closeCartButton');

    if (searchInput) {
        searchInput.addEventListener('input', (event) => {
            state.activeQuery = event.target.value.trim().toLowerCase();
            renderProducts();
        });
    }

    if (categorySelect) {
        categorySelect.addEventListener('change', (event) => {
            state.activeCategory = event.target.value;
            renderProducts();
        });
    }

    if (filterAll) {
        filterAll.addEventListener('click', () => {
            state.activeFilter = 'all';
            renderProducts();
        });
    }

    if (filterRecommended) {
        filterRecommended.addEventListener('click', () => {
            state.activeFilter = 'recommended';
            renderProducts();
        });
    }

    if (openCartButton) {
        openCartButton.addEventListener('click', toggleCartPanel);
    }

    if (closeCartButton) {
        closeCartButton.addEventListener('click', toggleCartPanel);
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeProductModal();
            closeCart();
        }
    });

    renderProducts();
    renderCart();

    const shouldOpenCart = new URLSearchParams(window.location.search).get('openCart') === '1';
    if (shouldOpenCart) {
        showCartPanel();
    }
}

window.shop = {
    productos,
    renderProducts,
    showProductDetail,
    closeProductModal,
    addToCart,
    changeQuantity,
    removeFromCart,
    renderCart,
    toggleCartPanel,
    showCartPanel,
};

document.addEventListener('DOMContentLoaded', initShop);
