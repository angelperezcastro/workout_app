const mongoose = require('mongoose')

const routineExerciseSchema = new mongoose.Schema({
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true,
  },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  weight: { type: Number }, // opcional, para ejercicios con peso corporal
})

const routineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  exercises: [routineExerciseSchema],
})

const Routine = mongoose.model('Routine', routineSchema)

module.exports = Routine
