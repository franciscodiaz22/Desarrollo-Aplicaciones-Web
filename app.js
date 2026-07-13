const form = document.getElementById('formRegistro');
const mensajeFormulario = document.getElementById('mensajeFormulario');
const listaRegistros = document.getElementById('listaRegistros');
const totalRegistros = document.getElementById('totalRegistros');
const btnLimpiar = document.getElementById('btnLimpiar');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelarEdicion = document.getElementById('btnCancelarEdicion');
const registroIdInput = document.getElementById('registroId');

const campos = {
  idEmpresa: document.getElementById('idEmpresa'),
  nombre: document.getElementById('nombre'),
  correo: document.getElementById('correo'),
  telefono: document.getElementById('telefono'),
  departamento: document.getElementById('departamento'),
  comentario: document.getElementById('comentario')
};

// EDMOUND trabajo esta parte

const errores = {
  idEmpresa: document.getElementById('errorIdEmpresa'),
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
const avisoSesion = document.getElementById('avisoSesion');
const avisoHistorial = document.getElementById('avisoHistorial');
const contenedorHistorial = document.getElementById('contenedorHistorial');
const tablaHistorial = document.getElementById('tablaHistorial');

let estaAutenticado = false;
let usuarioActual = null;
let registrosCache = [];

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
  await cargarHistorial();
}

function actualizarUISesion() {
  if (estaAutenticado) {
    sesionInfo.textContent = `Sesión activa: ${usuarioActual.usuario}`;
    linkLogin.classList.add('hidden');
    btnLogout.classList.remove('hidden');
    avisoSesion.classList.add('hidden');
    avisoHistorial.classList.add('hidden');
    contenedorHistorial.classList.remove('hidden');
  } else {
    sesionInfo.textContent = '';
    linkLogin.classList.remove('hidden');
    btnLogout.classList.add('hidden');
    avisoSesion.classList.remove('hidden');
    avisoHistorial.classList.remove('hidden');
    contenedorHistorial.classList.add('hidden');
  }
  renderLista(registrosCache);
}

// ---------- Historial de Accesos (Etapa 4 - Control de acceso) ----------

async function cargarHistorial() {
  if (!estaAutenticado) return;

  try {
    const res = await fetch('/api/historial');
    if (!res.ok) return;
    const historial = await res.json();
    renderHistorial(historial);
  } catch {
    tablaHistorial.innerHTML = '<tr><td colspan="5" class="p-2.5 text-slate-500">Error al cargar el historial.</td></tr>';
  }
}

function renderHistorial(historial) {
  if (historial.length === 0) {
    tablaHistorial.innerHTML = '<tr><td colspan="5" class="p-2.5 text-slate-500">Aún no hay intentos de registro.</td></tr>';
    return;
  }

  tablaHistorial.innerHTML = historial.map((h) => {
    const aceptado = h.resultado === 'aceptado';
    const badge = aceptado
      ? '<span class="bg-green-100 text-green-800 rounded px-2 py-0.5 text-xs font-semibold">Aceptado</span>'
      : '<span class="bg-red-100 text-red-800 rounded px-2 py-0.5 text-xs font-semibold">Rechazado</span>';
    const fecha = new Date(h.fecha).toLocaleString('es-DO');

    return `
      <tr class="border-b border-slate-100">
        <td class="p-2.5">${h.nombre}</td>
        <td class="p-2.5">${h.correo}</td>
        <td class="p-2.5">${h.id_empresa}</td>
        <td class="p-2.5">${badge}</td>
        <td class="p-2.5 text-slate-500">${fecha}</td>
      </tr>`;
  }).join('');
}

btnLogout.addEventListener('click', async () => {
  try {
    await fetch('/api/logout', { method: 'POST' });
  } finally {
    estaAutenticado = false;
    usuarioActual = null;
    cancelarEdicion();
    actualizarUISesion();
  }
});

// ---------- Listado y CRUD de registros ----------

async function pintarRegistros() {
  try {
    const res = await fetch('/api/registros');
    const registros = await res.json();

    registrosCache = registros;
    renderLista(registros);
    await cargarEstadisticas();
  } catch {
    listaRegistros.innerHTML = '<li>Error al cargar registros.</li>';
  }
}

function renderLista(registros) {
  if (registros.length === 0) {
    listaRegistros.innerHTML = '<li>No hay registros aún.</li>';
    return;
  }

  listaRegistros.innerHTML = registros.map((r) => `
    <li class="flex items-center justify-between gap-2 bg-white/5 rounded-md px-2 py-1.5">
      <span><strong>${r.nombre}</strong> — ${r.departamento || 'Sin departamento'}</span>
      ${estaAutenticado ? `
        <span class="flex gap-1 shrink-0">
          <button type="button" class="btn-edit" data-editar="${r.id}">Editar</button>
          <button type="button" class="btn-danger" data-eliminar="${r.id}">Eliminar</button>
        </span>` : ''}
    </li>
  `).join('');
}

listaRegistros.addEventListener('click', (e) => {
  const botonEditar = e.target.closest('[data-editar]');
  const botonEliminar = e.target.closest('[data-eliminar]');

  if (botonEditar) iniciarEdicion(botonEditar.dataset.editar);
  if (botonEliminar) eliminarRegistro(botonEliminar.dataset.eliminar);
});

function iniciarEdicion(id) {
  const registro = registrosCache.find((r) => String(r.id) === String(id));
  if (!registro) return;

  registroIdInput.value = registro.id;
  campos.idEmpresa.value = registro.id_empresa || '';
  campos.nombre.value = registro.nombre;
  campos.correo.value = registro.correo;
  campos.telefono.value = registro.telefono || '';
  campos.departamento.value = registro.departamento || '';
  campos.comentario.value = registro.comentario || '';
  Object.values(campos).forEach((c) => c.classList.remove('input-valido', 'input-error'));

  btnGuardar.textContent = 'Actualizar Registro';
  btnCancelarEdicion.classList.remove('hidden');
  document.getElementById('registro').scrollIntoView({ behavior: 'smooth' });
}

function cancelarEdicion() {
  registroIdInput.value = '';
  form.reset();
  Object.values(campos).forEach((c) => c.classList.remove('input-valido', 'input-error'));
  btnGuardar.textContent = 'Registrar Datos';
  btnCancelarEdicion.classList.add('hidden');
}

btnCancelarEdicion.addEventListener('click', () => {
  cancelarEdicion();
  limpiarMensaje();
});

async function eliminarRegistro(id) {
  if (!confirm('¿Eliminar este registro?')) return;

  try {
    const res = await fetch(`/api/registros/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (res.ok && data.success) {
      if (registroIdInput.value === String(id)) cancelarEdicion();
      await pintarRegistros();
    } else if (res.status === 401) {
      await verificarSesion();
      mostrarMensaje('❌ Tu sesión expiró. Inicia sesión nuevamente.', 'error');
    } else {
      mostrarMensaje('❌ ' + (data.error || 'No se pudo eliminar.'), 'error');
    }
  } catch {
    mostrarMensaje('❌ No se pudo conectar con el servidor.', 'error');
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

// ID de Empresa (Etapa 4 - Control de acceso): la validez real del código
// se confirma en el backend contra la tabla empresas_autorizadas.
function validarIdEmpresa() {
  const valor = campos.idEmpresa.value.trim();
  if (valor.length < 3) {
    const mensaje = 'Ingrese el ID de Empresa que le fue asignado.';
    setEstadoCampo(campos.idEmpresa, errores.idEmpresa, mensaje);
    return false;
  }

  setEstadoCampo(campos.idEmpresa, errores.idEmpresa, '');
  return true;
}

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
    validarIdEmpresa(),
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
    id_empresa:   campos.idEmpresa.value.trim(),
    nombre:       campos.nombre.value.trim(),
    correo:       campos.correo.value.trim(),
    telefono:     campos.telefono.value.trim(),
    departamento: campos.departamento.value,
    comentario:   campos.comentario.value.trim()
  };

  const editando = Boolean(registroIdInput.value);
  const url = editando ? `/api/registros/${registroIdInput.value}` : '/api/registros';
  const metodo = editando ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method: metodo,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    const data = await res.json();

    if (res.ok && data.success) {
      mostrarMensaje(editando ? '✅ Registro actualizado exitosamente.' : '✅ Registro guardado exitosamente.', 'exito');
      cancelarEdicion();
      await pintarRegistros();
      await cargarHistorial();
    } else if (res.status === 401) {
      await verificarSesion();
      mostrarMensaje('❌ Tu sesión expiró. Inicia sesión nuevamente.', 'error');
    } else if (res.status === 403) {
      setEstadoCampo(campos.idEmpresa, errores.idEmpresa, data.error || 'ID de Empresa inválido.');
      mostrarMensaje('❌ ' + (data.error || 'ID de Empresa inválido.'), 'error');
      await cargarHistorial();
    } else {
      mostrarMensaje('❌ Error: ' + (data.error || 'No se pudo guardar.'), 'error');
    }
  } catch {
    mostrarMensaje('❌ No se pudo conectar con el servidor.', 'error');
  }
});

btnLimpiar.addEventListener('click', () => {
  cancelarEdicion();
  limpiarMensaje();
  Object.values(errores).forEach((e) => { e.innerHTML = ''; });
});

// Luis Matos - trabajo esta parte

(async () => {
  await verificarSesion();
  await pintarRegistros();
})();
