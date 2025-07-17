document.addEventListener('DOMContentLoaded', () => {
    const dragContainer = document.getElementById('drag-container');
    const infoBox = document.querySelector('.info-box');
    const dragHandles = document.querySelectorAll('.drag-handle');
    const magneticButtons = document.querySelectorAll('.magnetic');
    const mainContent = document.getElementById('main-content');
    const donateContent = document.getElementById('donate-content');
    const toDonateBtn = document.getElementById('to-donate-btn');
    const toMainBtn = document.getElementById('to-main-btn');

    const mainText = `Здравствуйте, я обычный человек с псевдонимом
Рэйвар
Имя: Еблан
Псевдоним: Рэйвар
Возраст: 1488

Люблю писать ботов, программы
Какие языки программирования я знаю:
Python, JavaScript, Java, C++, C#, Assembler, C, Go
На этом все! :3
#krd ❤️`;
    const donateText = `хэй! если ты хочешь поддержать меня (например помочь в создании телеграмм-ботов) то можешь кинуть денюжек на карту? :3`;

    let isDragging = false, parallaxEnabled = true, xOffset = 0, yOffset = 0, initialX, initialY;

    dragHandles.forEach(handle => {
        handle.addEventListener('mousedown', dragStart);
        handle.addEventListener('touchstart', dragStart, { passive: false });
    });
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchmove', drag, { passive: false });
    
    function dragStart(e) {
        isDragging = true;
        parallaxEnabled = false;
        document.body.classList.add('dragging');
        infoBox.style.transition = 'none';
        initialX = (e.type === 'touchstart' ? e.touches[0].clientX : e.clientX) - xOffset;
        initialY = (e.type === 'touchstart' ? e.touches[0].clientY : e.clientY) - yOffset;
    }
    
    function dragEnd() {
        if (!isDragging) return;
        isDragging = false;
        parallaxEnabled = true;
        infoBox.style.transition = 'transform 0.05s linear';
        document.body.classList.remove('dragging');
    }
    
    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            const currentX = (e.type === "touchmove" ? e.touches[0].clientX : e.clientX) - initialX;
            const currentY = (e.type === "touchmove" ? e.touches[0].clientY : e.clientY) - initialY;
            xOffset = currentX;
            yOffset = currentY;
            dragContainer.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    }

    function apply3DEffect(e) {
        if (!parallaxEnabled) return;
        const rect = dragContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        const rotateX = (mouseY / (rect.height / 2)) * -5;
        const rotateY = (mouseX / (rect.width / 2)) * 5;
        infoBox.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    function applyMagneticEffect(e, el) {
        if (!parallaxEnabled) return;
        const rect = el.getBoundingClientRect();
        const deltaX = e.clientX - (rect.left + rect.width / 2);
        const deltaY = e.clientY - (rect.top + rect.height / 2);
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        const magneticTransform = distance < 100 ? `translate(${deltaX * 0.2}px, ${deltaY * 0.2}px)` : '';
        const hoverTransform = el.matches(':hover') ? 'translateY(-2px)' : '';
        el.style.transform = magneticTransform || hoverTransform;
    }

    document.body.onmousemove = (e) => {
        window.requestAnimationFrame(() => {
            document.documentElement.style.setProperty('--mouse-x', e.clientX + 'px');
            document.documentElement.style.setProperty('--mouse-y', e.clientY + 'px');
            apply3DEffect(e);
            document.querySelectorAll('.btn.magnetic').forEach(btn => applyMagneticEffect(e, btn));
        });
    };

    function dataMoshing(textContainer, onComplete) {
        const chars = '█▓▒░01';
        const segments = textContainer.querySelectorAll('span.char, br, span.cursor');
        let completed = 0;
        let charSegments = Array.from(segments).filter(s => s.tagName === 'SPAN' && !s.classList.contains('cursor'));
        if (charSegments.length === 0) { if (onComplete) onComplete(); return; }
        charSegments.forEach((span, i) => {
            let randomCharCount = 0;
            const animate = () => {
                if (randomCharCount < 10) {
                    span.textContent = chars[Math.floor(Math.random() * chars.length)];
                    span.style.opacity = Math.random();
                    randomCharCount++;
                    setTimeout(animate, 20);
                } else {
                    span.style.opacity = '0';
                    if (++completed >= charSegments.length && onComplete) onComplete();
                }
            };
            setTimeout(animate, i * 5);
        });
    }

    function typewriter(textContainer, text, onComplete) {
        let html = '';
        for (const char of text) html += char === '\n' ? '<br>' : `<span class="char">${char}</span>`;
        textContainer.innerHTML = html + '<span class="cursor"> |</span>';
        const chars = Array.from(textContainer.children).filter(c => c.tagName === 'SPAN' && !c.classList.contains('cursor'));
        let i = 0;
        function revealChar() {
            if (i < chars.length) {
                chars[i].style.transition = 'opacity 0.5s';
                chars[i].style.opacity = '1';
                i++;
                setTimeout(revealChar, 15);
            } else { if (onComplete) onComplete(); }
        }
        revealChar();
    }
    
    function switchPage(pageOut, pageIn, textIn) {
        pageOut.querySelector('.btn-container').classList.remove('visible');
        parallaxEnabled = false;
        infoBox.style.transform = 'rotateX(0deg) rotateY(0deg)';
        const textContainerOut = pageOut.querySelector('.typing-text-container');
        dataMoshing(textContainerOut, () => {
             pageOut.style.display = 'none';
             pageOut.classList.remove('active');
             pageIn.style.display = 'flex';
             pageIn.classList.add('active');
             parallaxEnabled = true;
             typewriter(pageIn.querySelector('.typing-text-container'), textIn, () => {
                 pageIn.querySelector('.btn-container').classList.add('visible');
             });
        });
    }

    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        mainContent.classList.add('active');
        typewriter(document.getElementById('main-p'), mainText, () => {
            document.getElementById('main-btns').classList.add('visible');
        });
    });
    
    document.body.onmouseleave = () => {
        if(parallaxEnabled) infoBox.style.transform = `rotateX(0deg) rotateY(0deg)`;
        magneticButtons.forEach(btn => btn.style.transform = '');
    };
    
    document.addEventListener('mousedown', (e) => {
        if(e.target.closest('.info-box')) return;
        const ripple = document.createElement('span');
        ripple.classList.add('ripple', 'background-ripple');
        document.body.appendChild(ripple);
        const size = 100;
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - size/2}px`;
        ripple.style.top = `${e.clientY - size/2}px`;
        setTimeout(() => ripple.remove(), 600);
    });

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('mousedown', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;
            setTimeout(() => ripple.remove(), 600);
        });
    });

    toDonateBtn.onclick = () => switchPage(mainContent, donateContent, donateText);
    toMainBtn.onclick = () => switchPage(donateContent, mainContent, mainText);

    document.getElementById('copyButton').addEventListener('click', (e) => {
        e.stopPropagation();
        const cardNumber = document.getElementById('cardNumber')?.innerText;
        navigator.clipboard.writeText(cardNumber.replace(/\s/g, '')).then(() => {
            e.target.classList.add('copied');
            setTimeout(() => e.target.classList.remove('copied'), 2000);
        });
    });
});
