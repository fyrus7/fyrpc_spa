function initLoginUI() {
  const passwordInput = document.getElementById('pwd');
  const toggleIcon = document.getElementById('toggle-password');

  if (!passwordInput || !toggleIcon) return;

  // restore state
  const hide = localStorage.getItem('hidePassword');

  if (hide === 'false') {
    passwordInput.type = 'text';
    toggleIcon.classList.replace('bi-eye-slash','bi-eye');
  } else {
    passwordInput.type = 'password';
    toggleIcon.classList.replace('bi-eye','bi-eye-slash');
    localStorage.setItem('hidePassword','true');
  }

  toggleIcon.onclick = () => {
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      toggleIcon.classList.replace('bi-eye-slash','bi-eye');
      localStorage.setItem('hidePassword','false');
    } else {
      passwordInput.type = 'password';
      toggleIcon.classList.replace('bi-eye','bi-eye-slash');
      localStorage.setItem('hidePassword','true');
    }
  };

  // enter key
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      validateLogin();
    }
  });

  // button click
  document.getElementById('submit-btn').onclick = validateLogin;
}
