const mongoose = require('mongoose');

const performedExerciseSchema = new mongoose.Schema(
  {
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    sets: Number,
    reps: Number,
    weight: Number,
    completedSets: Number,
    perSetDone: [Boolean],
  },
  { _id: false }
);

const workoutSessionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    routineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine', required: true },

    date: { type: Date, default: Date.now },

    startedAt: Date,
    endedAt: Date,
    durationSeconds: Number,

    performedExercises: [performedExerciseSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('WorkoutSession', workoutSessionSchema);