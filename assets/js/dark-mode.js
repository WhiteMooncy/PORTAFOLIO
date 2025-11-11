/**
 * DARK MODE TOGGLE
 * Maneja el cambio entre modo claro y oscuro
 * Persistencia en localStorage
 * Respeta preferencias del sistema
 */

(function() {
    'use strict';
    
    const STORAGE_KEY = 'theme-preference';
    
    /**
     * Obtiene la preferencia del sistema
     */
    function getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    /**
     * Obtiene la preferencia guardada o del sistema
     */
    function getSavedTheme() {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        return savedTheme || getSystemTheme();
    }
    
    /**
     * Aplica el tema al documento
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        
        // Update meta theme-color para mobile
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute(
                'content', 
                theme === 'dark' ? '#0f172a' : '#6366f1'
            );
        }
        
        // Analytics tracking (si está disponible)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'theme_change', {
                'event_category': 'UI',
                'event_label': theme,
                'value': 1
            });
        }
    }
    
    /**
     * Guarda la preferencia en localStorage
     */
    function saveTheme(theme) {
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch (e) {
            console.warn('No se pudo guardar la preferencia de tema:', e);
        }
    }
    
    /**
     * Toggle entre temas
     */
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        applyTheme(newTheme);
        saveTheme(newTheme);
        
        // Feedback háptico en móviles (si está disponible)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    /**
     * Inicialización
     */
    function init() {
        // Aplicar tema guardado inmediatamente (antes de DOMContentLoaded)
        const savedTheme = getSavedTheme();
        applyTheme(savedTheme);
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupToggleButton);
        } else {
            setupToggleButton();
        }
        
        // Marcar que el tema está cargado (evitar flash)
        document.body.classList.add('theme-loaded');
    }
    
    /**
     * Configurar el botón de toggle
     */
    function setupToggleButton() {
        const toggleButton = document.getElementById('theme-toggle');
        
        if (!toggleButton) {
            console.warn('Botón de theme toggle no encontrado');
            return;
        }
        
        // Event listener para click
        toggleButton.addEventListener('click', toggleTheme);
        
        // Event listener para teclado (accesibilidad)
        toggleButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }
    
    /**
     * Escuchar cambios en preferencias del sistema
     */
    function watchSystemTheme() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Listener para cambios (solo si no hay preferencia guardada)
        mediaQuery.addEventListener('change', function(e) {
            // Solo aplicar si no hay preferencia manual guardada
            if (!localStorage.getItem(STORAGE_KEY)) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }
    
    // Inicializar inmediatamente
    init();
    
    // Watch system theme changes
    watchSystemTheme();
    
    // Exponer función global para debug
    window.themeManager = {
        toggle: toggleTheme,
        set: function(theme) {
            if (theme === 'dark' || theme === 'light') {
                applyTheme(theme);
                saveTheme(theme);
            }
        },
        get: function() {
            return document.documentElement.getAttribute('data-theme');
        },
        reset: function() {
            localStorage.removeItem(STORAGE_KEY);
            applyTheme(getSystemTheme());
        }
    };
    
})();

/**
 * ANIMACIÓN EXTRA: Partículas ajustadas según tema
 */
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si particles.js está disponible
    if (typeof particlesJS !== 'undefined') {
        
        // Función para actualizar color de partículas
        function updateParticlesColor() {
            const theme = document.documentElement.getAttribute('data-theme');
            const particlesColor = theme === 'dark' ? '#4adebd' : '#339998';
            const lineColor = theme === 'dark' ? '#4adebd' : '#339998';
            
            // Si particles está inicializado, actualizar colores
            if (window.pJSDom && window.pJSDom[0]) {
                window.pJSDom[0].pJS.particles.color.value = particlesColor;
                window.pJSDom[0].pJS.particles.line_linked.color = lineColor;
            }
        }
        
        // Observer para detectar cambios de tema
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'data-theme') {
                    updateParticlesColor();
                }
            });
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
        
        // Actualizar color inicial
        updateParticlesColor();
    }
});
