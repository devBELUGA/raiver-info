document.addEventListener('DOMContentLoaded', () => {
    const copyButton = document.getElementById('copyButton');
    const cardNumberText = document.getElementById('cardNumber').innerText;

    if(copyButton) {
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(cardNumberText).then(() => {
                copyButton.textContent = 'Скопировано!';
                setTimeout(() => {
                    copyButton.textContent = 'Копировать';
                }, 2000);
            }).catch(err => {
                console.error('Не удалось скопировать текст: ', err);
                copyButton.textContent = 'Ошибка!';
            });
        });
    }
});
