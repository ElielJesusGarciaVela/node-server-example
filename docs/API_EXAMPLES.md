# Ejemplos de uso de la API

## Preparar el entorno

Desde la raíz del proyecto, crea la configuración local, inicia PostgreSQL, aplica las migraciones y crea el usuario de prueba con ID `1`:

```bash
npm install
cp .env.example .env
docker compose up -d
npm run db:setup
npm run dev
```

Deja `npm run dev` ejecutándose en esa terminal. En otra terminal, ejecuta los ejemplos siguientes. `db:setup` se puede repetir sin duplicar el usuario de prueba.

## Endpoints disponibles

### Health Check
```bash
curl http://localhost:3000/health
```

Respuesta:
```json
{"ok": true}
```

---

## Users

### Listar usuarios
```bash
curl http://localhost:3000/api/users
```

### Obtener usuario por ID
```bash
curl http://localhost:3000/api/users/1
```

### Actualizar usuario
```bash
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Nuevo Nombre","email":"nuevo@email.com"}'
```

### Eliminar usuario
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

---

## Tasks

Las tareas pertenecen a un usuario. Al eliminar un usuario, PostgreSQL elimina también sus tareas.

### Crear una tarea
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Comprar pan","description":"Pan integral","userId":1}'
```

En una base de datos recién creada, la primera tarea recibe el ID `1`, usado en los ejemplos siguientes. Si la base ya se utilizó, usa el `id` que devuelve el `POST` en las rutas siguientes.

### Listar tareas
```bash
curl http://localhost:3000/api/tasks
```

### Obtener una tarea
```bash
curl http://localhost:3000/api/tasks/1
```

### Actualizar una tarea
```bash
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"done":true}'
```

### Eliminar una tarea
```bash
curl -X DELETE http://localhost:3000/api/tasks/1
```

### Comprobar respuestas de error

```bash
# 400: falta el título (validación Zod)
curl -i -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"userId":1}'

# 400: título de menos de 3 caracteres (validación Zod)
curl -i -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"ab","userId":1}'

# 400: userId inexistente (clave foránea)
curl -i -X POST http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Comprar pan","userId":999}'

# 404: tarea inexistente
curl -i -X PATCH http://localhost:3000/api/tasks/9999 \
  -H 'Content-Type: application/json' \
  -d '{"done":true}'

# 400: ID no numérico
curl -i http://localhost:3000/api/tasks/abc
```

---

## Validación con Zod

La API valida automáticamente los datos de entrada usando Zod.

### Ejemplo de validación fallida

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid","name":"A"}'
```

**Response (400):**
```json
{
  "errors": {
    "formErrors": [],
    "fieldErrors": {
      "name": ["El nombre debe tener al menos 2 caracteres"],
      "email": ["Email inválido"]
    }
  }
}
```

### Ejemplo de validación exitosa

**Request:**
```bash
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Pérez"}'
```

**Response (200):**
```json
{
  "id": 1,
  "email": "usuario@example.com",
  "name": "Juan Pérez",
  "createdAt": "2024-11-04T11:30:00.000Z"
}
```

---

## Manejo de errores

### Usuario no encontrado (404)
```bash
curl http://localhost:3000/api/users/999
```

**Response:**
```json
{
  "message": "Usuario no encontrado"
}
```

### Email duplicado (409)
```bash
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"email":"email@existente.com"}'
```

**Response:**
```json
{
  "message": "El email ya está en uso"
}
```

---

## Próximamente

En versiones futuras se añadirán:
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Login con JWT
- `GET /api/users/me` - Perfil del usuario autenticado
- Rutas protegidas con JWT
