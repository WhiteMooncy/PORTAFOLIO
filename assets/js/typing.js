document.addEventListener("DOMContentLoaded", function() {
    // 1. Configuración del texto y elementos
    const textElement = document.getElementById('typed-text');
    const cursorElement = document.querySelector('.typing-container .cursor');
    const text = "Desarrollador Web"; 
    
    // --- ESTOS SON LOS CAMBIOS CLAVE ---
    // A. INICIALIZA EL TEXTO COMPLETO PARA QUE YA ESTÉ VISIBLE AL CARGAR
    textElement.textContent = text; 

    let charIndex = text.length; // Empezamos el índice con la longitud total del texto
    const typingSpeed = 100;
    const initialPause = 3000; // 3 segundos de pausa antes de empezar el borrado/reescritura
    // ------------------------------------

    // 2. Función de ESCRITURA (Type)
    function type() {
        if (charIndex < text.length) {
            // Sigue escribiendo
            textElement.textContent += text.charAt(charIndex);
            charIndex++;
            setTimeout(type, typingSpeed);
        } else {
            // Cuando termina de escribir, se queda en pausa y luego llama a borrar (erase)
            setTimeout(erase, initialPause);
        }
    }

    // 3. Función de BORRADO (Erase/Rewind)
    function erase() {
        if (charIndex > 0) {
            // Borra el último carácter
            textElement.textContent = text.substring(0, charIndex - 1);
            charIndex--;
            // Velocidad de borrado más rápida
            setTimeout(erase, typingSpeed / 2); 
        } else {
            // Cuando termina de borrar, llama a escribir (type)
            setTimeout(type, 500); // Pequeña pausa antes de empezar a escribir
        }
    }

    // 4. INICIO DEL CICLO: Después de una pausa inicial, comienza a borrar
    setTimeout(erase, initialPause);
});