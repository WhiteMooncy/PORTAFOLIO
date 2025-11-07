document.addEventListener('DOMContentLoaded', function() {

    const sections = document.querySelectorAll('.Info-section, .About-section, .Info-sectionm, .Projects-section, .Certificates-section'); // Añade todas tus secciones aquí

    const navBlocks = document.querySelectorAll('.headerNavBlock');

    // 3. Opciones para el Intersection Observer
    const options = {
        root: null,
        rootMargin: '0px 0px -50% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {

            if (entry.isIntersecting) {

                navBlocks.forEach(block => {
                    block.classList.remove('headerNavBlock-active');
                });

                const currentId = entry.target.getAttribute('id');

                if (currentId) {

                    const targetNavBlock = document.querySelector(`.headerNavBlock a[href="#${currentId}"]`).closest('.headerNavBlock');
                    
                    if (targetNavBlock) {
                        targetNavBlock.classList.add('headerNavBlock-active');
                    }
                }
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });
});