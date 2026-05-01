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
<div id="uiBlocker"></div>
<div id="globalSpinner">
    <i class="bi bi-arrow-repeat spin"></i>
</div>

<div id="logoutMenu">

    <div id="monitorBtn" onclick="goMonitor()" style="padding:10px; cursor:pointer;">
        Monitor
    </div>
    <div id="adminBtn" onclick="goAdmin()" style="padding:10px; cursor:pointer;">
        Admin
    </div>
    <div id="logoutMenuBtn" onclick="logoutFromMenu()" style="padding:10px; cursor:pointer; color:red;">
        Logout
    </div>
</div>

<div class="main-wrapper">
<!------------- BODY SECTION ------------->

    <div class="top-header">
        <div class="profile-display" id="profileNameDisplay" style="font-size: 18px; color:#455A64; font-weight: bold;">
            <i class="bi bi-person-badge"></i> <span id="userProfile"></span>
        </div>

        <!-- ON HOLD button (hidden by default) -->
        <div id="onHoldContainer" style="display:none;">
            <button
                    type="button"
                    id="onHoldButton"
                    onclick="openHoldModal()"
                    style="
    font-size:12px;
    padding:4px 8px;
    border-radius:12px;
    background:#fff3cd;
    border:1px solid #ffe69c;
    cursor:pointer;
    height: 24px;       /* pastikan sama tinggi dengan line-height text */
    display: flex;
    align-items: center;
  "
            >(0)</button>

        </div>

        <button id="logoutBtn" type="button" onclick="handleLogoutClick()" style="font-size: 18px; background-color: transparent; color:#455A64; border: none; cursor: pointer">
            <i class="bi bi-box-arrow-right" style="font-size: 22px"></i>
        </button>
    </div>
    <div style="text-align: center;">

    <h1 style="font-size:30px; font-style: italic; text-align:center;">FyRPC</h1>

    <form style="text-align: left; display: inline-block; position: relative;">

        <!-- Form Container -->
        <div class="search-wrapper">
            <input type="text" id="searchTerm" class="search-box" placeholder="Reg ID, MyKad or Name" onkeydown="handleEnter(event)">
            <button type="button" id="searchButton" onclick="search()">
                <i class="bi bi-search"></i></button>
        </div>
        <!-- Clear Button -->
        <div id="clearButtonContainer" class="clear-button">
            <button type="button" onclick="clearSearch()" class="icon-clear-button">
                <i class="bi bi-eraser-fill"></i> Clear
            </button>
        </div>
        <div id="resultCount" class="counter"></div>
    </form>

    <div id="message"></div>
    <div id="result" class="result-box"></div>
    <br>

    <button id="selectAllBtn" class="floating-select">Select All</button>

    <div id="collectBoxes" class="collect-box">
        collect by
        <input type="text" id="collectBy1" placeholder="Name" style="width: 100px; height: 10px; font-size: 12px; padding: 5px; margin-left: 5px;"
               oninput="this.value = this.value.replace(/[^a-zA-Z ]/g, '');">

        <input type="tel" id="collectBy2" placeholder="Phone Number" style="width: 100px; height: 10px; font-size: 12px; padding: 5px; margin-left: 5px;"
               oninput="this.value = this.value.replace(/[^0-9]/g, '');">

        <br>

        <div class="collect-button-wrapper">
            <input type="button" id="holdButton" value="Hold" onclick="holdSelection()" class="collect-button" style="background:#FF9800;">
            <input type="button" id="collectButton" value="Collect" onclick="collect()" class="collect-button">
        </div>
    </div>

    <br><br><br><br><br>

    <div id="collectedStatusContainer" class="status-box">
        <div id="collectedStatus"></div>
        <br>
        <button id="okButton" class="ok-button" onclick="dismissCollectedStatus()">OK</button>
    </div>

    <div id="holdModal" class="hold-modal">
        <div class="hold-modal-box">
            <div class="hold-modal-header">
                <b>HOLD ITEMS</b>
                <button class="hold-modal-close" onclick="closeHoldModal()">&times;</button>
            </div>

            <div id="holdList" class="hold-grid"></div>

            <div id="holdActions" class="hold-modal-actions">
                <button id="modalRemoveBtn" onclick="removeHold()" class="btn-cancel">REMOVE</button>
                <button id="modalCollectBtn" onclick="collectHold()" class="btn-collect">COLLECT</button>
                <button id="modalOkBtn" onclick="closeHoldModal()" class="btn-collect" style="display:none;">OK</button>
            </div>

            <div id="holdCollectedMsg" style="display:none; text-align:center; margin-top:12px; font-weight:600; color:#4CAF50;">
                COLLECTED
            </div>
        </div>
    </div>

    <div id="footer">
        <div class="dropdown-container">
            <div class="dropdown">
                <button id="searchDropdownBtn" class="dropdown-btn">IC/ID/Name</button>

                <div class="dropdown-menu">
                    <div class="dropdown-item" onclick="setOption('DEFAULT','IC/ID/Name')">IC/ID/Name</div>
                    <div class="dropdown-item" onclick="setOption('A','Team')">Team</div>
                    <div class="dropdown-item" onclick="setOption('E','Email')">Email</div>
                    <div class="dropdown-item" onclick="setOption('F','BIB no')">BIB no</div>
                    <div class="dropdown-item" onclick="setOption('G','Collected')">Collected</div>
                </div>
            </div>

            <input type="hidden" id="searchOption" value="DEFAULT">

            <button id="walkinButton" class="walkinButton" type="button" onclick="openWalkinForm()">
                Add Runner
            </button>
        </div>

        <div class="floating-button-wrapper">
            <button id="startButton" onclick="openScanner()">
                <i class="bi bi-qr-code-scan"></i>
            </button>
        </div>

    <!--  <button id="walkinButton" class="walkinButton" type="button" onclick="openWalkinForm()">
        <i class="bi bi-cart-plus" style="font-size: 20px;"></i>
      </button> -->

      <!--  <button id="showCollected" class="showCollectedbutton" onclick="showCollectedStatus()">
            <i id="showCollectedIcon" class="bi bi-journal-text" style="font-size: 20px;"></i>
        </button> -->
    </div>

    <!-- WALKIN FORM -->
    <div id="walkinFormBox" class="walkin-box">
        <span class="close" onclick="closeWalkinForm()">&times;</span>
        <h3>Add New Runner</h3>

        <div id="walkinFields">
            <input type="tel" id="walkinIC" placeholder="No IC" oninput="this.value=this.value.replace(/[^0-9]/g,'')" />
            <input type="text" id="walkinName" placeholder="Name" style="text-transform: uppercase; margin-top: 10px;" />
            <input type="tel" id="walkinContact" placeholder="Contact" style="margin-top: 10px;"
                   oninput="this.value=this.value.replace(/[^0-9]/g,'')" />

            <div class="bib-chip-row">
                <input type="text" id="walkinBib" placeholder="BIB No"
                       oninput="this.value=this.value.toUpperCase().replace(/[^0-9ABCDEFGKS/() ]/g,'')" />
                <input type="tel" id="walkinChip" placeholder="Chip No"
                       oninput="this.value=this.value.replace(/[^0-9]/g,'')" />
            </div>

            <input type="text" id="walkinEmer" placeholder="Emergency Name / Phone"
                   style="margin-top: 10px;" oninput="this.value=this.value.toUpperCase().replace(/[^A-Z0-9/ ]/g,'')" />

            <div style="margin-top:20px;">
                <label style="font-weight:600; display:block; margin-bottom:4px;">Category:</label>

                <div class="dropdown">
                    <button id="walkinDropdownBtn" class="dropdown-btn" style="width:92%; margin:auto;">
                        Select Category
                    </button>
                    <div id="walkinDropdownMenu" class="dropdown-menu" style="width:92%;"></div>
                </div>

                <select id="walkinDistance" style="display:none;"></select>
            </div>
        </div>

        <div id="walkinError" style="color:red; font-weight:bold; display:none; margin-top:5px; margin-bottom: 5px;"></div>

        <div id="confirmPreview" style="display:none; text-align:center; margin-bottom:15px;">
            <div style="font-weight:bold; margin-bottom:8px;">ADD THIS RUNNER?</div>
            <div>NAME: <b id="previewName"></b></div>
            <div style="font-size:22px; margin-top:5px;">BIB: <b id="previewBib"></b></div>
        </div>

        <br>

        <div class="btn-row">
            <button id="walkinSubmitBtn" onclick="submitWalkinForm()">SUBMIT</button>
            <button onclick="handleCancel()">CANCEL</button>
        </div>

        <div id="walkinLoader" style="display:none; text-align:center; margin-top:15px;">
            <i class="bi bi-arrow-repeat spin" style="font-size:40px; color:#000;"></i>
        </div>
    </div>

    <div id="successBox" class="walkin-box" style="display:none;">
        <h3>Successfull Added</h3>
        <p><b><span id="successBib" style="font-size:40px;"></span></b></p>
        <p><b><span id="successName" style="font-size:20px;"></span></b></p>
        <br>
        <button onclick="closeSuccessBox()">OK</button>
    </div>
    </div>

    <audio id="markSound" src="sounds/collected.mp3" preload="auto"></audio>
    <audio id="warnSound" src="sounds/warning.mp3" preload="auto"></audio>
    <audio id="successSound" src="sounds/tada.mp3" preload="auto"></audio>
</div>

<script src="js/backend.js"></script>
<script src="js/mobile.js"></script>
  `;
}

function desktopPage() {
  return `
    <h2>DESKTOP PAGE</h2>
    <button onclick="logout()">Logout</button>
  `;
}
