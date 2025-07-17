document.addEventListener('DOMContentLoaded', () => {

    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    particlesJS("particles-js", {
        particles: { number: { value: 60, density: { enable: true, value_area: 800 }},
            color: { value: "#ffffff" }, shape: { type: "circle" },
            opacity: { value: 0.5, random: true }, size: { value: 3, random: true },
            line_linked: { enable: false },
            move: { enable: true, speed: 2, direction: "bottom-right", random: true, straight: true, out_mode: "out" }
        },
        interactivity: { detect_on: "canvas", events: { onhover: { enable: false }, onclick: { enable: false }, resize: true }},
        retina_detect: true
    });

    const mainContent = document.getElementById('main-content');
    const donateContent = document.getElementById('donate-content');
    const toDonateBtn = document.getElementById('to-donate-btn');
    const toMainBtn = document.getElementById('to-main-btn');

    function switchContent(outgoing, incoming) {
        outgoing.classList.add('content-out');
        
        outgoing.addEventListener('animationend', () => {
            outgoing.style.display = 'none';
            outgoing.classList.remove('content-out');
            
            incoming.style.display = 'flex';
            incoming.classList.add('content-in');
        }, { once: true });
    }

    if(toDonateBtn) toDonateBtn.addEventListener('click', () => switchContent(mainContent, donateContent));
    if(toMainBtn) toMainBtn.addEventListener('click', () => switchContent(donateContent, mainContent));
    
    document.querySelectorAll('.btn, .copy-btn').forEach(button => {
        button.addEventListener('click', function(e) {
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

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    const copyButton = document.getElementById('copyButton');
    const cardNumberText = document.getElementById('cardNumber')?.innerText;

    if(copyButton && cardNumberText) {
        copyButton.addEventListener('click', (e) => {
            e.stopPropagation(); 
            navigator.clipboard.writeText(cardNumberText.replace(/\s/g, '')).then(() => {
                copyButton.classList.add('copied');
                copyButton.title = 'Скопировано!';
                setTimeout(() => {
                    copyButton.classList.remove('copied');
                    copyButton.title = 'Копировать';
                }, 2000);
            });
        });
    }
});
