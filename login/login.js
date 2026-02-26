var a = document.getElementById("loginBtn");
var b = document.getElementById("registerBtn");
var x = document.getElementById("login");
var y = document.getElementById("register");

// FUNGSI ANIMASI PINDAH TAB
function login() {
  x.style.display = "block";
  y.style.display = "none";
  if (a) {
    a.className = "btn white-btn";
    b.className = "btn";
  }
}

function register() {
  x.style.display = "none";
  y.style.display = "block";
  if (a) {
    a.className = "btn";
    b.className = "btn white-btn";
  }
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
    alert("Please fill in all required fields!");
    return;
  }

  // Ambil data users yang sudah ada
  let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

  // Cek apakah email sudah terdaftar
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    alert("Email is already registered! Please login.");
    return;
  }

  // Simpan user baru
  users.push({ firstName, lastName, email, password });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Notifikasi & Pindah ke form Login
  alert("Registration successful! Please login with your new account.");
  login(); // Pindah layar ke Login otomatis
}

// FUNGSI LOGIN
function submitLogin() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!email || !password) {
    alert("Please enter email and password.");
    return;
  }

  let users = JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  
  // Cek apakah email ada di database kita
  const user = users.find(u => u.email === email);

  if (!user) {
    // JIKA AKUN BELUM TERDAFTAR
    alert("Account not registered! Redirecting to Sign Up page...");
    register(); // Pindah layar ke Register otomatis
    // Otomatis isikan email yang tadi salah ke kolom register
    document.getElementById("regEmail").value = email;
    return;
  }

  if (user.password !== password) {
    alert("Incorrect password!");
    return;
  }

  // JIKA LOGIN BERHASIL
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  alert(`Welcome back, ${user.firstName}! Login Successful.`);
  
  // Pindah ke halaman utama (Mundur 1 folder ke index.html)
  window.location.href = "../index.html";
}