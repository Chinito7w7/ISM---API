📦 Stock Manager API

Backend para un sistema de gestión de stock con autenticación de usuarios.  
Cada usuario puede administrar su propio inventario de productos.

Este proyecto forma parte de mi aprendizaje fullstack enfocado principalmente en frontend, pero construyendo un backend sólido.

---

🚀 Cómo lanzar el proyecto

1. Clonar el repositorio

   git clone https://github.com/TU-USUARIO/TU-REPO.git

2. Instalar dependencias
   npm install

3. Crear archivo .env

   PORT=3000 => ejemplo
   MONGODB_URI=tu_string_de_conexion => ejemplo
   JWT_SECRET=supersecretkey => ejemplo

4. Ejecutar el proyecto
   npm run dev

5. Endpoint de prueba

   En postman o en una plataforma integral de desarrollo y pruebas de API

   GET /api/health

   Respuesta esperada:
   { message: "Api running correctly" }

---

🛠️ Tecnologías utilizadas

- Node.js
- Express
- MongoDB (Atlas)
- Mongoose
- JWT Authentication
- Morgan
- Cors

---

✨ Características actuales del sistema

- Registro de usuarios
- Login con autenticación JWT
- Estructura modular escalable
- API REST
- Conexión a base de datos en MongoDB Atlas
- Logging de peticiones
- Middleware configurado

Próximas features:

- CRUD de productos
- Sistema de stock por usuario
- Estadísticas de inventario
- Dashboard con métricas
- Control de movimientos de stock

---

🚧 Próximas funcionalidades

1. CRUD de productos: Gestión total de artículos.

2. Stock por usuario: Inventarios privados y aislados.

3. Dashboard: Visualización de métricas clave.

4. Movimientos: Historial de entradas y salidas de mercadería.

---
