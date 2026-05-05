-- ============================================
-- CONSULTA 1: Ver todos los usuarios
-- ============================================
SELECT * FROM vw_resumen_usuarios;

-- ============================================
-- CONSULTA 2: Estadísticas diarias
-- ============================================
SELECT * FROM vw_estadisticas_diarias;

-- ============================================
-- CONSULTA 3: Auditoría completa
-- ============================================
SELECT * FROM vw_auditoria_completa LIMIT 20;

-- ============================================
-- CONSULTA 4: Probar procedimiento almacenado
-- ============================================
CALL sp_registrar_comunicacion(1, 'Estoy feliz hoy', 'hogar', 30, @id);
SELECT @id as nueva_comunicacion_id;

-- ============================================
-- CONSULTA 5: Probar función
-- ============================================
SELECT 
    id_usuario,
    nombre,
    fn_calcular_nivel_autonomia(id_usuario) as nivel_calculado
FROM usuarios;

-- ============================================
-- CONSULTA 6: Actualizar progreso semanal
-- ============================================
CALL sp_actualizar_progreso_semanal(1, '2026-01-01', '2026-01-31');

-- ============================================
-- CONSULTA 7: Generar reporte
-- ============================================
CALL sp_generar_reporte_terapeuta(1, 3);

-- ============================================
-- CONSULTA 8: Ver tablas creadas
-- ============================================
SHOW TABLES;

-- ============================================
-- CONSULTA 9: Ver triggers
-- ============================================
SHOW TRIGGERS;

-- ============================================
-- CONSULTA 10: Ver procedures
-- ============================================
SHOW PROCEDURE STATUS WHERE Db = 'conexiontea';

-- ============================================
-- CONSULTA 11: Ver funciones
-- ============================================
SHOW FUNCTION STATUS WHERE Db = 'conexiontea';

-- ============================================
-- CONSULTA 12: Contar registros
-- ============================================
SELECT 'usuarios' as tabla, COUNT(*) as total FROM usuarios
UNION ALL
SELECT 'comunicaciones', COUNT(*) FROM comunicaciones
UNION ALL
SELECT 'pictogramas', COUNT(*) FROM pictogramas
UNION ALL
SELECT 'progreso', COUNT(*) FROM progreso
UNION ALL
SELECT 'auditoria', COUNT(*) FROM auditoria;