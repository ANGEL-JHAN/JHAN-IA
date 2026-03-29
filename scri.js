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

// ===================== SIGNUP =====================
document.getElementById('signupForm').addEventListener('submit', async function(e){
  e.preventDefault();

  var name = document.getElementById('signupName').value.trim(),
      user = document.getElementById('signupUser').value.trim(),
      email = document.getElementById('signupEmail').value.trim(),
      pass = document.getElementById('signupPassword').value;

  if(!name || !user || !email || !pass){
    showToast('Completa todos los campos','error');
    return;
  }
  if(pass.length < 8){
    showToast('Mínimo 8 caracteres','error');
    return;
  }

  var btn = this.querySelector('.btn-primary');
  btn.innerHTML = '<span>Creando cuenta...</span>';
  btn.disabled = true;

  try {
    // Crear usuario en la DB
    const res = await fetch('https://database-2poz.onrender.com/users', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({name, username:user, email, password:pass})
    });

    if(!res.ok) throw new Error('Error al crear usuario');
    const newUser = await res.json();

    // Guardar usuario creado y loguear automáticamente
    localStorage.setItem('user_data', JSON.stringify({id:newUser.id, name:newUser.name, username:newUser.username, email:newUser.email}));
    localStorage.setItem('user_session', JSON.stringify({id:newUser.id, name:newUser.name, username:newUser.username, logged:true}));

    showToast('¡Cuenta creada y logueada!','success');
    btn.innerHTML = '<span>✓ Registrado</span>';

    // Redirigir a la web
    btn.disabled = false;
    window.location.href = 'index.html';

  } catch(err){
    console.error(err);
    showToast('Error al conectar con la DB','error');
    btn.innerHTML = '<span>Crear Cuenta</span>';
    btn.disabled = false;
  }
});

// ===================== LOGIN =====================
document.getElementById('loginForm').addEventListener('submit', async function(e){
  e.preventDefault();

  var email = document.getElementById('loginEmail').value.trim(),
      pass = document.getElementById('loginPassword').value;

  if(!email || !pass){
    showToast('Completa todos los campos','error');
    return;
  }

  var btn = this.querySelector('.btn-primary');
  btn.innerHTML = '<span>Verificando...</span>';
  btn.disabled = true;

  try {
    const res = await fetch('https://database-2poz.onrender.com/users');
    const users = await res.json();
    const user = users.find(u => (u.email === email || u.username === email) && u.password === pass);

    if(!user){
      showToast('Usuario o contraseña incorrecta','error');
      btn.innerHTML = '<span>Iniciar Sesión</span>';
      btn.disabled = false;
      return;
    }

    localStorage.setItem('user_session', JSON.stringify({id:user.id, name:user.name, username:user.username, logged:true}));
    showToast('¡Inicio de sesión exitoso!','success');

    btn.innerHTML = '<span>Iniciar Sesión</span>';
    btn.disabled = false;
    window.location.href = 'index.html';

  } catch(err){
    console.error(err);
    showToast('Error al conectar con la DB','error');
    btn.innerHTML = '<span>Iniciar Sesión</span>';
    btn.disabled = false;
  }
});