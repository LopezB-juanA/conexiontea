-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost:3308:localhost:3308
-- Tiempo de generación: 05-10-2026 a las 04:53:11
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `conexiontea`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `auditoria`
--

CREATE TABLE `auditoria` (
  `id_auditoria` int(11) NOT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `tipo_evento` varchar(50) NOT NULL,
  `descripcion` text NOT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp(),
  `resultado` enum('exito','fallo') DEFAULT 'exito'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comunicaciones`
--

CREATE TABLE `comunicaciones` (
  `id_comunicacion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_hora` timestamp NOT NULL DEFAULT current_timestamp(),
  `pictogramas_usados` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`pictogramas_usados`)),
  `frase_texto` text DEFAULT NULL,
  `contexto` varchar(100) DEFAULT NULL,
  `duracion_segundos` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `comunicaciones`
--

INSERT INTO `comunicaciones` (`id_comunicacion`, `id_usuario`, `fecha_hora`, `pictogramas_usados`, `frase_texto`, `contexto`, `duracion_segundos`) VALUES
(1, 1, '2026-10-04 17:18:09', NULL, 'Tengo hambre', 'hogar', 30),
(2, 1, '2026-10-04 17:18:09', NULL, 'Quiero jugar', 'escuela', 45),
(3, 1, '2026-10-04 17:18:09', NULL, 'Estoy feliz', 'hogar', 20),
(4, 2, '2026-10-04 17:18:09', NULL, 'Necesito ayuda', 'terapia', 60),
(5, 1, '2026-10-04 17:18:09', NULL, 'Quiero dormir', 'hogar', 25),
(6, 1, '2026-10-05 00:24:43', '[\"Triste\",\"Casa\",\"Dormir\"]', 'Triste Casa Dormir', NULL, NULL),
(7, 1, '2026-10-05 00:25:10', '[\"Feliz\"]', 'Feliz', NULL, NULL),
(8, 1, '2026-10-05 01:01:21', '[\"Triste\",\"Casa\",\"Dormir\"]', 'Triste Casa Dormir', NULL, NULL),
(9, 5, '2026-10-05 02:11:26', '[\"Triste\",\"Casa\",\"Dormir\"]', 'Triste Casa Dormir', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuidadores_vinculos`
--

CREATE TABLE `cuidadores_vinculos` (
  `id_vinculo` int(11) NOT NULL,
  `id_usuario_principal` int(11) NOT NULL,
  `id_usuario_cuidador` int(11) NOT NULL,
  `tipo_relacion` varchar(50) NOT NULL,
  `permisos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`permisos`)),
  `fecha_vinculacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('activo','inactivo') DEFAULT 'activo'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cuidadores_vinculos`
--

INSERT INTO `cuidadores_vinculos` (`id_vinculo`, `id_usuario_principal`, `id_usuario_cuidador`, `tipo_relacion`, `permisos`, `fecha_vinculacion`, `estado`) VALUES
(1, 1, 2, 'padre', '{\"ver_progreso\": true, \"editar_configuracion\": true}', '2026-10-04 17:18:09', 'activo'),
(2, 1, 3, 'terapeuta', '{\"ver_progreso\": true, \"editar_configuracion\": false}', '2026-10-04 17:18:09', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `frases_frecuentes`
--

CREATE TABLE `frases_frecuentes` (
  `id_frase` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre_frase` varchar(100) NOT NULL,
  `pictogramas_secuencia` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`pictogramas_secuencia`)),
  `texto_asociado` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `frecuencia_uso` int(11) DEFAULT 0,
  `ultima_utilizacion` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `frases_frecuentes`
--

INSERT INTO `frases_frecuentes` (`id_frase`, `id_usuario`, `nombre_frase`, `pictogramas_secuencia`, `texto_asociado`, `fecha_creacion`, `frecuencia_uso`, `ultima_utilizacion`) VALUES
(1, 1, 'Saludo', NULL, 'Hola, buenos días', '2026-10-04 17:18:09', 10, NULL),
(2, 1, 'Necesidad', NULL, 'Tengo hambre', '2026-10-04 17:18:09', 25, NULL),
(3, 2, 'Ayuda', NULL, 'Necesito ayuda por favor', '2026-10-04 17:18:09', 15, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfiles_accesibilidad`
--

CREATE TABLE `perfiles_accesibilidad` (
  `id_perfil` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `esquema_colores` varchar(50) DEFAULT 'claro',
  `tamaño_fuente` int(11) DEFAULT 16,
  `nivel_contraste` varchar(20) DEFAULT 'normal',
  `animaciones_activas` tinyint(1) DEFAULT 1,
  `sonidos_activos` tinyint(1) DEFAULT 1,
  `tiempo_espera_ms` int(11) DEFAULT 3000,
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `perfiles_accesibilidad`
--

INSERT INTO `perfiles_accesibilidad` (`id_perfil`, `id_usuario`, `esquema_colores`, `tamaño_fuente`, `nivel_contraste`, `animaciones_activas`, `sonidos_activos`, `tiempo_espera_ms`, `fecha_actualizacion`) VALUES
(1, 1, 'claro', 18, 'alto', 1, 1, 3000, '2026-10-04 17:18:09'),
(2, 2, 'oscuro', 20, 'muy-alto', 1, 1, 3000, '2026-10-04 17:18:09'),
(3, 3, 'claro', 16, 'normal', 1, 1, 3000, '2026-10-04 17:18:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pictogramas`
--

CREATE TABLE `pictogramas` (
  `id_pictograma` int(11) NOT NULL,
  `codigo_arasaac` varchar(50) DEFAULT NULL,
  `categoria` varchar(50) NOT NULL,
  `etiquetas` text DEFAULT NULL,
  `ruta_imagen` varchar(255) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `veces_usado` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pictogramas`
--

INSERT INTO `pictogramas` (`id_pictograma`, `codigo_arasaac`, `categoria`, `etiquetas`, `ruta_imagen`, `fecha_creacion`, `veces_usado`) VALUES
(1, 'ARA-001', 'emociones', 'feliz, alegria, sonriente', '/img/pictogramas/001.png', '2026-10-04 17:18:09', 0),
(2, 'ARA-002', 'emociones', 'triste, llorando', '/img/pictogramas/002.png', '2026-10-04 17:18:09', 0),
(3, 'ARA-003', 'acciones', 'comer, alimento, hambre', '/img/pictogramas/003.png', '2026-10-04 17:18:09', 0),
(4, 'ARA-004', 'acciones', 'beber, agua, sed', '/img/pictogramas/004.png', '2026-10-04 17:18:09', 0),
(5, 'ARA-005', 'personas', 'familia, madre, padre', '/img/pictogramas/005.png', '2026-10-04 17:18:09', 0),
(6, 'ARA-006', 'lugares', 'casa, hogar, dormitorio', '/img/pictogramas/006.png', '2026-10-04 17:18:09', 0),
(7, 'ARA-007', 'objetos', 'juguete, pelota, juego', '/img/pictogramas/007.png', '2026-10-04 17:18:09', 0),
(8, 'ARA-008', 'acciones', 'dormir, cama, descanso', '/img/pictogramas/008.png', '2026-10-04 17:18:09', 0),
(9, 'ARA-009', 'emociones', 'enojo, furia, molesto', '/img/pictogramas/009.png', '2026-10-04 17:18:09', 0),
(10, 'ARA-010', 'acciones', 'jugar, diversion', '/img/pictogramas/010.png', '2026-10-04 17:18:09', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `progreso`
--

CREATE TABLE `progreso` (
  `id_progreso` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_fin` date NOT NULL,
  `total_comunicaciones` int(11) DEFAULT 0,
  `nivel_autonomia` varchar(50) DEFAULT 'inicial'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `progreso`
--

INSERT INTO `progreso` (`id_progreso`, `id_usuario`, `fecha_inicio`, `fecha_fin`, `total_comunicaciones`, `nivel_autonomia`) VALUES
(1, 1, '2026-01-01', '2026-01-31', 15, 'intermedio'),
(2, 1, '2026-02-01', '2026-02-28', 25, 'avanzado'),
(3, 2, '2026-01-01', '2026-01-31', 8, 'inicial');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reportes_terapeuta`
--

CREATE TABLE `reportes_terapeuta` (
  `id_reporte` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_terapeuta` int(11) NOT NULL,
  `fecha_generacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `metricas_incluidas` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metricas_incluidas`)),
  `observaciones` text DEFAULT NULL,
  `recomendaciones` text DEFAULT NULL,
  `ruta_pdf` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sesiones`
--

CREATE TABLE `sesiones` (
  `id_sesion` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha_inicio` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_fin` timestamp NULL DEFAULT NULL,
  `duracion_segundos` int(11) DEFAULT NULL,
  `dispositivo` varchar(100) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `acciones_realizadas` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tokens_recuperacion`
--

CREATE TABLE `tokens_recuperacion` (
  `id_token` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `token_hash` varchar(255) NOT NULL,
  `fecha_expiracion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `usado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('activo','inactivo','suspendido') DEFAULT 'activo',
  `rol` enum('usuario_final','cuidador','terapeuta','administrador') DEFAULT 'usuario_final',
  `ultimo_acceso` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `email`, `password_hash`, `nombre`, `fecha_registro`, `estado`, `rol`, `ultimo_acceso`) VALUES
(1, 'demo@conexiontea.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Usuario Demo', '2026-10-04 17:18:09', 'activo', 'usuario_final', NULL),
(2, 'cuidador@conexiontea.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Cuidador Demo', '2026-10-04 17:18:09', 'activo', 'cuidador', NULL),
(3, 'terapeuta@conexiontea.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Terapeuta Demo', '2026-10-04 17:18:09', 'activo', 'terapeuta', NULL),
(4, 'admin@conexiontea.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Administrador', '2026-10-04 17:18:09', 'activo', 'administrador', NULL),
(5, 'prueba@conexiontea.com', '$2b$10$ySPUxjUej7GrtL5VZIVYyeR0Ku5xtQ2oOKGUpqsEZm0qD6py445O6', 'Prueba', '2026-10-05 01:33:08', 'activo', 'usuario_final', NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD PRIMARY KEY (`id_auditoria`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `idx_fecha` (`fecha_hora`),
  ADD KEY `idx_tipo` (`tipo_evento`);

--
-- Indices de la tabla `comunicaciones`
--
ALTER TABLE `comunicaciones`
  ADD PRIMARY KEY (`id_comunicacion`),
  ADD KEY `idx_usuario` (`id_usuario`),
  ADD KEY `idx_fecha` (`fecha_hora`);

--
-- Indices de la tabla `cuidadores_vinculos`
--
ALTER TABLE `cuidadores_vinculos`
  ADD PRIMARY KEY (`id_vinculo`),
  ADD KEY `idx_principal` (`id_usuario_principal`),
  ADD KEY `idx_cuidador` (`id_usuario_cuidador`);

--
-- Indices de la tabla `frases_frecuentes`
--
ALTER TABLE `frases_frecuentes`
  ADD PRIMARY KEY (`id_frase`),
  ADD KEY `idx_usuario` (`id_usuario`);

--
-- Indices de la tabla `perfiles_accesibilidad`
--
ALTER TABLE `perfiles_accesibilidad`
  ADD PRIMARY KEY (`id_perfil`),
  ADD UNIQUE KEY `id_usuario` (`id_usuario`),
  ADD KEY `idx_usuario` (`id_usuario`);

--
-- Indices de la tabla `pictogramas`
--
ALTER TABLE `pictogramas`
  ADD PRIMARY KEY (`id_pictograma`),
  ADD UNIQUE KEY `codigo_arasaac` (`codigo_arasaac`),
  ADD KEY `idx_categoria` (`categoria`);

--
-- Indices de la tabla `progreso`
--
ALTER TABLE `progreso`
  ADD PRIMARY KEY (`id_progreso`),
  ADD KEY `idx_usuario` (`id_usuario`);

--
-- Indices de la tabla `reportes_terapeuta`
--
ALTER TABLE `reportes_terapeuta`
  ADD PRIMARY KEY (`id_reporte`),
  ADD KEY `idx_usuario` (`id_usuario`),
  ADD KEY `idx_terapeuta` (`id_terapeuta`);

--
-- Indices de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  ADD PRIMARY KEY (`id_sesion`),
  ADD KEY `idx_usuario` (`id_usuario`),
  ADD KEY `idx_fecha_inicio` (`fecha_inicio`);

--
-- Indices de la tabla `tokens_recuperacion`
--
ALTER TABLE `tokens_recuperacion`
  ADD PRIMARY KEY (`id_token`),
  ADD UNIQUE KEY `token_hash` (`token_hash`),
  ADD KEY `id_usuario` (`id_usuario`),
  ADD KEY `idx_token` (`token_hash`),
  ADD KEY `idx_expiracion` (`fecha_expiracion`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_email` (`email`),
  ADD KEY `idx_rol` (`rol`),
  ADD KEY `idx_estado` (`estado`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `auditoria`
--
ALTER TABLE `auditoria`
  MODIFY `id_auditoria` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comunicaciones`
--
ALTER TABLE `comunicaciones`
  MODIFY `id_comunicacion` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `cuidadores_vinculos`
--
ALTER TABLE `cuidadores_vinculos`
  MODIFY `id_vinculo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `frases_frecuentes`
--
ALTER TABLE `frases_frecuentes`
  MODIFY `id_frase` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `perfiles_accesibilidad`
--
ALTER TABLE `perfiles_accesibilidad`
  MODIFY `id_perfil` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `pictogramas`
--
ALTER TABLE `pictogramas`
  MODIFY `id_pictograma` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `progreso`
--
ALTER TABLE `progreso`
  MODIFY `id_progreso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `reportes_terapeuta`
--
ALTER TABLE `reportes_terapeuta`
  MODIFY `id_reporte` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `sesiones`
--
ALTER TABLE `sesiones`
  MODIFY `id_sesion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tokens_recuperacion`
--
ALTER TABLE `tokens_recuperacion`
  MODIFY `id_token` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `auditoria`
--
ALTER TABLE `auditoria`
  ADD CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE SET NULL;

--
-- Filtros para la tabla `comunicaciones`
--
ALTER TABLE `comunicaciones`
  ADD CONSTRAINT `comunicaciones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cuidadores_vinculos`
--
ALTER TABLE `cuidadores_vinculos`
  ADD CONSTRAINT `cuidadores_vinculos_ibfk_1` FOREIGN KEY (`id_usuario_principal`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `cuidadores_vinculos_ibfk_2` FOREIGN KEY (`id_usuario_cuidador`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `frases_frecuentes`
--
ALTER TABLE `frases_frecuentes`
  ADD CONSTRAINT `frases_frecuentes_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `perfiles_accesibilidad`
--
ALTER TABLE `perfiles_accesibilidad`
  ADD CONSTRAINT `perfiles_accesibilidad_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `progreso`
--
ALTER TABLE `progreso`
  ADD CONSTRAINT `progreso_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `reportes_terapeuta`
--
ALTER TABLE `reportes_terapeuta`
  ADD CONSTRAINT `reportes_terapeuta_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE,
  ADD CONSTRAINT `reportes_terapeuta_ibfk_2` FOREIGN KEY (`id_terapeuta`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `sesiones`
--
ALTER TABLE `sesiones`
  ADD CONSTRAINT `sesiones_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;

--
-- Filtros para la tabla `tokens_recuperacion`
--
ALTER TABLE `tokens_recuperacion`
  ADD CONSTRAINT `tokens_recuperacion_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id_usuario`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
