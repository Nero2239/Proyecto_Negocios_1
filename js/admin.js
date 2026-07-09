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
    const orderModal = document.getElementById('orderModal');
    const orderModalClose = document.getElementById('orderModalClose');
    const orderModalBackdrop = document.getElementById('orderModalBackdrop');
    const orderModalTitle = document.getElementById('orderModalTitle');
    const orderModalClient = document.getElementById('orderModalClient');
    const orderModalDate = document.getElementById('orderModalDate');
    const orderModalItems = document.getElementById('orderModalItems');
    const orderModalTotal = document.getElementById('orderModalTotal');
    const orderStatusSelect = document.getElementById('orderStatusSelect');
    const orderStatusSave = document.getElementById('orderStatusSave');
    const clientModal = document.getElementById('clientModal');
    const clientModalBackdrop = document.getElementById('clientModalBackdrop');
    const clientModalClose = document.getElementById('clientModalClose');
    const clientModalName = document.getElementById('clientModalName');
    const clientModalEmail = document.getElementById('clientModalEmail');
    const clientModalPhone = document.getElementById('clientModalPhone');
    const clientModalIssue = document.getElementById('clientModalIssue');
    const clientModalStatus = document.getElementById('clientModalStatus');
    const clientModalSave = document.getElementById('clientModalSave');
    const clientModalCancel = document.getElementById('clientModalCancel');
    let productToDelete = null;
    let currentOrder = null;
    let clientPage = 1;
    const clientsPerPage = 4;

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
        { id: 2, name: 'Diego Ruiz', email: 'diego@example.com', phone: '555-0102', issue: 'Consulta por devolución', status: 'Atendido' },
        { id: 3, name: 'Mauro Pérez', email: 'mauro@example.com', phone: '555-0103', issue: 'Cambio de dirección', status: 'Pendiente' },
        { id: 4, name: 'Nadia Ortega', email: 'nadia@example.com', phone: '555-0104', issue: 'Revisión de stock', status: 'Atendido' },
        { id: 5, name: 'Camilo Vega', email: 'camilo@example.com', phone: '555-0105', issue: 'Solicitud de factura', status: 'Pendiente' },
        { id: 6, name: 'Paula Jiménez', email: 'paula@example.com', phone: '555-0106', issue: 'Seguimiento de pedido', status: 'Atendido' },
        { id: 7, name: 'Sergio Lozano', email: 'sergio@example.com', phone: '555-0107', issue: 'Consulta de garantía', status: 'Pendiente' },
        { id: 8, name: 'Elena Torres', email: 'elena@example.com', phone: '555-0108', issue: 'Confirmación de reserva', status: 'Atendido' },
        { id: 9, name: 'Bruno Salas', email: 'bruno@example.com', phone: '555-0109', issue: 'Reemplazo de mochila', status: 'Pendiente' },
        { id: 10, name: 'Valentina Ríos', email: 'valentina@example.com', phone: '555-0110', issue: 'Asesoría para camping', status: 'Atendido' }
    ];
    let orders = [
        { id: '#125', client: 'Laura Gómez', status: 'Recibido', total: 205, date: '07/07', items: ['Tienda Pro-Series', 'Saco Térmico -5°C'] },
        { id: '#126', client: 'Diego Ruiz', status: 'En tránsito', total: 318, date: '06/07', items: ['Linterna Solar LED', 'Mochila Ergonómica 50L'] },
        { id: '#127', client: 'Sofía C.', status: 'Pendiente', total: 142, date: '06/07', items: ['Set Cocina Compacto'] },
        { id: '#128', client: 'Tomás D.', status: 'Entregado', total: 267, date: '05/07', items: ['Tienda Compact 1P', 'Saco UltraLight 0°C'] },
        { id: '#129', client: 'Paula M.', status: 'Pendiente', total: 188, date: '05/07', items: ['Luz Frontal PRO'] }
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
        localStorage.setItem('adminView', viewName);
    }

    function showFeedback(text, type = 'success') {
        if (!feedbackMessage) return;
        feedbackMessage.className = `feedback-message ${type} show`;
        feedbackMessage.textContent = text;
        clearTimeout(showFeedback.timeoutId);
        showFeedback.timeoutId = setTimeout(() => {
            feedbackMessage.className = 'feedback-message';
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
        const totalPages = Math.max(1, Math.ceil(clients.length / clientsPerPage));
        clientPage = Math.min(clientPage, totalPages);
        const start = (clientPage - 1) * clientsPerPage;
        const visibleClients = clients.slice(start, start + clientsPerPage);
        const visibleRange = `${start + 1}-${Math.min(start + visibleClients.length, clients.length)}`;
        clientsList.innerHTML = `
            <div class="clients-summary">Mostrando ${visibleRange} de ${clients.length} clientes</div>
            <div class="clients-grid">
                ${visibleClients.map(client => `
                    <article class="client-card" data-id="${client.id}">
                        <h4>${client.name}</h4>
                        <p><strong>Correo:</strong> ${client.email}</p>
                        <p><strong>Teléfono:</strong> ${client.phone}</p>
                        <p><strong>Problema:</strong> ${client.issue}</p>
                        <div style="display:flex; gap:0.5rem; margin-top:0.6rem; align-items:center; justify-content:space-between;">
                            <span><strong>Estado:</strong> <span class="client-status">${client.status}</span></span>
                            <div style="display:flex; gap:0.4rem;">
                                <button class="btn btn-outline btn-small" type="button" data-action="view-client" data-id="${client.id}">Ver</button>
                                <button class="btn btn-small" type="button" data-action="toggle-status" data-id="${client.id}">Actualizar</button>
                            </div>
                        </div>
                    </article>
                `).join('')}
            </div>
            <div class="pagination-row">
                <button class="page-btn" type="button" data-action="page" data-page="prev" ${clientPage === 1 ? 'disabled' : ''}>Anterior</button>
                <span class="page-indicator">Página ${clientPage} / ${totalPages}</span>
                <button class="page-btn" type="button" data-action="page" data-page="next" ${clientPage === totalPages ? 'disabled' : ''}>Siguiente</button>
            </div>
        `;
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
                <td><button class="btn btn-outline" type="button" data-action="view-order" data-id="${order.id}">Ver</button></td>
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

    function showInlineProductEditor(product) {
        if (!productDetailCard) return;
        editingId = product.id;
        if (productFormTitle) {
            productFormTitle.textContent = `Editando ${product.name}`;
        }
        const escapedName = String(product.name).replace(/"/g, '&quot;');
        const escapedDescription = String(product.description || '').replace(/"/g, '&quot;');
        productDetailCard.innerHTML = `
            <div class="inline-editor">
                <h4>Edición rápida</h4>
                <form class="inline-editor-form">
                    <div class="field-group">
                        <label>Nombre</label>
                        <input name="name" type="text" required value="${escapedName}" />
                    </div>
                    <div class="field-group">
                        <label>Categoría</label>
                        <select name="category">
                            <option value="Tiendas" ${product.category === 'Tiendas' ? 'selected' : ''}>Tiendas</option>
                            <option value="Sacos" ${product.category === 'Sacos' ? 'selected' : ''}>Sacos</option>
                            <option value="Iluminación" ${product.category === 'Iluminación' ? 'selected' : ''}>Iluminación</option>
                            <option value="Ropa" ${product.category === 'Ropa' ? 'selected' : ''}>Ropa</option>
                            <option value="Botas" ${product.category === 'Botas' ? 'selected' : ''}>Botas</option>
                            <option value="Emergencias" ${product.category === 'Emergencias' ? 'selected' : ''}>Emergencias</option>
                        </select>
                    </div>
                    <div class="field-group">
                        <label>Precio</label>
                        <input name="price" type="number" min="0" step="0.01" required value="${product.price}" />
                    </div>
                    <div class="field-group">
                        <label>Descripción</label>
                        <textarea name="description" rows="3">${escapedDescription}</textarea>
                    </div>
                    <div class="field-group">
                        <label>Existencia</label>
                        <input name="stock" type="number" min="0" required value="${product.stock}" />
                    </div>
                    <div class="field-group">
                        <label>Estado</label>
                        <select name="status">
                            <option value="Disponible" ${product.status === 'Disponible' ? 'selected' : ''}>Disponible</option>
                            <option value="Agotado" ${product.status === 'Agotado' ? 'selected' : ''}>Agotado</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button class="btn btn-primary" type="submit">Guardar cambios</button>
                        <button class="btn btn-outline" type="button" data-inline-cancel="true">Cancelar</button>
                    </div>
                </form>
            </div>`;
        productDetailCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

    function openOrderDetail(order) {
        if (!orderModal || !orderModalTitle) return;
        currentOrder = order;
        orderModalTitle.textContent = `Pedido ${order.id}`;
        orderModalClient.textContent = `Cliente: ${order.client}`;
        orderModalDate.textContent = `Fecha: ${order.date}`;
        orderModalItems.textContent = `Items: ${order.items.join(', ')}`;
        orderModalTotal.textContent = `Total: $${order.total}`;
        if (orderStatusSelect) {
            orderStatusSelect.value = order.status;
        }
        orderModal.classList.remove('hidden');
    }

    function closeOrderDetail() {
        if (!orderModal) return;
        orderModal.classList.add('hidden');
        currentOrder = null;
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
                showFeedback('Completa el nombre y la categoría para guardar.', 'error');
                return;
            }

            if (editingId) {
                products = products.map(product => product.id === editingId ? { ...product, ...productData } : product);
                showFeedback('Actualizado Correctamente', 'success');
            } else {
                products.unshift(productData);
                showFeedback('Producto añadido Correctamente', 'success');
            }

            renderProducts();
            resetProductForm();
        });
    }

    if (productDetailCard) {
        productDetailCard.addEventListener('submit', (event) => {
            const form = event.target.closest('.inline-editor-form');
            if (!form) return;
            event.preventDefault();
            const formData = new FormData(form);
            const updatedProduct = {
                name: formData.get('name').toString().trim(),
                category: formData.get('category').toString().trim(),
                price: Number(formData.get('price')),
                stock: Number(formData.get('stock')),
                status: formData.get('status').toString(),
                description: formData.get('description').toString().trim()
            };
            products = products.map(product => product.id === editingId ? { ...product, ...updatedProduct } : product);
            renderProducts();
            resetProductForm();
            showFeedback('Actualizado Correctamente', 'success');
        });

        productDetailCard.addEventListener('click', (event) => {
            const cancelButton = event.target.closest('[data-inline-cancel="true"]');
            if (cancelButton) {
                resetProductForm();
                showFeedback('Edición cancelada.', 'success');
            }
        });
    }

    if (promotionForm) {
        promotionForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(promotionForm);
            const start = formData.get('start').toString();
            const end = formData.get('end').toString();

            if (new Date(start) > new Date(end)) {
                showFeedback('La fecha de fin debe ser posterior a la de inicio.', 'error');
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
            clientPage = 1;
            renderClients();
            showFeedback('Cliente registrado con éxito.', 'success');
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
                showInlineProductEditor(product);
                showFeedback('Editando producto en línea.');
            } else if (action === 'view') {
                showProductDetail(product);
                showFeedback(`Viendo detalle de ${product.name}.`);
            } else if (action === 'delete') {
                showDeletePrompt(product);
            }
        });
    }

    if (clientsList) {
        clientsList.addEventListener('click', (event) => {
            const pageButton = event.target.closest('[data-action="page"]');
            if (pageButton) {
                const page = pageButton.dataset.page;
                if (page === 'prev' && clientPage > 1) clientPage -= 1;
                else if (page === 'next') clientPage += 1;
                renderClients();
                return;
            }

            const viewBtn = event.target.closest('[data-action="view-client"]');
            if (viewBtn) {
                const id = Number(viewBtn.dataset.id);
                const client = clients.find(c => c.id === id);
                if (client) openClientModal(client);
                return;
            }

            const toggleBtn = event.target.closest('[data-action="toggle-status"]');
            if (toggleBtn) {
                const id = Number(toggleBtn.dataset.id);
                clients = clients.map(c => c.id === id ? { ...c, status: c.status === 'Pendiente' ? 'Atendido' : 'Pendiente' } : c);
                renderClients();
                showFeedback('Estado de cliente actualizado.', 'success');
                return;
            }
        });
    }

    if (ordersTableBody) {
        ordersTableBody.addEventListener('click', (event) => {
            const button = event.target.closest('button');
            if (!button || button.dataset.action !== 'view-order') return;
            const order = orders.find(item => item.id === button.dataset.id);
            if (order) {
                openOrderDetail(order);
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

    orderModalClose?.addEventListener('click', closeOrderDetail);
    orderModalBackdrop?.addEventListener('click', closeOrderDetail);
    orderStatusSave?.addEventListener('click', () => {
        if (!currentOrder || !orderStatusSelect) return;
        const nextStatus = orderStatusSelect.value;
        orders = orders.map(order => order.id === currentOrder.id ? { ...order, status: nextStatus } : order);
        renderOrders();
        showFeedback(`Estado actualizado a ${nextStatus}.`);
        closeOrderDetail();
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

    // Client modal handlers
    function openClientModal(client) {
        if (!clientModal) return;
        clientModalName.value = client.name || '';
        clientModalEmail.value = client.email || '';
        clientModalPhone.value = client.phone || '';
        clientModalIssue.value = client.issue || '';
        clientModalStatus.value = client.status || 'Pendiente';
        clientModal.dataset.clientId = client.id;
        clientModal.classList.remove('hidden');
    }

    function closeClientModal() {
        if (!clientModal) return;
        clientModal.classList.add('hidden');
        delete clientModal.dataset.clientId;
    }

    clientModalClose?.addEventListener('click', closeClientModal);
    clientModalBackdrop?.addEventListener('click', closeClientModal);
    clientModalCancel?.addEventListener('click', closeClientModal);

    clientModalSave?.addEventListener('click', () => {
        const id = Number(clientModal.dataset.clientId);
        if (!id) return;
        clients = clients.map(c => c.id === id ? {
            ...c,
            name: clientModalName.value.trim(),
            email: clientModalEmail.value.trim(),
            phone: clientModalPhone.value.trim(),
            issue: clientModalIssue.value.trim(),
            status: clientModalStatus.value
        } : c);
        renderClients();
        closeClientModal();
        showFeedback('Actualizado Correctamente', 'success');
    });

    document.querySelectorAll('.action-btn').forEach(button => {
        button.addEventListener('click', () => {
            const viewName = button.dataset.view;
            if (viewName) {
                setView(viewName);
                if (viewName === 'productos') {
                    resetProductForm();
                }
            }
        });
    });

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
