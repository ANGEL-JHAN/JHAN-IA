// ============================
// 🎆 Partículas
// ============================
(function(){
    var c=document.getElementById('particles');
    for(var i=0;i<40;i++){
        var p=document.createElement('div');
        p.className='particle';
        var s=Math.random()*4+2;
        p.style.width=s+'px';
        p.style.height=s+'px';
        p.style.left=Math.random()*100+'%';
        p.style.animationDuration=Math.random()*15+10+'s';
        p.style.animationDelay=Math.random()*10+'s';
        if(Math.random()>.5)p.style.background='#b040ff';
        c.appendChild(p)
    }
})();

// ============================
// 🔹 Toggle Login/Signup Cards
// ============================
function showSignup(e){
    e.preventDefault();
    document.getElementById('loginCard').classList.add('hidden');
    var sc=document.getElementById('signupCard');
    sc.classList.remove('hidden');
    sc.style.animation='none';
    sc.offsetHeight;
    sc.style.animation='cardIn 0.6s ease';
}

function showLogin(e){
    e.preventDefault();
    document.getElementById('signupCard').classList.add('hidden');
    var lc=document.getElementById('loginCard');
    lc.classList.remove('hidden');
    lc.style.animation='none';
    lc.offsetHeight;
    lc.style.animation='cardIn 0.6s ease';
}

// ============================
// 🔹 Toggle Password
// ============================
function togglePassword(id,btn){
    var inp=document.getElementById(id);
    inp.type=inp.type==='password'?'text':'password';
    btn.style.color=inp.type==='text'?'#00e5ff':'';
}

// ============================
// 🔹 Password Strength
// ============================
document.getElementById('signupPassword').addEventListener('input',function(){
    var v=this.value,fill=document.getElementById('strengthFill'),txt=document.getElementById('strengthText'),score=0;
    if(v.length>=8)score++;
    if(/[A-Z]/.test(v))score++;
    if(/[0-9]/.test(v))score++;
    if(/[^A-Za-z0-9]/.test(v))score++;
    var levels=[{w:'0%',c:'',t:''},{w:'25%',c:'#ff4466',t:'Débil'},{w:'50%',c:'#ffaa00',t:'Media'},{w:'75%',c:'#00e5ff',t:'Buena'},{w:'100%',c:'#00ff88',t:'Fuerte'}];
    var l=levels[score];
    fill.style.width=l.w;
    fill.style.background=l.c;
    txt.textContent=l.t;
    txt.style.color=l.c;
});

// ============================
// 🔹 Toast
// ============================
function showToast(msg,type){
    var t=document.getElementById('toast');
    t.textContent=msg;
    t.className='toast '+type+' show';
    setTimeout(function(){t.classList.remove('show')},3000);
}

// ============================
// 🌐 API URL
// ============================
const API_URL = "https://mi-api-clnb.onrender.com";

// ============================
// 🔹 Signup con API
// ============================
document.getElementById('signupForm').addEventListener('submit', async function(e){
    e.preventDefault();
    var name=document.getElementById('signupName').value.trim(),
        user=document.getElementById('signupUser').value.trim(),
        email=document.getElementById('signupEmail').value.trim(),
        pass=document.getElementById('signupPassword').value;

    if(!name||!user||!email||!pass) return showToast('Completa todos los campos','error');
    if(pass.length<8) return showToast('Mínimo 8 caracteres','error');

    var btn=this.querySelector('.btn-primary');
    btn.innerHTML='<span>Creando cuenta...</span>';
    btn.disabled=true;

    try {
        const res = await fetch(`${API_URL}/register`, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({email,password:pass})
        });
        const data = await res.json();
        if(res.ok){
            showToast('¡Cuenta creada! ✅','success');
            setTimeout(()=>showLogin(new MouseEvent('click')),1500);
        } else {
            showToast(data.error||'Error al registrarse','error');
        }
    } catch(err){
        console.error(err);
        showToast('Error de conexión con la API','error');
    } finally {
        btn.innerHTML='<span>Crear Cuenta</span>';
        btn.disabled=false;
    }
});

// ============================
// 🔹 Login con API
// ============================
document.getElementById('loginForm').addEventListener('submit', async function(e){
    e.preventDefault();
    var email=document.getElementById('loginEmail').value.trim(),
        pass=document.getElementById('loginPassword').value;

    if(!email||!pass) return showToast('Completa todos los campos','error');

    var btn=this.querySelector('.btn-primary');
    btn.innerHTML='<span>Verificando...</span>';
    btn.disabled=true;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body: JSON.stringify({email,password:pass})
        });
        const data = await res.json();
        if(res.ok){
            localStorage.setItem('user_session',JSON.stringify(data.user));
            showToast('¡Inicio de sesión exitoso! ✅','success');
            setTimeout(()=>window.location.href='dashboard.html',1000);
        } else {
            showToast(data.error||'Email o contraseña incorrectos','error');
        }
    } catch(err){
        console.error(err);
        showToast('Error de conexión con la API','error');
    } finally {
        btn.innerHTML='<span>Iniciar Sesión</span>';
        btn.disabled=false;
    }
});

// ============================
// 🔹 Social Logins
// ============================
function loginWithGoogle(){window.location.href=`${API_URL}/login/google`;}
function loginWithFacebook(){window.location.href=`${API_URL}/login/facebook`;}
function loginWithGmail(){showToast('Gmail login no implementado','info');}

// Mostrar login o redirigir si ya está logueado
document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('user_session'));
    if(session?.logged){
        // Si ya está logueado, vamos al dashboard
        window.location.href = 'dashboard.html';
    } else {
        // Si no hay sesión, mostrar la tarjeta de login
        document.getElementById('loginCard').classList.remove('hidden');
        document.getElementById('signupCard').classList.add('hidden');
    }
});