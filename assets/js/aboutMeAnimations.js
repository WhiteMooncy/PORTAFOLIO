// Seguridad: ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function () {
    // Selecciones (usar las mismas clases que el HTML/CSS)
    const aboutSection = document.querySelector('.About-section');
    const imageContainer = document.querySelector('.About-image-container');
    const contentContainer = document.querySelector('.About-content');

    if (!aboutSection) {
        console.warn('aboutMeAnimations: .About-section no encontrada — observador no iniciado');
        return;
    }

    // Opciones para el observador (empieza la animación cuando el 10% de la sección es visible)
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% de la sección visible
    };

    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (imageContainer) imageContainer.classList.add('animate-from-bottom');
                if (contentContainer) contentContainer.classList.add('animate-from-right');
            } else {
                if (imageContainer) imageContainer.classList.remove('animate-from-bottom');
                if (contentContainer) contentContainer.classList.remove('animate-from-right');
            }
        });
    }

    // Crea el observador y empieza a monitorear la sección 'Acerca de mí'
    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    observer.observe(aboutSection);

    console.debug('aboutMeAnimations: observador inicializado para .About-section');
});