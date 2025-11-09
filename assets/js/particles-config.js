// Configuración de Particles.js para Portafolio (Tonos Blancos/Grises - VISIBLES)
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
            value: ['#ffffff', '#f0f0f0', '#d0d0d0', '#b0b0b0']
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 1,
                color: '#ffffff'
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
            color: '#a0a0a0',
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
