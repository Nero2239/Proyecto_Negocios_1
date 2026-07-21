// Toast Notification Function
function showToast(message, type = 'success') {
    // Remove any existing toasts
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }

    const toast = document.createElement('div');
    toast.className = `toast-notification ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Trigger the animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        // Remove the element after the animation completes
        toast.addEventListener('transitionend', () => toast.remove());
    }, 3000);
}
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('campaignCommentForm');
    const commentsList = document.getElementById('campaignCommentsList');
    const nameInput = document.getElementById('campaignCommentName');
    const textInput = document.getElementById('campaignCommentText');

    const COMMENTS_KEY = 'campaignComments';

    // Cargar comentarios iniciales (si los hay)
    const initialComments = [
        { name: 'Santiago', text: 'Me gustó la selección del producto destacado, justo lo que necesito para mis rutas cortas.', date: 'Hace 2 días' },
        { name: 'Lucía', text: 'Muy clara la presentación de la campaña. Quiero ver más productos en próximas ediciones.', date: 'Hace 4 días' }
    ];

    function renderComments() {
        if (!commentsList) return;

        const storedComments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
        // Combinar comentarios iniciales con los guardados, evitando duplicados si se recarga
        const allComments = [...storedComments];
        if (storedComments.length === 0) {
            allComments.push(...initialComments);
            localStorage.setItem(COMMENTS_KEY, JSON.stringify(initialComments));
        }

        commentsList.innerHTML = allComments.map(comment => `
            <article class="comment-card">
                <div class="flex items-center justify-between gap-4">
                    <div>
                        <p class="font-semibold text-[#2C302E]">${comment.name}</p>
                        <p class="text-sm text-gray-500">${comment.date}</p>
                    </div>
                </div>
                <p class="mt-3 text-gray-700">${comment.text}</p>
            </article>
        `).join('');
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = nameInput.value.trim();
            const text = textInput.value.trim();

            if (!name || !text) {
                showToast('Por favor, completa tu nombre y comentario.', 'error');
                return;
            }

            const newComment = {
                name: name,
                text: text,
                date: 'Ahora mismo'
            };

            // Obtener comentarios existentes, agregar el nuevo y guardar
            let comments = JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
            comments.unshift(newComment);
            localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));

            // Limpiar formulario y volver a renderizar
            nameInput.value = '';
            textInput.value = '';
            renderComments();

            // Mostrar feedback
            showToast('¡Gracias por tu comentario!', 'success');
        });
    }

    // Renderizar comentarios al cargar la página
    renderComments();

    // Escuchar por cambios en el storage para actualizar en tiempo real si otra pestaña comenta
    window.addEventListener('storage', (e) => {
        if (e.key === COMMENTS_KEY) {
            renderComments();
        }
    });
});