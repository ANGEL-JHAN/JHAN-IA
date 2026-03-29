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
    if(Math.random()>.5) p.style.background='#b040ff';
    c.appendChild(p)
  }
})();

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

function togglePassword(id,btn){
  var inp=document.getElementById(id);
  inp.type=inp.type==='password'?'text':'password';
  btn.style.color=inp.type==='text'?'#00e5ff':'';
}

document.getElementById('signupPassword').addEventListener('input', function(){
  var v=this.value,
      fill=document.getElementById('strengthFill'),
      txt=document.getElementById('strengthText'),
      score=0;
  if(v.length>=8) score++;
  if(/[A-Z]/.test(v)) score++;
  if(/[0-9]/.test(v)) score++;
  if(/[^A-Za-z0-9]/.test(v)) score++;
  var levels=[
    {w:'0%',c:'',t:''},
    {w:'25%',c:'#ff4466',t:'Débil'},
    {w:'50%',c:'#ffaa00',t:'Media'},
    {w:'75%',c:'#00e5ff',t:'Buena'},
    {w:'100%',c:'#00ff88',t:'Fuerte'}
  ];
  var l=levels[score];
  fill.style.width=l.w;
  fill.style.background=l.c;
  txt.textContent=l.t;
  txt.style.color=l.c;
});

function showToast(msg,type){
  var t=document.getElementById('toast');
  t.textContent=msg;
  t.className='toast '+type+' show';
  setTimeout(function(){t.classList.remove('show')},3000)
}

// ===================== LOGIN =====================
document.getElementById('loginForm').addEventListener('submit', async function(e){
  e.preventDefault();

  var email=document.getElementById('loginEmail').value.trim(),
      pass=document.getElementById('loginPassword').value;

  if(!email || !pass){
    showToast('Completa todos los campos','error');
    return;
  }

  var btn=this.querySelector('.btn-primary');
  btn.innerHTML='<span>Verificando...</span>';
  btn.disabled=true;

  try {
    const res = await fetch('https://database-2poz.onrender.com/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email, password:pass})
    });
    const data = await res.json();

    if(res.ok){
      localStorage.setItem('user_session', JSON.stringify({
        id: data.user.id,
        email: data.user.email,
        plan: data.user.plan,
        logged:true
      }));
      showToast('¡Inicio de sesión exitoso!','success');
      btn.innerHTML='<span>✓ Conectado</span>';
      setTimeout(()=>{ window.location.href='index.html'; }, 1000);
    } else {
      showToast(data.error,'error');
      btn.innerHTML='<span>Iniciar Sesión</span>';
      btn.disabled=false;
    }

  } catch(err){
    console.error(err);
    showToast('Error al conectar con la DB','error');
    btn.innerHTML='<span>Iniciar Sesión</span>';
    btn.disabled=false;
  }
});

// ===================== SIGNUP =====================
document.getElementById('signupForm').addEventListener('submit', async function(e){
  e.preventDefault();

  var name=document.getElementById('signupName').value.trim(),
      user=document.getElementById('signupUser').value.trim(),
      email=document.getElementById('signupEmail').value.trim(),
      pass=document.getElementById('signupPassword').value;

  if(!name || !user || !email || !pass){
    showToast('Completa todos los campos','error');
    return;
  }
  if(pass.length<8){
    showToast('Mínimo 8 caracteres','error');
    return;
  }

  var btn=this.querySelector('.btn-primary');
  btn.innerHTML='<span>Creando cuenta...</span>';
  btn.disabled=true;

  try {
    // Registrar usuario
    const res = await fetch('https://database-2poz.onrender.com/register', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email, password:pass})
    });
    const data = await res.json();

    if(res.ok){
      // Login automático después del registro para obtener ID real
      const loginRes = await fetch('https://database-2poz.onrender.com/login', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email, password:pass})
      });
      const loginData = await loginRes.json();

      if(loginRes.ok){
        localStorage.setItem('user_session', JSON.stringify({
          id: loginData.user.id,
          email: loginData.user.email,
          plan: loginData.user.plan,
          logged:true
        }));
        showToast('¡Cuenta creada y logueada!','success');
        btn.innerHTML='<span>✓ Registrado</span>';
        setTimeout(()=>{ window.location.href='index.html'; }, 1000);
      } else {
        showToast(loginData.error,'error');
        btn.innerHTML='<span>Crear Cuenta</span>';
        btn.disabled=false;
      }

    } else {
      showToast(data.error,'error');
      btn.innerHTML='<span>Crear Cuenta</span>';
      btn.disabled=false;
    }

  } catch(err){
    console.error(err);
    showToast('Error al conectar con la DB','error');
    btn.innerHTML='<span>Crear Cuenta</span>';
    btn.disabled=false;
  }
});

// ===================== SOCIAL LOGIN =====================
function loginWithGoogle(){showToast('Conectando con Google...','info');setTimeout(function(){showToast('¡Conectado con Google!','success')},1500)}
function loginWithFacebook(){showToast('Conectando con Facebook...','info');setTimeout(function(){showToast('¡Conectado con Facebook!','success')},1500)}
function loginWithGmail(){showToast('Conectando con Gmail...','info');setTimeout(function(){showToast('¡Conectado con Gmail!','success')},1500)}