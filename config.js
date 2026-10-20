/**
 * CONFIGURACIÓN DE INTEGRACIÓN GOOGLE SHEETS & EMAIL
 * 
 * Planilla vinculada:
 * https://docs.google.com/spreadsheets/d/17EOFT889rTSBPGfSJbIwYu-m0Oq3VtdmNrMHxCga02o/edit?usp=sharing
 * 
 * Emails receptores:
 * - jge@vida.com.uy
 * - josemage@gmail.com
 */

const CONFIG = {
  // Planilla de Google Sheets donde se guardan los registros
  SPREADSHEET_URL: "https://docs.google.com/spreadsheets/d/17EOFT889rTSBPGfSJbIwYu-m0Oq3VtdmNrMHxCga02o/edit?usp=sharing",
  
  // URL de la Aplicación Web (Webhook de Google Apps Script)
  // Reemplaza esta URL con la que te proporcione Google al desplegar el script de 'google-apps-script.js'
  // Si se deja vacío, el formulario guardará los datos localmente en el navegador y mostrará el aviso informativo.
  WEBHOOK_URL: "https://script.google.com/macros/s/AKfycbwvJ7AOUFfD3d1bwuA3eyqaBYQQwSP7Prirjcc-CseyANvRaOmcbMKM7eHWPRnXlOu8/exec",

  // Destinatarios configurados
  EMAILS: ["jge@vida.com.uy", "josemage@gmail.com"]
};

// Exportar globalmente
window.APP_CONFIG = CONFIG;
