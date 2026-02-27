var a = document.getElementById("loginBtn");
var b = document.getElementById("registerBtn");
var x = document.getElementById("login");
var y = document.getElementById("register");

// FUNGSI ANIMASI PINDAH TAB
function login() {
  x.style.display = "flex";
  y.style.display = "none";
  if (a) {
    a.className = "btn white-btn";
    b.className = "btn";
  }
}

function register() {
  x.style.display = "none";
  y.style.display = "flex";
  if (a) {
    a.className = "btn";
    b.className = "btn white-btn";
  }
}

// FUNGSI NOTIFIKASI
function showNotification(text, color) {
  if (!text) return;

  const notification = document.createElement("div");
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    background-color: var(${color});
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 2000;
    animation: slideInRight 0.3s ease;
    font-weight: bold;
  `;
  notification.textContent = text;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.opacity = "0";
    notification.style.transition = "opacity 0.3s ease";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  }, 3000);
}

// ==========================================
// LOGIKA AUTENTIKASI (LOCAL STORAGE)
// ==========================================

const USERS_KEY = "vintixUsers";
const CURRENT_USER_KEY = "vintixCurrentUser";

// FUNGSI REGISTER
function submitRegister() {
  const firstName = document.getElementById("regFirst").value.trim();
  const lastName = document.getElementById("regLast").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();

  if (!firstName || !email || !password) {
    showNotification("Please fill in all required fields!", '--primary-red');
    return;
  }

  // Ambil data users yang sudah ada
  let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  // Cek apakah email sudah terdaftar
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    showNotification("Email is already registered! Please login.", '--primary-red');
    return;
  }

  // Simpan user baru
  users.push({ firstName, lastName, email, password });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Notifikasi & Pindah ke form Login
  showNotification("Registration successful! Please login with your new account.", '--tosca');
  login(); // Pindah layar ke Login otomatis
}

// FUNGSI LOGIN
function submitLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    showNotification("Please enter email and password.", '--primary-red');
    return;
  }

  let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  
  // Cek apakah email ada di database kita
  const user = users.find(u => u.email === email);

  if (!user) {
    // JIKA AKUN BELUM TERDAFTAR
    showNotification("Account not registered! Redirecting to Sign Up page.", '--primary-red');
    register(); // Pindah layar ke Register otomatis
    // Otomatis isikan email yang tadi salah ke kolom register
    document.getElementById("regEmail").value = email;
    return;
  }

  if (user.password !== password) {
    showNotification("Incorrect password!", '--primary-red');
    return;
  }

  // JIKA LOGIN BERHASIL
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  showNotification(`Welcome back, ${user.firstName}! Login Successful.`, '--tosca');
  
  // Pindah ke halaman utama (Mundur 1 folder ke index.html)
  window.location.href = "../index.html";
}