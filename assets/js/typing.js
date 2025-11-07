document.addEventListener("DOMContentLoaded", function() {

    const textElement = document.getElementById('typed-text');
    const cursorElement = document.querySelector('.typing-container .cursor');
    const text = "Desarrollador Web"; 

    textElement.textContent = text; 

    let charIndex = text.length;
    const typingSpeed = 100;
    const initialPause = 3000; // 3 segundos de pausa antes de empezar el borrado/reescritura

    // 2. Función de ESCRITURA (Type)
    function type() {
        if (charIndex < text.length) {

            textElement.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {

            setTimeout(erase, initialPause);
        }
    }

    function erase() {
        if (charIndex > 0) {

            textElement.textContent = text.substring(0, charIndex - 1);
            charIndex--;

            setTimeout(erase, typingSpeed / 2); 
        } else {

            setTimeout(type, 500);
        }
    }

    setTimeout(erase, initialPause);
});