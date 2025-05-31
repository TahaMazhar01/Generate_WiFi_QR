const ssidInput = document.querySelector('.ssid');
const passwordInput = document.querySelector('.password');
const qrcodeDiv = document.getElementById('qrcode');
const messageBox = document.getElementById('message-box');

function showMessage(message, type = 'default', duration = 3000) {
    messageBox.textContent = message;
    messageBox.className = 'message-box show';
    
    if (type && type !== 'default') {
        messageBox.classList.add(type);
    }

    messageBox.style.display = 'block';

    setTimeout(() => {
        messageBox.classList.remove('show');
        setTimeout(() => {
            messageBox.style.display = 'none';
            messageBox.className = 'message-box';
        }, 300);
    }, duration);
}

function generateQRCode() {
    let ssid = ssidInput.value.trim();
    let password = passwordInput.value.trim();
    let authType = "WPA";

    if (!validateInputs(ssid, password)) {
        return;
    }

    let formattedSSID = ssid.includes(" ") ? `"${ssid}"` : ssid;
    let formattedPassword = password.includes(" ") ? `"${password}"` : password;

    let wifiData = `WIFI:S:${formattedSSID};T:${authType};P:${formattedPassword};;`;

    qrcodeDiv.innerHTML = "";

    try {
        new QRCode(qrcodeDiv, {
            text: wifiData,
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
        showMessage('QR Code generated successfully!', 'success');
    } catch (error) {
        showMessage('Error generating QR Code. Please try again.', 'error', 5000);
        console.error("QR Code generation error:", error);
    }
}

function validateInputs(ssid, password) {
    ssid = ssid.trim();
    password = password.trim();

    if (!ssid || !password) {
        showMessage("Please enter both Network Name and Password.", 'error', 4000);
        return false;
    }

    if (ssid.length > 32) {
        showMessage("SSID exceeds 32 characters!", 'error', 4000);
        return false;
    }

    if (password.length < 8 || password.length > 63) {
        showMessage("WPA passwords must be between 8 and 63 characters.", 'error', 4000);
        return false;
    }

    if (/[^a-zA-Z0-9 _-]/.test(ssid)) {
        showMessage("SSID contains invalid characters! Only letters, numbers, spaces, dashes, and underscores are allowed.", 'error', 6000);
        return false;
    }

    return true;
}

function printQRCode() {
    let qrCodeContainer = document.querySelector(".qrcode-container");
    let qrCodeCanvas = qrcodeDiv.querySelector('canvas');

    if (!qrCodeCanvas) {
        showMessage("QR code not generated yet! Generate it first.", 'error', 4000);
        return;
    }

    document.body.classList.add('printing-active');

    let printWindow = window.open("", "_blank");
    printWindow.document.write("<html><head><title>Print QR Code</title>");
    printWindow.document.write('<link rel="stylesheet" href="style.css">');
    printWindow.document.write("</head><body>");

    let clonedQrContainer = qrCodeContainer.cloneNode(true);
    let h3 = clonedQrContainer.querySelector('h3');
    if (h3) h3.remove();
    let pTag = clonedQrContainer.querySelector('p');
    if (pTag) pTag.remove();

    printWindow.document.body.appendChild(clonedQrContainer);

    printWindow.document.write("</body></html>");
    printWindow.document.close();

    printWindow.onload = function() {
        printWindow.print();
        printWindow.close();
        document.body.classList.remove('printing-active');
    };
}