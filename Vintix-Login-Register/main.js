var a = document.getElementById("loginBtn");
var a = document.getElementById("registerBtn");
var x = document.getElementById("login");
var y = document.getElementById("register");

function login() {
  x.style.left = "4px";
  y.style.right = "-520px";
  a.className += " white-btn";
  b.className = "btn";
  x.style.opacity = 1;
  y.style.opacity = 0;
}
function register() {
  x.style.left = "-510px";
  y.style.right = "5px";
  a.className = "btn";
  b.className += " white-btn";
  x.style.opacity = 0;
  y.style.opacity = 1;
}
function register() {
  document.getElementById("login").style.display = "none";
  document.getElementById("register").style.display = "block";
}

function login() {
  document.getElementById("register").style.display = "none";
  document.getElementById("login").style.display = "block";
}
