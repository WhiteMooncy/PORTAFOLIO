# 🔒 Seguridad del Portafolio

## Medidas de Seguridad Implementadas

### 🛡️ 1. Protección Anti-Spam

#### Rate Limiting (Limitación de Envíos)
- ✅ **1 mensaje por día** por usuario
- ✅ **1 mensaje por mes** por usuario
- ✅ Basado en hash del email (privacidad preservada)
- ✅ Almacenamiento local (LocalStorage)
- ✅ Limpieza automática de datos antiguos (30 días)

#### Honeypot Field
- ✅ Campo oculto `_gotcha` para detectar bots
- ✅ Los bots lo llenan automáticamente
- ✅ Si está lleno, el envío se bloquea silenciosamente

### 🔍 2. Validaciones de Contenido

#### Validación de Formato
- ✅ **Email**: Formato válido (regex)
- ✅ **Nombre**: 2-100 caracteres
- ✅ **Asunto**: 3-200 caracteres
- ✅ **Mensaje**: 10-5000 caracteres

#### Detección de Contenido Sospechoso
Bloquea mensajes con:
- ❌ Spam keywords (viagra, casino, lottery, etc.)
- ❌ Múltiples URLs (3 o más enlaces)
- ❌ Caracteres repetidos excesivamente
- ❌ Patrones de click-bait ("click here", "buy now")

### 🔐 3. Protección de Datos

#### Privacidad del Usuario
- ✅ Hash del email (no se almacena el email real)
- ✅ Solo timestamps de envíos
- ✅ No se comparten datos con terceros
- ✅ Datos locales (navegador del usuario)

#### Formspree Security
- ✅ HTTPS obligatorio
- ✅ Protección CSRF incluida
- ✅ Validación server-side
- ✅ Rate limiting del servidor (50/mes)

### 📊 4. Monitoreo y Logs

#### Consola del Navegador
- 🔍 Detecta bots (honeypot)
- 🔍 Registra contenido sospechoso
- 🔍 No expone datos sensibles

#### Dashboard de Formspree
- 📈 Estadísticas de envíos
- 📧 Historial de mensajes
- 🚫 Bloqueo de IPs sospechosas (manual)

## 📝 Configuración de Límites

### Límites Actuales
```javascript
const RATE_LIMIT = {
    MAX_SUBMISSIONS_PER_MONTH: 1,  // 1 envío por mes
    MAX_SUBMISSIONS_PER_DAY: 1,    // 1 envío por día
    STORAGE_KEY: 'portfolio_form_submissions'
};
```

### Modificar Límites
Para cambiar los límites, edita `assets/js/contact.js` líneas 4-8:

```javascript
// Aumentar a 3 mensajes por mes y 1 por día
MAX_SUBMISSIONS_PER_MONTH: 3,
MAX_SUBMISSIONS_PER_DAY: 1,
```

## 🚨 Respuestas de Seguridad

### Mensajes al Usuario

**Límite Diario Alcanzado:**
> "Ya enviaste un mensaje hoy. Podrás enviar otro en X horas."

**Límite Mensual Alcanzado:**
> "Ya alcanzaste el límite de mensajes este mes. Podrás enviar otro en X días."

**Contenido Sospechoso:**
> "El contenido parece sospechoso. Por favor, revisa tu mensaje."

**Email Inválido:**
> "Por favor ingresa un email válido."

**Campos Incorrectos:**
> "El [campo] debe tener entre X y Y caracteres."

## 🔧 Solución de Problemas

### Usuario Legítimo Bloqueado

Si un usuario real necesita enviar más mensajes:

1. **Opción 1 - Limpiar LocalStorage:**
   ```javascript
   // En la consola del navegador
   localStorage.removeItem('portfolio_form_submissions');
   ```

2. **Opción 2 - Aumentar límites:**
   Modifica los valores en `contact.js`

3. **Opción 3 - Contacto alternativo:**
   Proporciona email directo: `mgallardovillablanca@gmail.com`

### Testing

Para probar el sistema:

1. **Enviar primer mensaje** ✅ Debe funcionar
2. **Enviar segundo mensaje** ❌ Debe bloquearse
3. **Esperar 24 horas** ✅ Debe permitir nuevo envío
4. **Llenar campo honeypot** ❌ Debe bloquearse silenciosamente
5. **Enviar spam keywords** ❌ Debe mostrar advertencia

## 📈 Mejoras Futuras Sugeridas

### Nivel 1 (Actual) ✅
- Rate limiting básico
- Honeypot
- Validaciones de formato
- Detección de spam keywords

### Nivel 2 (Opcional) 🔄
- [ ] Google reCAPTCHA v3
- [ ] Verificación de email (doble opt-in)
- [ ] Lista negra de dominios de email
- [ ] Análisis de sentimiento del mensaje

### Nivel 3 (Avanzado) 🚀
- [ ] Backend propio con Node.js/PHP
- [ ] Base de datos para logging
- [ ] IP blocking automático
- [ ] Machine Learning anti-spam

## 🎯 Recomendaciones

### Para Usuarios Legítimos
1. Usa un email real
2. Escribe mensajes claros y profesionales
3. No incluyas múltiples enlaces
4. Espera 24 horas entre mensajes

### Para el Administrador (Tú)
1. Revisa el dashboard de Formspree regularmente
2. Bloquea IPs sospechosas manualmente
3. Ajusta límites según necesidad
4. Mantén actualizado el código de seguridad

## 📞 Contacto de Emergencia

Si el sistema de contacto falla completamente:

- 📧 Email directo: `mgallardovillablanca@gmail.com`
- 💼 LinkedIn: [tu-perfil-linkedin]
- 🐙 GitHub Issues: `github.com/WhiteMooncy`

---

**Última actualización:** Noviembre 2025  
**Versión de seguridad:** 1.0  
**Estado:** ✅ Activo y monitoreado
