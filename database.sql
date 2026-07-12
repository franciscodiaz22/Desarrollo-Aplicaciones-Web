-- ============================================================
-- Script de exportación de base de datos
-- Sistema: Dashboard de Registro de Datos
-- Equipo #7 - Desarrollo de Aplicaciones Web UAPA
-- ============================================================

CREATE DATABASE IF NOT EXISTS dashboard_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE dashboard_db;

-- ------------------------------------------------------------
-- Tabla: registros
-- Almacena los datos enviados desde el formulario del dashboard
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registros (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(100)  NOT NULL,
  correo          VARCHAR(100)  NOT NULL,
  telefono        VARCHAR(20),
  departamento    ENUM('administracion', 'ventas', 'soporte', 'tecnologia'),
  comentario      TEXT,
  fecha_registro  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Datos de ejemplo
-- ------------------------------------------------------------
INSERT INTO registros (nombre, correo, telefono, departamento, comentario) VALUES
('María González',  'maria.gonzalez@correo.com',  '8095550001', 'administracion', 'Empleada del área administrativa'),
('Carlos Martínez', 'carlos.martinez@correo.com', '8095550002', 'ventas',          'Vendedor zona norte'),
('Ana Pérez',       'ana.perez@correo.com',       '8095550003', 'tecnologia',      'Desarrolladora frontend'),
('Luis Santos',     'luis.santos@correo.com',     '8095550004', 'soporte',         'Técnico de soporte nivel 2'),
('Sofía Díaz',      'sofia.diaz@correo.com',      '8095550005', 'administracion',  'Asistente administrativa');

-- ------------------------------------------------------------
-- Tabla: usuarios
-- Cuentas para el login del panel (Etapa 4 - Autenticación)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS usuarios (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  usuario         VARCHAR(50)   NOT NULL UNIQUE,
  password_hash   VARCHAR(255)  NOT NULL,
  fecha_creacion  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Usuario de ejemplo -> usuario: admin / contraseña: Admin2026!
-- El hash fue generado con bcrypt (10 rounds); no se guarda la contraseña en texto plano.
INSERT INTO usuarios (usuario, password_hash) VALUES
('admin', '$2b$10$oGpie6mkUG1eLs16ltUXwejvoG8PbmN.3QU1qlUeHMl5AyDD6zMU.');
