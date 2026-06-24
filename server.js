require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
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

// DELETE eliminar un registro por ID
app.delete('/api/registros/:id', (req, res) => {
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
