# 📊 Configuración de Google Analytics

## Paso 1: Crear cuenta de Google Analytics

1. Ve a **https://analytics.google.com/**
2. Haz clic en "**Comenzar a medir**" o "**Start measuring**"
3. Crea una cuenta con estos datos:
   - **Nombre de cuenta**: Portafolio Matteo
   - **Nombre de propiedad**: whitemooncy.github.io
   - **Zona horaria**: América/Santiago (Chile)
   - **Moneda**: Peso chileno (CLP)

## Paso 2: Configurar propiedad web

1. Selecciona **"Web"** como plataforma
2. Configura el stream de datos:
   - **URL del sitio web**: `https://whitemooncy.github.io/Portafolio/`
   - **Nombre del stream**: Portafolio Principal
   - ✅ Habilitar "Enhanced measurement" (medición mejorada)

## Paso 3: Obtener el ID de medición

1. Una vez creado, verás un **"Measurement ID"** (ID de medición)
2. Se verá así: `G-XXXXXXXXXX`
3. **Copia este ID**

## Paso 4: Agregar el código al sitio

Una vez que tengas tu ID de medición, avísame y lo agregaré automáticamente al `<head>` de tu HTML.

El código que se agregará será:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 📈 Datos que podrás ver en Google Analytics

### En Tiempo Real
- 👥 Usuarios activos en este momento
- 📍 De qué país/ciudad visitan
- 📱 Qué dispositivo usan (móvil/desktop)
- 📄 Qué página están viendo

### Reportes Generales
- 📊 **Visitas totales** por día/semana/mes
- 🌍 **Ubicación geográfica** de visitantes
- 📱 **Dispositivos** (móvil 📱 vs desktop 💻)
- 🕐 **Tiempo en página** promedio
- 🔄 **Páginas más visitadas**
- 🚪 **Tasa de rebote** (bounce rate)
- 📈 **Crecimiento** de visitas

### Datos de Comportamiento
- 🎯 Qué secciones son más populares
- 🔗 De dónde vienen los visitantes (Google, LinkedIn, etc.)
- 📊 Flujo de navegación
- ⏱️ Tiempo de carga de página

## 🔒 Privacidad

Google Analytics cumple con:
- ✅ GDPR (Europa)
- ✅ CCPA (California)
- ✅ Anonimización de IPs
- ✅ No cookies innecesarias

## 🎯 Pasos siguientes

1. **Crea tu cuenta** en Google Analytics
2. **Copia tu Measurement ID** (G-XXXXXXXXXX)
3. **Avísame el ID** y lo agregaré al código
4. **Espera 24-48 horas** para ver los primeros datos
5. **Accede al dashboard** en https://analytics.google.com/

## 💡 Consejos

- Instala la extensión **Google Analytics Debugger** para Chrome
- Configura **alertas** para picos de tráfico
- Revisa las estadísticas **semanalmente**
- Comparte el acceso con reclutadores si te lo piden

---

**¿Necesitas ayuda?** Avísame cuando tengas el Measurement ID y lo configuro inmediatamente.
