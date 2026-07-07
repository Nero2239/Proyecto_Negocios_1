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
    const productForm = document.getElementById('productForm');
    const productFormTitle = document.getElementById('productFormTitle');
    const productDetailCard = document.getElementById('productDetailCard');
    const cancelProductEdit = document.getElementById('cancelProductEdit');
    const imagePreview = document.getElementById('imagePreview');
    const productImageInput = document.getElementById('productImage');

    const initialProducts = [
        { id: 1, name: 'Tienda Pro-Series', category: 'Tiendas', price: 120, stock: 8, status: 'Disponible', description: 'Tienda resistente para viajes largos.', emoji: '⛺' },
        { id: 2, name: 'Saco Térmico -5°C', category: 'Sacos', price: 85, stock: 2, status: 'Agotado', description: 'Ideal para noches frías.', emoji: '🛏️' },
        { id: 3, name: 'Linterna Solar LED', category: 'Iluminación', price: 34, stock: 12, status: 'Disponible', description: 'Carga solar para senderismo.', emoji: '🔦' },
        { id: 4, name: 'Set Cocina Compacto', category: 'Cocina', price: 67, stock: 5, status: 'Disponible', description: 'Kit práctico para cocinar al aire libre.', emoji: '🍳' }
    ];

    let products = [...initialProducts];
    let editingId = null;

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
                <td><div class="thumb">${product.emoji}</div></td>
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
        if (!productDetailCard) return;
        productDetailCard.innerHTML = `
            <h4>${product.name}</h4>
            <p><strong>Categoría:</strong> ${product.category}</p>
            <p><strong>Precio:</strong> $${product.price}</p>
            <p><strong>Stock:</strong> ${product.stock}</p>
            <p><strong>Descripción:</strong> ${product.description || 'Sin descripción'}</p>
        `;
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
                products = products.filter(item => item.id !== product.id);
                renderProducts();
                showFeedback(`Se eliminó ${product.name}.`);
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

    window.addEventListener('resize', () => {
        if (window.innerWidth > 780) {
            sidebar?.classList.add('open');
        }
    });
});
