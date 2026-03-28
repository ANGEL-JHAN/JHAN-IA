const API_KEY = "123456";
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => { hamburger.classList.toggle("active"); navLinks.classList.toggle("active"); });
navLinks.querySelectorAll(".nav-link").forEach(l => l.addEventListener("click", () => { hamburger.classList.remove("active"); navLinks.classList.remove("active"); }));
window.addEventListener("scroll", () => { document.getElementById("navbar").style.background = window.scrollY > 50 ? "rgba(8,11,20,0.95)" : "rgba(8,11,20,0.85)"; });
(function() { const c = document.getElementById("particles"); for (let i = 0; i < 30; i++) { const p = document.createElement("div"); p.classList.add("particle"); p.style.left = Math.random()*100+"%"; p.style.animationDelay = Math.random()*8+"s"; p.style.animationDuration = (6+Math.random()*6)+"s"; c.appendChild(p); } })();
const obs = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }), { threshold: 0.1 });
document.querySelectorAll(".animate-on-scroll").forEach(el => obs.observe(el));

const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const sendBtn = document.getElementById("sendBtn");
const history = [{ role: "system", content: "Eres un asistente AI creado por ANGEL OFC. Responde de forma útil y amigable en español." }];

function addMsg(text, isUser) {
const d = document.createElement("div");
d.className = "message " + (isUser ? "user-message" : "bot-message");
d.innerHTML = '<div class="message-avatar">' + (isUser ? "TÚ" : "AI") + '</div><div class="message-content"><p>' + text + '</p></div>';
chatMessages.appendChild(d);
chatMessages.scrollTop = chatMessages.scrollHeight;
}
function showTyping() {
const d = document.createElement("div"); d.className = "message bot-message"; d.id = "typing";
d.innerHTML = '<div class="message-avatar">AI</div><div class="typing-indicator"><span></span><span></span><span></span></div>';
chatMessages.appendChild(d); chatMessages.scrollTop = chatMessages.scrollHeight;
}
function removeTyping() { const e = document.getElementById("typing"); if (e) e.remove(); }

async function send(text) {
addMsg(text, true);
history.push({ role: "user", content: text });
sendBtn.disabled = true; chatInput.disabled = true;
showTyping();
try {
// 🔗 Aquí usamos tu propia API en Render
const r = await fetch("https://mi-api-clnb.onrender.com/api/ia", {
method: "POST",
headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
body: JSON.stringify({ mensaje: text, usuario: "nestor" })
});

if (!r.ok) throw new Error(r.status);  

const data = await r.json();  
const reply = data.respuesta || "No hubo respuesta de la API.";  

removeTyping(); addMsg(reply, false);  
history.push({ role: "assistant", content: reply });

} catch (e) {
removeTyping();
const fallback = ["⚠️ La API está dormida o no responde. Intenta más tarde."][0];
addMsg(fallback, false);
history.push({ role: "assistant", content: fallback });
}
sendBtn.disabled = false; chatInput.disabled = false; chatInput.focus();
}
chatForm.addEventListener("submit", e => { e.preventDefault(); const t = chatInput.value.trim(); if (!t) return; chatInput.value = ""; send(t); });
document.getElementById("contactForm").addEventListener("submit", e => {
e.preventDefault(); const b = e.target.querySelector("button");
b.textContent = "¡Enviado! ✓"; b.style.background = "#22c55e";
setTimeout(() => { b.textContent = "Enviar Mensaje"; b.style.background = ""; e.target.reset(); }, 3000);
});
// -------------------------
// 🔊 Reproducir voz automática en cada respuesta
// -------------------------
function speak(text) {
if (!text) return;
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'es-ES'; // Idioma español
speechSynthesis.speak(utterance);
}

// Modificar la función addMsg para reproducir voz cuando sea mensaje de bot
function addMsg(text, isUser) {
const d = document.createElement("div");
d.className = "message " + (isUser ? "user-message" : "bot-message");
d.innerHTML = '<div class="message-avatar">' + (isUser ? "TÚ" : "AI") + '</div><div class="message-content"><p>' + text + '</p></div>';
chatMessages.appendChild(d);
chatMessages.scrollTop = chatMessages.scrollHeight;

// 🔊 Si es mensaje del bot, reproducir voz automáticamente
if (!isUser) speak(text);
}