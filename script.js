document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.getElementById('main-content');
    const donateContent = document.getElementById('donate-content');
    const toDonateBtn = document.getElementById('to-donate-btn');
    const toMainBtn = document.getElementById('to-main-btn');
    const mainText = `Здравствуйте, я обычный человек с псевдонимом Рэйвар
Имя: Еблан
Псевдоним: Рэйвар
Возраст: 1488

Люблю писать ботов, программы
Какие языки программирования я знаю:
Python, JavaScript, Java, C++, C#, Assembler, C, Go
На этом все! :3
#krd ❤️`;
    const donateText = `хэй! если ты хочешь поддержать меня (например помочь в создании телеграмм-ботов) то можешь кинуть денюжек на карту? :3`;

    function typewriter(textContainer, text, callback) {
        textContainer.innerHTML = '<span class="content"></span><span class="cursor">▋</span>';
        const contentSpan = textContainer.querySelector('.content');
        let i = 0;
        const speed = 20;

        function type() {
            if (i < text.length) {
                contentSpan.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                if (callback) callback();
            }
        }
        type();
    }

    function showPage(pageElement, textElement, text, buttonsContainer) {
        pageElement.style.display = 'flex';
        pageElement.classList.remove('content-out');
        pageElement.classList.add('content-in');
        buttonsContainer.classList.remove('visible');
        typewriter(textElement, text, () => {
            buttonsContainer.classList.add('visible');
        });
    }

    function switchPage(pageOut, pageIn, textElementIn, textIn, buttonsIn) {
        pageOut.classList.remove('content-in');
        pageOut.classList.add('content-out');
        pageOut.addEventListener('animationend', () => {
            pageOut.style.display = 'none';
            pageOut.classList.remove('content-out');
            showPage(pageIn, textElementIn, textIn, buttonsIn);
        }, { once: true });
    }

    particlesJS("particles-js", {
        particles: { number: { value: 50, density: { enable: true, value_area: 800 } },
            color: { value: "#4f5661" }, shape: { type: "circle" }, opacity: { value: 0.5, random: true },
            size: { value: 2, random: true }, line_linked: { enable: false },
            move: { enable: true, speed: 2, direction: "bottom-right", random: false, straight: true, out_mode: "out" }
        },
        interactivity: { detect_on: "canvas", events: { onhover: { enable: false }, onclick: { enable: false }, resize: true } },
        retina_detect: true
    });

    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        showPage(mainContent, document.getElementById('main-p'), mainText, document.getElementById('main-btns'));
    });
    toDonateBtn.addEventListener('click', () => switchPage(mainContent, donateContent, document.getElementById('donate-p'), donateText, document.getElementById('donate-btns')));
    toMainBtn.addEventListener('click', () => switchPage(donateContent, mainContent, document.getElementById('main-p'), mainText, document.getElementById('main-btns')));

    document.querySelectorAll('.btn, .copy-btn').forEach(button => {
        button.addEventListener('mousedown', function (e) {
            const rect = this.getBoundingClientRect();
            const size = Math.max(this.clientWidth, this.clientHeight);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            this.appendChild(ripple);
            setTimeout(() => { ripple.remove(); }, 600);
        });
    });

    const copyButton = document.getElementById('copyButton');
    const cardNumberText = document.getElementById('cardNumber')?.innerText;
    if (copyButton && cardNumberText) {
        copyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(cardNumberText.replace(/\s/g, '')).then(() => {
                copyButton.classList.add('copied');
                setTimeout(() => { copyButton.classList.remove('copied'); }, 2000);
            });
        });
    }
});
