const track = document.querySelector('.certificates-carousel-track');
let currentPosition = 0;
const scrollSpeed = 0.8;

function autoScroll(){

    if (!track) {
        console.error("Error: El elemento .certificates-carousel-track no fue encontrado.");
        return; 
    }

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