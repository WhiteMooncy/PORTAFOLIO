const aboutSection = document.querySelector('.About-section');
const imageContainer = document.querySelector('.about-image-container');
const contentContainer = document.querySelector('.about-content');


// El resto de tu código...


// Opciones para el observador (empieza la animación cuando el 10% de la sección es visible)
const observerOptions = {
    root: null, // El viewport
    rootMargin: '0px',
    threshold: 0.1 // 10% de la sección visible
};

function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        // Si la sección es visible (entra al viewport)
        if (entry.isIntersecting) {
            // AÑADIR: Aplica las clases para que los elementos entren
            imageContainer.classList.add('animate-from-bottom');
            contentContainer.classList.add('animate-from-right');
        } else {
            imageContainer.classList.remove('animate-from-bottom');
            contentContainer.classList.remove('animate-from-right');
        }
    });
}
// Crea el observador y empieza a monitorear la sección 'Acerca de mí'
const observer = new IntersectionObserver(handleIntersection, observerOptions);

if (aboutSection) {
    observer.observe(aboutSection);
}