function addCampaignComment(event) {
    event.preventDefault();
    const nameInput = document.getElementById('campaignCommentName');
    const commentInput = document.getElementById('campaignCommentText');
    const feedback = document.getElementById('campaignCommentFeedback');
    const list = document.getElementById('campaignCommentsList');
    if (!nameInput || !commentInput || !feedback || !list) return;
    const name = nameInput.value.trim();
    const text = commentInput.value.trim();
    const ratingSelect = document.getElementById('campaignCommentRating');
    const rating = ratingSelect ? Number(ratingSelect.value) : 5;
    if (!name || !text) return;
    const stars = '★★★★★'.slice(0, rating) + '☆☆☆☆☆'.slice(0, 5 - rating);
    const commentCard = document.createElement('article');
    commentCard.className = 'comment-card';
    commentCard.innerHTML = `
        <div class="flex items-center justify-between gap-4">
            <div>
                <p class="font-semibold text-bosque">${name}</p>
                <p class="text-sm text-gray-500">Ahora</p>
            </div>
            <span class="text-sm text-amber-600 font-semibold">${stars}</span>
        </div>
        <p class="mt-3 text-gray-700">${text}</p>
    `;
    list.prepend(commentCard);
    nameInput.value = '';
    commentInput.value = '';
    feedback.classList.remove('hidden');
    setTimeout(() => feedback.classList.add('hidden'), 2800);
}

function initCampaignPage() {
    const commentForm = document.getElementById('campaignCommentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', addCampaignComment);
    }
}

window.addEventListener('DOMContentLoaded', initCampaignPage);
