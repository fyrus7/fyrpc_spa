function loginPage() {
  return `
  <div class="glass-container">

    <img src="https://raw.githubusercontent.com/fyrus7/FyrusApp/heads/main/media/flogo.png" width="200">
    <br><br>

    <div style="position: relative; margin-bottom: 5px;">
      <input 
        type="tel" 
        id="pwd" 
        class="input-box" 
        placeholder="Enter PIN"
        inputmode="numeric"
        oninput="this.value = this.value.replace(/[^0-9]/g, '')"
      >

      <span id="toggle-password" class="bi bi-eye-slash" style="
        position:absolute;
        right:10px;
        top:35%;
        cursor:pointer;
      "></span>
    </div>

    <button id="submit-btn" class="submit-button">Login</button>

    <div id="error-message" style="color:red;margin-top:10px;"></div>

    <br>FyRPC | v10.1-AIO

    <div class="login-info-box">
      <div>1234 / admin</div>
      <div>0001 / counter01</div>
      <div>0002 / counter02</div>
    </div>

  </div>
  `;
}

function mobilePage() {
  return `
    <h2>MOBILE PAGE</h2>
    <button onclick="logout()">Logout</button>
  `;
}

function desktopPage() {
  return `
    <h2>DESKTOP PAGE</h2>
    <button onclick="logout()">Logout</button>
  `;
}
