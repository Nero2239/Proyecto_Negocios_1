document.addEventListener('DOMContentLoaded', () => {
    // --- Lógica para Publicar Producto ---
    const publishProductForm = document.getElementById('publishProductForm');
    if (publishProductForm) {
        publishProductForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const feedbackEl = document.getElementById('publishFeedback');

            const product = {
                id: Date.now(),
                name: document.getElementById('productName').value,
                price: parseFloat(document.getElementById('productPrice').value),
                description: document.getElementById('productDescription').value,
                photo: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop' // Foto simulada
            };

            // Guardar en localStorage
            let publications = JSON.parse(localStorage.getItem('userPublications') || '[]');
            publications.unshift(product);
            localStorage.setItem('userPublications', JSON.stringify(publications));

            // Mostrar mensaje y redirigir
            feedbackEl.innerHTML = `<div class="message-success">¡Producto publicado con éxito! Redirigiendo...</div>`;
            publishProductForm.reset();

            setTimeout(() => {
                window.location.href = 'mis-publicaciones.html';
            }, 2000);
        });
    }

    // --- Lógica para Mis Publicaciones ---
    const myPublicationsList = document.getElementById('myPublicationsList');
    if (myPublicationsList) {
        const publications = JSON.parse(localStorage.getItem('userPublications') || '[]');

        if (publications.length === 0) {
            myPublicationsList.innerHTML = `<p class="text-center text-gray-500">Aún no has publicado ningún producto.</p>`;
        } else {
            myPublicationsList.innerHTML = publications.map(product => `
                <div class="publication-card">
                    <img src="${product.photo}" alt="${product.name}" class="publication-photo">
                    <div class="publication-body">
                        <h4 class="publication-title">${product.name}</h4>
                        <p class="publication-price">$${product.price.toFixed(2)}</p>
                        <p class="publication-description">${product.description}</p>
                    </div>
                    <div class="publication-actions">
                        <button class="btn btn-secondary btn-small" onclick="alert('Función de editar no implementada.')">Editar</button>
                        <button class="btn btn-secondary btn-small" onclick="alert('Función de eliminar no implementada.')">Eliminar</button>
                    </div>
                </div>
            `).join('');
        }
    }

    // --- Lógica para Subasta ---
    const auctionTimerEl = document.getElementById('auctionTimer');
    const bidForm = document.getElementById('bidForm');

    if (auctionTimerEl) {
        let timeLeft = 300; // 5 minutos
        const timerInterval = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
            const seconds = (timeLeft % 60).toString().padStart(2, '0');
            auctionTimerEl.textContent = `${minutes}:${seconds}`;

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                auctionTimerEl.textContent = "Finalizada";
                bidForm.style.display = 'none';
            }
        }, 1000);
    }

    if (bidForm) {
        bidForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const bidAmountInput = document.getElementById('bidAmount');
            const bidAmount = parseFloat(bidAmountInput.value);
            const currentBidEl = document.getElementById('currentBid');
            const bidsList = document.getElementById('bidsList');
            const bidFeedback = document.getElementById('bidFeedback');

            const currentBid = parseFloat(currentBidEl.textContent.replace('$', ''));

            if (bidAmount > currentBid) {
                // Actualizar la oferta actual
                currentBidEl.textContent = `$${bidAmount.toFixed(2)}`;

                // Añadir a la lista de ofertas
                const userName = localStorage.getItem('userName') || 'Tú';
                const newBidLi = document.createElement('li');
                newBidLi.innerHTML = `<span class="font-semibold text-bosque">${userName}</span> ofertó <span class="text-naranja font-bold">$${bidAmount.toFixed(2)}</span>`;
                bidsList.prepend(newBidLi);

                // Mostrar feedback
                bidFeedback.innerHTML = `<div class="message-success">¡Oferta registrada!</div>`;
                bidAmountInput.value = '';
                bidAmountInput.min = bidAmount + 1; // Siguiente oferta debe ser mayor

                setTimeout(() => {
                    bidFeedback.innerHTML = '';
                }, 2500);

            } else {
                bidFeedback.innerHTML = `<div class="message-error">Tu oferta debe ser mayor a la actual.</div>`;
                setTimeout(() => {
                    bidFeedback.innerHTML = '';
                }, 2500);
            }
        });
    }
});