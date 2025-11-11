# 📧 Configuración de Formspree

## ⚠️ IMPORTANTE: El formulario actualmente está dando error 404

El ID actual `xgvrvvdqb` no está funcionando. Necesitas crear un nuevo formulario en Formspree.

## Pasos para activar el formulario de contacto:

### 1. Crear cuenta en Formspree
1. Ve a **https://formspree.io/**
2. Haz clic en "Get Started" o "Sign Up"
3. Regístrate con tu email: `mgallardovillablanca@gmail.com`
4. Verifica tu email

### 2. Crear un nuevo formulario
1. Una vez dentro del dashboard, haz clic en "**+ New Form**"
2. Dale un nombre: "Portafolio Contacto"
3. Copia el **Form ID** completo (se verá así: `xyzabc123`)
   - El enlace completo será: `https://formspree.io/f/xyzabc123`

### 3. Actualizar el código
1. Abre el archivo: `index.html`
2. Busca la línea que dice:
   ```html
   <form class="contact-form" id="contact-form" action="https://formspree.io/f/xgvrvvdqb" method="POST">
   ```
3. Reemplaza `xgvrvvdqb` con tu nuevo Form ID real de Formspree

**Ejemplo:**
```html
<form class="contact-form" id="contact-form" action="https://formspree.io/f/TUNUEVOFORMID" method="POST">
```

### 4. Configuración opcional en Formspree

En el dashboard de Formspree, puedes configurar:

- ✅ **Email de destino**: Confirma que sea `mgallardovillablanca@gmail.com`
- ✅ **Nombre del formulario**: "Portafolio Contacto"
- ✅ **Notificaciones**: Activa notificaciones por email
- ✅ **Spam protection**: Ya está activado por defecto
- ✅ **Archivo adjunto**: Opcional (si quieres que envíen archivos)

### 5. Plan gratuito
- ✅ **50 envíos por mes** (más que suficiente)
- ✅ Sin tarjeta de crédito requerida
- ✅ Protección anti-spam incluida
- ✅ Confirmación por email de cada mensaje

### 6. Probar el formulario
1. Abre tu portafolio
2. Ve a la sección "Contacto"
3. Llena el formulario y envía un mensaje de prueba
4. Deberías recibir el email en `mgallardovillablanca@gmail.com`

## ✨ Características implementadas:

- 🔄 **Spinner de carga** mientras envía
- ✅ **Notificación de éxito** (verde)
- ❌ **Notificación de error** (roja)
- 🔒 **Protección anti-spam** de Formspree
- 📱 **Responsive** en móviles
- 🎨 **Animaciones suaves**

## 🚀 ¡Listo!

Una vez que reemplaces `YOUR_FORM_ID`, tu formulario estará completamente funcional.
