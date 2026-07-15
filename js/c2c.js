// Helper para obtener la clave de almacenamiento específica del usuario
function getPublicationsStorageKey() {
    const userEmail = localStorage.getItem('userEmail');
    return userEmail ? `userPublications_${userEmail}` : null;
}

// --- Lógica para la página "Publicar Producto" ---
function initPublishProductPage() {
    const publishProductForm = document.getElementById('publishProductForm');
    if (!publishProductForm) return;

    publishProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const feedbackEl = document.getElementById('publishFeedback');
        const storageKey = getPublicationsStorageKey();

        if (!storageKey) {
            feedbackEl.innerHTML = `<div class="message-error">Debes iniciar sesión para publicar un producto.</div>`;
            return;
        }

        const product = {
            id: Date.now(),
            name: document.getElementById('productName').value,
            price: parseFloat(document.getElementById('productPrice').value),
            description: document.getElementById('productDescription').value,
            photo: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop' // Foto simulada
        };

        let publications = JSON.parse(localStorage.getItem(storageKey) || '[]');
        publications.unshift(product);
        localStorage.setItem(storageKey, JSON.stringify(publications));

        feedbackEl.innerHTML = `<div class="message-success">Publicado (simulado)</div>`;
        publishProductForm.reset();
        renderMyPublications(); // Actualiza la lista de publicaciones en segundo plano

        setTimeout(() => {
            const publicationsTab = document.querySelector('.c2c-tab[data-view="publications"]');
            if (publicationsTab) {
                publicationsTab.click();
            }
            feedbackEl.innerHTML = '';
        }, 1500);
    });
}

// --- Lógica para la página "Mis Publicaciones" ---
function renderMyPublications() {
    const myPublicationsList = document.getElementById('myPublicationsList');
    if (!myPublicationsList) return;

    const storageKey = getPublicationsStorageKey();
    if (!storageKey) {
        myPublicationsList.innerHTML = `<p class="text-center text-gray-500">Debes <a href="login.html" class="text-naranja font-semibold">iniciar sesión</a> para ver tus publicaciones.</p>`;
        return;
    }

    const publications = JSON.parse(localStorage.getItem(storageKey) || '[]');

    if (publications.length === 0) {
        myPublicationsList.innerHTML = `<p class="text-center text-gray-500">Aún no has publicado ningún producto.</p>`;
    } else {
        myPublicationsList.innerHTML = publications.map(product => `
            <div class="publication-card" id="publication-${product.id}">
                <img src="${product.photo}" alt="${product.name}" class="publication-photo">
                <div class="publication-body">
                    <h4 class="publication-title">${product.name}</h4>
                    <p class="publication-price">$${product.price.toFixed(2)}</p>
                    <p class="publication-description">${product.description}</p>
                </div>
                <div class="publication-actions">
                    <button class="btn btn-secondary btn-small" onclick="window.c2c.editPublication(${product.id})">Editar</button>
                    <button class="btn btn-danger btn-small" onclick="window.c2c.deletePublication(${product.id})">Eliminar</button>
                </div>
            </div>
        `).join('');
    }
}

function editPublication(productId) {
    const storageKey = getPublicationsStorageKey();
    if (!storageKey) return;

    const publications = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const product = publications.find(item => item.id === productId);
    if (!product) return;

    const newName = prompt('Nuevo nombre del producto', product.name);
    if (newName === null) return;

    const newPrice = prompt('Nuevo precio', product.price.toString());
    if (newPrice === null) return;

    const newDescription = prompt('Nueva descripción', product.description);
    if (newDescription === null) return;

    Object.assign(product, {
        name: newName.trim() || product.name,
        price: parseFloat(newPrice) || product.price,
        description: newDescription.trim() || product.description
    });

    localStorage.setItem(storageKey, JSON.stringify(publications));
    renderMyPublications();
}

function deletePublication(productId) {
    if (!confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
        return;
    }

    const storageKey = getPublicationsStorageKey();
    if (!storageKey) return;

    let publications = JSON.parse(localStorage.getItem(storageKey) || '[]');
    publications = publications.filter(p => p.id !== productId);
    localStorage.setItem(storageKey, JSON.stringify(publications));

    const cardToRemove = document.getElementById(`publication-${productId}`);
    if (cardToRemove) {
        cardToRemove.style.animation = 'fadeOut 0.5s ease forwards';
        cardToRemove.addEventListener('animationend', renderMyPublications, { once: true });
    } else {
        renderMyPublications();
    }
}

function initMyPublicationsPage() {
    renderMyPublications();
}

// --- Lógica para la página de Subasta ---
function initAuctionPage() {
    const auctionTimerEl = document.getElementById('auctionTimer');
    const bidForm = document.getElementById('bidForm');
    if (!auctionTimerEl || !bidForm) return;

    // Evitar duplicar el temporizador si se cambia de pestaña
    if (auctionTimerEl.dataset.initialized) return;
    auctionTimerEl.dataset.initialized = 'true';

    let timeLeft = 300; // 5 minutos
    let botInterval;

    const updateTimer = () => {
        timeLeft--;
        const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
        const seconds = (timeLeft % 60).toString().padStart(2, '0');
        auctionTimerEl.textContent = `${minutes}:${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            clearInterval(botInterval);
            auctionTimerEl.textContent = "Finalizada";
            auctionTimerEl.closest('.auction-timer-card').classList.add('finished');
            bidForm.style.display = 'none';
        }
    };

    const timerInterval = setInterval(updateTimer, 1000);

    const botNames = ['AventureroX', 'MontañistaPro', 'Explorador_7', 'Ruta_Adicto'];
    const simulateBotBid = () => {
        if (timeLeft <= 10) return;

        const currentBidEl = document.getElementById('currentBid');
        const bidsList = document.getElementById('bidsList');
        const currentBid = parseFloat(currentBidEl.textContent.replace('$', ''));
        
        const newBid = currentBid + Math.random() * 5 + 1;
        currentBidEl.textContent = `$${newBid.toFixed(2)}`;
        
        const botName = botNames[Math.floor(Math.random() * botNames.length)];
        const newBidLi = document.createElement('li');
        newBidLi.innerHTML = `<span class="font-semibold text-bosque">${botName}</span> ofertó <span class="text-naranja font-bold">$${newBid.toFixed(2)}</span>`;
        newBidLi.style.animation = 'slideIn 0.5s ease forwards';
        bidsList.prepend(newBidLi);

        const bidAmountInput = document.getElementById('bidAmount');
        if(bidAmountInput) {
            bidAmountInput.min = Math.ceil(newBid + 1);
            bidAmountInput.placeholder = `> $${Math.ceil(newBid)}`;
        }
    };
    botInterval = setInterval(simulateBotBid, Math.random() * 8000 + 7000);

    bidForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const bidAmountInput = document.getElementById('bidAmount');
        const bidAmount = parseFloat(bidAmountInput.value);
        const currentBidEl = document.getElementById('currentBid');
        const bidsList = document.getElementById('bidsList');
        const bidFeedback = document.getElementById('bidFeedback');
        const currentBid = parseFloat(currentBidEl.textContent.replace('$', ''));

        if (bidAmount > currentBid) {
            currentBidEl.textContent = `$${bidAmount.toFixed(2)}`;
            const userName = localStorage.getItem('userName') || 'Tú';
            const newBidLi = document.createElement('li');
            newBidLi.innerHTML = `<span class="font-semibold text-bosque">${userName}</span> ofertó <span class="text-naranja font-bold">$${bidAmount.toFixed(2)}</span>`;
            newBidLi.style.animation = 'slideIn 0.5s ease forwards';
            bidsList.prepend(newBidLi);

            bidFeedback.innerHTML = `<div class="message-success">Oferta registrada (simulado)</div>`;
            bidAmountInput.value = '';
            bidAmountInput.min = bidAmount + 1;
            bidAmountInput.placeholder = `> $${bidAmount}`;

            setTimeout(() => { bidFeedback.innerHTML = ''; }, 2500);
        } else {
            bidFeedback.innerHTML = `<div class="message-error">Tu oferta debe ser mayor a la actual.</div>`;
            setTimeout(() => { bidFeedback.innerHTML = ''; }, 2500);
        }
    });
}

// --- Lógica de Pestañas y Inicialización ---
function setupC2CTabs() {
    const tabsContainer = document.getElementById('c2c-tabs');
    const viewsContainer = document.getElementById('c2c-views-container');
    if (!tabsContainer || !viewsContainer) return;

    const tabs = tabsContainer.querySelectorAll('.c2c-tab');
    const views = viewsContainer.querySelectorAll('.c2c-view');

    tabsContainer.addEventListener('click', (event) => {
        const clickedTab = event.target.closest('.c2c-tab');
        if (!clickedTab) return;

        const viewName = clickedTab.dataset.view;

        tabs.forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');

        views.forEach(view => {
            view.classList.toggle('hidden', view.id !== `c2c-${viewName}-view`);
        });

        // Inicializar la subasta solo cuando se ve por primera vez
        if (viewName === 'auction') {
            initAuctionPage();
        }
    });
}

// --- Inicialización General ---
document.addEventListener('DOMContentLoaded', () => {
    // Si estamos en la página de perfil y el panel de vendedor existe
    if (document.getElementById('sellerDashboard')) {
        setupC2CTabs(); // Configura los listeners de las pestañas
        initPublishProductPage(); // Configura el formulario de publicación
        initMyPublicationsPage(); // Carga las publicaciones iniciales
    }
});

// Exponer funciones al objeto window para poder llamarlas desde el HTML (onclick)
window.c2c = {
    editPublication,
    deletePublication
};