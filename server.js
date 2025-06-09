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
GET     /api/users            ← Todos los usuarios
POST    /api/users            ← Crear usuario (JSON en body)
GET     /api/images           ← Todas las imágenes (con info de raza)
POST    /api/images           ← Crear imagen (JSON en body)
GET     /api/favourites/:id_user   ← Favoritos de un usuario
POST    /api/favourites       ← Agregar favorito (JSON en body)
GET     /api/votes/:id_image       ← Votos de una imagen
POST    /api/votes            ← Agregar voto (JSON en body)
    </pre>
  `);
});

// Todas las rutas usan async/await y el pool
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
        res.status(500).json({ mensaje: 'Error al agregar images' });
    }
});

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

// Votar por una imagen
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

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`API corriendo en http://localhost:${PORT}`);
});