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

module.exports = router;
