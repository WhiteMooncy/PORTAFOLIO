// Slide-in animation para el título principal (Hola, soy Matteo)
document.addEventListener('DOMContentLoaded', function () {
	const heroSection = document.querySelector('#inicio');
	const animatedTitle = document.querySelector('.Hello-title');

	if (!heroSection || !animatedTitle) {
		// No hay elementos necesarios, salir silenciosamente
		console.warn('slideInLeft: elementos #inicio o .Hello-title no encontrados');
		return;
	}

	const options = {
		root: null,
		rootMargin: '0px',
		threshold: 0.15 // cuando ~15% de la sección aparece
	};

	function handler(entries) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				animatedTitle.classList.add('slideInLeft-animation');
			} else {
				// Remover para permitir reinicios al hacer scroll hacia arriba/abajo
				animatedTitle.classList.remove('slideInLeft-animation');
			}
		});
	}

	const observer = new IntersectionObserver(handler, options);
	observer.observe(heroSection);

	console.debug('slideInLeft: observador inicializado para #inicio');
});

