// Semillas de publicaciones y subastas simuladas para marketing
(function () {
    const seedKeyPrefix = 'userPublications_seed_';

    // Si ya hay publicaciones, no sobrescribimos
    let found = false;
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('userPublications_')) { found = true; break; }
    }

    if (found) return;

    const samples = [
        { id: 101, name: 'Tienda usada - buen estado', price: 233, description: 'Tienda 2P, poco uso', photo: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop', used: true, auction: false, owner: 'javi@ruta.com' },
        { id: 102, name: 'Mochila Expedición 70L', price: 450, description: 'Resistente a la intemperie', photo: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=400&h=300&fit=crop', used: true, auction: true, currentBid: 85, owner: 'marta@ruta.com' },
        { id: 103, name: 'Colchoneta aislante', price: 45, description: 'Ligera y compacta', photo: 'https://images.unsplash.com/photo-1524594154909-1c9b6b2f2b0b?w=400&h=300&fit=crop', used: false, auction: false, owner: 'pepe@ruta.com' },
        { id: 104, name: 'Hornillo portatil', price: 35, description: 'Funciona con cartucho', photo: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=400&h=300&fit=crop', used: true, auction: false, owner: 'luis@ruta.com' },
        { id: 105, name: 'Set de cocina', price: 25, description: 'Completo, poco uso', photo: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop', used: true, auction: false, owner: 'ana@ruta.com' },
        { id: 106, name: 'Tienda Ligera 1P', price: 120, description: 'Compacta y resistente', photo: 'https://images.unsplash.com/photo-1505904267569-6b48a0f3a1f8?w=400&h=300&fit=crop', used: false, auction: true, currentBid: 120, owner: 'carla@ruta.com' },
        { id: 107, name: 'Saco -10°C', price: 180, description: 'Muy buen estado', photo: 'https://images.unsplash.com/photo-1532634896-26909d0d0b27?w=400&h=300&fit=crop', used: true, auction: false, owner: 'lola@ruta.com' },
        { id: 108, name: 'Faro LED', price: 20, description: 'Excelente para acampadas', photo: 'https://images.unsplash.com/photo-1496309732348-3623f8d3b7b1?w=400&h=300&fit=crop', used: false, auction: false, owner: 'diego@ruta.com' }
    ];

    // Añadimos más publicaciones para mostrar variedad
    samples.push(
        { id: 109, name: 'Botas Trekking', price: 95, description: 'Uso moderado, suela casi nueva', photo: 'https://images.unsplash.com/photo-1528701800489-2a9ef3a0d7a9?w=400&h=300&fit=crop', used: true, auction: false, owner: 'javi@ruta.com' },
        { id: 110, name: 'Cámara de acción', price: 150, description: 'Graba en 4K, incluye soportes', photo: 'https://images.unsplash.com/photo-1519183071298-a2962be54a59?w=400&h=300&fit=crop', used: false, auction: true, currentBid: 75, owner: 'marta@ruta.com' },
        { id: 111, name: 'Linterna frontal', price: 18, description: 'Impermeable, varias intensidades', photo: 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=400&h=300&fit=crop', used: false, auction: false, owner: 'ana@ruta.com' },
        { id: 112, name: 'Botiquín compacto', price: 22, description: 'Incluye vendajes y antiseptico', photo: 'https://images.unsplash.com/photo-1600181951135-2a4f6c0f1d6d?w=400&h=300&fit=crop', used: false, auction: false, owner: 'pepe@ruta.com' }
    );

    // Guardar como si fueran publicaciones de diferentes usuarios
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
