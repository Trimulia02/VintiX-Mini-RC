var a = document.getElementById("loginBtn");
var b = document.getElementById("registerBtn");
var x = document.getElementById("login");
var y = document.getElementById("register");

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
