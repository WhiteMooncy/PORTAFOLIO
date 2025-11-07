
document.addEventListener('DOMContentLoaded', function () {

    const aboutSection = document.querySelector('.About-section');
    const imageContainer = document.querySelector('.About-image-container');
    const contentContainer = document.querySelector('.About-content');

    if (!aboutSection) {
        console.warn('aboutMeAnimations: .About-section no encontrada — observador no iniciado');
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
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

    const observer = new IntersectionObserver(handleIntersection, observerOptions);
    observer.observe(aboutSection);

    console.debug('aboutMeAnimations: observador inicializado para .About-section');
});