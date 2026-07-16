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
            const displayName = email.split('@')[0];
            const remember = document.getElementById('rememberCheck').checked;

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

    function updateAuthUI() {
        const navAuthContainer = document.getElementById('nav-auth-buttons');
        const profileEmail = document.getElementById('profileEmail');
        const userEmail = localStorage.getItem('userEmail') || '';
        const isLoggedIn = localStorage.getItem('isLoggedIn') === '1' || Boolean(userEmail);

        if (navAuthContainer) {
            if (isLoggedIn && userEmail) {
                navAuthContainer.innerHTML = `
                    <button id="openCartButton" class="bg-bosque hover:bg-slate-800 text-white px-5 py-2.5 rounded-full font-bold transition shadow-lg text-sm whitespace-nowrap flex items-center gap-2" type="button">
                        <i class="bi bi-cart3"></i>
                        <span id="cartCount">0</span>
                    </button>
                    <div class="flex items-center gap-3">
                        <a href="profile.html" class="font-semibold text-bosque hover:text-naranja transition hidden sm:block" title="${userEmail}">${userEmail}</a>
                        <button id="navLogoutBtn" title="Cerrar sesión" class="text-bosque hover:text-naranja transition text-xl"><i class="bi bi-box-arrow-right"></i></button>
                    </div>
                `;
                document.getElementById('navLogoutBtn')?.addEventListener('click', function () {
                    localStorage.removeItem('userEmail');
                    localStorage.removeItem('isLoggedIn');
                    localStorage.removeItem('userName');
                    localStorage.removeItem('rememberUser');
                    updateAuthUI();
                    window.location.href = 'index.html';
                });
            } else {
                navAuthContainer.innerHTML = `
                    <button id="openCartButton" class="bg-bosque hover:bg-slate-800 text-white px-5 py-2.5 rounded-full font-bold transition shadow-lg text-sm whitespace-nowrap flex items-center gap-2" type="button">
                        <i class="bi bi-cart3"></i>
                        <span id="cartCount">0</span>
                    </button>
                    <div class="flex flex-col gap-2">
                        <a href="login.html" class="btn btn-welcome px-5 py-2.5 rounded-full font-bold transition shadow-lg flex items-center gap-2 text-sm whitespace-nowrap">
                            <i class="bi bi-box-arrow-in-right"></i>
                            <span>Iniciar sesión</span>
                        </a>
                        <button class="btn btn-welcome px-5 py-2.5 rounded-full font-bold transition shadow-lg text-sm whitespace-nowrap">Planifica tu viaje  <i class="bi bi-calendar-event-fill"></i></button>
                    </div>
                `;
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
        localStorage.removeItem('userEmail');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userName');
        localStorage.removeItem('rememberUser');
        updateAuthUI();
        window.location.href = 'index.html';
    });
});
