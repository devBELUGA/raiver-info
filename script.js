document.addEventListener('DOMContentLoaded', () => {
    const dragContainer = document.getElementById('drag-container');
    const infoBox = document.querySelector('.info-box');
    const dragHandles = document.querySelectorAll('.drag-handle');
    const magneticButtons = document.querySelectorAll('.magnetic');

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

    let isDragging = false;
    let parallaxEnabled = true;
    let xOffset = 0, yOffset = 0, initialX, initialY;
    
    dragHandles.forEach(handle => {
        handle.addEventListener('mousedown', dragStart);
        handle.addEventListener('touchstart', dragStart, { passive: false });
    });
    
    function dragStart(e) {
        isDragging = true;
        parallaxEnabled = false;
        document.body.classList.add('dragging');
        
        if (e.type === 'touchstart') {
            initialX = e.touches[0].clientX - xOffset;
            initialY = e.touches[0].clientY - yOffset;
        } else {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
        }
    }
    
    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        parallaxEnabled = true;
        document.body.classList.remove('dragging');
    }
    
    function drag(e) {
        if (!isDragging) return;
        e.preventDefault();

        let currentX, currentY;
        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        dragContainer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    }

    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });


    function apply3DEffect(e) {
        if (!parallaxEnabled) return;
        const {
            left,
            top,
            width,
            height
        } = dragContainer.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        const rotateX = (mouseY / (height / 2)) * -5;
        const rotateY = (mouseX / (width / 2)) * 5;
        infoBox.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    function applyMagneticEffect(e, el) {
        if (!parallaxEnabled) return;
        const { left, top, width, height } = el.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        if (distance < 100) {
            el.style.transform = `translateZ(40px) translate(${deltaX * 0.2}px, ${deltaY * 0.2}px)`;
        } else {
            el.style.transform = 'translateZ(40px)';
        }
    }

    document.body.onmousemove = (e) => {
        apply3DEffect(e);
        magneticButtons.forEach(btn => applyMagneticEffect(e, btn));
    };

    function dataMoshing(textContainer, newText, onComplete) {
        const chars = '█▓▒░ABCDEFGHIJKLM_NOPQRSTUVWXYZ!@#$%^&*()';
        const segments = textContainer.querySelectorAll('span.char, br, span.cursor');
        let completed = 0;
        let charSegments = Array.from(segments).filter(s => s.tagName !== 'BR' && !s.classList.contains('cursor'));
        const total = charSegments.length;

        if (total === 0) {
             if (onComplete) onComplete();
             return;
        }

        charSegments.forEach((span, i) => {
            const originalChar = span.textContent;
            let randomCharCount = 0;
            const animate = () => {
                if (randomCharCount < 10) {
                    span.textContent = chars[Math.floor(Math.random() * chars.length)];
                    span.style.opacity = Math.random();
                    randomCharCount++;
                    setTimeout(animate, 20);
                } else {
                    span.textContent = originalChar;
                    span.style.opacity = '0';
                    if (++completed >= total && onComplete) {
                        onComplete();
                    }
                }
            };
            setTimeout(animate, i * 10);
        });
    }


    function typewriter(textContainer, text, onComplete) {
        let html = '';
        for (const char of text) {
            html += char === '\n' ? '<br>' : `<span class="char">${char}</span>`;
        }
        textContainer.innerHTML = html + '<span class="cursor"> |</span>';
        const chars = textContainer.querySelectorAll('.char');
        let i = 0;
        function revealChar() {
            if (i < chars.length) {
                chars[i].style.opacity = '1';
                i++;
                setTimeout(revealChar, 15);
            } else {
                if (onComplete) onComplete();
            }
        }
        revealChar();
    }
    
    function switchPage(pageOut, pageIn, textIn) {
        infoBox.style.transform = 'rotateX(0deg) rotateY(0deg)';
        const textContainerOut = pageOut.querySelector('.typing-text-container');
        dataMoshing(textContainerOut, textIn, () => {
             pageOut.style.display = 'none';
             pageOut.classList.remove('active');
             pageIn.style.display = 'flex';
             pageIn.classList.add('active');
             const textContainerIn = pageIn.querySelector('.typing-text-container');
             typewriter(textContainerIn, textIn);
        });
    }

    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        mainContent.classList.add('active');
        const textContainer = document.getElementById('main-p');
        typewriter(textContainer, mainText);
    });
    
    document.body.onmouseleave = () => {
        if(parallaxEnabled) {
             infoBox.style.transform = `rotateX(0deg) rotateY(0deg)`;
             magneticButtons.forEach(btn => btn.style.transform = 'translateZ(40px)');
        }
    };
    
    toDonateBtn.onclick = () => switchPage(mainContent, donateContent, donateText);
    toMainBtn.onclick = () => switchPage(donateContent, mainContent, mainText);

    const copyButton = document.getElementById('copyButton');
    const cardNumberText = document.getElementById('cardNumber')?.innerText;
    if (copyButton && cardNumberText) {
        copyButton.addEventListener('click', (e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(cardNumberText.replace(/\s/g, '')).then(() => {
                copyButton.classList.add('copied');
                setTimeout(() => {
                    copyButton.classList.remove('copied');
                }, 2000);
            });
        });
    }
});
