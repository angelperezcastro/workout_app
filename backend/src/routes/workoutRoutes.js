const express = require('express');
const WorkoutSession = require('../models/WorkoutSession');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.use(auth);

// create sesion
router.post('/', async (req, res) => {
  const { routineId, date, performedExercises, startedAt, endedAt, durationSeconds } = req.body;

  try {
    const session = new WorkoutSession({
      userId: req.user.userId,
      routineId,
      date: date ? new Date(date) : new Date(),
      startedAt: startedAt ? new Date(startedAt) : undefined,
      endedAt: endedAt ? new Date(endedAt) : undefined,
      durationSeconds: typeof durationSeconds === 'number' ? durationSeconds : undefined,
      performedExercises,
    });

    await session.save();
    res.status(201).json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// get record 
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

module.exports = router;  // important
