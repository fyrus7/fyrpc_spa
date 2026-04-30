const WORKER_API = "https://fyrpc.iamfyrus.workers.dev";

let isLoggingIn = false;

function validateLogin() {
  if (isLoggingIn) return;
  isLoggingIn = true;

  const pwd = document.getElementById('pwd').value;
  const btn = document.getElementById('submit-btn');
  const err = document.getElementById('error-message');

  err.innerText = "";
  btn.innerText = "Loading...";
  btn.disabled = true;

  if (!pwd) {
    err.innerText = "Please enter your password.";
    resetBtn();
    return;
  }

  fetch(`${WORKER_API}/login`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ password: pwd })
  })
  .then(async r => {
  const text = await r.text();
  console.log("RAW RESPONSE:", text);
  return JSON.parse(text);
})w
  .then(res => {
    isLoggingIn = false;
    resetBtn();

    if (!res.success) {
      err.innerText = "Wrong Password";
      return;
    }

    localStorage.setItem("sessionToken", res.token);
    localStorage.setItem("userProfile", res.profile);

    routeUser(res.profile);
  })
  .catch(() => {
    err.innerText = "No internet";
    resetBtn();
  });

  function resetBtn() {
    btn.innerText = "Login";
    btn.disabled = false;
  }
}

function validateSession() {
  const token = localStorage.getItem("sessionToken");
  if (!token) return Promise.resolve(null);

  return fetch(`${WORKER_API}/validate`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ token })
  })
  .then(r => r.json())
  .then(res => res.valid ? res.profile : null)
  .catch(() => null);
}

function logout() {
  const token = localStorage.getItem("sessionToken");

  fetch(`${WORKER_API}/logout`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ token })
  }).finally(() => {
    localStorage.clear();
    router("/login");
  });
}
