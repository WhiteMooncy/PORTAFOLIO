// =========================================================
// LÓGICA DE INTERSECTION OBSERVER PARA REPETICIÓN DE ANIMACIONES
// =========================================================

// SELECTORES
// 1. Sección de Inicio (Asumiendo que usa el ID #inicio)
const heroSection = document.querySelector('#inicio'); 
const animatedTitle = document.querySelector('.Hello-title'); 

// 2. Sección Acerca de Mí
const aboutSection = document.querySelector('.About-section');
const imageContainer = document.querySelector('.About-image-container');
const contentContainer = document.querySelector('.About-content');

// OPCIONES GENERALES
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1 
};

// HANDLER para la Sección INICIO
function handleHeroIntersection(entries) {
    entries.forEach(entry => {
        if (animatedTitle) {
            if (entry.isIntersecting) {
                // Cuando entra: activa la animación
                animatedTitle.classList.add('slideInLeft-animation');
            } else {
                // Cuando sale: quita la clase para que se reinicie
                animatedTitle.classList.remove('slideInLeft-animation');
            }
        }
    });
}

// HANDLER para la Sección ACERCA DE MÍ
function handleAboutIntersection(entries) {
    entries.forEach(entry => {
        if (imageContainer && contentContainer) {
            if (entry.isIntersecting) {
                // Cuando entra: activa ambas animaciones
                imageContainer.classList.add('animate-from-bottom');
                contentContainer.classList.add('animate-from-right');
            } else {
                // Cuando sale: quita las clases para que se reinicie
                imageContainer.classList.remove('animate-from-bottom');
                contentContainer.classList.remove('animate-from-right');
            }
        }
    });
}

// INICIALIZACIÓN DE OBSERVADORES
// Inicia el observador para la sección de Inicio
if (heroSection) {
    const heroObserver = new IntersectionObserver(handleHeroIntersection, observerOptions);
    heroObserver.observe(heroSection);
}

// Inicia el observador para la sección Acerca de Mí
if (aboutSection) {
    const aboutObserver = new IntersectionObserver(handleAboutIntersection, observerOptions);
    aboutObserver.observe(aboutSection);
}