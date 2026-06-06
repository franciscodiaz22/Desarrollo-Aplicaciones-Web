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

function pintarRegistros() {
  const registros = obtenerRegistros();

  if (registros.length === 0) {
    listaRegistros.innerHTML = '<li>No hay registros guardados aun.</li>';
    totalRegistros.innerHTML = '0';
    return;
  }

  listaRegistros.innerHTML = registros
    .map((registro) => {
      const departamento = registro.departamento.charAt(0).toUpperCase() + registro.departamento.slice(1);
      return `<li><strong>${registro.nombre}</strong> - ${departamento}</li>`;
    })
    .join('');

  totalRegistros.innerHTML = String(registros.length);
}

function agregarRegistro() {
  const registros = obtenerRegistros();

  const nuevoRegistro = {
    nombre: campos.nombre.value.trim(),
    correo: campos.correo.value.trim(),
    telefono: campos.telefono.value.trim(),
    departamento: campos.departamento.value,
    comentario: campos.comentario.value.trim(),
    fecha: new Date().toISOString()
  };

  registros.push(nuevoRegistro);
  guardarRegistros(registros);
}

function limpiarEstadosFormulario() {
  Object.values(errores).forEach((error) => {
    error.innerHTML = '';
  });

  Object.values(campos).forEach((campo) => {
    campo.classList.remove('input-error', 'input-valido');
  });
}

form.addEventListener('submit', (evento) => {
  evento.preventDefault();
  limpiarMensaje();

  const formularioValido = validarFormulario();

  if (!formularioValido) {
    mostrarMensaje('Revise los campos marcados en rojo antes de enviar.', 'error');
    return;
  }

  agregarRegistro();
  pintarRegistros();
  mostrarMensaje('Registro guardado correctamente.', 'exito');
  form.reset();
  limpiarEstadosFormulario();
});

campos.nombre.addEventListener('input', validarNombre);
campos.correo.addEventListener('input', validarCorreo);
campos.telefono.addEventListener('input', validarTelefono);
campos.departamento.addEventListener('change', validarDepartamento);
campos.comentario.addEventListener('input', validarComentario);

btnLimpiar.addEventListener('click', () => {
  localStorage.removeItem('registrosDashboard');
  pintarRegistros();
  limpiarMensaje();
  mostrarMensaje('Historial eliminado de LocalStorage.', 'exito');
});

// Uso de querySelector para demostrar manipulacion adicional del DOM.
const primeraTarjeta = document.querySelector('.tarjeta .numero');
if (primeraTarjeta) {
  primeraTarjeta.classList.add('resaltado-dashboard');
}

pintarRegistros();
