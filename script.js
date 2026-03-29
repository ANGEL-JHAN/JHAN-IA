<!-- LOGIN / SIGNUP SCRIPT -->
<script>
// ===================== VARIABLES =====================
const API_KEY = "123456";
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

// ===================== NAVBAR =====================
if (hamburger && navLinks) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  navLinks.querySelectorAll(".nav-link").forEach(l =>
    l.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    })
  );
}

window.addEventListener("scroll", () => {
  const navbar = document.getElementById("navbar");
  if(navbar){
    navbar.style.background = window.scrollY > 50
      ? "rgba(8,11,20,0.95)"
      : "rgba(8,11,20,0.85)";
  }
});

// ===================== PARTICULAS =====================
(function() {
  const c = document.getElementById("particles");
  if(!c) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");
    p.style.left = Math.random()*100+"%";
    p.style.animationDelay = Math.random()*8+"s";
    p.style.animationDuration = (6+Math.random()*6)+"s";
    c.appendChild(p);
  }
})();

// ===================== LOGIN SUCCESS =====================
function loginSuccess(username){
  // Guarda la sesión
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('username', username);

  // Redirige al index.html
  window.location.href = 'index.html';
}

// ===================== COMPROBAR SESIÓN =====================
(function(){
  const sessionLogged = localStorage.getItem("loggedIn");
  const username = localStorage.getItem("username");
  const currentPage = window.location.href;

  // Si no hay sesión y no estás en signup o login → ir a signup
  if(!sessionLogged && !currentPage.includes("signup.html") && !currentPage.includes("login.html")){
    window.location.href = "signup.html";
  }

  // Si hay sesión y estás en login o signup → ir a index
  if(sessionLogged && (currentPage.includes("signup.html") || currentPage.includes("login.html"))){
    window.location.href = "index.html";
  }

  // Mostrar nombre en navbar si hay sesión
  const userNameEl = document.getElementById("user-name");
  if(username && userNameEl){
    userNameEl.textContent = `Hola, ${username}`;
  }

  // Botón logout
  const logoutBtn = document.getElementById("logout-btn");
  if(logoutBtn){
    logoutBtn.addEventListener("click", ()=>{
      localStorage.removeItem("loggedIn");
      localStorage.removeItem("username");
      window.location.href="signup.html";
    });
  }
})();

// ===================== FORMULARIO LOGIN / SIGNUP =====================
const loginForm = document.getElementById("loginForm");
if(loginForm){
  loginForm.addEventListener("submit", e=>{
    e.preventDefault();
    const username = e.target.querySelector("input[name='username']").value.trim();
    if(!username) return alert("Ingresa tu usuario");
    loginSuccess(username); // Aquí llamamos a la función
  });
}

const signupForm = document.getElementById("signupForm");
if(signupForm){
  signupForm.addEventListener("submit", e=>{
    e.preventDefault();
    const username = e.target.querySelector("input[name='username']").value.trim();
    if(!username) return alert("Ingresa tu usuario");
    loginSuccess(username); // Aquí llamamos a la función
  });
}
</script>