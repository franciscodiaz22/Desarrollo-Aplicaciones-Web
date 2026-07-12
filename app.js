const form = document.getElementById('formRegistro');
const mensajeFormulario = document.getElementById('mensajeFormulario');
const listaRegistros = document.getElementById('listaRegistros');
const totalRegistros = document.getElementById('totalRegistros');
const btnLimpiar = document.getElementById('btnLimpiar');

const campos = {
  nombre: document.getElementById('nombre'),
  correo: document.getElementById('correo'),
  telefono: document.getElementById('telefono'),
  departamento: document.getElementById('departamento'),
  comentario: document.getElementById('comentario')
};

// EDMOUND trabajo esta parte

const errores = {
  nombre: document.getElementById('errorNombre'),
  correo: document.getElementById('errorCorreo'),
  telefono: document.getElementById('errorTelefono'),
  departamento: document.getElementById('errorDepartamento'),
  comentario: document.getElementById('errorComentario')
};

async function cargarEstadisticas() {
  try {
    const res = await fetch('/api/stats');
    const stats = await res.json();
    document.getElementById('totalUsuarios').textContent = stats.total_usuarios;
    totalRegistros.textContent = stats.registros_mes;
  } catch {
    console.error('No se pudo conectar con el servidor.');
  }
}

// ---------- Sesión (Etapa 4 - Autenticación) ----------

const sesionInfo = document.getElementById('sesionInfo');
const linkLogin = document.getElementById('linkLogin');
const btnLogout = document.getElementById('btnLogout');

let estaAutenticado = false;
let usuarioActual = null;

async function verificarSesion() {
  try {
    const res = await fetch('/api/session');
    const data = await res.json();
    estaAutenticado = data.autenticado;
    usuarioActual = data.usuario;
  } catch {
    estaAutenticado = false;
    usuarioActual = null;
  }
  actualizarUISesion();
}

function actualizarUISesion() {
  if (estaAutenticado) {
    sesionInfo.textContent = `Sesión activa: ${usuarioActual.usuario}`;
    linkLogin.classList.add('hidden');
    btnLogout.classList.remove('hidden');
  } else {
    sesionInfo.textContent = '';
    linkLogin.classList.remove('hidden');
    btnLogout.classList.add('hidden');
  }
}

btnLogout.addEventListener('click', async () => {
  try {
    await fetch('/api/logout', { method: 'POST' });
  } finally {
    estaAutenticado = false;
    usuarioActual = null;
    actualizarUISesion();
  }
});

async function pintarRegistros() {
  try {
    const res = await fetch('/api/registros');
    const registros = await res.json();

    totalRegistros.textContent = registros.length;

    listaRegistros.innerHTML = registros.length === 0
      ? '<li>No hay registros aún.</li>'
      : registros.map((r) =>
          `<li><strong>${r.nombre}</strong> — ${r.departamento || 'Sin departamento'}</li>`
        ).join('');

    await cargarEstadisticas();
  } catch {
    listaRegistros.innerHTML = '<li>Error al cargar registros.</li>';
  }
}

function mostrarMensaje(texto, tipo) {
  mensajeFormulario.innerHTML = texto;
  mensajeFormulario.classList.remove('mensaje-exito', 'mensaje-error', 'mensaje-visible');
  mensajeFormulario.classList.add(tipo === 'exito' ? 'mensaje-exito' : 'mensaje-error', 'mensaje-visible');
}

function limpiarMensaje() {
  mensajeFormulario.innerHTML = '';
  mensajeFormulario.classList.remove('mensaje-exito', 'mensaje-error', 'mensaje-visible');
}

function setEstadoCampo(campo, error, mensaje) {
  error.innerHTML = mensaje;
  campo.classList.remove('input-error', 'input-valido');

  if (mensaje) {
    campo.classList.add('input-error');
  } else {
    campo.classList.add('input-valido');
  }
}

// EDMOUND trabajo esta parte

function validarNombre() {
  const valor = campos.nombre.value.trim();
  if (valor.length < 3) {
    const mensaje = 'El nombre debe tener al menos 3 caracteres.';
    setEstadoCampo(campos.nombre, errores.nombre, mensaje);
    return false;
  }

  setEstadoCampo(campos.nombre, errores.nombre, '');
  return true;
}

function validarCorreo() {
  const valor = campos.correo.value.trim();
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!regexCorreo.test(valor)) {
    const mensaje = 'Ingrese un correo electronico valido.';
    setEstadoCampo(campos.correo, errores.correo, mensaje);
    return false;
  }

  setEstadoCampo(campos.correo, errores.correo, '');
  return true;
}

function validarTelefono() {
  const valor = campos.telefono.value.trim();
  const soloDigitos = valor.replace(/\D/g, '');

  if (soloDigitos.length !== 10) {
    const mensaje = 'El telefono debe contener 10 digitos.';
    setEstadoCampo(campos.telefono, errores.telefono, mensaje);
    return false;
  }

  setEstadoCampo(campos.telefono, errores.telefono, '');
  return true;
}


function validarDepartamento() {
  const valor = campos.departamento.value;

  if (!valor) {
    const mensaje = 'Seleccione un departamento.';
    setEstadoCampo(campos.departamento, errores.departamento, mensaje);
    return false;
  }

  setEstadoCampo(campos.departamento, errores.departamento, '');
  return true;
}

function validarComentario() {
  const valor = campos.comentario.value.trim();

  if (valor.length > 0 && valor.length < 10) {
    const mensaje = 'Si agrega comentario, escriba al menos 10 caracteres.';
    setEstadoCampo(campos.comentario, errores.comentario, mensaje);
    return false;
  }

  setEstadoCampo(campos.comentario, errores.comentario, '');
  return true;
}

function validarFormulario() {
  const validaciones = [
    validarNombre(),
    validarCorreo(),
    validarTelefono(),
    validarDepartamento(),
    validarComentario()
  ];

  return validaciones.every((resultado) => resultado === true);
}

// Luis Matos - trabajo esta parte

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  limpiarMensaje();

  if (!validarFormulario()) return;

  const datos = {
    nombre:       campos.nombre.value.trim(),
    correo:       campos.correo.value.trim(),
    telefono:     campos.telefono.value.trim(),
    departamento: campos.departamento.value,
    comentario:   campos.comentario.value.trim()
  };

  try {
    const res = await fetch('/api/registros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    const data = await res.json();

    if (res.ok && data.success) {
      mostrarMensaje('✅ Registro guardado exitosamente.', 'exito');
      form.reset();
      Object.values(campos).forEach((c) => c.classList.remove('input-valido', 'input-error'));
      await pintarRegistros();
    } else {
      mostrarMensaje('❌ Error: ' + (data.error || 'No se pudo guardar.'), 'error');
    }
  } catch {
    mostrarMensaje('❌ No se pudo conectar con el servidor.', 'error');
  }
});

btnLimpiar.addEventListener('click', () => {
  form.reset();
  limpiarMensaje();
  Object.values(campos).forEach((c) => c.classList.remove('input-valido', 'input-error'));
  Object.values(errores).forEach((e) => { e.innerHTML = ''; });
});

// Luis Matos - trabajo esta parte

(async () => {
  await verificarSesion();
  await pintarRegistros();
})();
