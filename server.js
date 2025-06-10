require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();

// Usa el puerto de env o 3000 por defecto
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Pool de conexiones MySQL (usando variables de entorno)
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Ruta principal
app.get('/', (req, res) => {
    res.send(`
    <h2>¡Bienvenido a la API de Cat Social Network!</h2>
    <pre>
Usa las siguientes rutas:

GET     /api/breeds           ← Todas las razas de gatos
POST    /api/breeds           ← Crear raza (JSON en body)
PUT     /api/breeds/:id       ← Actualizar raza
DELETE  /api/breeds/:id       ← Eliminar raza

GET     /api/users            ← Todos los usuarios
POST    /api/users            ← Crear usuario (JSON en body)
PUT     /api/users/:id        ← Actualizar usuario
DELETE  /api/users/:id        ← Eliminar usuario

GET     /api/images           ← Todas las imágenes (con info de raza)
POST    /api/images           ← Crear imagen (JSON en body)
PUT     /api/images/:id       ← Actualizar imagen
DELETE  /api/images/:id       ← Eliminar imagen

GET     /api/favourites/:id_user   ← Favoritos de un usuario
POST    /api/favourites       ← Agregar favorito (JSON en body)
PUT     /api/favourites/:id   ← Actualizar favorito
DELETE  /api/favourites/:id   ← Eliminar favorito

GET     /api/votes/:id_image       ← Votos de una imagen
POST    /api/votes            ← Agregar voto (JSON en body)
PUT     /api/votes/:id        ← Actualizar voto
DELETE  /api/votes/:id        ← Eliminar voto
    </pre>
  `);
});

// ---------- Breeds ----------

// Obtener todas las razas de gatos
app.get('/api/breeds', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM breed');
        res.json(results);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener razas' });
    }
});

// Crear una nueva raza
app.post('/api/breeds', async (req, res) => {
    const { name_breed, origin_breed, description_breed } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO breed (name_breed, origin_breed, description_breed) VALUES (?, ?, ?)',
            [name_breed, origin_breed, description_breed]
        );
        res.status(201).json({ id_breed: result.insertId, name_breed, origin_breed, description_breed });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al crear raza' });
    }
});

// Actualizar una raza
app.put('/api/breeds/:id', async (req, res) => {
    const { name_breed, origin_breed, description_breed } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE breed SET name_breed = ?, origin_breed = ?, description_breed = ? WHERE id_breed = ?',
            [name_breed, origin_breed, description_breed, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Raza no encontrada' });
        }
        res.json({ mensaje: 'Raza actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al actualizar raza' });
    }
});

// Eliminar una raza
app.delete('/api/breeds/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM breed WHERE id_breed = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Raza no encontrada' });
        }
        res.json({ mensaje: 'Raza eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al eliminar raza' });
    }
});

// ---------- Users ----------

// Obtener todos los usuarios
app.get('/api/users', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT id_user, name_user, password_user FROM user_');
        res.json(results);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
});

// Crear usuario
app.post('/api/users', async (req, res) => {
    const { name_user, password_user } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO user_ (name_user, password_user) VALUES (?, ?)',
            [name_user, password_user]
        );
        res.status(201).json({ id_user: result.insertId, name_user, password_user });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al crear usuario' });
    }
});

// Actualizar usuario
app.put('/api/users/:id', async (req, res) => {
    const { name_user, password_user } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE user_ SET name_user = ?, password_user = ? WHERE id_user = ?',
            [name_user, password_user, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json({ mensaje: 'Usuario actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al actualizar usuario' });
    }
});

// Eliminar usuario
app.delete('/api/users/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM user_ WHERE id_user = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }
        res.json({ mensaje: 'Usuario eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al eliminar usuario' });
    }
});

// ---------- Images ----------

// Obtener todas las imagenes
app.get('/api/images', async (req, res) => {
    try {
        const [results] = await pool.query(
            'SELECT image.*, breed.name_breed FROM image LEFT JOIN breed ON image.id_breed = breed.id_breed'
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener imágenes' });
    }
});

// Crear una imagen
app.post('/api/images', async (req, res) => {
    const { url_image, id_breed } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO image (url_image, id_breed) VALUES (?, ?)',
            [url_image, id_breed]
        );
        res.status(201).json({ id_image: result.insertId, url_image, id_breed });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al agregar imagen' });
    }
});

// Actualizar imagen
app.put('/api/images/:id', async (req, res) => {
    const { url_image, id_breed } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE image SET url_image = ?, id_breed = ? WHERE id_image = ?',
            [url_image, id_breed, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Imagen no encontrada' });
        }
        res.json({ mensaje: 'Imagen actualizada correctamente' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al actualizar imagen' });
    }
});

// Eliminar imagen
app.delete('/api/images/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM image WHERE id_image = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Imagen no encontrada' });
        }
        res.json({ mensaje: 'Imagen eliminada correctamente' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al eliminar imagen' });
    }
});

// ---------- Favourites ----------

// Obtener todos los favoritos de un usuario
app.get('/api/favourites/:id_user', async (req, res) => {
    try {
        const [results] = await pool.query(
            'SELECT favourite.*, image.url_image FROM favourite JOIN image ON favourite.id_image = image.id_image WHERE favourite.id_user = ?',
            [req.params.id_user]
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener favoritos' });
    }
});

// Agregar un favorito
app.post('/api/favourites', async (req, res) => {
    const { id_user, id_image } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO favourite (id_user, id_image) VALUES (?, ?)',
            [id_user, id_image]
        );
        res.status(201).json({ id_favourite: result.insertId, id_user, id_image });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al agregar favorito' });
    }
});

// Actualizar favorito
app.put('/api/favourites/:id', async (req, res) => {
    const { id_user, id_image } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE favourite SET id_user = ?, id_image = ? WHERE id_favourite = ?',
            [id_user, id_image, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Favorito no encontrado' });
        }
        res.json({ mensaje: 'Favorito actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al actualizar favorito' });
    }
});

// Eliminar favorito
app.delete('/api/favourites/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM favourite WHERE id_favourite = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Favorito no encontrado' });
        }
        res.json({ mensaje: 'Favorito eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al eliminar favorito' });
    }
});

// ---------- Votes ----------

// Obtener votos de una imagen
app.get('/api/votes/:id_image', async (req, res) => {
    try {
        const [results] = await pool.query(
            'SELECT vote.*, user_.name_user FROM vote JOIN user_ ON vote.id_user = user_.id_user WHERE vote.id_image = ?',
            [req.params.id_image]
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener votos' });
    }
});

// Agregar voto
app.post('/api/votes', async (req, res) => {
    const { value_vote, id_user, id_image } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO vote (value_vote, id_user, id_image) VALUES (?, ?, ?)',
            [value_vote, id_user, id_image]
        );
        res.status(201).json({ id_vote: result.insertId, value_vote, id_user, id_image });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al votar' });
    }
});

// Actualizar voto
app.put('/api/votes/:id', async (req, res) => {
    const { value_vote, id_user, id_image } = req.body;
    try {
        const [result] = await pool.query(
            'UPDATE vote SET value_vote = ?, id_user = ?, id_image = ? WHERE id_vote = ?',
            [value_vote, id_user, id_image, req.params.id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Voto no encontrado' });
        }
        res.json({ mensaje: 'Voto actualizado correctamente' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al actualizar voto' });
    }
});

// Eliminar voto
app.delete('/api/votes/:id', async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM vote WHERE id_vote = ?', [req.params.id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ mensaje: 'Voto no encontrado' });
        }
        res.json({ mensaje: 'Voto eliminado correctamente' });
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al eliminar voto' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`);
});