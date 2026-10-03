/* contact-form.js — one concern: client-side validation + HONEST submit state.
 * There is no backend yet (B1 deferred, ARCHITECTURE): a valid submit shows a
 * persistent pending note — "meddelandet skickas till e-post när backend
 * kopplas in" — and never a fake success (I2). The seam for the future
 * e-post-backend is the marked "backend seam (B1)" block in the submit handler. */
(function () {
  'use strict';

  var form = document.querySelector('[data-contact-form]');
  if (!form) return;

  var status = document.getElementById('cf-status');
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var FIELDS = [
    {
      id: 'cf-namn', error: 'cf-namn-fel',
      valid: function (v) { return v.trim().length >= 2; },
      message: 'Skriv ditt namn (minst 2 tecken).'
    },
    {
      id: 'cf-epost', error: 'cf-epost-fel',
      valid: function (v) { return EMAIL_RE.test(v.trim()); },
      message: 'Ange en giltig e-postadress.'
    },
    {
      id: 'cf-meddelande', error: 'cf-meddelande-fel',
      valid: function (v) { return v.trim().length >= 3; },
      message: 'Skriv ett kort meddelande.'
    }
  ];

  function setFieldState(field, ok, value) {
    var input = document.getElementById(field.id);
    var err = document.getElementById(field.error);
    if (!input || !err) return;
    input.setAttribute('aria-invalid', ok ? 'false' : 'true');
    err.textContent = ok ? '' : field.message;
    err.hidden = ok;
  }

  FIELDS.forEach(function (field) {
    var input = document.getElementById(field.id);
    if (!input) return;
    input.addEventListener('blur', function () {
      if (input.value !== '') setFieldState(field, field.valid(input.value), input.value);
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var firstBad = null;
    var allOk = true;
    FIELDS.forEach(function (field) {
      var input = document.getElementById(field.id);
      var ok = !!input && field.valid(input.value);
      setFieldState(field, ok, input ? input.value : '');
      if (!ok) {
        allOk = false;
        if (!firstBad) firstBad = input;
      }
    });

    if (!allOk) {
      /* QA P2 (MC 3934.3 c2): a rejected submit must not leave a stale
       * "Tack..." text in the aria-live region — replace it so the
       * announcement matches the on-screen field errors. */
      if (status) {
        status.textContent = 'Åtgärda de markerade fälten ovan.';
        status.hidden = false;
      }
      if (firstBad) firstBad.focus();
      return;
    }

    /* ---- backend seam (B1) ----
     * When the e-post backend exists, POST {namn, epost, meddelande} here and
     * replace the honest pending note with the real result state. */
    if (status) {
      status.textContent = 'Tack, ' +
        document.getElementById('cf-namn').value.trim().split(/\s+/)[0] +
        '! Meddelandet skickas till e-post när backend kopplas in — ' +
        'ingen information har ännu nått Anny. Vill du boka tid redan nu? ' +
        'Ring eller skriv på Instagram @mullers.anny.';
      status.hidden = false;
    }
  });
})();
