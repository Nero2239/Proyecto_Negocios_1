const promoData = {
    availableCodes: ['RUTA10', 'Aventura15', 'VERANO20'],
    baseTotal: 149.00,
    currentDiscount: 0,
};

function formatPrice(value) {
    return `$${value.toFixed(2)}`;
}

function renderTotal() {
    const totalValue = document.getElementById('totalValue');
    const discountBadge = document.getElementById('discountBadge');
    const finalTotal = promoData.baseTotal * (1 - promoData.currentDiscount / 100);

    if (totalValue) {
        totalValue.textContent = formatPrice(finalTotal);
    }

    if (discountBadge) {
        if (promoData.currentDiscount > 0) {
            discountBadge.textContent = `${promoData.currentDiscount}% OFF aplicado`;
            discountBadge.classList.remove('hidden');
        } else {
            discountBadge.classList.add('hidden');
        }
    }
}

function showPopout(message) {
    const popup = document.getElementById('discountPopup');
    if (!popup) return;

    popup.querySelector('p').textContent = message;
    popup.classList.remove('hidden');
    setTimeout(() => popup.classList.add('hidden'), 3200);
}

function showSuccess() {
    const success = document.getElementById('discountSuccess');
    if (!success) return;

    success.classList.remove('hidden');
    setTimeout(() => success.classList.add('hidden'), 3000);
}

function applyDiscountCode() {
    const input = document.getElementById('discountCodeInput');
    if (!input) return;

    const code = input.value.trim().toUpperCase();
    const success = document.getElementById('discountSuccess');
    const popup = document.getElementById('discountPopup');

    if (promoData.availableCodes.includes(code)) {
        promoData.currentDiscount = code === 'RUTA10' ? 10 : code === 'Aventura15' ? 15 : 20;
        renderTotal();
        if (success) {
            success.classList.remove('hidden');
        }
        if (popup) {
            popup.classList.add('hidden');
        }
        showSuccess();
    } else {
        promoData.currentDiscount = 0;
        renderTotal();
        if (success) {
            success.classList.add('hidden');
        }
        showPopout('Aún no sacamos esa promo');
    }
}

function addComment(event) {
    event.preventDefault();

    const nameInput = document.getElementById('commentName');
    const commentInput = document.getElementById('commentText');
    const feedback = document.getElementById('commentFeedback');
    const list = document.getElementById('commentsList');

    if (!nameInput || !commentInput || !list || !feedback) return;

    const name = nameInput.value.trim();
    const text = commentInput.value.trim();
    const ratingSelect = document.getElementById('commentRating');
    const rating = ratingSelect ? Number(ratingSelect.value) : 5;
    if (!name || !text) return;

    const stars = '★★★★★'.slice(0, rating) + '☆☆☆☆☆'.slice(0, 5 - rating);
    const newComment = document.createElement('article');
    newComment.className = 'comment-card';
    newComment.innerHTML = `
        <div class="flex items-center justify-between gap-4">
            <div>
                <p class="font-semibold text-bosque">${name}</p>
                <p class="text-sm text-gray-500">Ahora</p>
            </div>
            <span class="text-sm text-amber-600 font-semibold">${stars}</span>
        </div>
        <p class="mt-3 text-gray-700">${text}</p>
    `;

    list.prepend(newComment);
    nameInput.value = '';
    commentInput.value = '';

    feedback.classList.remove('hidden');
    setTimeout(() => feedback.classList.add('hidden'), 2800);
}

function initPromotionPage() {
    const applyButton = document.getElementById('applyDiscountButton');
    const commentForm = document.getElementById('commentForm');

    if (applyButton) {
        applyButton.addEventListener('click', applyDiscountCode);
    }
    if (commentForm) {
        commentForm.addEventListener('submit', addComment);
    }
    renderTotal();
}

window.addEventListener('DOMContentLoaded', initPromotionPage);
