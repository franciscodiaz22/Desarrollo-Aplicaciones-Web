require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Manejo de sesiones del servidor (equivalente a session_start() / $_SESSION en PHP)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2 // 2 horas
  }
}));

app.use(express.static(path.join(__dirname)));

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dashboard_db'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar con MySQL:', err.message);
    process.exit(1);
  }
  console.log('Conectado a MySQL correctamente');
});

// Middleware que protege las rutas privadas (editar, eliminar)
function requireAuth(req, res, next) {
  if (!req.session.usuario) {
    return res.status(401).json({ error: 'Debe iniciar sesión para realizar esta acción.' });
  }
  next();
}

// ---------- Autenticación ----------

app.post('/api/login', (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' });
  }

  db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    const cuenta = results[0];
    const claveValida = bcrypt.compareSync(password, cuenta.password_hash);

    if (!claveValida) {
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos.' });
    }

    req.session.usuario = { id: cuenta.id, usuario: cuenta.usuario };
    res.json({ success: true, usuario: cuenta.usuario });
  });
});

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

app.get('/api/session', (req, res) => {
  res.json({ autenticado: Boolean(req.session.usuario), usuario: req.session.usuario || null });
});

// ---------- CRUD Registros ----------

// GET estadísticas del dashboard (total usuarios y registros del mes)
app.get('/api/stats', (req, res) => {
  const mes = new Date().getMonth() + 1;
  const anio = new Date().getFullYear();

  db.query('SELECT COUNT(*) AS total FROM registros', (err, totalRes) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(
      'SELECT COUNT(*) AS mes FROM registros WHERE MONTH(fecha_registro) = ? AND YEAR(fecha_registro) = ?',
      [mes, anio],
      (err, mesRes) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
          total_usuarios: totalRes[0].total,
          registros_mes: mesRes[0].mes
        });
      }
    );
  });
});

// GET todos los registros
app.get('/api/registros', (req, res) => {
  db.query('SELECT * FROM registros ORDER BY fecha_registro DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST guardar nuevo registro
app.post('/api/registros', (req, res) => {
  const { nombre, correo, telefono, departamento, comentario } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ error: 'Nombre y correo son requeridos' });
  }

  db.query(
    'INSERT INTO registros (nombre, correo, telefono, departamento, comentario) VALUES (?, ?, ?, ?, ?)',
    [nombre, correo, telefono || null, departamento || null, comentario || null],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id: result.insertId, message: 'Registro guardado exitosamente' });
    }
  );
});

// DELETE eliminar un registro por ID (ruta privada)
app.delete('/api/registros/:id', requireAuth, (req, res) => {
  db.query('DELETE FROM registros WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Registro no encontrado' });
    }
    res.json({ success: true, message: 'Registro eliminado' });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
