const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT id_user, name_user, password_user FROM user_');
        res.json(results);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios' });
    }
});

// Crear usuario
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;