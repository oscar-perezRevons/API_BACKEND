# 🐾 Cat Social Network API

Bienvenido a la **API REST para Cat Social Network**.  
Este backend permite gestionar usuarios, razas de gatos, imágenes, favoritos y votos para una red social de amantes de los gatos.

---

## 🚀 Tecnologías usadas

- Node.js + Express
- MySQL (base de datos)
- Swagger/OpenAPI para documentación
- Railway (despliegue)

---

## 📚 Documentación Interactiva (Swagger)

Accede a la documentación y prueba los endpoints en:  
[http://localhost:3000/doc](http://localhost:3000/api-docs)  
*(o la URL de Railway si está desplegado)*

---

## 📦 Instalación local

1. **Clona el repositorio**
    ```bash
    git clone https://github.com/tu-usuario/tu-repo.git
    cd tu-repo
    ```

2. **Instala dependencias**
    ```bash
    npm install
    ```

3. **Configura las variables de entorno**

    Crea un archivo `.env`:

    ```env
    DB_HOST=localhost
    DB_USER=usuario
    DB_PASSWORD=contraseña
    DB_DATABASE=cat_social_db
    PORT=3000
    ```

4. **Ejecuta el servidor**
    ```bash
    npm run dev
    # o
    node server.js
    ```

---

## 🗃️ Estructura de carpetas

```
├── config/
│   └── db.js
├── routes/
│   ├── breedRoutes.js
│   ├── userRoutes.js
│   ├── imageRoutes.js
│   ├── favouriteRoutes.js
│   └── voteRoutes.js
├── swagger.yaml
├── server.js
└── README.md
```

---

## 📒 Endpoints principales

### Usuarios

- `GET    /api/users` — Listar usuarios
- `POST   /api/users` — Crear usuario
- `PUT    /api/users/:id` — Actualizar usuario
- `DELETE /api/users/:id` — Eliminar usuario

### Razas (Breeds)

- `GET    /api/breeds` — Listar razas
- `POST   /api/breeds` — Crear raza
- `PUT    /api/breeds/:id` — Actualizar raza
- `DELETE /api/breeds/:id` — Eliminar raza

### Imágenes

- `GET    /api/images` — Listar imágenes
- `POST   /api/images` — Crear imagen
- `PUT    /api/images/:id` — Actualizar imagen
- `DELETE /api/images/:id` — Eliminar imagen

### Favoritos

- `GET    /api/favourites/:id_user` — Favoritos de un usuario
- `POST   /api/favourites` — Agregar favorito
- `PUT    /api/favourites/:id` — Actualizar favorito
- `DELETE /api/favourites/:id` — Eliminar favorito

### Votos

- `GET    /api/votes/:id_image` — Votos de una imagen
- `POST   /api/votes` — Agregar voto
- `PUT    /api/votes/:id` — Actualizar voto
- `DELETE /api/votes/:id` — Eliminar voto

---

## 📝 Ejemplo de respuesta

```json
[
  {
    "id_breed": 1,
    "name_breed": "Siamese",
    "origin_breed": "Thailand",
    "description_breed": "Muy sociable y cariñoso"
  }
]
```

---

## 🔒 Seguridad y buenas prácticas

- **No subas tu archivo `.env`** al repositorio.
- Las contraseñas de usuario deben ser hasheadas (usa bcrypt).
- Valida bien los datos de entrada.

---

## ☁️ Despliegue

Este proyecto está pensado para ser desplegado en [Railway](https://railway.app/) o servicios similares.

---

## 🤝 Contribuciones

¡Se aceptan PRs y sugerencias!  
Abre un issue o pull request para contribuir.

---

## 📄 Licencia

[MIT](LICENSE)

---

¡Gracias por usar Cat Social Network API! 😺
