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
-- Tabla: empresas_autorizadas
-- Códigos de empresa válidos para aceptar un registro (Etapa 4)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS empresas_autorizadas (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  id_empresa      VARCHAR(30)   NOT NULL UNIQUE,
  nombre_empresa  VARCHAR(100)  NOT NULL,
  activo          TINYINT(1)    NOT NULL DEFAULT 1,
  fecha_creacion  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO empresas_autorizadas (id_empresa, nombre_empresa, activo) VALUES
('UAPA-2026', 'UAPA - Equipo 7', 1),
('EMP-1001',  'Empresa Aliada 1', 1),
('EMP-1002',  'Empresa Aliada 2', 1),
('EMP-0000',  'Código de prueba desactivado', 0);

-- ------------------------------------------------------------
-- Tabla: registros
-- Almacena los datos enviados desde el formulario del dashboard.
-- Solo se crea un registro cuando el id_empresa es válido; los
-- intentos con un código inválido quedan en historial_accesos.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS registros (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(100)  NOT NULL,
  correo          VARCHAR(100)  NOT NULL,
  telefono        VARCHAR(20),
  departamento    ENUM('administracion', 'ventas', 'soporte', 'tecnologia'),
  comentario      TEXT,
  id_empresa      VARCHAR(30)   NOT NULL,
  fecha_registro  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_registros_empresa FOREIGN KEY (id_empresa)
    REFERENCES empresas_autorizadas (id_empresa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ------------------------------------------------------------
-- Datos de ejemplo
-- ------------------------------------------------------------
INSERT INTO registros (nombre, correo, telefono, departamento, comentario, id_empresa) VALUES
('María González',  'maria.gonzalez@correo.com',  '8095550001', 'administracion', 'Empleada del área administrativa', 'UAPA-2026'),
('Carlos Martínez', 'carlos.martinez@correo.com', '8095550002', 'ventas',          'Vendedor zona norte',              'UAPA-2026'),
('Ana Pérez',       'ana.perez@correo.com',       '8095550003', 'tecnologia',      'Desarrolladora frontend',          'EMP-1001'),
('Luis Santos',     'luis.santos@correo.com',     '8095550004', 'soporte',         'Técnico de soporte nivel 2',       'EMP-1001'),
('Sofía Díaz',      'sofia.diaz@correo.com',      '8095550005', 'administracion',  'Asistente administrativa',         'EMP-1002');

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

-- ------------------------------------------------------------
-- Tabla: historial_accesos
-- Bitácora de TODOS los intentos de registro desde el formulario
-- (aceptados y rechazados), para control de acceso (Etapa 4)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS historial_accesos (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(100)  NOT NULL,
  correo      VARCHAR(100)  NOT NULL,
  id_empresa  VARCHAR(30)   NOT NULL,
  resultado   ENUM('aceptado', 'rechazado') NOT NULL,
  motivo      VARCHAR(150),
  fecha       TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
