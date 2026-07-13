# Dashboard de Registro de Datos — Equipo #7 UAPA

Sistema web para registrar y visualizar datos, con backend en Node.js y base de datos MySQL.

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [MySQL](https://dev.mysql.com/downloads/) (o XAMPP con MySQL activo)

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/franciscodiaz22/Desarrollo-Aplicaciones-Web.git
cd Desarrollo-Aplicaciones-Web
git checkout etapa-3/backend
```

### 2. Crear la base de datos

Abre MySQL (Workbench, phpMyAdmin o terminal) y ejecuta:

```bash
mysql -u root -p < database.sql
```

Esto crea la base de datos `dashboard_db` con las tablas `registros`, `usuarios`, `empresas_autorizadas` e `historial_accesos`, junto con datos de ejemplo.

### 3. Instalar dependencias

```bash
npm install
```

### 4. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido (ajusta según tu configuración de MySQL):

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=dashboard_db
PORT=3000
SESSION_SECRET=cambia-este-valor-por-una-cadena-larga-y-secreta
```

`SESSION_SECRET` es la clave que usa Express para firmar la cookie de sesión — usa cualquier cadena larga y única, no hace falta recordarla.

### 5. Iniciar el servidor

```bash
npm start
```

Este comando primero compila Tailwind CSS (`npm run build:css`) y luego levanta el servidor. Si vas a modificar clases de Tailwind mientras desarrollas, corre en otra terminal:

```bash
npm run watch:css
```

El servidor estará disponible en: **http://localhost:3000**

---

## Uso

1. Abre **http://localhost:3000** en el navegador (sirve `Index.html`).
2. Las tarjetas del dashboard, el historial y el formulario de registro se pueden usar **sin iniciar sesión**: cualquier visitante puede crear datos (Create) y verlos (Read), siempre que ingrese un **ID de Empresa** válido (ver siguiente sección).
3. Para **editar o eliminar** registros hace falta iniciar sesión como administrador desde `/login.html`.
   - Usuario de prueba: `admin`
   - Contraseña de prueba: `Admin2026!`
4. Con sesión activa aparecen los botones **Editar** y **Eliminar** en cada registro del historial (CRUD completo: Create, Read, Update, Delete), y se habilita la pestaña **Historial** con la bitácora de accesos.
5. El botón **Cerrar sesión** (arriba a la derecha) destruye la sesión del servidor y vuelve a ocultar las acciones de Update/Delete y el historial de accesos.

---

## Control de acceso por ID de Empresa

El formulario de registro exige un campo **ID de Empresa**. El backend valida ese código contra la tabla `empresas_autorizadas` antes de aceptar el registro:

- Si el código existe y está activo → el registro se guarda en `registros` y queda marcado como **aceptado** en el historial.
- Si el código no existe o está desactivado → el registro **no se guarda**, el servidor responde `403` y el intento queda marcado como **rechazado** en el historial (con nombre y correo, para poder auditar quién lo intentó).

Códigos de ejemplo (ver `database.sql`):

| ID de Empresa | Estado |
|----------------|--------|
| `UAPA-2026`    | Activo |
| `EMP-1001`     | Activo |
| `EMP-1002`     | Activo |
| `EMP-0000`     | Desactivado (para probar el caso de rechazo) |

La pestaña **Historial** (`#historial` en `Index.html`) muestra todos los intentos —aceptados y rechazados— y solo es visible con sesión de administrador iniciada, ya que expone correos de personas que intentaron registrarse.

---

## Estructura del proyecto

```
├── Index.html          # Interfaz principal del dashboard
├── login.html           # Pantalla de inicio de sesión
├── login.js              # Lógica del formulario de login
├── src/input.css        # Fuente de Tailwind CSS (@tailwind + componentes)
├── styles.css            # CSS compilado por Tailwind (generado, no editar a mano)
├── tailwind.config.js   # Configuración de Tailwind (colores institucionales, content paths)
├── app.js                # Lógica del frontend (validación, CRUD, sesión)
├── server.js             # Servidor Express: rutas API, sesiones y autenticación
├── database.sql          # Script de exportación de la base de datos
├── package.json          # Dependencias y scripts Node.js
└── .env                  # Variables de entorno (no incluido en git)
```

---

## Autenticación y sesiones

El login usa `express-session` (equivalente en Node al `session_start()` / `$_SESSION` de PHP): al autenticarse, el servidor guarda el usuario en `req.session.usuario` y una cookie firmada identifica esa sesión en cada petición. Las contraseñas se comparan con `bcryptjs` contra el hash guardado en la tabla `usuarios` (nunca se guarda texto plano).

Rutas privadas (requieren sesión activa, responden `401` si no la hay):
- `PUT /api/registros/:id` (editar)
- `DELETE /api/registros/:id` (eliminar)
- `GET /api/historial` (bitácora de accesos aceptados/rechazados)

Rutas públicas: `GET /api/stats`, `GET /api/registros`, `POST /api/registros`, `GET /api/session`, `POST /api/login`, `POST /api/logout`. El registro (Create) y la lectura (Read) están abiertos a cualquier visitante a propósito, para que el formulario se pueda usar sin cuenta; `POST /api/registros` igual exige un ID de Empresa válido para aceptar el dato. Solo Update, Delete y el historial quedan reservados al administrador autenticado.

---

## API Endpoints

| Método | Ruta                  | Descripción                                    | Requiere sesión |
|--------|-----------------------|--------------------------------------------------|:---------------:|
| GET    | `/api/stats`           | Estadísticas del dashboard                       | No |
| GET    | `/api/registros`       | Lista todos los registros                        | No |
| POST   | `/api/registros`       | Crea un nuevo registro (valida ID de Empresa)    | No |
| PUT    | `/api/registros/:id`   | Actualiza un registro existente                  | Sí |
| DELETE | `/api/registros/:id`   | Elimina un registro por ID                       | Sí |
| GET    | `/api/historial`       | Bitácora de accesos (aceptados y rechazados)     | Sí |
| POST   | `/api/login`           | Inicia sesión (usuario + contraseña)             | No |
| POST   | `/api/logout`          | Cierra la sesión activa                          | No |
| GET    | `/api/session`         | Consulta si hay sesión activa                    | No |

---

## Equipo

- Luis Eduardo Matos Lajara
- Jose Alexander González
- Rosanny Estevez Jerez
- Darlenny Altagracia Pimentel Ramos
- Edmoun Ramírez
