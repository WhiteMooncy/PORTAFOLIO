// Formulario de Contacto con Formspree + Seguridad Anti-Spam - Portafolio Matteo

// Configuración de seguridad
const RATE_LIMIT = {
    MAX_SUBMISSIONS_PER_MONTH: 1,  // 1 envío por mes por usuario
    MAX_SUBMISSIONS_PER_DAY: 1,    // 1 envío por día por usuario
    STORAGE_KEY: 'portfolio_form_submissions'
};

// Función para obtener hash del email (para privacidad)
function hashEmail(email) {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
        const char = email.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

// Función para verificar si el usuario puede enviar
function canUserSubmit(email) {
    const now = new Date();
    const userHash = hashEmail(email.toLowerCase());
    
    // Obtener datos de envíos del localStorage
    const submissionsData = localStorage.getItem(RATE_LIMIT.STORAGE_KEY);
    const submissions = submissionsData ? JSON.parse(submissionsData) : {};
    
    // Limpiar envíos antiguos (más de 30 días)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    Object.keys(submissions).forEach(hash => {
        submissions[hash] = submissions[hash].filter(timestamp => 
            new Date(timestamp) > thirtyDaysAgo
        );
        if (submissions[hash].length === 0) {
            delete submissions[hash];
        }
    });
    
    // Verificar si el usuario existe
    if (!submissions[userHash]) {
        return { allowed: true, reason: null };
    }
    
    const userSubmissions = submissions[userHash];
    
    // Verificar límite diario
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const submissionsToday = userSubmissions.filter(timestamp => 
        new Date(timestamp) > oneDayAgo
    );
    
    if (submissionsToday.length >= RATE_LIMIT.MAX_SUBMISSIONS_PER_DAY) {
        return { 
            allowed: false, 
            reason: 'daily',
            nextAvailable: new Date(submissionsToday[0]).getTime() + 24 * 60 * 60 * 1000
        };
    }
    
    // Verificar límite mensual
    if (userSubmissions.length >= RATE_LIMIT.MAX_SUBMISSIONS_PER_MONTH) {
        return { 
            allowed: false, 
            reason: 'monthly',
            nextAvailable: new Date(userSubmissions[0]).getTime() + 30 * 24 * 60 * 60 * 1000
        };
    }
    
    return { allowed: true, reason: null };
}

// Función para registrar un envío
function recordSubmission(email) {
    const now = new Date();
    const userHash = hashEmail(email.toLowerCase());
    
    const submissionsData = localStorage.getItem(RATE_LIMIT.STORAGE_KEY);
    const submissions = submissionsData ? JSON.parse(submissionsData) : {};
    
    if (!submissions[userHash]) {
        submissions[userHash] = [];
    }
    
    submissions[userHash].push(now.toISOString());
    localStorage.setItem(RATE_LIMIT.STORAGE_KEY, JSON.stringify(submissions));
}

// Función para formatear tiempo restante
function getTimeRemaining(timestamp) {
    const now = new Date().getTime();
    const diff = timestamp - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
        return `${days} día${days > 1 ? 's' : ''} y ${hours} hora${hours !== 1 ? 's' : ''}`;
    }
    return `${hours} hora${hours !== 1 ? 's' : ''}`;
}

// Validación de contenido sospechoso
function isContentSuspicious(text) {
    const suspiciousPatterns = [
        /viagra/i,
        /casino/i,
        /lottery/i,
        /click here/i,
        /buy now/i,
        /(https?:\/\/[^\s]+){3,}/gi,  // Múltiples URLs
        /(.)\1{10,}/,  // Caracteres repetidos
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(text));
}

// Inicialización del formulario
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.button-text') || submitButton;
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const email = document.getElementById('email').value.trim();
            const name = document.getElementById('name').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validaciones de seguridad
            
            // 1. Verificar honeypot (campo _gotcha)
            const honeypot = document.querySelector('input[name="_gotcha"]');
            if (honeypot && honeypot.value !== '') {
                console.warn('Bot detected - honeypot filled');
                return; // Bot detectado, no mostrar nada
            }
            
            // 2. Verificar límite de envíos
            const rateLimitCheck = canUserSubmit(email);
            if (!rateLimitCheck.allowed) {
                const timeRemaining = getTimeRemaining(rateLimitCheck.nextAvailable);
                const message = rateLimitCheck.reason === 'daily' 
                    ? `Ya enviaste un mensaje hoy. Podrás enviar otro en ${timeRemaining}.`
                    : `Ya alcanzaste el límite de mensajes este mes. Podrás enviar otro en ${timeRemaining}.`;
                
                showNotification(message, 'warning');
                return;
            }
            
            // 3. Validar longitud de campos
            if (name.length < 2 || name.length > 100) {
                showNotification('El nombre debe tener entre 2 y 100 caracteres.', 'error');
                return;
            }
            
            if (subject.length < 3 || subject.length > 200) {
                showNotification('El asunto debe tener entre 3 y 200 caracteres.', 'error');
                return;
            }
            
            if (message.length < 10 || message.length > 5000) {
                showNotification('El mensaje debe tener entre 10 y 5000 caracteres.', 'error');
                return;
            }
            
            // 4. Detectar contenido sospechoso
            if (isContentSuspicious(message) || isContentSuspicious(subject)) {
                showNotification('El contenido parece sospechoso. Por favor, revisa tu mensaje.', 'error');
                console.warn('Suspicious content detected');
                return;
            }
            
            // 5. Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Por favor ingresa un email válido.', 'error');
                return;
            }
            
            // Deshabilitar botón y mostrar estado de carga
            submitButton.disabled = true;
            const originalText = buttonText.innerHTML;
            buttonText.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            try {
                // Obtener datos del formulario
                const formData = new FormData(contactForm);
                
                // Enviar a Formspree
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    // Registrar el envío exitoso
                    recordSubmission(email);
                    
                    // Éxito
                    buttonText.innerHTML = '<i class="fas fa-check"></i> ¡Enviado!';
                    showNotification('¡Mensaje enviado exitosamente! Te responderé pronto.', 'success');
                    contactForm.reset();
                    
                    // Restaurar botón después de 3 segundos
                    setTimeout(() => {
                        buttonText.innerHTML = originalText;
                        submitButton.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Error en el envío');
                }
            } catch (error) {
                // Error
                buttonText.innerHTML = '<i class="fas fa-times"></i> Error';
                showNotification('Hubo un error al enviar el mensaje. Por favor intenta de nuevo.', 'error');
                
                // Restaurar botón después de 3 segundos
                setTimeout(() => {
                    buttonText.innerHTML = originalText;
                    submitButton.disabled = false;
                }, 3000);
            }
        });
    }
});

// Función para mostrar notificaciones
function showNotification(message, type) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle'
    };
    
    const colors = {
        success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        error: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
        warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    };
    
    notification.innerHTML = `
        <i class="fas fa-${icons[type]}"></i>
        <span>${message}</span>
    `;
    
    // Agregar estilos inline
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
        font-family: 'Poppins', sans-serif;
        max-width: 400px;
    `;
    
    document.body.appendChild(notification);
    
    // Eliminar después de 6 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 6000);
}
