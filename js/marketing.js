// marketing.js - agrega publicaciones comunitarias y subastas a marketing.html

function getAllUserPublications() {
    // Busca claves en localStorage que sigan el patrón userPublications_<email>
    const publications = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        if (key.startsWith('userPublications_')) {
            try {
                const list = JSON.parse(localStorage.getItem(key) || '[]');
                list.forEach(item => publications.push(Object.assign({}, item)));
            } catch (e) {
                // Ignorar entradas inválidas
            }
        }
    }
    return publications;
}

function renderCommunityPublications() {
    const publications = getAllUserPublications();
    const grid = document.getElementById('publicationsGrid');
    const count = document.getElementById('publicationsCount');
    if (!grid) return;

    count.textContent = `${publications.length} publicaciones`;

    if (publications.length === 0) {
        grid.innerHTML = '<p class="text-gray-500">Aún no hay publicaciones disponibles.</p>';
        return;
    }

    grid.innerHTML = publications.map(p => `
        <div class="publication-card">
            <img src="${p.photo || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop'}" class="publication-photo" alt="${p.name}">
            <div class="publication-body">
                <h4 class="publication-title">${p.name}</h4>
                <p class="publication-price">$${(p.price||0).toFixed(2)}</p>
                <p class="publication-description">${p.description || ''}</p>
            </div>
            <div class="publication-actions">
                <button class="btn btn-secondary btn-small" onclick="window.marketing.showDetail(${p.id})">Ver</button>
            </div>
        </div>
    `).join('');
}

function findActiveAuctionsFromPublications() {
    // Para el prototipo, consideramos que cualquier publicación puede tener subasta si contiene auction:true
    const pubs = getAllUserPublications();
    return pubs.filter(p => p.auction === true || p.isAuction === true);
}

function renderActiveAuctions() {
    const auctions = findActiveAuctionsFromPublications();
    const count = document.getElementById('auctionsCount');
    const carouselInner = document.getElementById('auctionsCarouselInner');
    if (!carouselInner) return;

    count.textContent = `${auctions.length} subastas`;

    if (auctions.length === 0) {
        carouselInner.innerHTML = '<p class="text-gray-500">No hay subastas activas en este momento.</p>';
        return;
    }

    carouselInner.innerHTML = auctions.map(a => `
        <div class="auction-summary-card bg-white p-4 rounded-xl border">
            <div class="flex items-center gap-4">
                <img src="${a.photo || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop'}" class="w-28 h-20 object-cover rounded-md">
                <div class="flex-1">
                    <h4 class="font-bold text-bosque">${a.name}</h4>
                    <p class="text-sm text-gray-600">Oferta actual: <strong class="text-naranja">$${(a.currentBid||a.price||0).toFixed(2)}</strong></p>
                </div>
                <div>
                    <a href="profile.html#c2c-auction-view" class="btn btn-primary btn-small">Ir a subasta</a>
                </div>
            </div>
        </div>
    `).join('');

    // Hook carousel controls
    const prev = document.getElementById('auctionsPrev');
    const next = document.getElementById('auctionsNext');
    const viewport = document.getElementById('auctionsCarousel');
    if (prev && next && viewport) {
        prev.addEventListener('click', () => { viewport.scrollBy({ left: -340, behavior: 'smooth' }); });
        next.addEventListener('click', () => { viewport.scrollBy({ left: 340, behavior: 'smooth' }); });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    renderCommunityPublications();
    renderActiveAuctions();
    // Filters and search
    const btnAll = document.getElementById('filterAll');
    const btnUsed = document.getElementById('filterUsed');
    const btnAuctions = document.getElementById('filterAuctions');
    const search = document.getElementById('pubSearch');

    function applyFilter(mode) {
        const pubs = getAllUserPublications();
        let filtered = pubs;
        if (mode === 'used') filtered = pubs.filter(p => p.used === true || p.condition === 'used');
        if (mode === 'auctions') filtered = pubs.filter(p => p.auction === true || p.isAuction === true);
        if (search && search.value.trim()) {
            const q = search.value.trim().toLowerCase();
            filtered = filtered.filter(p => (p.name||'').toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q));
        }
        const grid = document.getElementById('publicationsGrid');
        const count = document.getElementById('publicationsCount');
        grid.innerHTML = filtered.length === 0 ? '<p class="text-gray-500">No hay resultados.</p>' : filtered.map(p => `
            <div class="publication-card">
                <img src="${p.photo || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop'}" class="publication-photo" alt="${p.name}">
                <div class="publication-body">
                    <h4 class="publication-title">${p.name}</h4>
                    <p class="publication-price">$${(p.price||0).toFixed(2)}</p>
                    <p class="publication-description">${p.description || ''}</p>
                </div>
                <div class="publication-actions">
                    <button class="btn btn-secondary btn-small" onclick="window.marketing.showDetail(${p.id})">Ver</button>
                </div>
            </div>
        `).join('');
        count.textContent = `${filtered.length} publicaciones`;
    }

    btnAll?.addEventListener('click', () => applyFilter('all'));
    btnUsed?.addEventListener('click', () => applyFilter('used'));
    btnAuctions?.addEventListener('click', () => applyFilter('auctions'));
    search?.addEventListener('input', () => applyFilter('all'));
    // initial apply
    applyFilter('all');
    // expose detail function
    window.marketing = window.marketing || {};
    window.marketing.showDetail = function (id) {
        const all = getAllUserPublications();
        const item = all.find(x => x.id === id);
        if (!item) return alert('Detalle no disponible');
        const container = document.getElementById('marketingDetail');
        if (!container) return;
        document.body.classList.add('modal-open');
        container.innerHTML = `
            <div class="product-modal-backdrop" onclick="window.marketing.closeDetail()">
                <div class="product-modal-card" onclick="event.stopPropagation();">
                    <button class="detail-close-btn" type="button" onclick="window.marketing.closeDetail()" aria-label="Cerrar ventana"><i class="bi bi-x-lg"></i></button>
                    <div class="modal-card-header">
                        <span class="text-sm uppercase tracking-[0.3em] text-naranja font-semibold">Publicación</span>
                        <h3>${item.name}</h3>
                    </div>
                    <div class="left">
                        <div class="detalle-imagen"><img src="${item.photo}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:12px;"/></div>
                        <div class="rounded-2xl bg-crema p-4 text-sm text-gray-700">
                            <p class="font-semibold text-bosque">Por: ${item.owner || 'Usuario'}</p>
                            <p class="mt-1">${item.description}</p>
                        </div>
                    </div>
                    <div class="right">
                        <p class="text-gray-700 mb-4">Precio: <strong class="text-naranja">$${(item.price||0).toFixed(2)}</strong></p>
                        ${item.auction ? `<p class="text-sm text-gray-600">Esta publicación participa en subasta. Oferta actual: <strong class="text-naranja">$${(item.currentBid||item.price||0).toFixed(2)}</strong></p>
                        <div class="mb-3">
                            <label class="text-sm text-gray-600">Tu oferta (USD)</label>
                            <input id="bidInput" type="number" min="1" value="${(item.currentBid||item.price||0)}" class="mt-1 px-3 py-2 rounded-lg border w-full" />
                        </div>` : ''}
                        <div class="detalle-actions">
                            ${item.auction ? `<button id="makeBidBtn" class="btn btn-primary">Ofertar</button>` : ''}
                            <button class="btn btn-secondary" onclick="window.marketing.closeDetail()">Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        // attach bid handler if auction
        if (item.auction) {
            setTimeout(() => {
                const btn = document.getElementById('makeBidBtn');
                const input = document.getElementById('bidInput');
                if (!btn || !input) return;
                btn.addEventListener('click', () => {
                    const val = parseFloat(input.value || '0');
                    if (isNaN(val) || val <= 0) return alert('Ingresa un monto válido');
                    if (val <= (item.currentBid || item.price || 0)) return alert('La oferta debe ser mayor a la actual');
                    // persist bid to the publication in localStorage
                    // find the owner key and update the item
                    for (let i = 0; i < localStorage.length; i++) {
                        const k = localStorage.key(i);
                        if (!k || !k.startsWith('userPublications_')) continue;
                        try {
                            const arr = JSON.parse(localStorage.getItem(k) || '[]');
                            const idx = arr.findIndex(x => x.id === item.id);
                            if (idx !== -1) {
                                arr[idx].currentBid = val;
                                localStorage.setItem(k, JSON.stringify(arr));
                                alert('Oferta registrada: $' + val.toFixed(2));
                                window.marketing.closeDetail();
                                renderCommunityPublications();
                                renderActiveAuctions();
                                return;
                            }
                        } catch (e) { /* ignore parse errors */ }
                    }
                    alert('No se pudo guardar la oferta');
                });
            }, 100);
        }
        container.classList.remove('hidden');
    };
    window.marketing.closeDetail = function () {
        const container = document.getElementById('marketingDetail');
        if (!container) return;
        container.classList.add('hidden');
        container.innerHTML = '';
        document.body.classList.remove('modal-open');
    };
});
