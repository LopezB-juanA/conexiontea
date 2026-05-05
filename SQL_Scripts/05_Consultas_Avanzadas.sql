-- ============================================
-- CONSULTA 13: JOIN AVANZADO (4 TABLAS)
-- Requisito: Consultas con más de 4 tablas
-- ============================================
SELECT 
    u.nombre AS usuario,
    u.email,
    c.frase_texto,
    c.fecha_hora,
    p.nivel_autonomia,
    pa.esquema_colores,
    cv.tipo_relacion
FROM usuarios u
INNER JOIN comunicaciones c ON u.id_usuario = c.id_usuario
INNER JOIN progreso p ON u.id_usuario = p.id_usuario
INNER JOIN perfiles_accesibilidad pa ON u.id_usuario = pa.id_usuario
LEFT JOIN cuidadores_vinculos cv ON u.id_usuario = cv.id_usuario_principal
WHERE u.estado = 'activo'
ORDER BY c.fecha_hora DESC
LIMIT 10;

-- ============================================
-- CONSULTA 14: CTE (COMMON TABLE EXPRESSION)
-- Requisito: Uso de WITH para consultas complejas
-- ============================================
WITH ComunicacionesPorUsuario AS (
    SELECT 
        id_usuario,
        COUNT(*) as total_comunicaciones,
        AVG(duracion_segundos) as duracion_promedio
    FROM comunicaciones
    GROUP BY id_usuario
),
UsuariosActivos AS (
    SELECT 
        u.id_usuario,
        u.nombre,
        u.rol,
        cpu.total_comunicaciones,
        cpu.duracion_promedio
    FROM usuarios u
    INNER JOIN ComunicacionesPorUsuario cpu ON u.id_usuario = cpu.id_usuario
    WHERE u.estado = 'activo'
)
SELECT * FROM UsuariosActivos
ORDER BY total_comunicaciones DESC;

-- ============================================
-- CONSULTA 15: EXPLAIN (OPTIMIZACIÓN)
-- Requisito: Mostrar antes/después de índices
-- ============================================

-- Ver plan de ejecución de consulta pesada
EXPLAIN SELECT 
    u.nombre,
    c.frase_texto,
    c.fecha_hora
FROM usuarios u
INNER JOIN comunicaciones c ON u.id_usuario = c.id_usuario
WHERE c.fecha_hora > '2026-01-01'
ORDER BY c.fecha_hora DESC;

-- Resultado esperado:
-- type: index o range (NO debe ser "ALL")
-- key: idx_usuario_fecha (debe usar el índice)
-- rows: menos de 100 (optimizado)

-- ============================================
-- CONSULTA 15: EXPLAIN (OPTIMIZACIÓN)
-- Requisito: Mostrar antes/después de índices
-- ============================================

-- Ver plan de ejecución de consulta pesada
EXPLAIN SELECT 
    u.nombre,
    c.frase_texto,
    c.fecha_hora
FROM usuarios u
INNER JOIN comunicaciones c ON u.id_usuario = c.id_usuario
WHERE c.fecha_hora > '2026-01-01'
ORDER BY c.fecha_hora DESC;

-- Resultado esperado:
-- type: index o range (NO debe ser "ALL")
-- key: idx_usuario_fecha (debe usar el índice)
-- rows: menos de 100 (optimizado)

-- ============================================
-- CONSULTA 16: TRANSACCIONALIDAD (COMMIT/ROLLBACK)
-- Requisito: Demostrar atomicidad ante fallos
-- ============================================

-- Ejemplo 1: Transacción exitosa (COMMIT)
START TRANSACTION;

INSERT INTO usuarios (email, password_hash, nombre, rol, estado)
VALUES ('test_transaccion@conexiontea.com', '$2a$10$hash...', 'Test Transacción', 'usuario_final', 'activo');

SET @nuevo_id = LAST_INSERT_ID();

INSERT INTO perfiles_accesibilidad (id_usuario, esquema_colores, tamaño_fuente)
VALUES (@nuevo_id, 'claro', 16);

INSERT INTO auditoria (id_usuario, tipo_evento, descripcion, resultado)
VALUES (@nuevo_id, 'registro', 'Usuario creado con transacción', 'exito');

COMMIT;

-- Ejemplo 2: Transacción con error (ROLLBACK)
START TRANSACTION;

INSERT INTO usuarios (email, password_hash, nombre, rol)
VALUES ('rollback_test@conexiontea.com', '$2a$10$hash...', 'Test Rollback', 'usuario_final');

-- Simular error (email duplicado si ya existe)
-- Si hay error, ejecutar:
ROLLBACK;

-- Verificar que no se creó
SELECT * FROM usuarios WHERE email = 'rollback_test@conexiontea.com';

-- ============================================
-- CONSULTA 17: VERIFICAR ROLES Y PERMISOS (DCL)
-- Requisito: 3 niveles de acceso (admin, app, auditor)
-- ============================================

-- Ver usuarios creados
SELECT user, host FROM mysql.user WHERE user LIKE '%conexiontea%';

-- Ver privilegios de cada usuario
SHOW GRANTS FOR 'admin_conexiontea'@'localhost';
SHOW GRANTS FOR 'app_conexiontea'@'localhost';
SHOW GRANTS FOR 'auditor_conexiontea'@'localhost';

-- Ver roles existentes
-- Ver todos los usuarios y roles creados
SELECT 
    user, 
    host, 
    account_locked,
    password_last_changed
FROM mysql.user 
WHERE user LIKE '%conexiontea%';

-- Prueba: Intentar DELETE con usuario app (debe fallar)
-- Conectar como app_conexiontea y ejecutar:
-- DELETE FROM usuarios WHERE id_usuario = 1;
-- Expected: ERROR 1142 (DELETE command denied)

-- ============================================
-- CONSULTA 18: SUBCONSULTA COMPLEJA
-- Requisito: Subconsultas anidadas
-- ============================================
SELECT 
    u.nombre,
    u.email,
    (SELECT COUNT(*) FROM comunicaciones c WHERE c.id_usuario = u.id_usuario) as total_comunicaciones,
    (SELECT MAX(fecha_hora) FROM comunicaciones c WHERE c.id_usuario = u.id_usuario) as ultima_comunicacion,
    (SELECT nivel_autonomia FROM progreso p WHERE p.id_usuario = u.id_usuario ORDER BY fecha_fin DESC LIMIT 1) as nivel_actual
FROM usuarios u
WHERE u.estado = 'activo'
HAVING total_comunicaciones > 0
ORDER BY total_comunicaciones DESC;