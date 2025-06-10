const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Obtener todos los favoritos de un usuario
router.get('/:id_user', async (req, res) => {
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
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;