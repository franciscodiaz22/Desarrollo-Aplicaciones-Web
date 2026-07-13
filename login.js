const formLogin = document.getElementById('formLogin');
const mensajeLogin = document.getElementById('mensajeLogin');

function mostrarMensajeLogin(texto, tipo) {
  mensajeLogin.textContent = texto;
  mensajeLogin.classList.remove('mensaje-exito', 'mensaje-error', 'mensaje-visible');
  mensajeLogin.classList.add(tipo === 'exito' ? 'mensaje-exito' : 'mensaje-error', 'mensaje-visible');
}

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault();

  const usuario = document.getElementById('usuario').value.trim();
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password })
    });
    const data = await res.json();

    if (res.ok && data.success) {
      window.location.href = '/Index.html';
    } else {
      mostrarMensajeLogin(data.error || 'No se pudo iniciar sesión.', 'error');
    }
  } catch {
    mostrarMensajeLogin('No se pudo conectar con el servidor.', 'error');
  }
});
