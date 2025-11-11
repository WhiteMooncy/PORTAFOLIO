// Contador de Visitantes - Portafolio Matteo
// Sistema simple y confiable con localStorage

// Configuración del contador
const COUNTER_CONFIG = {
    storageKey: 'portfolio_visitor_count',
    sessionKey: 'portfolio_session_counted'
};

// Función para obtener y mostrar el contador
function updateVisitorCount() {
    const counterElement = document.getElementById('visitor-count');
    
    if (!counterElement) {
        console.warn('Elemento contador no encontrado');
        return;
    }
    
    try {
        // Obtener contador actual
        let count = parseInt(localStorage.getItem(COUNTER_CONFIG.storageKey)) || 0;
        
        // Verificar si ya se contó en esta sesión (usando sessionStorage)
        const alreadyCounted = sessionStorage.getItem(COUNTER_CONFIG.sessionKey);
        
        // Solo incrementar si es una nueva sesión de navegador
        if (!alreadyCounted) {
            count++;
            localStorage.setItem(COUNTER_CONFIG.storageKey, count);
            sessionStorage.setItem(COUNTER_CONFIG.sessionKey, 'true');
        }
        
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
function getVisitorStats() {
    try {
        return parseInt(localStorage.getItem(COUNTER_CONFIG.storageKey)) || 0;
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        return 0;
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
