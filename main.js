document.addEventListener("DOMContentLoaded", () => {
    const loadComponent = (selector, url) => {
        const element = document.querySelector(selector);
        if (element) {
            fetch(url)
                .then(response => response.ok ? response.text() : Promise.reject('Component not found'))
                .then(html => {
                    element.innerHTML = html;
                    // Disparar un evento personalizado cuando el componente se carga
                    document.dispatchEvent(new CustomEvent(`${selector.substring(1)}Loaded`));
                })
                .catch(error => console.error(`Error loading ${url}:`, error));
        }
    };

    // Cargar componentes
    loadComponent("header.site-header", "_navbar.html");
    loadComponent("footer.site-footer", "_footer.html");
});

// Escuchar el evento de carga de la barra de navegación para ejecutar el script de autenticación
document.addEventListener('header.site-headerLoaded', () => {
    // Aquí puedes inicializar otros scripts que dependan de la barra de navegación, como auth.js
});