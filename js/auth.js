const WORKER_API = "https://fyrpc.iamfyrus.workers.dev";

let isLoggingIn = false;

function validateLogin() {
  if (isLoggingIn) return;
  isLoggingIn = true;

  const pwd = document.getElementById('pwd').value;
  const btn = document.getElementById('submit-btn');
  const err = document.getElementById('error-message');

  function resetBtn() {
    btn.innerText = "Login";
    btn.disabled = false;
    isLoggingIn = false;
  }

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

  if (!r.ok) {
    throw new Error("HTTP " + r.status);
  }

  const text = await r.text();
  console.log("RAW:", text);

  return JSON.parse(text);
})
.then(res => {
  resetBtn();

  if (!res.success) {
    err.innerText = "Wrong Password";
    return;
  }

  localStorage.setItem("sessionToken", res.token);
  localStorage.setItem("userProfile", res.profile);

  routeUser(res.profile);
})
.catch(e => {
  console.log("REAL ERROR:", e);
  err.innerText = "Server error / connection issue";
  resetBtn();
});

function validateSession() {
  const token = localStorage.getItem("sessionToken");
  if (!token) return Promise.resolve(null);

  return fetch(`${WORKER_API}/validate`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ token })
  })
  .then(async r => {
  if (!r.ok) return null;
  const text = await r.text();
  return JSON.parse(text);
})
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
