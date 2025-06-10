const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Obtener todas las razas de gatos
router.get('/', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM breed');
        res.json(results);
    } catch (err) {
        res.status(500).json({ mensaje: 'Error al obtener razas' });
    }
});

// Crear una nueva raza
router.post('/', async (req, res) => {
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
router.put('/:id', async (req, res) => {
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
router.delete('/:id', async (req, res) => {
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

module.exports = router;