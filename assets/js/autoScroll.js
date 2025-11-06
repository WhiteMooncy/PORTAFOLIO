const track = document.querySelector('.certificates-carousel-track');
let currentPosition = 0;
const scrollSpeed = 0.5;

function autoScroll(){
    // **********************************************
    // ** VERIFICACIÓN CRÍTICA (CORRECCIÓN 1) **
    // **********************************************
    // Si el elemento aún no existe (es null), sal de la función.
    if (!track) {
        console.error("Error: El elemento .certificates-carousel-track no fue encontrado.");
        return; 
    }
    
    // mover hacia la izquierda
    currentPosition -= scrollSpeed;
    const trackWidth = track.scrollWidth; // Ahora no fallará si 'track' no es null
    const containerWidth = track.parentElement.clientWidth;

    if(currentPosition < -(trackWidth - containerWidth)*0.7){
        currentPosition = 0;
    }
    
    // CORRECCIÓN 2: Asegurarse de usar la sintaxis correcta
    // (Ya la tienes bien en el último archivo que me enviaste, ¡bien hecho!)
    track.style.transform = `translateX(${currentPosition}px)`;
    
    requestAnimationFrame(autoScroll);
}

// **********************************************
// ** CORRECCIÓN 3: Inicia solo DESPUÉS de cargar la página. **
// **********************************************
window.addEventListener('load', autoScroll);