document.addEventListener("DOMcontentLoaded", function() {
    //1. configuracion del texto y los elementos
    const textElement = document.getElementById('typed-text');
    const cursorElement = document.querySelector('typing-container .cursor');
    const text ="Desarrollador Web";
    
    let charIndex = 0;
    const typingSpeed = 100;
    const pauseDuration = 2500;

    //2. funcion prinicipal para el efecto
    function type() {
        if(charIndex < text.length) {
            textElement.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            //cuando termina de escribir, oculta el cursor luego de una pausa
            if(cursorElement) {
                setTimeout(() => {
                    cursorElement.style.display = 'none'; //oculta el cursor
                }, pauseDuration);
            }
        }   
    }
    //inica el efecto despues de una pausa inicial (0,5 segundos)
    setTimeout(type, 500)
});