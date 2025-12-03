const express = require('express')
const Routine = require('../models/Routine')
const auth = require('../middleware/authMiddleware')

const router = express.Router()

router.use(auth)

// GET /api/routines
router.get('/', async (req, res) => {
  try {
    console.log('Usuario en req.user:', req.user)
    const routines = await Routine.find({ userId: req.user.userId })
      .populate('exercises.exerciseId') // 👈 para obtener nombre, grupo, etc
    res.json(routines)
  } catch (err) {
    console.error('Error en GET /api/routines:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /api/routines
router.post('/', async (req, res) => {
  const { name, description, exercises } = req.body

  try {
    const routine = new Routine({
      userId: req.user.userId,
      name,
      description,
      exercises, // [{ exerciseId, sets, reps, weight }]
    })

    await routine.save()
    const populated = await routine.populate('exercises.exerciseId')

    res.status(201).json(populated)
  } catch (err) {
    console.error('Error en POST /api/routines:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
