-- ============================================
-- VISTA 1: RESUMEN DE USUARIOS
-- ============================================
CREATE VIEW vw_resumen_usuarios AS
SELECT 
    u.id_usuario,
    u.nombre,
    u.email,
    u.rol,
    u.estado,
    COUNT(c.id_comunicacion) as total_comunicaciones,
    fn_calcular_nivel_autonomia(u.id_usuario) as nivel_autonomia,
    MAX(c.fecha_hora) as ultima_comunicacion
FROM usuarios u
LEFT JOIN comunicaciones c ON u.id_usuario = c.id_usuario
GROUP BY u.id_usuario;

-- ============================================
-- VISTA 2: ESTADÍSTICAS DIARIAS
-- ============================================
CREATE VIEW vw_estadisticas_diarias AS
SELECT 
    DATE(fecha_hora) as fecha,
    COUNT(*) as total_comunicaciones,
    COUNT(DISTINCT id_usuario) as usuarios_activos,
    AVG(duracion_segundos) as duracion_promedio
FROM comunicaciones
GROUP BY DATE(fecha_hora)
ORDER BY fecha DESC;

-- ============================================
-- VISTA 3: AUDITORÍA COMPLETA
-- ============================================
CREATE VIEW vw_auditoria_completa AS
SELECT 
    a.id_auditoria,
    u.nombre as usuario_nombre,
    u.email as usuario_email,
    a.tipo_evento,
    a.descripcion,
    a.fecha_hora,
    a.resultado
FROM auditoria a
LEFT JOIN usuarios u ON a.id_usuario = u.id_usuario
ORDER BY a.fecha_hora DESC;

-- ============================================
-- ÍNDICES COMPUESTOS PARA RENDIMIENTO
-- ============================================

-- Índice para consultas frecuentes de comunicaciones
CREATE INDEX idx_usuario_fecha ON comunicaciones(id_usuario, fecha_hora);

-- Índice para búsqueda de usuarios
CREATE INDEX idx_email_estado ON usuarios(email, estado);

-- Índice para pictogramas por categoría
CREATE INDEX idx_categoria_fecha ON pictogramas(categoria, fecha_creacion);

-- Índice para auditoría por fecha
CREATE INDEX idx_auditoria_fecha_tipo ON auditoria(fecha_hora, tipo_evento);

-- Índice para progreso
CREATE INDEX idx_progreso_fechas ON progreso(fecha_inicio, fecha_fin);

-- ============================================
-- VER ÍNDICES CREADOS
-- ============================================
SHOW INDEX FROM comunicaciones;
SHOW INDEX FROM usuarios;
SHOW INDEX FROM auditoria;

-- ============================================
-- CREACIÓN DE ROLES
-- ============================================

-- Rol 1: Administrador de Base de Datos
CREATE ROLE IF NOT EXISTS 'admin_db';
GRANT ALL PRIVILEGES ON conexiontea.* TO 'admin_db';

-- Rol 2: Usuario de Aplicación (backend)
CREATE ROLE IF NOT EXISTS 'usuario_app';
GRANT SELECT, INSERT, UPDATE ON conexiontea.usuarios TO 'usuario_app';
GRANT SELECT, INSERT ON conexiontea.comunicaciones TO 'usuario_app';
GRANT SELECT ON conexiontea.pictogramas TO 'usuario_app';
GRANT SELECT, INSERT, UPDATE ON conexiontea.progreso TO 'usuario_app';
GRANT SELECT, INSERT ON conexiontea.perfiles_accesibilidad TO 'usuario_app';
GRANT SELECT ON conexiontea.frases_frecuentes TO 'usuario_app';
-- NO se concede DELETE ni acceso a auditoría

-- Rol 3: Auditor/Consultor (solo lectura)
CREATE ROLE IF NOT EXISTS 'auditor_consulta';
GRANT SELECT ON conexiontea.usuarios TO 'auditor_consulta';
GRANT SELECT ON conexiontea.comunicaciones TO 'auditor_consulta';
GRANT SELECT ON conexiontea.progreso TO 'auditor_consulta';
GRANT SELECT ON conexiontea.auditoria TO 'auditor_consulta';
GRANT SELECT ON conexiontea.reportes_terapeuta TO 'auditor_consulta';
GRANT SELECT ON conexiontea.vw_resumen_usuarios TO 'auditor_consulta';
GRANT SELECT ON conexiontea.vw_estadisticas_diarias TO 'auditor_consulta';

-- ============================================
-- CREACIÓN DE USUARIOS
-- ============================================

-- Usuario Administrador
CREATE USER IF NOT EXISTS 'admin_conexiontea'@'localhost' 
IDENTIFIED BY 'Admin#2026$Segura!';
GRANT 'admin_db' TO 'admin_conexiontea'@'localhost';

-- Usuario Aplicación (para backend Node.js)
CREATE USER IF NOT EXISTS 'app_conexiontea'@'localhost' 
IDENTIFIED BY 'App#2026$Conexion!';
GRANT 'usuario_app' TO 'app_conexiontea'@'localhost';

-- Usuario Auditor (para terapeutas/reportes)
CREATE USER IF NOT EXISTS 'auditor_conexiontea'@'localhost' 
IDENTIFIED BY 'Audit#2026$Reporte!';
GRANT 'auditor_consulta' TO 'auditor_conexiontea'@'localhost';

-- ============================================
-- APLICAR PRIVILEGIOS
-- ============================================
FLUSH PRIVILEGES;

-- ============================================
-- VERIFICAR PRIVILEGIOS
-- ============================================
SHOW GRANTS FOR 'admin_conexiontea'@'localhost';
SHOW GRANTS FOR 'app_conexiontea'@'localhost';
SHOW GRANTS FOR 'auditor_conexiontea'@'localhost';
