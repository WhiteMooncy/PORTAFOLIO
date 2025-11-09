// Contador de Visitantes con CountAPI - Portafolio Matteo

// Configuración del contador
const COUNTER_CONFIG = {
    namespace: 'whitemooncy-portfolio',
    key: 'visits',
    apiUrl: 'https://api.countapi.xyz'
};

// Función para obtener y mostrar el contador
async function updateVisitorCount() {
    const counterElement = document.getElementById('visitor-count');
    
    try {
        // Incrementar contador en CountAPI
        const response = await fetch(
            `${COUNTER_CONFIG.apiUrl}/hit/${COUNTER_CONFIG.namespace}/${COUNTER_CONFIG.key}`
        );
        
        if (!response.ok) {
            throw new Error('Error al cargar contador');
        }
        
        const data = await response.json();
        const count = data.value;
        
        // Animar el número
        animateCounter(counterElement, count);
        
    } catch (error) {
        console.error('Error al cargar el contador de visitas:', error);
        counterElement.textContent = '---';
    }
}

// Función para animar el contador
function animateCounter(element, targetValue) {
    const duration = 1500; // 1.5 segundos
    const startValue = 0;
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Función de easing (ease-out)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOut);
        
        element.textContent = currentValue.toLocaleString('es-ES');
        
        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        } else {
            element.textContent = targetValue.toLocaleString('es-ES');
        }
    }
    
    requestAnimationFrame(updateNumber);
}

// Función para obtener estadísticas (sin incrementar)
async function getVisitorStats() {
    try {
        const response = await fetch(
            `${COUNTER_CONFIG.apiUrl}/get/${COUNTER_CONFIG.namespace}/${COUNTER_CONFIG.key}`
        );
        
        if (!response.ok) {
            throw new Error('Error al obtener estadísticas');
        }
        
        const data = await response.json();
        return data.value;
        
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return null;
    }
}

// Inicializar contador cuando cargue la página
document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para que cargue el footer
    setTimeout(() => {
        updateVisitorCount();
    }, 500);
});

// También actualizar cuando la página se vuelva visible
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        const counterElement = document.getElementById('visitor-count');
        if (counterElement && counterElement.textContent === 'Cargando...') {
            updateVisitorCount();
        }
    }
});
