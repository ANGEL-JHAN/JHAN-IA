// ============================
// 🎆 Partículas
// ============================
(function(){
    const c = document.getElementById('particles');
    for(let i=0; i<40; i++){
        const p = document.createElement('div');
        p.className = 'particle';
        const s = Math.random()*4 + 2;
        p.style.width = s+'px';
        p.style.height = s+'px';
        p.style.left = Math.random()*100+'%';
        p.style.animationDuration = Math.random()*15 + 10 + 's';
        p.style.animationDelay = Math.random()*10 + 's';
        if(Math.random() > 0.5) p.style.background = '#b040ff';
        c.appendChild(p);
    }
})();

// ============================
// 🔹 Toggle Login/Signup Cards
// ============================
function showSignup(e){
    e.preventDefault();
    document.getElementById('loginCard').classList.add('hidden');
    const sc = document.getElementById('signupCard');
    sc.classList.remove('hidden');
    sc.style.animation='none';
    sc.offsetHeight;
    sc.style.animation='cardIn 0.6s ease';
}

function showLogin(e){
    e.preventDefault();
    document.getElementById('signupCard').classList.add('hidden');
    const lc = document.getElementById('loginCard');
    lc.classList.remove('hidden');
    lc.style.animation='none';
    lc.offsetHeight;
    lc.style.animation='cardIn 0.6s ease';
}

// ============================
// 🔹 Toggle Password
// ============================
function togglePassword(id,btn){
    const inp = document.getElementById(id);
    inp.type = inp.type === 'password' ? 'text' : 'password';
    btn.style.color = inp.type === 'text' ? '#00e5ff' : '';
}

// ============================
// 🔹 Password Strength
// ============================
document.getElementById('signupPassword').addEventListener('input', function(){
    const v = this.value;
    const fill = document.getElementById('strengthFill');
    const txt = document.getElementById('strengthText');
    let score = 0;
    if(v.length >= 8) score++;
    if(/[A-Z]/.test(v)) score++;
    if(/[0-9]/.test(v)) score++;
    if(/[^A-Za-z0-9]/.test(v)) score++;
    const levels = [
        {w:'0%', c:'', t:''},
        {w:'25%', c:'#ff4466', t:'Débil'},
        {w:'50%', c:'#ffaa00', t:'Media'},
        {w:'75%', c:'#00e5ff', t:'Buena'},
        {w:'100%', c:'#00ff88', t:'Fuerte'}
    ];
    const l = levels[score];
    fill.style.width = l.w;
    fill.style.background = l.c;
    txt.textContent = l.t;
    txt.style.color = l.c;
});

// ============================
// 🔹 Toast
// ============================
function showToast(msg,type){
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = 'toast ' + type + ' show';
    setTimeout(()=>t.classList.remove('show'), 3000);
}

// ============================
// 🌐 API URL (Base de datos)
// ============================
const API_URL = "https://database-2poz.onrender.com";

// ============================
// 🔹 Signup con DB
// ============================
document.getElementById('signupForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const user = document.getElementById('signupUser').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const pass = document.getElementById('signupPassword').value;

    if(!name || !user || !email || !pass) return showToast('Completa todos los campos','error');
    if(pass.length < 8) return showToast('Mínimo 8 caracteres','error');

    const btn = this.querySelector('.btn-primary');
    btn.innerHTML = '<span>Creando cuenta...</span>';
    btn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name,user,email,password:pass})
        });
        const data = await res.json();
        if(res.ok){
            showToast('¡Cuenta creada! ✅','success');
            setTimeout(()=>showLogin(new MouseEvent('click')), 1500);
        } else {
            showToast(data.error || 'Error al registrarse','error');
        }
    } catch(err){
        console.error(err);
        showToast('Error de conexión con la API','error');
    } finally {
        btn.innerHTML = '<span>Crear Cuenta</span>';
        btn.disabled = false;
    }
});

// ============================
// 🔹 Login con DB
// ============================
document.getElementById('loginForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const pass = document.getElementById('loginPassword').value;

    if(!email || !pass) return showToast('Completa todos los campos','error');

    const btn = this.querySelector('.btn-primary');
    btn.innerHTML = '<span>Verificando...</span>';
    btn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email,password:pass})
        });
        const data = await res.json();
        if(res.ok){
            localStorage.setItem('user_session', JSON.stringify({logged:true, ...data.user}));
            showToast('¡Inicio de sesión exitoso! ✅','success');
            setTimeout(()=>window.location.href='index.html', 1000);
        } else {
            showToast(data.error || 'Email o contraseña incorrectos','error');
        }
    } catch(err){
        console.error(err);
        showToast('Error de conexión con la API','error');
    } finally {
        btn.innerHTML = '<span>Iniciar Sesión</span>';
        btn.disabled = false;
    }
});

// ============================
// 🔹 Redirigir si ya está logueado
// ============================
document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('user_session'));
    if(session?.logged){
        // Si ya hay sesión, ir a index
        window.location.href = 'index.html';
    } else {
        // Si no, mostrar login
        document.getElementById('loginCard').classList.remove('hidden');
        document.getElementById('signupCard').classList.add('hidden');
    }
});