const express = require('express');
const router = express.Router();
const pool = require('../config/db');
//obtener todos los votos

router.get('/', async (req, res) => {
    try {
        const [results] = await pool.query(
            'SELECT vote.*, user_.name_user FROM vote JOIN user_ ON vote.id_user = user_.id_user'
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener todos los votos' });
    }
});
// Obtener votos de una imagen
router.get('/:id_image', async (req, res) => {
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
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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
// Buscar votos por ID de usuario (sub_id)
router.get('/by-user/:sub_id', async (req, res) => {
    try {
        const [results] = await pool.query(
            'SELECT vote.*, user_.name_user FROM vote JOIN user_ ON vote.id_user = user_.id_user WHERE vote.id_user = ?',
            [req.params.sub_id]
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener votos por usuario' });
    }
});

module.exports = router;