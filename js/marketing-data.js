// Semillas de publicaciones y subastas simuladas para marketing
(function () {
    const defaultMarketingImage = 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&h=300&fit=crop&auto=format&q=80';
    const samples = [
        { id: 101, name: 'Tienda usada - buen estado', price: 233, description: 'Tienda 2P, poco uso', photo: defaultMarketingImage, used: true, auction: false, owner: 'javi@ruta.com' },
        { id: 102, name: 'Mochila Expedición 70L', price: 450, description: 'Resistente a la intemperie', photo: defaultMarketingImage, used: true, auction: true, currentBid: 85, owner: 'marta@ruta.com' },
        { id: 103, name: 'Colchoneta aislante', price: 45, description: 'Ligera y compacta', photo: defaultMarketingImage, used: false, auction: false, owner: 'pepe@ruta.com' },
        { id: 104, name: 'Hornillo portátil', price: 35, description: 'Funciona con cartucho', photo: defaultMarketingImage, used: true, auction: false, owner: 'luis@ruta.com' },
        { id: 105, name: 'Set de cocina campamento', price: 25, description: 'Completo, poco uso', photo: defaultMarketingImage, used: true, auction: false, owner: 'ana@ruta.com' },
        { id: 106, name: 'Tienda Ligera 1P', price: 120, description: 'Compacta y resistente', photo: defaultMarketingImage, used: false, auction: true, currentBid: 120, owner: 'carla@ruta.com' },
        { id: 107, name: 'Saco -10°C', price: 180, description: 'Muy buen estado', photo: defaultMarketingImage, used: true, auction: false, owner: 'lola@ruta.com' },
        { id: 108, name: 'Faro LED', price: 20, description: 'Excelente para acampadas', photo: defaultMarketingImage, used: false, auction: false, owner: 'diego@ruta.com' },
        { id: 109, name: 'Botas Trekking', price: 95, description: 'Uso moderado, suela casi nueva', photo: defaultMarketingImage, used: true, auction: false, owner: 'javi@ruta.com' },
        { id: 110, name: 'Cámara de acción', price: 150, description: 'Graba en 4K, incluye soportes', photo: defaultMarketingImage, used: false, auction: false, owner: 'marta@ruta.com' },
        { id: 111, name: 'Linterna frontal', price: 18, description: 'Impermeable, varias intensidades', photo: defaultMarketingImage, used: false, auction: false, owner: 'ana@ruta.com' },
        { id: 112, name: 'Botiquín compacto', price: 22, description: 'Incluye vendajes y antiseptico', photo: defaultMarketingImage, used: false, auction: false, owner: 'pepe@ruta.com' },
        { id: 113, name: 'Casco Alpine Pro', price: 85, description: 'Protección y estilo, poco uso', photo: defaultMarketingImage, used: true, auction: false, owner: 'roberto@ruta.com' },
        { id: 114, name: 'Equipo de pesca portátil', price: 59, description: 'Incluye caña y caja de accesorios', photo: defaultMarketingImage, used: false, auction: false, owner: 'sofia@ruta.com' }
    ];

    function getExistingPublications() {
        const list = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key || !key.startsWith('userPublications_')) continue;
            try {
                const arr = JSON.parse(localStorage.getItem(key) || '[]');
                arr.forEach(item => list.push(item));
            } catch (e) {
                // Ignorar entradas inválidas
            }
        }
        return list;
    }

    function savePublications(key, publications) {
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        const existingIds = new Set(existing.map(item => item.id));
        const merged = [...existing];
        publications.forEach(item => {
            if (!existingIds.has(item.id)) {
                merged.push(item);
            }
        });
        localStorage.setItem(key, JSON.stringify(merged));
    }

    function updateExistingPublicationImages() {
        const samplesById = Object.fromEntries(samples.map(item => [item.id, item]));
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (!key || !key.startsWith('userPublications_')) continue;
            try {
                const arr = JSON.parse(localStorage.getItem(key) || '[]');
                let changed = false;
                const updated = arr.map(item => {
                    const sample = samplesById[item.id];
                    if (sample && item.photo !== sample.photo) {
                        changed = true;
                        return { ...item, photo: sample.photo };
                    }
                    return item;
                });
                if (changed) {
                    localStorage.setItem(key, JSON.stringify(updated));
                }
            } catch (e) {
                // Ignorar entradas inválidas
            }
        }
    }

    let found = false;
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('userPublications_')) { found = true; break; }
    }

    const existing = getExistingPublications();
    if (found) {
        updateExistingPublicationImages();
        const existingIds = new Set(existing.map(item => item.id));
        const hasEnoughPublications = existing.length >= 10;
        const auctionCount = existing.filter(p => p.auction === true || p.isAuction === true).length;

        if (!hasEnoughPublications || auctionCount < 3) {
            const fallback = samples.filter(item => !existingIds.has(item.id));
            if (fallback.length) {
                savePublications('userPublications_ruta_marketing@ruta.com', fallback);
            }
        }
        return;
    }

    const byOwner = {};
    samples.forEach(s => {
        const key = `userPublications_${s.owner}`;
        if (!byOwner[key]) byOwner[key] = [];
        byOwner[key].push(s);
    });

    Object.keys(byOwner).forEach(k => {
        const existing = JSON.parse(localStorage.getItem(k) || '[]');
        const existingIds = new Set(existing.map(item => item.id));
        const merged = [...existing];
        byOwner[k].forEach(sample => {
            if (!existingIds.has(sample.id)) {
                merged.push(sample);
            }
        });
        if (merged.length > 0) {
            localStorage.setItem(k, JSON.stringify(merged));
        }
    });
})();
