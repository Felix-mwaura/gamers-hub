/* ============================================================================
   Gamers Hub — contact page
   Client-side validation + success state. Swap the fake delay for a real POST
   to your form backend (Formspree, Web3Forms, or your own API).
   ============================================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validate()) submit(form);
    });
  });

  function setError(field, message) {
    var input = document.getElementById(field);
    var err = document.getElementById('err-' + field);
    if (err) err.textContent = message || '';
    input.closest('.field').classList.toggle('has-err', Boolean(message));
  }

  function validate() {
    var ok = true;
    var name = document.getElementById('cName').value.trim();
    var email = document.getElementById('cEmail').value.trim();
    var subject = document.getElementById('cSubject').value;
    var message = document.getElementById('cMessage').value.trim();

    if (name.length < 2) { setError('cName', 'Please tell us your name.'); ok = false; }
    else setError('cName', '');

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError('cEmail', 'Please enter a valid email address.'); ok = false;
    } else setError('cEmail', '');

    if (!subject) { setError('cSubject', 'Pick a topic so we can route your message.'); ok = false; }
    else setError('cSubject', '');

    if (message.length < 15) {
      setError('cMessage', 'A little more detail helps us answer properly (15+ characters).');
      ok = false;
    } else setError('cMessage', '');

    return ok;
  }

  function submit(form) {
    var btn = document.getElementById('contactSubmit');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    /* ------------------------------------------------------------------
       REAL SEND HOOK — replace with your own endpoint:

       fetch('https://formspree.io/f/YOUR_ID', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
         body: JSON.stringify({
           name:    cName.value,
           email:   cEmail.value,
           subject: cSubject.value,
           message: cMessage.value
         })
       })
       ------------------------------------------------------------------ */

    setTimeout(function () {
      document.getElementById('doneEmail').textContent =
        document.getElementById('cEmail').value.trim();
      form.hidden = true;
      document.getElementById('contactDone').hidden = false;
      document.getElementById('contactDone').scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }, 700);
  }
})();
