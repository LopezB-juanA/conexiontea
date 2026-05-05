-- Consulta 1: Ver las 14 tablas creadas
SHOW TABLES;

-- Consulta 2: Ver los 5 usuarios registrados
SELECT id_usuario, email, nombre, rol, estado, ultimo_acceso 
FROM usuarios;

-- Consulta 3: Ver la auditoría de acciones
SELECT id_auditoria, tipo_evento, descripcion, fecha_hora, resultado 
FROM auditoria 
ORDER BY fecha_hora DESC 
LIMIT 10;

-- Consulta 4: Ver pictogramas disponibles
SELECT id_pictograma, categoria, etiquetas, veces_usado 
FROM pictogramas 
LIMIT 5;

-- Consulta 5: Ver progreso de usuarios
SELECT u.nombre, p.total_comunicaciones, p.nivel_autonomia, p.fecha_fin
FROM progreso p
INNER JOIN usuarios u ON p.id_usuario = u.id_usuario;