const app = document.getElementById("app");

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
    || window.innerWidth <= 768;
}

function router(path) {
  history.pushState({}, "", path);
  render(path);
}

window.onpopstate = () => render(location.pathname);

function render(path) {

  if (path === "/" || path === "/login") {
    app.innerHTML = loginPage();

    requestAnimationFrame(() => {
      initLoginUI();
    });

  } else if (path === "/mobile") {
    app.innerHTML = mobilePage();

  } else if (path === "/desktop") {
    app.innerHTML = desktopPage();

  } else {
    app.innerHTML = "404";
  }
}

function routeUser(profile) {
  if (isMobileDevice()) {
    router("/mobile");
  } else {
    router("/desktop");
  }
}

// 🚀 INIT
window.addEventListener("DOMContentLoaded", async () => {

  render("/login");

  const profile = await validateSession();

  if (profile) {
    routeUser(profile);
  }
});
