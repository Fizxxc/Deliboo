function toggleForm() {
    document.getElementById("login-form").style.display = 
        document.getElementById("login-form").style.display === "none" ? "block" : "none";
    document.getElementById("register-form").style.display = 
        document.getElementById("register-form").style.display === "none" ? "block" : "none";
}

function register() {
    let username = document.getElementById("register-username").value;
    let password = document.getElementById("register-password").value;

    if (localStorage.getItem(username)) {
        alert("Username sudah terdaftar!");
        return;
    }

    localStorage.setItem(username, password);
    alert("Registrasi berhasil! Silakan login.");
    toggleForm();
}

function login() {
    let username = document.getElementById("login-username").value;
    let password = document.getElementById("login-password").value;

    if (localStorage.getItem(username) === password) {
        sessionStorage.setItem("user", username);
        window.location.href = "claim.html";
    } else {
        alert("Login gagal! Periksa username dan password.");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let savedData = JSON.parse(localStorage.getItem("claimData")) || {};
    let claimCode = savedData.code;
    let claimTime = savedData.time;
    let now = Date.now();
    let oneWeek = 7 * 24 * 60 * 60 * 1000;

    if (claimCode && now - claimTime < oneWeek) {
        document.getElementById("claim-code").innerText = claimCode;
        document.getElementById("claim-btn").style.display = "none";
        document.getElementById("send-btn").style.display = "block";
    }
});

function claimCode() {
    let username = sessionStorage.getItem("user");
    if (!username) {
        window.location.href = "index.html";
        return;
    }

    let savedData = JSON.parse(localStorage.getItem("claimData")) || {};
    let now = Date.now();
    let oneWeek = 7 * 24 * 60 * 60 * 1000;

    // Cek apakah user sudah klaim dalam 1 minggu terakhir
    if (savedData.code && now - savedData.time < oneWeek) {
        let remainingDays = Math.ceil((oneWeek - (now - savedData.time)) / (24 * 60 * 60 * 1000));
        alert(`Anda sudah klaim! Coba lagi dalam ${remainingDays} hari.`);
        return;
    }

    // Generate kode unik baru
    let claimCode = generateCode(6);
    document.getElementById("claim-code").innerText = claimCode;

    // Simpan kode dan waktu klaim ke LocalStorage
    let claimData = { code: claimCode, time: now };
    localStorage.setItem("claimData", JSON.stringify(claimData));

    // Update tampilan tombol
    document.getElementById("claim-btn").style.display = "none";
    document.getElementById("send-btn").style.display = "block";

    alert("Kode Anda: " + claimCode + ". Silakan kirim ke bot Telegram.");
}

// Fungsi untuk mengirim kode ke bot Telegram
function sendToBot() {
    let username = sessionStorage.getItem("user");
    let claimData = JSON.parse(localStorage.getItem("claimData"));

    if (!username || !claimData) {
        alert("Anda belum klaim kode!");
        return;
    }

    let claimCode = claimData.code;
    let telegramBotToken = "7930613961:AAEPVtQyEkZszGkRGISVg2fBd4GJOkcH77k";
    let chatId = "6450551010"; // Ganti dengan ID admin atau pengguna yang diklaim
    let message = `🎉 User *${username}* telah klaim diskon!\n\n🔹 Kode: *${claimCode}*`;

    fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}&parse_mode=Markdown`)
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                alert("Kode telah dikirim ke bot Telegram!");
                window.location.href = `https://t.me/Delibo_Bot?start=claim_${claimCode}`;
            } else {
                alert("Gagal menghubungi bot Telegram!");
            }
        })
        .catch(error => {
            console.error("Error sending message:", error);
            alert("Terjadi kesalahan saat mengirim ke Telegram.");
        });
}

// Fungsi untuk generate kode unik (huruf + angka)
function generateCode(length) {
    let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

document.addEventListener("DOMContentLoaded", function() {
    const notification = document.getElementById('cookies-notification');

    // Periksa apakah pengguna sudah membuat keputusan sebelumnya
    if (localStorage.getItem('cookiesConsent')) {
        notification.style.display = 'none';
    }

    // Klik tombol Terima
    document.getElementById('btn-terima').addEventListener('click', function() {
        localStorage.setItem('cookiesConsent', 'accepted');
        notification.style.display = 'none';
        console.log("Pengguna menerima cookies.");
    });

    // Klik tombol Tolak
    document.getElementById('btn-tolak').addEventListener('click', function() {
        localStorage.setItem('cookiesConsent', 'declined');
        notification.style.display = 'none';
        console.log("Pengguna menolak cookies.");
    });
});

const date = new Date();
    document.getElementById("days").textContent = date.getDate();
    document.getElementById("month").textContent = date.toLocaleString('default', { month: 'long' });
    document.getElementById("year").textContent = date.getFullYear();