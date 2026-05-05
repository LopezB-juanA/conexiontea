-- ============================================
-- TRIGGER 1: AUDITORÍA DE LOGIN
-- ============================================
DELIMITER $$
CREATE TRIGGER trg_auditoria_login
AFTER UPDATE ON usuarios
FOR EACH ROW
BEGIN
    IF NEW.ultimo_acceso != OLD.ultimo_acceso THEN
        INSERT INTO auditoria (id_usuario, tipo_evento, descripcion, resultado)
        VALUES (NEW.id_usuario, 'login', CONCAT('Inicio de sesión - IP: ', IFNULL(@user_ip, 'localhost')), 'exito');
    END IF;
END$$
DELIMITER ;

-- ============================================
-- TRIGGER 2: AUDITORÍA DE COMUNICACIÓN
-- ============================================
DELIMITER $$
CREATE TRIGGER trg_auditoria_comunicacion
AFTER INSERT ON comunicaciones
FOR EACH ROW
BEGIN
    INSERT INTO auditoria (id_usuario, tipo_evento, descripcion, resultado)
    VALUES (NEW.id_usuario, 'comunicacion', CONCAT('Comunicación registrada: ', IFNULL(NEW.frase_texto, 'Sin texto')), 'exito');
END$$
DELIMITER ;

-- ============================================
-- TRIGGER 3: VALIDAR ESTADO DE USUARIO
-- ============================================
DELIMITER $$
CREATE TRIGGER trg_validar_estado_usuario
BEFORE INSERT ON sesiones
FOR EACH ROW
BEGIN
    DECLARE estado_usuario VARCHAR(20);
    SELECT estado INTO estado_usuario FROM usuarios WHERE id_usuario = NEW.id_usuario;
    IF estado_usuario != 'activo' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Usuario inactivo no puede iniciar sesión';
    END IF;
END$$
DELIMITER ;

-- ============================================
-- TRIGGER 4: ACTUALIZAR CONTADOR DE PICTOGRAMAS
-- ============================================
DELIMITER $$
CREATE TRIGGER trg_actualizar_veces_usado
AFTER INSERT ON comunicaciones
FOR EACH ROW
BEGIN
    -- Actualizar contador (lógica simplificada)
    UPDATE pictogramas 
    SET veces_usado = veces_usado + 1 
    WHERE id_pictograma IN (
        SELECT id FROM (
            SELECT id_pictograma as id FROM pictogramas WHERE categoria = 'emociones'
        ) as temp
    );
END$$
DELIMITER ;

-- ============================================
-- PROCEDURE 1: REGISTRAR COMUNICACIÓN
-- ============================================
DELIMITER $$
CREATE PROCEDURE sp_registrar_comunicacion(
    IN p_id_usuario INT,
    IN p_frase_texto TEXT,
    IN p_contexto VARCHAR(100),
    IN p_duracion INT,
    OUT p_id_comunicacion INT
)
BEGIN
    INSERT INTO comunicaciones (id_usuario, frase_texto, contexto, duracion_segundos)
    VALUES (p_id_usuario, p_frase_texto, p_contexto, p_duracion);
    
    SET p_id_comunicacion = LAST_INSERT_ID();
    
    -- Actualizar progreso
    UPDATE progreso 
    SET total_comunicaciones = total_comunicaciones + 1
    WHERE id_usuario = p_id_usuario
    AND fecha_fin >= CURDATE();
END$$
DELIMITER ;

-- ============================================
-- PROCEDURE 2: ACTUALIZAR PROGRESO SEMANAL
-- ============================================
DELIMITER $$
CREATE PROCEDURE sp_actualizar_progreso_semanal(
    IN p_id_usuario INT,
    IN p_fecha_inicio DATE,
    IN p_fecha_fin DATE
)
BEGIN
    DECLARE total_comunicaciones INT;
    DECLARE nivel VARCHAR(50);
    
    -- Contar comunicaciones
    SELECT COUNT(*) INTO total_comunicaciones 
    FROM comunicaciones 
    WHERE id_usuario = p_id_usuario 
    AND fecha_hora BETWEEN p_fecha_inicio AND p_fecha_fin;
    
    -- Determinar nivel
    IF total_comunicaciones < 10 THEN 
        SET nivel = 'inicial';
    ELSEIF total_comunicaciones < 50 THEN 
        SET nivel = 'intermedio';
    ELSE 
        SET nivel = 'avanzado';
    END IF;
    
    -- Insertar o actualizar
    INSERT INTO progreso (id_usuario, fecha_inicio, fecha_fin, total_comunicaciones, nivel_autonomia)
    VALUES (p_id_usuario, p_fecha_inicio, p_fecha_fin, total_comunicaciones, nivel)
    ON DUPLICATE KEY UPDATE 
        total_comunicaciones = total_comunicaciones,
        nivel_autonomia = nivel;
END$$
DELIMITER ;

-- ============================================
-- PROCEDURE 3: GENERAR REPORTE TERAPEUTA
-- ============================================
DELIMITER $$
CREATE PROCEDURE sp_generar_reporte_terapeuta(
    IN p_id_usuario INT,
    IN p_id_terapeuta INT
)
BEGIN
    DECLARE total_comunicaciones INT;
    DECLARE nivel_autonomia VARCHAR(50);
    DECLARE ultima_comunicacion TIMESTAMP;
    
    -- Obtener métricas
    SELECT COUNT(*) INTO total_comunicaciones 
    FROM comunicaciones 
    WHERE id_usuario = p_id_usuario;
    
    SELECT MAX(fecha_hora) INTO ultima_comunicacion
    FROM comunicaciones
    WHERE id_usuario = p_id_usuario;
    
    -- Calcular nivel
    SET nivel_autonomia = (SELECT fn_calcular_nivel_autonomia(p_id_usuario));
    
    -- Insertar reporte
    INSERT INTO reportes_terapeuta (id_usuario, id_terapeuta, metricas_incluidas, observaciones)
    VALUES (
        p_id_usuario, 
        p_id_terapeuta, 
        JSON_OBJECT(
            'total_comunicaciones', total_comunicaciones,
            'nivel_autonomia', nivel_autonomia,
            'ultima_actividad', ultima_comunicacion
        ),
        CONCAT('Reporte generado automáticamente - Nivel: ', nivel_autonomia)
    );
    
    SELECT 'Reporte generado exitosamente' as mensaje;
END$$
DELIMITER ;

-- ============================================
-- PROCEDURE 4: LIMPIAR SESIONES ANTIGUAS
-- ============================================
DELIMITER $$
CREATE PROCEDURE sp_limpiar_sesiones_antiguas(
    IN p_dias INT
)
BEGIN
    DECLARE filas_eliminadas INT;
    
    UPDATE sesiones 
    SET fecha_fin = NOW(),
        duracion_segundos = TIMESTAMPDIFF(SECOND, fecha_inicio, NOW())
    WHERE fecha_fin IS NULL
    AND fecha_inicio < DATE_SUB(NOW(), INTERVAL p_dias DAY);
    
    SET filas_eliminadas = ROW_COUNT();
    
    INSERT INTO auditoria (tipo_evento, descripcion, resultado)
    VALUES ('mantenimiento', CONCAT('Sesiones antiguas cerradas: ', filas_eliminadas), 'exito');
    
    SELECT filas_eliminadas as sesiones_cerradas;
END$$
DELIMITER ;

-- ============================================
-- FUNCIÓN 1: CALCULAR NIVEL DE AUTONOMÍA
-- ============================================
DELIMITER $$
CREATE FUNCTION fn_calcular_nivel_autonomia(p_id_usuario INT)
RETURNS VARCHAR(50)
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE nivel VARCHAR(50);
    DECLARE total INT;
    
    SELECT COUNT(*) INTO total 
    FROM comunicaciones 
    WHERE id_usuario = p_id_usuario;
    
    IF total < 10 THEN 
        SET nivel = 'inicial';
    ELSEIF total < 50 THEN 
        SET nivel = 'intermedio';
    ELSE 
        SET nivel = 'avanzado';
    END IF;
    
    RETURN nivel;
END$$
DELIMITER ;

-- ============================================
-- FUNCIÓN 2: VALIDAR ESTADO DE USUARIO
-- ============================================
DELIMITER $$
CREATE FUNCTION fn_validar_estado_usuario(p_id_usuario INT)
RETURNS BOOLEAN
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE estado_usuario VARCHAR(20);
    
    SELECT estado INTO estado_usuario 
    FROM usuarios 
    WHERE id_usuario = p_id_usuario;
    
    RETURN estado_usuario = 'activo';
END$$
DELIMITER ;

-- ============================================
-- FUNCIÓN 3: CALCULAR DURACIÓN DE SESIÓN
-- ============================================
DELIMITER $$
CREATE FUNCTION fn_calcular_duracion_sesion(p_id_sesion INT)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE duracion INT;
    DECLARE fecha_ini TIMESTAMP;
    DECLARE fecha_fin TIMESTAMP;
    
    SELECT fecha_inicio, fecha_fin INTO fecha_ini, fecha_fin
    FROM sesiones
    WHERE id_sesion = p_id_sesion;
    
    IF fecha_fin IS NOT NULL THEN
        SET duracion = TIMESTAMPDIFF(SECOND, fecha_ini, fecha_fin);
    ELSE
        SET duracion = TIMESTAMPDIFF(SECOND, fecha_ini, NOW());
    END IF;
    
    RETURN duracion;
END$$
DELIMITER ;

-- ============================================
-- FUNCIÓN 4: CONTAR COMUNICACIONES DEL DÍA
-- ============================================
DELIMITER $$
CREATE FUNCTION fn_contar_comunicaciones_dia(
    p_id_usuario INT,
    p_fecha DATE
)
RETURNS INT
DETERMINISTIC
READS SQL DATA
BEGIN
    DECLARE total INT;
    
    SELECT COUNT(*) INTO total
    FROM comunicaciones
    WHERE id_usuario = p_id_usuario
    AND DATE(fecha_hora) = p_fecha;
    
    RETURN total;
END$$
DELIMITER ;