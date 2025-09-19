(() => {
  const form = document.getElementById('guestForm');
  const msgBox = document.getElementById('msg');

  // helper: show error near field
  function setError(id, message) {
    const el = document.getElementById('err-' + id);
    if (el) el.textContent = message || '';
  }

  function clearErrors() {
    ['fullName','phone','email','aadhar','checkin','checkout','purpose'].forEach(id => setError(id,''));
    msgBox.textContent = '';
    msgBox.style.color = '';
  }

  function validEmail(email){
    // simple, permissive regex for email validation (keeps UX simple)
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validPhone(phone){
    // exactly 10 digits (no separators)
    return /^\d{10}$/.test(phone);
  }

  function validAadhar(a){
    // 12 digits
    return /^\d{12}$/.test(a);
  }

  function readStoredGuests(){
    const raw = localStorage.getItem('guests');
    return raw ? JSON.parse(raw) : [];
  }

  function saveGuest(obj){
    const list = readStoredGuests();
    list.push(obj);
    localStorage.setItem('guests', JSON.stringify(list));
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    const data = {
      fullName: form.fullName.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      aadhar: form.aadhar.value.trim(),
      checkin: form.checkin.value,
      checkout: form.checkout.value,
      purpose: form.purpose.value.trim(),
      submittedAt: new Date().toISOString()
    };

    let ok = true;

    if (!data.fullName) {
      setError('fullName', 'Full name is required.');
      ok = false;
    }
    if (!validPhone(data.phone)) {
      setError('phone', 'Phone must be exactly 10 digits.');
      ok = false;
    }
    if (!validEmail(data.email)) {
      setError('email', 'Enter a valid email address.');
      ok = false;
    }
    if (!validAadhar(data.aadhar)) {
      setError('aadhar', 'Aadhaar must be exactly 12 digits.');
      ok = false;
    }
    if (!data.checkin) {
      setError('checkin', 'Check-in date is required.');
      ok = false;
    }
    if (!data.checkout) {
      setError('checkout', 'Check-out date is required.');
      ok = false;
    }
    if (data.checkin && data.checkout) {
      const d1 = new Date(data.checkin);
      const d2 = new Date(data.checkout);
      if (d2 < d1) {
        setError('checkout', 'Check-out must be same or after check-in.');
        ok = false;
      }
    }
    if (!data.purpose) {
      setError('purpose', 'Purpose is required.');
      ok = false;
    }

    if (!ok) {
      msgBox.textContent = 'Please fix errors above.';
      msgBox.style.color = 'var(--danger)';
      return;
    }

    // Save
    try {
      saveGuest(data);
      msgBox.textContent = 'Saved successfully.';
      msgBox.style.color = 'var(--success)';

      form.reset();
      // after reset, clear small error placeholders
      clearErrors();

    } catch (err) {
      console.error(err);
      msgBox.textContent = 'Failed to save. Check console.';
      msgBox.style.color = 'var(--danger)';
    }
  });

  // Reset button: clear inline errors and message
  form.addEventListener('reset', () => {
    setTimeout(clearErrors, 10);
  });

})();