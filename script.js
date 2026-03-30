const API_KEY = "123456";
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

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

window.addEventListener("scroll", () => {
  document.getElementById("navbar").style.background =
    window.scrollY > 50 ? "rgba(8,11,20,0.95)" : "rgba(8,11,20,0.85)";
});

// Partículas
(function() {
  const c = document.getElementById("particles");
  for (let i = 0; i < 30; i++) {
    const p = document.createElement("div");
    p.classList.add("particle");
    p.style.left = Math.random()*100+"%";
    p.style.animationDelay = Math.random()*8+"s";
    p.style.animationDuration = (6+Math.random()*6)+"s";
    c.appendChild(p);
  }
})();

// Animaciones scroll
const obs = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) e.target.classList.add("visible");
}), { threshold: 0.1 });
document.querySelectorAll(".animate-on-scroll").forEach(el => obs.observe(el));

// Chat
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const history = [{ role: "system", content: "Eres un asistente AI creado por ANGEL OFC. Responde de forma útil y amigable en español." }];

// 🔊 Función para hablar solo texto limpio (sin emojis ni símbolos)
function speakTextClean(text) {
  const clean = text.replace(/[^\w\s.,!?¿¡]/g, ""); 
  if (!clean) return; // nada que decir
  if (!window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.lang = "es-ES";
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

// Función para agregar mensaje al chat
function addMsg(text, isUser) {
  const d = document.createElement("div");
  d.className = "message " + (isUser ? "user-message" : "bot-message");
  d.innerHTML = `
    <div class="message-avatar">
      ${isUser ? "TÚ" : '<img src="img.jpg" alt="AI Bot" style="width:40px; height:40px; object-fit:cover; border-radius:50%;">'}
    </div>
    <div class="message-content"><p>${text}</p></div>
  `;
  chatMessages.appendChild(d);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  if (!isUser) {
    setTimeout(() => speakTextClean(text), 100);
  }
}

// Animación de "escribiendo..."
function showTyping() {
  const d = document.createElement("div");
  d.className = "message bot-message";
  d.id = "typing";
  d.innerHTML = `
    <div class="message-avatar">
      <img src="icono.jpg" alt="AI Bot" style="width:40px; height:40px; object-fit:cover; border-radius:50%;">
    </div>
    <div class="typing-indicator"><span></span><span></span><span></span></div>
  `;
  chatMessages.appendChild(d);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const e = document.getElementById("typing");
  if (e) e.remove();
}

// 🔥 Función enviar mensaje a tu API
async function send(text) {
  addMsg(text, true);
  history.push({ role: "user", content: text });
  sendBtn.disabled = true;
  chatInput.disabled = true;
  showTyping();

  try {
    const r = await fetch("https://mi-api-clnb.onrender.com/api/ia", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY
      },
      body: JSON.stringify({ mensaje: text, usuario: "anonimo" })
    });

    if (!r.ok) throw new Error(r.status);
    const data = await r.json();
    const reply = data.respuesta || "🤖 No obtuve respuesta";
    removeTyping();
    addMsg(reply, false);
    history.push({ role: "assistant", content: reply });

  } catch (e) {
    removeTyping();
    const fallback = [
      "¡Interesante! Estoy en modo demo. Conecta tu API real para respuestas con IA completa. 🤖",
      "Soy el bot de ANGEL OFC en modo demo. Configura tu API key para activar la IA. 🚀",
      "¡Gracias por probarme! Para respuestas reales, cambia la API key en script.js. ⚡"
    ][Math.floor(Math.random()*3)];
    addMsg(fallback, false);
    history.push({ role: "assistant", content: fallback });
  }

  sendBtn.disabled = false;
  chatInput.disabled = false;
  chatInput.focus();
}

// Formulario de chat
chatForm.addEventListener("submit", e => {
  e.preventDefault();
  const t = chatInput.value.trim();
  if (!t) return;
  chatInput.value = "";
  send(t);
});

// Formulario de contacto
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const b = e.target.querySelector("button");
  b.textContent = "¡Enviado! ✓";
  b.style.background = "#22c55e";
  setTimeout(() => {
    b.textContent = "Enviar Mensaje";
    b.style.background = "";
    e.target.reset();
  }, 3000);
});

// Sesión y menú perfil
document.addEventListener('DOMContentLoaded', () => {
  const session = JSON.parse(localStorage.getItem('user_session'));
  const profileMenu = document.getElementById('profile-menu');
  const userNameSpan = document.getElementById('user-name');
  const logoutBtn = document.getElementById('logout-btn');

  if (session?.logged) {
    profileMenu.classList.remove('hidden');
    userNameSpan.textContent = session.user || session.name || 'Usuario';
  } else {
    profileMenu.classList.add('hidden');
  }

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('user_session');
    window.location.href = 'signup.html';
  });
});

function showSignup(e) {
  e.preventDefault();
  document.getElementById('loginCard').classList.add('hidden');
  document.getElementById('signupCard').classList.remove('hidden');
}

function showLogin(e) {
  e.preventDefault();
  document.getElementById('signupCard').classList.add('hidden');
  document.getElementById('loginCard').classList.remove('hidden');
}