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

Esto crea la base de datos `dashboard_db` con la tabla `registros` y datos de ejemplo.

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
```

### 5. Iniciar el servidor

```bash
npm start
```

El servidor estará disponible en: **http://localhost:3000**

---

## Uso

1. Abre **http://localhost:3000** en el navegador.
2. Las tarjetas del dashboard muestran el total de usuarios y registros del mes.
3. Completa el formulario y haz clic en **Registrar Datos** para guardar en la base de datos.
4. El historial del panel lateral se actualiza automáticamente.

---

## Estructura del proyecto

```
├── Index.html       # Interfaz principal del dashboard
├── styles.css       # Estilos del proyecto
├── app.js           # Lógica del frontend (validación + llamadas a la API)
├── server.js        # Servidor Express con rutas API
├── database.sql     # Script de exportación de la base de datos
├── package.json     # Dependencias Node.js
└── .env             # Variables de entorno (no incluido en git)
```

---

## API Endpoints

| Método | Ruta              | Descripción                        |
|--------|-------------------|------------------------------------|
| GET    | `/api/stats`      | Estadísticas del dashboard         |
| GET    | `/api/registros`  | Lista todos los registros          |
| POST   | `/api/registros`  | Crea un nuevo registro             |
| DELETE | `/api/registros/:id` | Elimina un registro por ID      |

---

## Equipo

- 
- Jose Alexander González
- Luis Eduardo Matos Lajara
- Rosanny Estevez Jerez
- Darlenny Altagracia Pimentel Ramos
- Edmoun Ramírez
