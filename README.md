# be3-testing-docker

API REST de Tienda de Productos con autenticación JWT, tests funcionales exhaustivos e imagen Docker optimizada.  
**Backend III: Testing y Escalabilidad** 

---

## Stack

- **Node.js 20+** + **Express 5**
- **JWT** (jsonwebtoken) + **bcryptjs**
- **express-validator** para validaciones
- **Winston** para logging con niveles personalizados
- **Swagger UI** para documentación interactiva
- **Mocha** + **Chai** + **Supertest** para testing
- **Docker** (imagen `node:20-alpine`)

---

## Estructura del proyecto

```
be3-testing-docker/
├── app.js
├── package.json
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── src/
    ├── config/logger.js
    ├── controllers/
    │   ├── product.controller.js
    │   └── user.controller.js
    ├── middleware/auth.middleware.js
    ├── models/
    │   ├── product.model.js
    │   └── user.model.js
    ├── repositories/
    │   ├── product.repository.js
    │   └── user.repository.js
    ├── routes/
    │   ├── product.router.js
    │   └── user.router.js
    ├── server/server.js
    ├── services/
    │   ├── product.service.js
    │   └── user.service.js
    └── test/
        ├── product.service.test.js
        └── product.route.test.js
```

---

## Instalación

```bash
git clone https://github.com/TU_USUARIO/be3-testing-docker.git
cd be3-testing-docker
npm install
cp .env.example .env   # completar JWT_SECRET
```

## Ejecución

```bash
npm run dev    # desarrollo con nodemon
npm start      # producción
```

API disponible en `http://localhost:8000`  
Swagger UI en `http://localhost:8000/api-docs`

## Tests

```bash
npm test
```

## Endpoints

### Productos

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/products` | No | Lista productos (opcional `?category=X`) |
| GET | `/api/products/:id` | No | Obtiene producto por ID |
| POST | `/api/products` | Bearer | Crea un producto |
| PUT | `/api/products/:id` | Bearer | Actualiza un producto |
| DELETE | `/api/products/:id` | Bearer + Admin | Elimina un producto |

### Usuarios

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/users` | No | Lista usuarios |
| POST | `/api/users/register` | No | Registra usuario |
| POST | `/api/users/login` | No | Login, retorna JWT |
| GET | `/api/users/profile` | Bearer | Perfil autenticado |

---

## Docker

```bash
# Build
docker build -t TU_USUARIO/be3-testing-docker:latest .

# Run
docker run -d \
  -p 8000:8000 \
  -e JWT_SECRET=TuClaveSecreta \
  --name be3_app \
  TU_USUARIO/be3-testing-docker:latest

# Con Compose
docker-compose up -d
```

### Imagen en DockerHub

```bash
docker pull TU_USUARIO/be3-testing-docker:latest
```

---

## Imagen DockerHub

🔗 `https://hub.docker.com/r/TU_USUARIO/be3-testing-docker`
