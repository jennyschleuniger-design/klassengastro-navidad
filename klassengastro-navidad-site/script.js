(function () {
  const form = document.getElementById('resForm');
  const submitBtn = document.getElementById('submitBtn');
  const msg = document.getElementById('formMsg');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.textContent = '';
    submitBtn.disabled = true;

    const required = ['name','email','rolle','anzahl'];
    for (const f of required) {
      if (!form[f] || !String(form[f].value).trim()) {
        msg.textContent = 'Bitte fülle alle Pflichtfelder aus.';
        msg.style.color = '#ffb3b3';
        submitBtn.disabled = false;
        return;
      }
    }
    if (!document.getElementById('privacy').checked) {
      msg.textContent = 'Bitte bestätige die Datenschutz-Checkbox.';
      msg.style.color = '#ffb3b3';
      submitBtn.disabled = false;
      return;
    }

    const action = form.getAttribute('action');
    if (!action || action === 'FORM_ACTION_URL') {
      msg.textContent = 'Formular ist noch nicht verbunden. Ersetze FORM_ACTION_URL in index.html (Formspree-Setup).';
      msg.style.color = '#ffb3b3';
      submitBtn.disabled = false;
      return;
    }

    try {
      const payload = {
        termin: '2025-12-09',
        name: form.name.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        rolle: form.rolle.value,
        anzahl: form.anzahl.value,
        allergien: form.allergien.value.trim(),
        _subject: 'La Cena de Navidad – Neue Reservation'
      };
      const res = await fetch(action, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        form.reset();
        msg.textContent = 'Danke! Deine Reservation ist eingegangen. Du erhältst eine Bestätigung per E-Mail.';
        msg.style.color = '#a9f0b5';
      } else {
        const err = await res.json().catch(() => ({}));
        msg.textContent = err?.error || 'Ups – etwas ist schiefgelaufen. Bitte später erneut versuchen.';
        msg.style.color = '#ffb3b3';
      }
    } catch (error) {
      msg.textContent = 'Netzwerkfehler – bist du online?';
      msg.style.color = '#ffb3b3';
    } finally {
      submitBtn.disabled = false;
    }
  });
})();