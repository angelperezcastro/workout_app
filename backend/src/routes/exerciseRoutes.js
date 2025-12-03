const express = require('express')
const Exercise = require('../models/Exercise')
const auth = require('../middleware/authMiddleware')

const router = express.Router()

// todas protegidas por JWT
router.use(auth)

// GET /api/exercises  -> listado de ejercicios disponibles
router.get('/', async (req, res) => {
  try {
    const exercises = await Exercise.find().sort({ name: 1 })
    res.json(exercises)
  } catch (err) {
    console.error('Error en GET /api/exercises:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/exercises -> crear ejercicio
router.post('/', async (req, res) => {
  const { name, muscleGroup, type } = req.body;

  try {
    const exercise = new Exercise({ name, muscleGroup, type });
    await exercise.save();
    res.status(201).json(exercise);
  } catch (err) {
    console.error('Error en POST /api/exercises:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router
