document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const recoverPasswordForm = document.getElementById('recoverPasswordForm');
    const loginView = document.getElementById('loginView');
    const registerView = document.getElementById('registerView');
    const recoverPasswordView = document.getElementById('recoverPasswordView');
    const messageBox = document.getElementById('messageBox');
    const showRegisterBtn = document.getElementById('showRegisterBtn');
    const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
    const backToLoginBtn = document.getElementById('backToLoginBtn');
    const backToLoginFromRecoveryBtn = document.getElementById('backToLoginFromRecoveryBtn');

    function clearMessageBox() {
        if (messageBox) {
            messageBox.innerHTML = '';
        }
    }

    function showMessage(text, type = 'success', showClose = false) {
        if (!messageBox) return;
        const className = type === 'error' ? 'message-error' : 'message-success';
        const closeButton = showClose ? ` <button type="button" id="messageCloseBtn" class="rounded-full bg-white/10 px-3 py-1 text-sm text-white hover:bg-white/20">Cerrar</button>` : '';
        messageBox.innerHTML = `<div class="${className} flex items-center justify-between gap-4">${text}${closeButton}</div>`;

        if (!showClose) {
            setTimeout(() => {
                clearMessageBox();
            }, 5000);
        } else {
            const messageCloseBtn = document.getElementById('messageCloseBtn');
            if (messageCloseBtn) {
                messageCloseBtn.addEventListener('click', function () {
                    clearMessageBox();
                    showLoginForm();
                });
            }
        }
    }

    function showRegisterForm() {
        loginView?.classList.add('hidden');
        recoverPasswordView?.classList.add('hidden');
        registerView?.classList.remove('hidden');
        clearMessageBox();
    }

    function showLoginForm() {
        registerView?.classList.add('hidden');
        recoverPasswordView?.classList.add('hidden');
        loginView?.classList.remove('hidden');
        clearMessageBox();
    }

    function showRecoverPasswordForm() {
        loginView?.classList.add('hidden');
        registerView?.classList.add('hidden');
        recoverPasswordView?.classList.remove('hidden');
        clearMessageBox();
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();
            const displayName = email.split('@')[0];
            const remember = document.getElementById('rememberCheck').checked;

            if (!email || !password) {
                showMessage('Por favor, ingresa tu correo y contraseña.', 'error');
                return;
            }

            sessionStorage.setItem('lastEmail', email);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', displayName);
            localStorage.setItem('isLoggedIn', '1');
            if (remember) {
                localStorage.setItem('rememberUser', '1');
            } else {
                localStorage.setItem('rememberUser', '0');
            }

            const isAdminAccount = email.toLowerCase().includes('admin');
            const userRole = isAdminAccount ? 'admin' : 'user';
            localStorage.setItem('userRole', userRole);

            showMessage(isAdminAccount ? 'Redirigiendo al panel de administrador...' : 'Redirigiendo a tu perfil...');
            setTimeout(() => {
                window.location.href = isAdminAccount ? 'admin.html' : 'profile.html';
            }, 800);
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('registerEmail').value.trim();
            const name = document.getElementById('registerName').value.trim();
            const password = document.getElementById('registerPassword').value.trim();

            if (!name || !email || !password) {
                showMessage('Por favor, completa todos los campos para registrarte.', 'error');
                return;
            }

            localStorage.setItem('userEmail', email);
            localStorage.setItem('userName', name);
            localStorage.setItem('isLoggedIn', '1');
            localStorage.setItem('rememberUser', '1');
            showLoginForm();
            showMessage('Registrado correctamente.', 'success', true);
            registerForm.reset();
        });
    }

    if (recoverPasswordForm) {
        recoverPasswordForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const email = document.getElementById('recoverEmail').value.trim();
            const code = document.getElementById('recoveryCode').value.trim();
            const newPassword = document.getElementById('newPassword').value.trim();

            if (!email || !code || !newPassword) {
                showMessage('Por favor, completa todos los campos para recuperar tu contraseña.', 'error');
                return;
            }

            showLoginForm();
            showMessage('La contraseña ha sido actualizada correctamente', 'success', true);
            recoverPasswordForm.reset();
        });
    }

    showRegisterBtn?.addEventListener('click', showRegisterForm);
    backToLoginBtn?.addEventListener('click', showLoginForm);
    backToLoginFromRecoveryBtn?.addEventListener('click', showLoginForm);
    forgotPasswordBtn?.addEventListener('click', showRecoverPasswordForm);

    (function () {
        const remembered = localStorage.getItem('rememberUser');
        const saved = localStorage.getItem('userEmail') || sessionStorage.getItem('lastEmail');
        const input = document.getElementById('loginEmail');
        const chk = document.getElementById('rememberCheck');

        if (saved && input) {
            input.value = saved;
        }
        if (remembered && chk) {
            chk.checked = true;
        }
    })();

    function logout() {
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        localStorage.removeItem('rememberUser');
        updateAuthUI(); // Re-render the UI to show the logged-out state
        // If on a protected page, redirect to home
        if (window.location.pathname.includes('profile.html') || window.location.pathname.includes('admin.html')) {
            window.location.href = 'index.html';
        }
    }

    function updateAuthUI() {
        const navAuthContainer = document.getElementById('nav-auth-buttons');
        const profileEmail = document.getElementById('profileEmail');
        const userEmail = localStorage.getItem('userEmail') || '';
        const isLoggedIn = localStorage.getItem('isLoggedIn') === '1' || Boolean(userEmail);
        const displayName = (localStorage.getItem('userName') || userEmail.split('@')[0]) || 'Usuario';

        if (navAuthContainer) {
            if (isLoggedIn && userEmail) {
                navAuthContainer.innerHTML = `
                    <a href="profile.html" class="hidden md:flex items-center gap-2 text-sm uppercase tracking-wider text-[#2C302E]/80 hover:text-[#606C5A] transition-colors" title="${userEmail}">
                        <i class="bi bi-person-circle"></i>
                        <span>${displayName}</span>
                    </a>
                    <button id="navLogoutBtn" title="Cerrar sesión" class="hidden md:block text-[#2C302E]/80 hover:text-[#606C5A] transition-colors text-xl"><i class="bi bi-box-arrow-right"></i></button>
                    <button id="openCartButton" class="relative border border-transparent hover:border-[#2C302E]/30 rounded-full p-2 transition-colors" type="button">
                        <i class="bi bi-cart3 text-xl text-[#2C302E]"></i>
                        <span id="cartCount" class="absolute -top-1 -right-1 bg-[#606C5A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
                    </button>
                `;
                document.getElementById('navLogoutBtn')?.addEventListener('click', logout);
            } else {
                navAuthContainer.innerHTML = `
                    <a href="login.html" class="hidden md:block border border-[#2C302E] px-5 py-2 rounded-full text-xs uppercase tracking-widest hover:bg-[#2C302E] hover:text-[#F9F6F0] transition-all duration-300">
                        Login
                    </a>
                    <button id="openCartButton" class="relative border border-transparent hover:border-[#2C302E]/30 rounded-full p-2 transition-colors" type="button">
                        <i class="bi bi-cart3 text-xl text-[#2C302E]"></i>
                        <span id="cartCount" class="absolute -top-1 -right-1 bg-[#606C5A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
                    </button>
                `;
            }
            // After innerHTML is replaced, we need to update the cart count from shop's state
            if (window.shop && typeof window.shop.renderCart === 'function') {
                // Calling renderCart is better as it updates multiple count displays
                window.shop.renderCart();
            }
        }

        if (profileEmail) {
            profileEmail.textContent = isLoggedIn && userEmail ? userEmail : 'paramore@ruta.com';
        }
    }

    updateAuthUI();

    const mainLogoutButton = document.querySelector('a[href="login.html"].btn-secondary');
    mainLogoutButton?.addEventListener('click', function (event) {
        event.preventDefault();
        logout();
    });
});
