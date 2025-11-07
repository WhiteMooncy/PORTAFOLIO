document.addEventListener('DOMContentLoaded', function() {
    // 1. Obtener todos los bloques de navegación que necesitamos observar
    const sections = document.querySelectorAll('.About-section, .Info-sectionm, .Projects-section, .Certificates-section'); // Añade todas tus secciones aquí

    // 2. Obtener el contenedor principal de la lista (para eliminar el estado activo de todos)
    const navBlocks = document.querySelectorAll('.headerNavBlock');

    // 3. Opciones para el Intersection Observer
    const options = {
        root: null, // El viewport
        rootMargin: '0px 0px -50% 0px', // Activa la sección a mitad de pantalla
        threshold: 0.1 // Porcentaje mínimo de visibilidad
    };

    // 4. Función de callback para cuando una sección entra o sale del viewport
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Si la sección es visible:
            if (entry.isIntersecting) {
                // a. Limpiar el estado activo de todos los enlaces
                navBlocks.forEach(block => {
                    block.classList.remove('headerNavBlock-active');
                });

                // b. Obtener el ID de la sección actual
                const currentId = entry.target.getAttribute('id');

                // c. Añadir la clase activa al bloque de navegación correspondiente
                if (currentId) {
                    // Seleccionamos el bloque usando el ID de la sección
                    const targetNavBlock = document.querySelector(`.headerNavBlock a[href="#${currentId}"]`).closest('.headerNavBlock');
                    
                    if (targetNavBlock) {
                        targetNavBlock.classList.add('headerNavBlock-active');
                    }
                }
            }
        });
    }, options);

    // 5. Observar cada sección
    sections.forEach(section => {
        observer.observe(section);
    });
});