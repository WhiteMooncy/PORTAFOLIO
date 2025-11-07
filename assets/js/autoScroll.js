const track = document.querySelector('.certificates-carousel-track');
let currentPosition = 0;
const scrollSpeed = 1;

function autoScroll(){
    // Si el elemento aún no existe (es null), sal de la función.
    if (!track) {
        console.error("Error: El elemento .certificates-carousel-track no fue encontrado.");
        return; 
    }
    // mover hacia la izquierda
    currentPosition -= scrollSpeed;
    const trackWidth = track.scrollWidth; 
    const containerWidth = track.parentElement.clientWidth;

    if(currentPosition < -(trackWidth - containerWidth)*0.7){
        currentPosition = 0;
    }
    track.style.transform = `translateX(${currentPosition}px)`;
    
    requestAnimationFrame(autoScroll);
}
window.addEventListener('load', autoScroll);