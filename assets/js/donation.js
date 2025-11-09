// ========================================
// SISTEMA DE DONACIONES
// Integración con múltiples pasarelas de pago
// ========================================

class DonationSystem {
    constructor() {
        this.selectedAmount = null;
        this.selectedPayment = null;
        this.modal = null;
        this.init();
    }

    init() {
        this.createModal();
        this.attachEventListeners();
    }

    createModal() {
        const modalHTML = `
            <div class="donation-float-button">
                <button class="donation-bubble" id="donation-bubble">
                    <span class="donation-tooltip">💝 Apóyame</span>
                    <i class="fas fa-heart"></i>
                </button>
            </div>

            <div class="donation-modal" id="donation-modal">
                <div class="donation-modal-content">
                    <button class="donation-close" id="donation-close">&times;</button>
                    
                    <div id="donation-form">
                        <div class="donation-header">
                            <h2>💝 Apoya mi trabajo</h2>
                            <p>Tu donación me ayuda a seguir creando contenido de calidad</p>
                        </div>

                        <div class="donation-amounts">
                            <button class="amount-button" data-amount="1000">$1.000</button>
                            <button class="amount-button" data-amount="2000">$2.000</button>
                            <button class="amount-button" data-amount="5000">$5.000</button>
                            <button class="amount-button" data-amount="10000">$10.000</button>
                            <button class="amount-button" data-amount="20000">$20.000</button>
                            <button class="amount-button" data-amount="50000">$50.000</button>
                        </div>

                        <div class="custom-amount">
                            <label for="custom-amount-input">O ingresa tu monto personalizado (CLP):</label>
                            <input 
                                type="number" 
                                id="custom-amount-input" 
                                placeholder="Ej: 15000"
                                min="500"
                                step="100"
                            >
                        </div>

                        <div class="payment-methods">
                            <h3>Selecciona método de pago:</h3>
                            <div class="payment-options">
                                <button class="payment-option" data-payment="paypal">
                                    <i class="fab fa-paypal payment-paypal"></i>
                                    <span>PayPal</span>
                                </button>
                                <button class="payment-option" data-payment="stripe">
                                    <i class="fab fa-stripe payment-stripe"></i>
                                    <span>Stripe</span>
                                </button>
                                <button class="payment-option" data-payment="mercadopago">
                                    <i class="fas fa-credit-card payment-mercadopago"></i>
                                    <span>Mercado Pago</span>
                                </button>
                                <button class="payment-option" data-payment="webpay">
                                    <i class="fas fa-shopping-cart payment-webpay"></i>
                                    <span>WebPay</span>
                                </button>
                            </div>
                        </div>

                        <button class="donation-submit" id="donation-submit" disabled>
                            Continuar con la donación
                        </button>
                    </div>

                    <div class="donation-thank-you" id="donation-thank-you">
                        <i class="fas fa-check-circle"></i>
                        <h3>¡Gracias por tu apoyo!</h3>
                        <p>Tu donación significa mucho para mí 💚</p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.modal = document.getElementById('donation-modal');
    }

    attachEventListeners() {
        // Abrir modal
        document.getElementById('donation-bubble').addEventListener('click', () => {
            this.openModal();
        });

        // Cerrar modal
        document.getElementById('donation-close').addEventListener('click', () => {
            this.closeModal();
        });

        // Cerrar al hacer clic fuera
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });

        // Selección de montos
        document.querySelectorAll('.amount-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.selectAmount(e.target);
            });
        });

        // Monto personalizado
        const customInput = document.getElementById('custom-amount-input');
        customInput.addEventListener('input', (e) => {
            this.selectCustomAmount(e.target.value);
        });

        // Selección de método de pago
        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectPaymentMethod(e.currentTarget);
            });
        });

        // Submit
        document.getElementById('donation-submit').addEventListener('click', () => {
            this.processDonation();
        });
    }

    openModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'donation_modal_open', {
                'event_category': 'Donations',
                'event_label': 'Modal Opened'
            });
        }
    }

    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.resetForm();
    }

    selectAmount(button) {
        // Remover selección anterior
        document.querySelectorAll('.amount-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // Seleccionar nuevo
        button.classList.add('selected');
        this.selectedAmount = parseInt(button.dataset.amount);
        
        // Limpiar input personalizado
        document.getElementById('custom-amount-input').value = '';
        
        this.updateSubmitButton();
    }

    selectCustomAmount(value) {
        const amount = parseInt(value);
        
        if (amount >= 500) {
            this.selectedAmount = amount;
            
            // Remover selección de botones
            document.querySelectorAll('.amount-button').forEach(btn => {
                btn.classList.remove('selected');
            });
        } else {
            this.selectedAmount = null;
        }
        
        this.updateSubmitButton();
    }

    selectPaymentMethod(option) {
        // Remover selección anterior
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Seleccionar nuevo
        option.classList.add('selected');
        this.selectedPayment = option.dataset.payment;
        
        this.updateSubmitButton();
    }

    updateSubmitButton() {
        const submitButton = document.getElementById('donation-submit');
        
        if (this.selectedAmount && this.selectedPayment) {
            submitButton.disabled = false;
            submitButton.textContent = `Donar $${this.selectedAmount.toLocaleString('es-CL')}`;
        } else {
            submitButton.disabled = true;
            submitButton.textContent = 'Continuar con la donación';
        }
    }

    async processDonation() {
        // Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'donation_attempt', {
                'event_category': 'Donations',
                'event_label': this.selectedPayment,
                'value': this.selectedAmount
            });
        }

        // Aquí irían las integraciones reales con las APIs
        switch(this.selectedPayment) {
            case 'paypal':
                this.processPayPal();
                break;
            case 'stripe':
                this.processStripe();
                break;
            case 'mercadopago':
                this.processMercadoPago();
                break;
            case 'webpay':
                this.processWebPay();
                break;
        }
    }

    processPayPal() {
        console.log('💳 Procesando con PayPal:', this.selectedAmount);
        
        // DEMO: Aquí iría la integración con PayPal
        // https://developer.paypal.com/
        
        alert(`[DEMO] PayPal\n\nMonto: $${this.selectedAmount.toLocaleString('es-CL')}\n\nEn producción, aquí se abriría la ventana de PayPal.`);
        
        this.showThankYou();
    }

    processStripe() {
        console.log('💳 Procesando con Stripe:', this.selectedAmount);
        
        // DEMO: Aquí iría la integración con Stripe
        // https://stripe.com/docs
        
        alert(`[DEMO] Stripe\n\nMonto: $${this.selectedAmount.toLocaleString('es-CL')}\n\nEn producción, aquí se abriría el checkout de Stripe.`);
        
        this.showThankYou();
    }

    processMercadoPago() {
        console.log('💳 Procesando con Mercado Pago:', this.selectedAmount);
        
        // DEMO: Aquí iría la integración con Mercado Pago
        // https://www.mercadopago.cl/developers/
        
        alert(`[DEMO] Mercado Pago\n\nMonto: $${this.selectedAmount.toLocaleString('es-CL')}\n\nEn producción, aquí se abriría el checkout de Mercado Pago.`);
        
        this.showThankYou();
    }

    processWebPay() {
        console.log('💳 Procesando con WebPay:', this.selectedAmount);
        
        // DEMO: Aquí iría la integración con Transbank WebPay
        // https://www.transbankdevelopers.cl/
        
        alert(`[DEMO] WebPay\n\nMonto: $${this.selectedAmount.toLocaleString('es-CL')}\n\nEn producción, aquí se redirigiría a WebPay de Transbank.`);
        
        this.showThankYou();
    }

    showThankYou() {
        document.getElementById('donation-form').style.display = 'none';
        document.getElementById('donation-thank-you').classList.add('active');
        
        // Cerrar automáticamente después de 3 segundos
        setTimeout(() => {
            this.closeModal();
        }, 3000);
    }

    resetForm() {
        // Reset valores
        this.selectedAmount = null;
        this.selectedPayment = null;
        
        // Reset UI
        document.querySelectorAll('.amount-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelectorAll('.payment-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        document.getElementById('custom-amount-input').value = '';
        
        // Reset vistas
        document.getElementById('donation-form').style.display = 'block';
        document.getElementById('donation-thank-you').classList.remove('active');
        
        this.updateSubmitButton();
    }
}

// Inicializar cuando cargue la página
document.addEventListener('DOMContentLoaded', () => {
    const donationSystem = new DonationSystem();
    console.log('✅ Donation System initialized');
});
