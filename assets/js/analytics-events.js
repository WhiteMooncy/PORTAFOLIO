// ========================================
// EVENTOS PERSONALIZADOS DE GOOGLE ANALYTICS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ====== Trackear clics en proyectos ======
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const projectCard = this.closest('.project-card');
            const projectName = projectCard ? projectCard.querySelector('h3')?.textContent : 'Unknown';
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'project_click', {
                    'event_category': 'Projects',
                    'event_label': projectName,
                    'value': 1
                });
            }
        });
    });
    
    // ====== Trackear descarga de CV ======
    const cvButton = document.querySelector('a[href*="cv"]');
    if (cvButton) {
        cvButton.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'cv_download', {
                    'event_category': 'Downloads',
                    'event_label': 'CV PDF',
                    'value': 1
                });
            }
        });
    }
    
    // ====== Trackear clics en botón de contacto ======
    const contactButtons = document.querySelectorAll('a[href="#contacto"]');
    contactButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contact_button_click', {
                    'event_category': 'Engagement',
                    'event_label': 'Contact Section',
                    'value': 1
                });
            }
        });
    });
    
    // ====== Trackear clics en redes sociales ======
    const socialLinks = document.querySelectorAll('.social-icons a, .contact-item a');
    socialLinks.forEach(link => {
        link.addEventListener('click', function() {
            let platform = 'Unknown';
            
            if (this.href.includes('linkedin')) platform = 'LinkedIn';
            else if (this.href.includes('github')) platform = 'GitHub';
            else if (this.href.includes('discord')) platform = 'Discord';
            else if (this.href.includes('mailto')) platform = 'Email';
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'social_click', {
                    'event_category': 'Social Media',
                    'event_label': platform,
                    'value': 1
                });
            }
        });
    });
    
    // ====== Trackear scroll depth ======
    let scrollDepth = 0;
    const milestones = [25, 50, 75, 100];
    
    window.addEventListener('scroll', function() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
        
        milestones.forEach(milestone => {
            if (scrollPercentage >= milestone && scrollDepth < milestone) {
                scrollDepth = milestone;
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth', {
                        'event_category': 'Engagement',
                        'event_label': milestone + '%',
                        'value': milestone
                    });
                }
            }
        });
    });
    
    // ====== Trackear tiempo en página ======
    let timeOnPage = 0;
    const timeInterval = setInterval(() => {
        timeOnPage += 30; // Incrementar cada 30 segundos
        
        if (timeOnPage % 60 === 0) { // Cada minuto
            if (typeof gtag !== 'undefined') {
                gtag('event', 'time_on_page', {
                    'event_category': 'Engagement',
                    'event_label': (timeOnPage / 60) + ' min',
                    'value': timeOnPage / 60
                });
            }
        }
    }, 30000);
    
    // Limpiar intervalo al salir
    window.addEventListener('beforeunload', () => {
        clearInterval(timeInterval);
    });
    
    // ====== Trackear envío del formulario de contacto ======
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form Submission',
                    'value': 1
                });
            }
        });
    }
    
    console.log('✅ Analytics Events initialized');
});
