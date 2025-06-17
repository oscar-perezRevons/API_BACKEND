const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Obtener todas las imagenes (con info de raza)
router.get('/', async (req, res) => {
    try {
        const [results] = await pool.query(
            'SELECT image.*, breed.name_breed FROM image LEFT JOIN breed ON image.id_breed = breed.id_breed'
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener imágenes' });
    }
});

// get todas las imágenes de una raza
router.get('/breed/:name_breed', async (req, res) => {
    try {
        const nameBreed = req.params.name_breed;
        const [results] = await pool.query(
            'SELECT image.*, breed.name_breed FROM image LEFT JOIN breed ON image.id_breed = breed.id_breed WHERE breed.name_breed = ?',
            [nameBreed]
        );

        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'No se encontraron imágenes para esta raza' });
        }

        res.json(results);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener imágenes de la raza' });
    }
});

// Crear una imagen
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
// Obtener imagen por ID (con info de raza opcional)
router.get('/:id', async (req, res) => {
    try {
        const [results] = await pool.query(
            'SELECT image.*, breed.name_breed FROM image LEFT JOIN breed ON image.id_breed = breed.id_breed WHERE id_image = ?',
            [req.params.id]
        );

        if (results.length === 0) {
            return res.status(404).json({ mensaje: 'Imagen no encontrada' });
        }

        res.json(results[0]); // Devuelve solo 1 imagen
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener la imagen' });
    }
});


module.exports = router;