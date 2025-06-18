const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// ✅ Todos los votos
router.get('/', async (req, res) => {
    const [results] = await pool.query(
        'SELECT vote.*, user_.name_user FROM vote JOIN user_ ON vote.id_user = user_.id_user'
    );
    res.json(results);
});

// ✅ UN voto por ID
router.get('/vote/:id_vote', async (req, res) => {
    const [results] = await pool.query(
        'SELECT vote.*, user_.name_user FROM vote JOIN user_ ON vote.id_user = user_.id_user WHERE vote.id_vote = ?',
        [req.params.id_vote]
    );
    if (results.length === 0) {
        return res.status(404).json({ mensaje: 'Voto no encontrado' });
    }
    res.json(results[0]);
});

// ✅ Votos por usuario
router.get('/by-user/:sub_id', async (req, res) => {
    const [results] = await pool.query(
        'SELECT vote.*, user_.name_user FROM vote JOIN user_ ON vote.id_user = user_.id_user WHERE vote.id_user = ?',
        [req.params.sub_id]
    );
    res.json(results);
});

// ✅ Votos de una imagen — GENÉRICA, AL FINAL
router.get('/:id_image', async (req, res) => {
    const [results] = await pool.query(
        'SELECT vote.*, user_.name_user FROM vote JOIN user_ ON vote.id_user = user_.id_user WHERE vote.id_image = ?',
        [req.params.id_image]
    );
    res.json(results);
});

// POST, PUT, DELETE igual, no cambian.
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
module.exports = router;
