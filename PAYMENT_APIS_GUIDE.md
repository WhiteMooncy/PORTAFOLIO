# 💳 Guía de Integración de APIs de Pago

Esta rama (`feature/donation-button`) incluye un sistema de donaciones con soporte para múltiples pasarelas de pago.

## 🎯 Características Implementadas

- ✅ Botón flotante animado (burbuja con corazón)
- ✅ Modal responsive con selección de montos
- ✅ Montos predefinidos + monto personalizado
- ✅ Soporte para 4 pasarelas de pago
- ✅ Animaciones y efectos visuales
- ✅ Integración con Google Analytics
- ✅ Modo DEMO funcional

## 🚀 Pasarelas de Pago Soportadas

### 1️⃣ **PayPal** (Más fácil de integrar)

**Recomendado para empezar**

#### Pasos de integración:

1. **Crear cuenta en PayPal Developer**
   - https://developer.paypal.com/
   - Crear una app en el dashboard

2. **Obtener credenciales**
   - Client ID
   - Secret Key

3. **Agregar SDK de PayPal**
   ```html
   <script src="https://www.paypal.com/sdk/js?client-id=TU_CLIENT_ID&currency=USD"></script>
   ```

4. **Código de ejemplo**
   ```javascript
   processPayPal() {
       paypal.Buttons({
           createOrder: (data, actions) => {
               return actions.order.create({
                   purchase_units: [{
                       amount: {
                           value: (this.selectedAmount / 900).toFixed(2) // CLP a USD
                       }
                   }]
               });
           },
           onApprove: (data, actions) => {
               return actions.order.capture().then((details) => {
                   this.showThankYou();
                   console.log('Transaction completed by ' + details.payer.name.given_name);
               });
           }
       }).render('#paypal-button-container');
   }
   ```

**Documentación:** https://developer.paypal.com/docs/checkout/

---

### 2️⃣ **Stripe** (Muy popular)

**Excelente UX y documentación**

#### Pasos de integración:

1. **Crear cuenta en Stripe**
   - https://stripe.com/
   - Obtener API Keys (Publishable y Secret)

2. **Instalar Stripe.js**
   ```html
   <script src="https://js.stripe.com/v3/"></script>
   ```

3. **Código de ejemplo**
   ```javascript
   async processStripe() {
       const stripe = Stripe('pk_test_TU_PUBLISHABLE_KEY');
       
       // Crear sesión de pago en tu backend
       const response = await fetch('/create-checkout-session', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ amount: this.selectedAmount })
       });
       
       const session = await response.json();
       
       // Redirigir a Stripe Checkout
       const result = await stripe.redirectToCheckout({
           sessionId: session.id
       });
   }
   ```

4. **Backend (PHP ejemplo)**
   ```php
   <?php
   require 'vendor/autoload.php';
   \Stripe\Stripe::setApiKey('sk_test_TU_SECRET_KEY');
   
   $session = \Stripe\Checkout\Session::create([
       'payment_method_types' => ['card'],
       'line_items' => [[
           'price_data' => [
               'currency' => 'clp',
               'product_data' => ['name' => 'Donación'],
               'unit_amount' => $_POST['amount'], // En centavos
           ],
           'quantity' => 1,
       ]],
       'mode' => 'payment',
       'success_url' => 'https://tu-sitio.com/success',
       'cancel_url' => 'https://tu-sitio.com/cancel',
   ]);
   
   echo json_encode(['id' => $session->id]);
   ```

**Documentación:** https://stripe.com/docs/payments/checkout

---

### 3️⃣ **Mercado Pago** (América Latina)

**Ideal para Chile, Argentina, Brasil, México**

#### Pasos de integración:

1. **Crear cuenta en Mercado Pago**
   - https://www.mercadopago.cl/developers/
   - Obtener Access Token

2. **Instalar SDK**
   ```html
   <script src="https://sdk.mercadopago.com/js/v2"></script>
   ```

3. **Código de ejemplo**
   ```javascript
   async processMercadoPago() {
       const mp = new MercadoPago('TU_PUBLIC_KEY', {
           locale: 'es-CL'
       });
       
       // Crear preferencia de pago en backend
       const response = await fetch('/create-preference', {
           method: 'POST',
           body: JSON.stringify({ amount: this.selectedAmount })
       });
       
       const preference = await response.json();
       
       // Abrir checkout
       mp.checkout({
           preference: { id: preference.id },
           render: { container: '.mercadopago-button', label: 'Donar' }
       });
   }
   ```

4. **Backend (PHP)**
   ```php
   <?php
   require 'vendor/autoload.php';
   MercadoPago\SDK::setAccessToken('TU_ACCESS_TOKEN');
   
   $preference = new MercadoPago\Preference();
   $item = new MercadoPago\Item();
   $item->title = 'Donación';
   $item->quantity = 1;
   $item->unit_price = $_POST['amount'];
   
   $preference->items = array($item);
   $preference->save();
   
   echo json_encode(['id' => $preference->id]);
   ```

**Documentación:** https://www.mercadopago.cl/developers/es/docs

---

### 4️⃣ **WebPay (Transbank)** - Chile 🇨🇱

**El más usado en Chile**

#### Pasos de integración:

1. **Registrarse en Transbank**
   - https://www.transbankdevelopers.cl/
   - Obtener credenciales de integración y producción

2. **Instalar SDK**
   ```bash
   composer require transbank/transbank-sdk
   ```

3. **Código Backend (PHP)**
   ```php
   <?php
   use Transbank\Webpay\WebpayPlus\Transaction;
   
   // Configurar credenciales
   Transaction::setCommerceCode('TU_CODIGO_COMERCIO');
   Transaction::setApiKey('TU_API_KEY');
   Transaction::setIntegrationType('TEST'); // o 'LIVE'
   
   // Crear transacción
   $amount = $_POST['amount'];
   $sessionId = session_id();
   $buyOrder = uniqid();
   $returnUrl = 'https://tu-sitio.com/webpay-return';
   
   $response = (new Transaction)->create($buyOrder, $sessionId, $amount, $returnUrl);
   
   echo json_encode([
       'token' => $response->getToken(),
       'url' => $response->getUrl()
   ]);
   ```

4. **Frontend**
   ```javascript
   async processWebPay() {
       const response = await fetch('/webpay-init', {
           method: 'POST',
           body: JSON.stringify({ amount: this.selectedAmount })
       });
       
       const { token, url } = await response.json();
       
       // Crear formulario y enviar
       const form = document.createElement('form');
       form.method = 'POST';
       form.action = url;
       
       const input = document.createElement('input');
       input.type = 'hidden';
       input.name = 'token_ws';
       input.value = token;
       
       form.appendChild(input);
       document.body.appendChild(form);
       form.submit();
   }
   ```

**Documentación:** https://www.transbankdevelopers.cl/documentacion/webpay-plus

---

## 🔧 Configuración del Proyecto

### 1. Activar el botón de donaciones

El botón ya está integrado en el HTML. Solo necesitas:

1. Recargar la página
2. Verás el botón flotante en la esquina inferior derecha
3. Haz clic para probar el modo DEMO

### 2. Testing con APIs reales

**Ambiente de pruebas (Sandbox/Test):**

Todas las pasarelas ofrecen ambientes de prueba:

| Pasarela | Modo Test |
|----------|-----------|
| PayPal | Sandbox: https://developer.paypal.com/dashboard/ |
| Stripe | Test Keys: `pk_test_...` |
| Mercado Pago | Test Credentials en Dashboard |
| WebPay | Ambiente de Integración |

### 3. Tarjetas de prueba

**Stripe:**
```
Número: 4242 4242 4242 4242
Fecha: Cualquier fecha futura
CVC: Cualquier 3 dígitos
```

**Mercado Pago:**
```
Número: 5031 7557 3453 0604
Código: 123
Fecha: 11/25
```

**WebPay:**
- Consultar tarjetas de prueba en documentación de Transbank

---

## 📊 Analytics Integrado

El sistema ya trackea:
- ✅ Apertura del modal
- ✅ Intentos de donación
- ✅ Método de pago seleccionado
- ✅ Monto de la donación

Eventos en Google Analytics:
```javascript
gtag('event', 'donation_modal_open');
gtag('event', 'donation_attempt', {
    'event_category': 'Donations',
    'event_label': 'paypal',  // o stripe, mercadopago, webpay
    'value': 5000
});
```

---

## 🎨 Personalización

### Cambiar colores:
Edita `donation-button.css`:
```css
.donation-bubble {
    background: linear-gradient(135deg, #TU_COLOR1 0%, #TU_COLOR2 100%);
}
```

### Cambiar montos predefinidos:
Edita `index.html` o `donation.js`:
```html
<button class="amount-button" data-amount="1000">$1.000</button>
```

### Cambiar textos:
Busca y reemplaza en `donation.js`

---

## 🚀 Deploy a Producción

1. **Cambiar a credenciales de producción**
   - Reemplazar API Keys de test por production
   - Configurar webhooks para confirmación de pagos

2. **Configurar HTTPS**
   - Todas las pasarelas requieren HTTPS en producción

3. **Cumplir regulaciones**
   - PCI DSS para manejo de tarjetas
   - Políticas de privacidad
   - Términos de servicio

---

## 📝 Próximos Pasos Recomendados

1. **Empezar con PayPal** (más fácil)
2. **Probar en modo Sandbox**
3. **Implementar backend** (PHP, Node.js, Python)
4. **Configurar webhooks** (para confirmaciones)
5. **Testear exhaustivamente**
6. **Deploy a producción** con credenciales reales

---

## 🆘 Recursos Útiles

- **PayPal Sandbox:** https://developer.paypal.com/
- **Stripe Testing:** https://stripe.com/docs/testing
- **Mercado Pago:** https://www.mercadopago.cl/developers/
- **Transbank:** https://www.transbankdevelopers.cl/
- **PCI Compliance:** https://www.pcisecuritystandards.org/

---

## ✅ Checklist de Implementación

- [ ] Crear cuenta en pasarela de pago
- [ ] Obtener credenciales de prueba
- [ ] Integrar SDK en frontend
- [ ] Crear endpoint en backend
- [ ] Probar transacción en modo test
- [ ] Configurar webhooks
- [ ] Implementar manejo de errores
- [ ] Testing completo
- [ ] Obtener credenciales de producción
- [ ] Deploy a producción

---

**¿Necesitas ayuda?** Consulta la documentación oficial de cada pasarela o déjame saber qué API quieres integrar primero! 🚀
