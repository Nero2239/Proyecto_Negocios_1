const CAMPAIGN_COMMENTS_KEY = 'campaignComments';
const LEGACY_COMMENTS_KEY = 'userCampaignComments';

function getCampaignComments() {
    const mainComments = JSON.parse(localStorage.getItem(CAMPAIGN_COMMENTS_KEY) || '[]');
    const legacyComments = JSON.parse(localStorage.getItem(LEGACY_COMMENTS_KEY) || '[]');
    const merged = [...mainComments, ...legacyComments];
    const uniqueComments = [];
    const seen = new Set();

    merged.forEach((comment) => {
        const signature = `${comment.name || ''}|${comment.text || ''}|${comment.date || ''}`;
        if (!seen.has(signature)) {
            seen.add(signature);
            uniqueComments.push(comment);
        }
    });

    return uniqueComments;
}

function saveCampaignComments(comments) {
    localStorage.setItem(CAMPAIGN_COMMENTS_KEY, JSON.stringify(comments));
    localStorage.setItem(LEGACY_COMMENTS_KEY, JSON.stringify(comments));
}

function renderCampaignComments() {
    const list = document.getElementById('campaignCommentsList');
    if (!list) return;

    const initialComments = [
        { name: 'Santiago', text: 'Me gustó la selección del producto destacado, justo lo que necesito para mis rutas cortas.', date: 'Hace 2 días' },
        { name: 'Lucía', text: 'Muy clara la presentación de la campaña. Quiero ver más productos en próximas ediciones.', date: 'Hace 4 días' },
        { name: 'Mateo', text: 'La oferta de temporada es perfecta para equiparme sin gastar de más.', date: 'Hace 1 semana' },
        { name: 'Ana', text: 'El equipo viene con una buena garantía y se ve preparado para el clima cambiante.', date: 'Hace 3 días' },
        { name: 'Florencia', text: 'Me encanta la energía de la campaña y los códigos de descuento son muy útiles.', date: 'Hace 5 horas' }
    ];

    const comments = getCampaignComments();
    const allComments = comments.length ? comments : initialComments;

    list.innerHTML = allComments.map((comment) => `
        <article class="comment-card">
            <div class="flex items-center justify-between gap-4">
                <div>
                    <p class="font-semibold text-[#2C302E]">${comment.name || 'Anónimo'}</p>
                    <p class="text-sm text-gray-500">${comment.date || 'Ahora'}</p>
                </div>
            </div>
            <p class="mt-3 text-gray-700">${comment.text || ''}</p>
        </article>
    `).join('');
}

function addCampaignComment(event) {
    event.preventDefault();
    const nameInput = document.getElementById('campaignCommentName');
    const commentInput = document.getElementById('campaignCommentText');
    const list = document.getElementById('campaignCommentsList');

    if (!nameInput || !commentInput || !list) return;

    const name = nameInput.value.trim() || 'Anónimo';
    const text = commentInput.value.trim() || '...';

    const newComment = {
        name: nameInput.readOnly && localStorage.getItem('userName') ? localStorage.getItem('userName') : name,
        text,
        date: 'Ahora'
    };

    const comments = getCampaignComments();
    comments.unshift(newComment);
    saveCampaignComments(comments);
    renderCampaignComments();

    commentInput.value = '';
    if (!nameInput.readOnly) {
        nameInput.value = '';
    }

    showToast('¡Gracias por tu comentario!', 'success');
}

function initCampaignPage() {
    const commentForm = document.getElementById('campaignCommentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', addCampaignComment);
        renderCampaignComments();

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
