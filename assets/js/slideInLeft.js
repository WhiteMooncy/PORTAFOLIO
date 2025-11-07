
document.addEventListener('DOMContentLoaded', function () {
	const heroSection = document.querySelector('#inicio');
	const animatedTitle = document.querySelector('.Hello-title');

	if (!heroSection || !animatedTitle) {

		console.warn('slideInLeft: elementos #inicio o .Hello-title no encontrados');
		return;
	}

	const options = {
		root: null,
		rootMargin: '0px',
		threshold: 0.15
	};

	function handler(entries) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				animatedTitle.classList.add('slideInLeft-animation');
			} else {

				animatedTitle.classList.remove('slideInLeft-animation');
			}
		});
	}

	const observer = new IntersectionObserver(handler, options);
	observer.observe(heroSection);

	console.debug('slideInLeft: observador inicializado para #inicio');
});

