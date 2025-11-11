// Contador de Visitantes - Portafolio Matteo
// Usando sistema híbrido: API + localStorage

// Configuración del contador
const COUNTER_CONFIG = {
    storageKey: 'portfolio_visitor_count',
    apiUrl: 'https://api.counterapi.dev/v1/whitemooncy/portfolio/visits'
};

// Función para obtener y mostrar el contador
async function updateVisitorCount() {
    const counterElement = document.getElementById('visitor-count');
    
    try {
        // Intentar incrementar con API
        const response = await fetch(`${COUNTER_CONFIG.apiUrl}/up`, {
            method: 'GET'
        });
        
        if (response.ok) {
            const data = await response.json();
            const count = data.count || 0;
            
            // Guardar en localStorage como respaldo
            localStorage.setItem(COUNTER_CONFIG.storageKey, count);
            
            // Animar el número
            animateCounter(counterElement, count);
        } else {
            throw new Error('API no disponible');
        }
        
    } catch (error) {
        console.error('Error al cargar el contador de visitas:', error);
        
        // Usar contador local como fallback
        let localCount = parseInt(localStorage.getItem(COUNTER_CONFIG.storageKey)) || 0;
        localCount++;
        localStorage.setItem(COUNTER_CONFIG.storageKey, localCount);
        
        animateCounter(counterElement, localCount);
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
        const response = await fetch(COUNTER_CONFIG.apiUrl, {
            method: 'GET'
        });
        
        if (response.ok) {
            const data = await response.json();
            return data.count || 0;
        } else {
            throw new Error('API no disponible');
        }
        
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        // Retornar contador local
        return parseInt(localStorage.getItem(COUNTER_CONFIG.storageKey)) || 0;
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
