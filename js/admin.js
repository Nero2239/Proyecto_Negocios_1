document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('adminSidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const viewSections = document.querySelectorAll('.view-section');
    const pageTitle = document.getElementById('pageTitle');
    const goStoreBtn = document.getElementById('goStoreBtn');
    const newProductBtn = document.getElementById('newProductBtn');
    const feedbackMessage = document.getElementById('feedbackMessage');
    const adminNameLabel = document.getElementById('adminNameLabel');

    const productSearch = document.getElementById('productSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const statusFilter = document.getElementById('statusFilter');
    const productsTableBody = document.getElementById('productsTableBody');
    const ordersTableBody = document.getElementById('ordersTableBody');
    const productForm = document.getElementById('productForm');
    const productFormTitle = document.getElementById('productFormTitle');
    const productDetailCard = document.getElementById('productDetailCard');
    const cancelProductEdit = document.getElementById('cancelProductEdit');
    const imagePreview = document.getElementById('imagePreview');
    const productImageInput = document.getElementById('productImage');
    const promotionForm = document.getElementById('promotionForm');
    const promotionsList = document.getElementById('promotionsList');
    const clientForm = document.getElementById('clientForm');
    const clientsList = document.getElementById('clientsList');
    const modal = document.getElementById('productModal');
    const modalBackdrop = document.getElementById('productModalBackdrop');
    const modalClose = document.getElementById('productModalClose');
    const modalProductIcon = document.getElementById('modalProductIcon');
    const modalProductName = document.getElementById('modalProductName');
    const modalProductCategory = document.getElementById('modalProductCategory');
    const modalProductPrice = document.getElementById('modalProductPrice');
    const modalProductStock = document.getElementById('modalProductStock');
    const modalProductDescription = document.getElementById('modalProductDescription');
    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const deleteConfirmClose = document.getElementById('deleteConfirmClose');
    const deleteConfirmCancel = document.getElementById('deleteConfirmCancel');
    const deleteConfirmAccept = document.getElementById('deleteConfirmAccept');
    const deleteConfirmText = document.getElementById('deleteConfirmText');
    let productToDelete = null;

    const categoryIcons = {
        Tiendas: 'bi-house-door',
        Sacos: 'bi-bag',
        Iluminación: 'bi-lamp',
        Cocina: 'bi-cup-straw',
        Ropa: 'bi-shirt',
        Botas: 'bi-shoe-prints',
        Emergencias: 'bi-bandaid'
    };

    const initialProducts = [
        { id: 1, name: 'Tienda Pro-Series', category: 'Tiendas', price: 120, stock: 8, status: 'Disponible', description: 'Tienda resistente para viajes largos.', iconClass: 'bi-house-door' },
        { id: 2, name: 'Saco Térmico -5°C', category: 'Sacos', price: 85, stock: 2, status: 'Agotado', description: 'Ideal para noches frías.', iconClass: 'bi-bag' },
        { id: 3, name: 'Linterna Solar LED', category: 'Iluminación', price: 34, stock: 12, status: 'Disponible', description: 'Carga solar para senderismo.', iconClass: 'bi-lamp' },
        { id: 4, name: 'Set Cocina Compacto', category: 'Cocina', price: 67, stock: 5, status: 'Disponible', description: 'Kit práctico para cocinar al aire libre.', iconClass: 'bi-cup-straw' }
    ];

    let products = [...initialProducts];
    let editingId = null;
    let promotions = [
        {
            id: 1,
            name: 'Campamento fin de semana',
            type: 'Evento',
            target: 'Fin de semana de aventura',
            discount: 20,
            start: '2026-07-10',
            end: '2026-07-14',
            notes: 'Válida para tiendas y sacos.'
        },
        {
            id: 2,
            name: 'Luna de verano',
            type: 'Producto',
            target: 'Linterna Solar LED',
            discount: 15,
            start: '2026-07-01',
            end: '2026-07-20',
            notes: 'Aplicable solo si hay stock mayor a 5.'
        }
    ];
    let clients = [
        { id: 1, name: 'Laura Gómez', email: 'laura@example.com', phone: '555-0101', issue: 'Problema con pedido pendiente', status: 'Pendiente' },
        { id: 2, name: 'Diego Ruiz', email: 'diego@example.com', phone: '555-0102', issue: 'Consulta por devolución', status: 'Atendido' }
    ];
    let orders = [
        { id: '#125', client: 'Laura Gómez', status: 'Recibido', total: 205, date: '07/07' },
        { id: '#126', client: 'Diego Ruiz', status: 'En tránsito', total: 318, date: '06/07' },
        { id: '#127', client: 'Sofía C.', status: 'Pendiente', total: 142, date: '06/07' },
        { id: '#128', client: 'Tomás D.', status: 'Entregado', total: 267, date: '05/07' },
        { id: '#129', client: 'Paula M.', status: 'Pendiente', total: 188, date: '05/07' }
    ];

    const userEmail = localStorage.getItem('userEmail') || 'admin@ruta.com';
    if (adminNameLabel) {
        adminNameLabel.textContent = userEmail;
    }

    function setView(viewName) {
        viewSections.forEach(section => {
            section.classList.toggle('active', section.id === `view-${viewName}`);
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.view === viewName);
        });

        const titles = {
            dashboard: 'Inicio',
            productos: 'Productos',
            pedidos: 'Pedidos',
            promociones: 'Promociones',
            clientes: 'Clientes',
            reportes: 'Reportes'
        };

        if (pageTitle) {
            pageTitle.textContent = titles[viewName] || 'Inicio';
        }
    }

    function showFeedback(text) {
        if (!feedbackMessage) return;
        feedbackMessage.textContent = text;
        setTimeout(() => {
            feedbackMessage.textContent = '';
        }, 2400);
    }

    function renderProducts() {
        const searchTerm = (productSearch?.value || '').toLowerCase();
        const categoryValue = categoryFilter?.value || '';
        const statusValue = statusFilter?.value || '';

        const filtered = products.filter(product => {
            const matchesSearch = `${product.name} ${product.category}`.toLowerCase().includes(searchTerm);
            const matchesCategory = !categoryValue || product.category === categoryValue;
            const matchesStatus = !statusValue || product.status === statusValue;
            return matchesSearch && matchesCategory && matchesStatus;
        });

        if (!productsTableBody) return;

        if (!filtered.length) {
            productsTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 1rem; color: #6b7280;">No hay productos para mostrar.</td></tr>';
            return;
        }

        productsTableBody.innerHTML = filtered.map(product => `
            <tr>
                <td><div class="thumb"><i class="bi ${product.iconClass || categoryIcons[product.category] || 'bi-box-seam'}"></i></div></td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>$${product.price}</td>
                <td>${product.stock}</td>
                <td><span class="badge ${product.status === 'Agotado' ? 'badge-warn' : 'badge-ok'}">${product.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button type="button" data-action="edit" data-id="${product.id}">Editar</button>
                        <button type="button" data-action="view" data-id="${product.id}">Ver</button>
                        <button type="button" data-action="delete" data-id="${product.id}">Eliminar</button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    function renderPromotions() {
        if (!promotionsList) return;
        const today = new Date();
        promotionsList.innerHTML = promotions.map(promo => {
            const start = new Date(promo.start);
            const end = new Date(promo.end);
            const isActive = today >= start && today <= end;
            return `
                <article class="promotion-card">
                    <h4>${promo.name}</h4>
                    <p><strong>${promo.type}:</strong> ${promo.target}</p>
                    <p><strong>Descuento:</strong> ${promo.discount}%</p>
                    <p><strong>Vigencia:</strong> ${promo.start} al ${promo.end}</p>
                    <p><strong>Estado:</strong> ${isActive ? 'Activa' : 'Fuera de vigencia'}</p>
                    <p>${promo.notes}</p>
                </article>
            `;
        }).join('');
    }

    function renderClients() {
        if (!clientsList) return;
        clientsList.innerHTML = clients.map(client => `
            <article class="client-card">
                <h4>${client.name}</h4>
                <p><strong>Correo:</strong> ${client.email}</p>
                <p><strong>Teléfono:</strong> ${client.phone}</p>
                <p><strong>Problema:</strong> ${client.issue}</p>
                <span><strong>Estado:</strong> ${client.status}</span>
            </article>
        `).join('');
    }

    function renderOrders() {
        if (!ordersTableBody) return;
        ordersTableBody.innerHTML = orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>${order.client}</td>
                <td><span class="badge ${order.status === 'Pendiente' ? 'badge-warn' : 'badge-ok'}">${order.status}</span></td>
                <td>$${order.total}</td>
                <td>${order.date}</td>
            </tr>
        `).join('');
    }

    function resetProductForm() {
        if (productForm) {
            productForm.reset();
        }
        editingId = null;
        if (productFormTitle) {
            productFormTitle.textContent = 'Agregar producto';
        }
        if (imagePreview) {
            imagePreview.innerHTML = '<i class="bi bi-image"></i><span>Vista previa</span>';
        }
        if (productDetailCard) {
            productDetailCard.innerHTML = '';
        }
    }

    function fillProductForm(product) {
        if (!productForm) return;
        document.getElementById('productName').value = product.name;
        document.getElementById('productCategory').value = product.category;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productStock').value = product.stock;
        document.getElementById('productStatus').value = product.status;
        if (productFormTitle) {
            productFormTitle.textContent = 'Editar producto';
        }
        editingId = product.id;
    }

    function showProductDetail(product) {
        if (!modal || !modalProductName) return;
        modalProductIcon.innerHTML = `<i class="bi ${product.iconClass || categoryIcons[product.category] || 'bi-box-seam'}"></i>`;
        modalProductName.textContent = product.name;
        modalProductCategory.textContent = `Categoría: ${product.category}`;
        modalProductPrice.textContent = `Precio: $${product.price}`;
        modalProductStock.textContent = `Stock: ${product.stock}`;
        modalProductDescription.textContent = `Descripción: ${product.description || 'Sin descripción'}`;
        modal.classList.remove('hidden');
    }

    function showDeletePrompt(product) {
        if (!deleteConfirmModal || !deleteConfirmText) return;
        productToDelete = product;
        deleteConfirmText.textContent = `¿Seguro que deseas eliminar ${product.name}?`;
        deleteConfirmModal.classList.remove('hidden');
    }

    function hideDeletePrompt() {
        if (!deleteConfirmModal) return;
        deleteConfirmModal.classList.add('hidden');
        productToDelete = null;
    }

    function confirmDeleteProduct() {
        if (!productToDelete) return;
        products = products.filter(item => item.id !== productToDelete.id);
        renderProducts();
        showFeedback(`Se eliminó ${productToDelete.name}.`);
        hideDeletePrompt();
    }

    if (deleteConfirmClose) {
        deleteConfirmClose.addEventListener('click', hideDeletePrompt);
    }
    if (deleteConfirmCancel) {
        deleteConfirmCancel.addEventListener('click', hideDeletePrompt);
    }
    if (deleteConfirmAccept) {
        deleteConfirmAccept.addEventListener('click', confirmDeleteProduct);
    }

    if (productForm) {
        productForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(productForm);
            const productData = {
                id: editingId || Date.now(),
                name: formData.get('name').toString().trim(),
                category: formData.get('category').toString().trim(),
                price: Number(formData.get('price')),
                stock: Number(formData.get('stock')),
                status: formData.get('status').toString(),
                description: formData.get('description').toString().trim(),
                emoji: '🧭'
            };

            if (!productData.name || !productData.category) {
                showFeedback('Completa el nombre y la categoría para guardar.');
                return;
            }

            if (editingId) {
                products = products.map(product => product.id === editingId ? { ...product, ...productData } : product);
                showFeedback('Producto actualizado con éxito.');
            } else {
                products.unshift(productData);
                showFeedback('Producto agregado con éxito.');
            }

            renderProducts();
            resetProductForm();
        });
    }

    if (promotionForm) {
        promotionForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(promotionForm);
            const start = formData.get('start').toString();
            const end = formData.get('end').toString();

            if (new Date(start) > new Date(end)) {
                showFeedback('La fecha de fin debe ser posterior a la de inicio.');
                return;
            }

            promotions.unshift({
                id: Date.now(),
                name: formData.get('name').toString().trim(),
                type: formData.get('type').toString(),
                target: formData.get('target').toString().trim(),
                discount: Number(formData.get('discount')),
                start,
                end,
                notes: formData.get('notes').toString().trim()
            });
            promotionForm.reset();
            renderPromotions();
            showFeedback('Promoción creada correctamente.');
        });
    }

    if (clientForm) {
        clientForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(clientForm);
            clients.unshift({
                id: Date.now(),
                name: formData.get('name').toString().trim(),
                email: formData.get('email').toString().trim(),
                phone: formData.get('phone').toString().trim(),
                issue: formData.get('issue').toString().trim(),
                status: formData.get('status').toString()
            });
            clientForm.reset();
            renderClients();
            showFeedback('Cliente dado de alta correctamente.');
        });
    }

    if (productsTableBody) {
        productsTableBody.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button) return;

            const { action, id } = button.dataset;
            const product = products.find(item => item.id === Number(id));
            if (!product) return;

            if (action === 'edit') {
                fillProductForm(product);
                showProductDetail(product);
                showFeedback('Editando producto desde la tabla.');
            } else if (action === 'view') {
                showProductDetail(product);
                showFeedback(`Viendo detalle de ${product.name}.`);
            } else if (action === 'delete') {
                showDeletePrompt(product);
            }
        });
    }

    [productSearch, categoryFilter, statusFilter].forEach(control => {
        control?.addEventListener('input', renderProducts);
        control?.addEventListener('change', renderProducts);
    });

    cancelProductEdit?.addEventListener('click', () => {
        resetProductForm();
        showFeedback('Formulario cancelado.');
    });

    modalClose?.addEventListener('click', () => {
        modal?.classList.add('hidden');
    });

    modalBackdrop?.addEventListener('click', () => {
        modal?.classList.add('hidden');
    });

    if (productImageInput && imagePreview) {
        productImageInput.addEventListener('change', (event) => {
            const file = event.target.files && event.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = () => {
                imagePreview.innerHTML = `<img src="${reader.result}" alt="Vista previa" />`;
            };
            reader.readAsDataURL(file);
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            setView(link.dataset.view);
            if (window.innerWidth < 780) {
                sidebar?.classList.remove('open');
            }
        });
    });

    sidebarToggle?.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
    });

    mobileSidebarToggle?.addEventListener('click', () => {
        sidebar?.classList.toggle('open');
    });

    goStoreBtn?.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    newProductBtn?.addEventListener('click', () => {
        resetProductForm();
        document.querySelector('.nav-link[data-view="productos"]').click();
    });

    const defaultView = localStorage.getItem('adminView') || 'dashboard';
    setView(defaultView);
    renderProducts();
    renderPromotions();
    renderClients();
    renderOrders();

    window.addEventListener('resize', () => {
        if (window.innerWidth > 780) {
            sidebar?.classList.add('open');
        }
    });
});
