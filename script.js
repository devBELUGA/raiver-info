document.addEventListener('DOMContentLoaded', () => {
    const infoBox = document.querySelector('.info-box');
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

    let currentRAF = null;

    function apply3DEffect(e) {
        const {
            left,
            top,
            width,
            height
        } = infoBox.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        const rotateX = (mouseY / (height / 2)) * -6;
        const rotateY = (mouseX / (width / 2)) * 6;
        infoBox.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    function applyMagneticEffect(e, el) {
        const { left, top, width, height } = el.getBoundingClientRect();
        const centerX = left + width / 2;
        const centerY = top + height / 2;
        const deltaX = Math.floor(e.clientX - centerX);
        const deltaY = Math.floor(e.clientY - centerY);
        const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
        
        if (distance < 100) {
            el.style.transform = `translateZ(40px) translate(${deltaX * 0.2}px, ${deltaY * 0.2}px)`;
        } else {
            el.style.transform = 'translateZ(40px)';
        }
    }
    
    function animate() {
        if(currentRAF) {
           document.body.onmousemove = (e) => {
               apply3DEffect(e);
               magneticButtons.forEach(btn => applyMagneticEffect(e, btn));
           };
        }
       requestAnimationFrame(animate);
    }
    
    function dataMoshing(textContainer, newText, onComplete) {
        const chars = '█▓▒░ABCDEFGHIJKLM_NOPQRSTUVWXYZ!@#$%^&*()';
        const segments = textContainer.querySelectorAll('span.char, span.cursor');
        let completed = 0;
        const total = segments.length - 1;

        segments.forEach((span, i) => {
            if(span.classList.contains('cursor')) return;
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
        let textWithSpans = '';
        for (const char of text) {
            textWithSpans += `<span class="char">${char}</span>`;
        }
        textContainer.innerHTML = textWithSpans + '<span class="cursor">▋</span>';

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
        currentRAF = false;
        infoBox.style.transform = 'rotateX(0deg) rotateY(0deg)';
        const textContainerOut = pageOut.querySelector('.typing-text-container');
        
        dataMoshing(textContainerOut, textIn, () => {
             pageOut.style.display = 'none';
             pageOut.classList.remove('active');

             pageIn.style.display = 'flex';
             pageIn.classList.add('active');
             
             const textContainerIn = pageIn.querySelector('.typing-text-container');
             typewriter(textContainerIn, textIn);
             currentRAF = true;
        });
    }

    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        mainContent.classList.add('active');
        const textContainer = document.getElementById('main-p');
        typewriter(textContainer, mainText);
        currentRAF = true;
        animate();
    });
    
    document.body.onmouseleave = () => {
      infoBox.style.transform = `rotateX(0deg) rotateY(0deg)`;
      magneticButtons.forEach(btn => btn.style.transform = 'translateZ(40px)');
    };
    
    toDonateBtn.onclick = () => switchPage(mainContent, donateContent, donateText);
    toMainBtn.onclick = () => switchPage(donateContent, mainContent, mainText);
});
