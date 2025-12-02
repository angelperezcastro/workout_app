const mongoose = require('mongoose');

const performedSetSchema = new mongoose.Schema({
  reps: { type: Number },
  weight: { type: Number }
});

const performedExerciseSchema = new mongoose.Schema({
  exerciseName: { type: String, required: true },
  sets: [performedSetSchema]
});

const workoutSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine', required: true },
  date: { type: Date, default: Date.now },
  performedExercises: [performedExerciseSchema]
});

const WorkoutSession = mongoose.model('WorkoutSession', workoutSessionSchema);

module.exports = WorkoutSession;
