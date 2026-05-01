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



















const API_BASE = window.WORKER_API || window.API_URL;

/* ================= SUMMARY ================= */
function loadSummaryCard() {
  fetch(`${API_BASE}/summary`)
    .then(r => r.json())
    .then(data => {
      document.getElementById('result').innerHTML = `
      <div class="summary-card">

        <div class="card-item">
          <div class="label">TOTAL PARTICIPANT</div>
          <div class="value">${data.total}</div>
        </div>

        <div class="card-item collected">
          <div class="label">COLLECTED</div>
          <div class="value">${data.collected}</div>
        </div>

        <div class="card-item uncollected">
          <div class="label">BALANCE</div>
          <div class="value">${data.balance}</div>
        </div>

      </div>
    `;
    });
}

/* ================= LOADER ================= */
function showLoader() {
  const spinner = document.getElementById("globalSpinner");
  if (spinner) spinner.style.display = "flex";
  blockUI(true);
}

function hideLoader() {
  const spinner = document.getElementById("globalSpinner");
  if (spinner) spinner.style.display = "none";
  blockUI(false);
}

function blockUI(state) {
  const blocker = document.getElementById("uiBlocker");
  if (blocker) blocker.style.display = state ? "block" : "none";
}

/* ================= INIT ================= */
window.onload = function () {
  loadSummaryCard();

  const cachedProfile = localStorage.getItem('userProfile');
  const token = localStorage.getItem('sessionToken');

  if (cachedProfile && token) {
    document.getElementById('userProfile').textContent =
      cachedProfile.toUpperCase();

    fetch(`${API_BASE}`, {
      method: "POST",
      body: JSON.stringify({
        action: "validate",
        token: token
      })
    })
      .then(res => res.json())
      .then(res => {
        if (!res.valid) {
          localStorage.clear();
          loadLogin();
        }
        hideLoader();
      })
      .catch(() => hideLoader());

  } else {
    loadLogin();
  }

  updateOnHoldButton();
  syncCollectButton();
};

/* ================= STORAGE SYNC ================= */
window.addEventListener('storage', function (e) {
  if (e.key === 'sessionToken' && !e.newValue) {
    loadLogin();
  }
});

/* ================= SEARCH ================= */
function search(customValue) {
  var input = getActiveSearchInput();
  input.blur();

  var searchTerm = customValue || input.value.trim();
  var searchOption = document.getElementById('searchOption').value;
  var searchButton = document.getElementById('searchButton');

  if (searchTerm === "") {
    document.getElementById("result").innerHTML =
      "<span style='color:red;'>Please enter something to search.</span>";
    document.getElementById('clearButtonContainer').style.display = 'none';
    document.getElementById('collectBoxes').style.display = 'none';
    return;
  }

  setAllButtonsDisabled(true);
  blockUI(true);

  searchButton.innerHTML =
    '<i class="bi bi-arrow-repeat spin" style="font-size:25px; opacity:0.8;"></i>';

  fetch(`${API_BASE}/search?ic=${encodeURIComponent(searchTerm)}&mode=${searchOption}`)
    .then(res => res.text())
    .then(html => {
      showResult(html);
      setAllButtonsDisabled(false);
      blockUI(false);
      searchButton.innerHTML = '<i class="bi bi-search"></i>';
    })
    .catch(() => {
      document.getElementById("result").innerHTML =
        "<span style='color:red;'>No internet connection</span>";
      setAllButtonsDisabled(false);
      blockUI(false);
      searchButton.innerHTML = '<i class="bi bi-search"></i>';
    });

  firstSearchDone = true;
}

/* ================= COLLECT ================= */
function collect() {

  if (hasHold()) {
    const warnSound = document.getElementById('warnSound');
    warnSound.currentTime = 0;
    warnSound.play();
    return;
  }

  var collectButton = document.getElementById('collectButton');
  var selected = document.querySelectorAll('.result-item.selected');

  var markedRows = [];
  var collectBy1 = document.getElementById('collectBy1').value.trim();
  var collectBy2 = document.getElementById('collectBy2').value.trim();
  var userProfile = localStorage.getItem('userProfile') || '';
  var resultContainer = document.getElementById('result');

  if ((collectBy1 && !collectBy2) || (!collectBy1 && collectBy2)) {
    return;
  }

  setAllButtonsDisabled(true);
  collectButton.value = 'Collecting...';

  selected.forEach(el => {
    markedRows.push({
      row: el.dataset.row,
      collectBy1,
      collectBy2,
      userProfile
    });
  });

  if (markedRows.length === 0) {
    collectButton.value = 'Collect';
    setAllButtonsDisabled(false);
    return;
  }

  fetch(`${API_BASE}/collect`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      rows: markedRows.map(r => ({
        row: r.row,
        user: r.userProfile,
        collectBy: `${r.collectBy1 || ""} ${r.collectBy2 || ""}`.trim()
      }))
    })
  })
    .then(res => res.json())
    .then(() => {
      resultContainer.innerHTML =
        '<div style="padding:10px;border:1px solid green;color:green;font-weight:bold;">SUCCESS</div>';

      setTimeout(() => {
        resultContainer.innerHTML = '';
        loadSummaryCard();
      }, 3000);

      collectButton.value = 'Collect';
      setAllButtonsDisabled(false);
    })
    .catch(() => {
      resultContainer.innerHTML =
        "<span style='color:red;'>Collect failed</span>";
      collectButton.value = 'Collect';
      setAllButtonsDisabled(false);
    });
}

/* ================= STATUS ================= */
function showCollectedStatus() {

  var showCollected = document.getElementById('showCollected');
  var icon = document.getElementById('showCollectedIcon');

  icon.className = 'bi bi-arrow-repeat spin';

  fetch(`${API_BASE}/status`)
    .then(res => res.text())
    .then(statusMessage => {
      displayStatus(statusMessage);
      icon.className = 'bi bi-journal-text';
    })
    .catch(() => {
      document.getElementById('result').innerHTML =
        "<span style='color:red;'>Failed to load status</span>";
      icon.className = 'bi bi-journal-text';
    });
}

/* ================= HOLD + WALKIN + UI (UNCHANGED LOGIC) ================= */
/* semua function bawah kekal macam kau punya, tak disentuh sebab tak request */

function loadLogin() {
  window.location.href = "login.html";
}

/* ================= FIXED LOGOUT (SPA SAFE) ================= */
function logout() {
  setAllButtonsDisabled(true);

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i>';
  }

  const token = localStorage.getItem('sessionToken');

  const finishLogout = () => {
    localStorage.clear();
    document.getElementById('app').innerHTML = '';
    loadLogin();
  };

  if (!token) {
    finishLogout();
    return;
  }

  fetch(`${API_BASE}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  })
    .then(() => finishLogout())
    .catch(() => finishLogout());
}

/* ================= API LOGOUT (optional) ================= */
function apiLogout(token) {
  return fetch(`${API_BASE}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token })
  });
}
