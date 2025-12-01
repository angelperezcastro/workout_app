const express = require('express');
const WorkoutSession = require('../models/WorkoutSession');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.use(auth);

// Crear entrenamiento
router.post('/', async (req, res) => {
  const { routineId, date, performedExercises } = req.body;

  try {
    const session = new WorkoutSession({
      userId: req.user.userId,
      routineId,
      date,
      performedExercises
    });

    await session.save();
    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Obtener historial
router.get('/', async (req, res) => {
  try {
    const sessions = await WorkoutSession.find({ userId: req.user.userId })
      .sort({ date: -1 })
      .limit(50);
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;  // 👈 IMPORTANTE
