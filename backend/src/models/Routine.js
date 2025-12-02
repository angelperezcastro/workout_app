const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  muscleGroup: { type: String },
  type: { type: String } // fuerza, cardio, etc
});

const routineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: String,
  exercises: [exerciseSchema]
});

// create the model
const Routine = mongoose.model('Routine', routineSchema);

// export the model
module.exports = Routine;
