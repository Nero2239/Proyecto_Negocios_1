function addCampaignComment(event) {
    event.preventDefault();
    const form = event.target;
    const nameInput = document.getElementById('campaignCommentName');
    const commentInput = document.getElementById('campaignCommentText');
    const feedback = document.getElementById('campaignCommentFeedback');
    const list = document.getElementById('campaignCommentsList');

    if (!nameInput || !commentInput || !feedback || !list) return;

    const name = nameInput.value.trim();
    const text = commentInput.value.trim();

    if (!name || !text) return;

    const commentCard = document.createElement('article');
    commentCard.className = 'comment-card';
    commentCard.innerHTML = `
        <div class="flex items-center justify-between gap-4">
            <div>
                <p class="font-semibold text-bosque">${name}</p>
                <p class="text-sm text-gray-500">Ahora</p>
            </div>
        </div>
        <p class="mt-3 text-gray-700">${text}</p>
    `;

    list.prepend(commentCard);

    // No usar form.reset() para no borrar el nombre del usuario logueado
    commentInput.value = '';
    // Solo limpiar el nombre si el campo no es de solo lectura (usuario no logueado)
    if (!nameInput.readOnly) {
        nameInput.value = '';
    }

    feedback.classList.remove('hidden');
    setTimeout(() => feedback.classList.add('hidden'), 2800);
}

function initCampaignPage() {
    const commentForm = document.getElementById('campaignCommentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', addCampaignComment);

        // Pre-fill name if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === '1';
        if (isLoggedIn) {
            const nameInput = document.getElementById('campaignCommentName');
            const userName = localStorage.getItem('userName');
            if (nameInput && userName) {
                nameInput.value = userName;
                nameInput.readOnly = true;
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', initCampaignPage);
