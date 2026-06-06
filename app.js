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

function obtenerRegistros() {
  const datos = localStorage.getItem('registrosDashboard');
  return datos ? JSON.parse(datos) : [];
}

function guardarRegistros(registros) {
  localStorage.setItem('registrosDashboard', JSON.stringify(registros));
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



// Luis Matos - trabajo esta parte
pintarRegistros();
