// ============================
// 🎆 Partículas
// ============================
(function () {

    const c = document.getElementById("particles");

    if (!c) return;

    for (let i = 0; i < 40; i++) {

        const p = document.createElement("div");

        p.className = "particle";

        const s = Math.random() * 4 + 2;

        p.style.width = s + "px";
        p.style.height = s + "px";
        p.style.left = Math.random() * 100 + "%";
        p.style.animationDuration =
            Math.random() * 15 + 10 + "s";

        p.style.animationDelay =
            Math.random() * 10 + "s";

        if (Math.random() > 0.5) {

            p.style.background = "#b040ff";
        }

        c.appendChild(p);
    }

})();

// ============================
// 🔹 Toggle Login/Signup
// ============================
function showSignup(e) {

    if (e) e.preventDefault();

    document
        .getElementById("loginCard")
        .classList
        .add("hidden");

    document
        .getElementById("signupCard")
        .classList
        .remove("hidden");
}

function showLogin(e) {

    if (e) e.preventDefault();

    document
        .getElementById("signupCard")
        .classList
        .add("hidden");

    document
        .getElementById("loginCard")
        .classList
        .remove("hidden");
}

// ============================
// 🔹 Mostrar/Ocultar Password
// ============================
function togglePassword(id, btn) {

    const inp = document.getElementById(id);

    if (!inp) return;

    inp.type =
        inp.type === "password"
            ? "text"
            : "password";

    btn.style.color =
        inp.type === "text"
            ? "#00e5ff"
            : "";
}

// ============================
// 🔹 Toast
// ============================
function showToast(msg, type = "success") {

    const t = document.getElementById("toast");

    if (!t) return;

    t.textContent = msg;

    t.className = `toast ${type} show`;

    setTimeout(() => {

        t.classList.remove("show");

    }, 3000);
}

// ============================
// 🌐 API URL
// ============================
const API_URL =
    "https://mi-api-clnb.onrender.com";

// ============================
// 🔹 SIGNUP
// ============================
const signupForm =
    document.getElementById("signupForm");

if (signupForm) {

    signupForm.addEventListener(
        "submit",

        async function (e) {

            e.preventDefault();

            const name =
                document
                    .getElementById("signupName")
                    .value
                    .trim();

            const user =
                document
                    .getElementById("signupUser")
                    .value
                    .trim();

            const email =
                document
                    .getElementById("signupEmail")
                    .value
                    .trim();

            const pass =
                document
                    .getElementById("signupPassword")
                    .value;

            if (!name || !user || !email || !pass) {

                return showToast(
                    "Completa todos los campos",
                    "error"
                );
            }

            if (pass.length < 8) {

                return showToast(
                    "La contraseña debe tener mínimo 8 caracteres",
                    "error"
                );
            }

            try {

                console.log("🔥 Registrando usuario...");

                const res = await fetch(
                    `${API_URL}/api/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            nombre: name,
                            usuario: user,
                            email: email,
                            password: pass
                        })
                    }
                );

                const text = await res.text();

                console.log("🔥 RESPUESTA:", text);

                let data;

                try {

                    data = JSON.parse(text);

                } catch {

                    throw new Error("La API devolvió HTML o error");
                }

                if (res.ok) {

                    showToast(
                        "¡Cuenta creada correctamente! ✅",
                        "success"
                    );

                    setTimeout(() => {

                        showLogin();

                    }, 1500);

                } else {

                    showToast(
                        data.error ||
                        "Error al registrarse",
                        "error"
                    );
                }

            } catch (err) {

                console.error("❌ ERROR:", err);

                showToast(
                    "Error de conexión con la API",
                    "error"
                );
            }
        }
    );
}

// ============================
// 🔹 LOGIN
// ============================
const loginForm =
    document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener(
        "submit",

        async function (e) {

            e.preventDefault();

            const email =
                document
                    .getElementById("loginEmail")
                    .value
                    .trim();

            const pass =
                document
                    .getElementById("loginPassword")
                    .value;

            if (!email || !pass) {

                return showToast(
                    "Completa todos los campos",
                    "error"
                );
            }

            try {

                console.log("🔥 Iniciando sesión...");

                const res = await fetch(
                    `${API_URL}/api/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            email,
                            password: pass
                        })
                    }
                );

                const text = await res.text();

                console.log("🔥 LOGIN RESP:", text);

                let data;

                try {

                    data = JSON.parse(text);

                } catch {

                    throw new Error("La API devolvió HTML");
                }

                if (res.ok) {

                    localStorage.setItem(
                        "user_session",

                        JSON.stringify({
                            logged: true,
                            token: data.token,
                            user:
                                data.user?.user_metadata?.usuario ||
                                data.user?.email
                        })
                    );

                    showToast(
                        "¡Login exitoso! ✅",
                        "success"
                    );

                    setTimeout(() => {

                        window.location.href =
                            "index.html";

                    }, 1000);

                } else {

                    showToast(
                        data.error ||
                        "Email o contraseña incorrectos",
                        "error"
                    );
                }

            } catch (err) {

                console.error("❌ LOGIN ERROR:", err);

                showToast(
                    "Error de conexión con la API",
                    "error"
                );
            }
        }
    );
}

// ============================
// 🔹 INICIALIZAR
// ============================
document.addEventListener(
    "DOMContentLoaded",

    () => {

        const session = JSON.parse(
            localStorage.getItem("user_session")
        );

        if (session?.logged) {

            console.log("✅ Usuario logueado");

        }

        showLogin();
    }
);