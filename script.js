async function send(text) {
  addMsg(text, true);
  history.push({ role: "user", content: text });
  sendBtn.disabled = true; chatInput.disabled = true;
  showTyping();

  try {
    // 🔗 Usamos tu API en Render
    const r = await fetch("https://mi-api-clnb.onrender.com/api/ia", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
      body: JSON.stringify({ mensaje: text, usuario: "nestor" })
    });

    if (!r.ok) throw new Error(r.status);

    const data = await r.json();
    const reply = data.respuesta || "No hubo respuesta de la API.";

    removeTyping();
    addMsg(reply, false);
    history.push({ role: "assistant", content: reply });

    // 🔊 Reproducir voz en Android / navegadores
    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = 'es-ES';
    speechSynthesis.cancel(); // Cancelar voz previa si existe
    speechSynthesis.speak(utterance);

  } catch (e) {
    removeTyping();
    const fallback = ["⚠️ La API está dormida o no responde. Intenta más tarde."][0];
    addMsg(fallback, false);
    history.push({ role: "assistant", content: fallback });
  }

  sendBtn.disabled = false; chatInput.disabled = false; chatInput.focus();
}