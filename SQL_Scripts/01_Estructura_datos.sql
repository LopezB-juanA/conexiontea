-- ============================================
-- CONEXIÓNTEA - BASE DE DATOS COMPLETA
-- Fase 1, 2 y 3 - Proyecto Base de Datos Avanzada
-- ============================================

-- Eliminar si existe
DROP DATABASE IF EXISTS conexiontea;

-- Crear base de datos
CREATE DATABASE conexiontea 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Usar base de datos
USE conexiontea;

-- ============================================
-- TABLA 1: USUARIOS
-- ============================================
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activo','inactivo','suspendido') DEFAULT 'activo',
    rol ENUM('usuario_final','cuidador','terapeuta','administrador') DEFAULT 'usuario_final',
    ultimo_acceso TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_rol (rol),
    INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA 2: COMUNICACIONES
-- ============================================
CREATE TABLE comunicaciones (
    id_comunicacion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    pictogramas_usados JSON,
    frase_texto TEXT,
    contexto VARCHAR(100),
    duracion_segundos INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_fecha (fecha_hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA 3: PICTOGRAMAS
-- ============================================
CREATE TABLE pictogramas (
    id_pictograma INT AUTO_INCREMENT PRIMARY KEY,
    codigo_arasaac VARCHAR(50) UNIQUE,
    categoria VARCHAR(50) NOT NULL,
    etiquetas TEXT,
    ruta_imagen VARCHAR(255) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    veces_usado INT DEFAULT 0,
    INDEX idx_categoria (categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA 4: PROGRESO
-- ============================================
CREATE TABLE progreso (
    id_progreso INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    total_comunicaciones INT DEFAULT 0,
    nivel_autonomia VARCHAR(50) DEFAULT 'inicial',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA 5: AUDITORIA
-- ============================================
CREATE TABLE auditoria (
    id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NULL,
    tipo_evento VARCHAR(50) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resultado ENUM('exito','fallo') DEFAULT 'exito',
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL,
    INDEX idx_fecha (fecha_hora),
    INDEX idx_tipo (tipo_evento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA 6: PERFILES_ACCESIBILIDAD
-- ============================================
CREATE TABLE perfiles_accesibilidad (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL UNIQUE,
    esquema_colores VARCHAR(50) DEFAULT 'claro',
    tamaño_fuente INT DEFAULT 16,
    nivel_contraste VARCHAR(20) DEFAULT 'normal',
    animaciones_activas BOOLEAN DEFAULT TRUE,
    sonidos_activos BOOLEAN DEFAULT TRUE,
    tiempo_espera_ms INT DEFAULT 3000,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA 7: FRASES_FRECUENTES
-- ============================================
CREATE TABLE frases_frecuentes (
    id_frase INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    nombre_frase VARCHAR(100) NOT NULL,
    pictogramas_secuencia JSON,
    texto_asociado TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    frecuencia_uso INT DEFAULT 0,
    ultima_utilizacion TIMESTAMP NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA 8: REPORTES_TERAPEUTA
-- ============================================
CREATE TABLE reportes_terapeuta (
    id_reporte INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_terapeuta INT NOT NULL,
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    metricas_incluidas JSON,
    observaciones TEXT,
    recomendaciones TEXT,
    ruta_pdf VARCHAR(255) NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_terapeuta) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    INDEX idx_usuario (id_usuario),
    INDEX idx_terapeuta (id_terapeuta)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA 9: CUIDADORES_VINCULOS
-- ============================================
CREATE TABLE cuidadores_vinculos (
    id_vinculo INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario_principal INT NOT NULL,
    id_usuario_cuidador INT NOT NULL,
    tipo_relacion VARCHAR(50) NOT NULL,
    permisos JSON,
    fecha_vinculacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('activo','inactivo') DEFAULT 'activo',
    FOREIGN KEY (id_usuario_principal) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_usuario_cuidador) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_principal (id_usuario_principal),
    INDEX idx_cuidador (id_usuario_cuidador)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA 10: SESIONES
-- ============================================
CREATE TABLE sesiones (
    id_sesion INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP NULL,
    duracion_segundos INT NULL,
    dispositivo VARCHAR(100) NULL,
    ip_address VARCHAR(45) NULL,
    acciones_realizadas INT DEFAULT 0,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_usuario (id_usuario),
    INDEX idx_fecha_inicio (fecha_inicio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA 11: TOKENS_RECUPERACION
-- ============================================
CREATE TABLE tokens_recuperacion (
    id_token INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    fecha_expiracion TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    INDEX idx_token (token_hash),
    INDEX idx_expiracion (fecha_expiracion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- DATOS DE PRUEBA - USUARIOS
-- ============================================
-- Contraseña: 123456 (hash bcrypt)
INSERT INTO usuarios (email, password_hash, nombre, rol, estado) VALUES
('demo@conexiontea.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Usuario Demo', 'usuario_final', 'activo'),
('cuidador@conexiontea.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Cuidador Demo', 'cuidador', 'activo'),
('terapeuta@conexiontea.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Terapeuta Demo', 'terapeuta', 'activo'),
('admin@conexiontea.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrador', 'administrador', 'activo');

-- ============================================
-- DATOS DE PRUEBA - PICTOGRAMAS
-- ============================================
INSERT INTO pictogramas (codigo_arasaac, categoria, etiquetas, ruta_imagen) VALUES
('ARA-001', 'emociones', 'feliz, alegria, sonriente', '/img/pictogramas/001.png'),
('ARA-002', 'emociones', 'triste, llorando', '/img/pictogramas/002.png'),
('ARA-003', 'acciones', 'comer, alimento, hambre', '/img/pictogramas/003.png'),
('ARA-004', 'acciones', 'beber, agua, sed', '/img/pictogramas/004.png'),
('ARA-005', 'personas', 'familia, madre, padre', '/img/pictogramas/005.png'),
('ARA-006', 'lugares', 'casa, hogar, dormitorio', '/img/pictogramas/006.png'),
('ARA-007', 'objetos', 'juguete, pelota, juego', '/img/pictogramas/007.png'),
('ARA-008', 'acciones', 'dormir, cama, descanso', '/img/pictogramas/008.png'),
('ARA-009', 'emociones', 'enojo, furia, molesto', '/img/pictogramas/009.png'),
('ARA-010', 'acciones', 'jugar, diversion', '/img/pictogramas/010.png');

-- ============================================
-- DATOS DE PRUEBA - COMUNICACIONES
-- ============================================
INSERT INTO comunicaciones (id_usuario, frase_texto, contexto, duracion_segundos) VALUES
(1, 'Tengo hambre', 'hogar', 30),
(1, 'Quiero jugar', 'escuela', 45),
(1, 'Estoy feliz', 'hogar', 20),
(2, 'Necesito ayuda', 'terapia', 60),
(1, 'Quiero dormir', 'hogar', 25);

-- ============================================
-- DATOS DE PRUEBA - PROGRESO
-- ============================================
INSERT INTO progreso (id_usuario, fecha_inicio, fecha_fin, total_comunicaciones, nivel_autonomia) VALUES
(1, '2026-01-01', '2026-01-31', 15, 'intermedio'),
(1, '2026-02-01', '2026-02-28', 25, 'avanzado'),
(2, '2026-01-01', '2026-01-31', 8, 'inicial');

-- ============================================
-- DATOS DE PRUEBA - PERFILES_ACCESIBILIDAD
-- ============================================
INSERT INTO perfiles_accesibilidad (id_usuario, esquema_colores, tamaño_fuente, nivel_contraste) VALUES
(1, 'claro', 18, 'alto'),
(2, 'oscuro', 20, 'muy-alto'),
(3, 'claro', 16, 'normal');

-- ============================================
-- DATOS DE PRUEBA - FRASES_FRECUENTES
-- ============================================
INSERT INTO frases_frecuentes (id_usuario, nombre_frase, texto_asociado, frecuencia_uso) VALUES
(1, 'Saludo', 'Hola, buenos días', 10),
(1, 'Necesidad', 'Tengo hambre', 25),
(2, 'Ayuda', 'Necesito ayuda por favor', 15);

-- ============================================
-- DATOS DE PRUEBA - CUIDADORES_VINCULOS
-- ============================================
INSERT INTO cuidadores_vinculos (id_usuario_principal, id_usuario_cuidador, tipo_relacion, permisos) VALUES
(1, 2, 'padre', '{"ver_progreso": true, "editar_configuracion": true}'),
(1, 3, 'terapeuta', '{"ver_progreso": true, "editar_configuracion": false}');

