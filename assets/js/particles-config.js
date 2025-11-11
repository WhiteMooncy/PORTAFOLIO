// Configuración de Particles.js para Portafolio (Adaptable a tema)
(function() {
    // Función para obtener colores según el tema
    function getParticleColors() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        
        return {
            particles: isDark 
                ? ['#4adebd', '#8eecd7', '#2bb89d', '#78d0ca'] 
                : ['#ffffff', '#f0f0f0', '#d0d0d0', '#b0b0b0'],
            lines: isDark ? '#4adebd' : '#a0a0a0',
            stroke: isDark ? '#4adebd' : '#ffffff'
        };
    }
    
    // Inicializar particles con colores del tema actual
    const colors = getParticleColors();
    
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 120,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: colors.particles
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 1,
                    color: colors.stroke
                }
            },
            opacity: {
                value: 0.8,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.4,
                    sync: false
                }
            },
            size: {
                value: 5,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 2,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: colors.lines,
                opacity: 0.6,
                width: 2
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 140,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });
    
    // Actualizar colores cuando cambie el tema
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'data-theme') {
                const newColors = getParticleColors();
                
                if (window.pJSDom && window.pJSDom[0]) {
                    const pJS = window.pJSDom[0].pJS;
                    pJS.particles.color.value = newColors.particles;
                    pJS.particles.line_linked.color = newColors.lines;
                    
                    // Refrescar partículas
                    pJS.fn.particlesRefresh();
                }
            }
        });
    });
    
    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
})();
