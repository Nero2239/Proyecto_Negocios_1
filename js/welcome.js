document.addEventListener('DOMContentLoaded', () => {
    const enterBtn = document.getElementById('enterBtn');
    const welcomeCard = document.querySelector('.welcome-hero');

    if (!enterBtn || !welcomeCard) return;

    enterBtn.addEventListener('click', () => {
        welcomeCard.classList.add('exiting');

        setTimeout(() => {
            if (window.opener && !window.opener.closed) {
                try {
                    window.opener.focus();
                } catch (e) {
                    console.warn(e);
                }
                window.close();
                return;
            }

            window.location.href = 'index.html';
        }, 420);
    });
});
