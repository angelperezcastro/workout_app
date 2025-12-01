const express = require('express');
const Routine = require('../models/Routine');      // 👈 SIN LLAVES
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.use(auth);

// GET /api/routines
router.get('/', async (req, res) => {
  try {
    console.log('Usuario en req.user:', req.user);
    const routines = await Routine.find({ userId: req.user.userId });
    res.json(routines);
  } catch (err) {
    console.error('Error en GET /api/routines:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/routines
router.post('/', async (req, res) => {
  const { name, description, exercises } = req.body;

  try {
    const routine = new Routine({
      userId: req.user.userId,
      name,
      description,
      exercises
    });

    await routine.save();
    res.status(201).json(routine);
  } catch (err) {
    console.error('Error en POST /api/routines:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
