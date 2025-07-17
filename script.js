document.addEventListener('DOMContentLoaded', () => {
    particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": 60,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "circle"
            },
            "opacity": {
                "value": 0.5,
                "random": true
            },
            "size": {
                "value": 3,
                "random": true
            },
            "line_linked": {
                "enable": false
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "bottom-right",
                "random": true,
                "straight": true,
                "out_mode": "out"
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": false
                },
                "onclick": {
                    "enable": false
                },
                "resize": true
            }
        },
        "retina_detect": true
    });
    
    const copyButton = document.getElementById('copyButton');
    const cardNumberText = document.getElementById('cardNumber')?.innerText;

    if(copyButton && cardNumberText) {
        copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(cardNumberText.replace(/\s/g, '')).then(() => {
                copyButton.classList.add('copied');
                copyButton.title = 'Скопировано!';
                setTimeout(() => {
                    copyButton.classList.remove('copied');
                    copyButton.title = 'Копировать';
                }, 2000);
            }).catch(err => {
                console.error('Не удалось скопировать текст: ', err);
                copyButton.title = 'Ошибка!';
            });
        });
    }
});
