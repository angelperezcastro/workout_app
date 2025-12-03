const mongoose = require('mongoose')

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  muscleGroup: { type: String }, // pectoral, espalda, pierna...
  type: { type: String },        // fuerza, cardio, movilidad...
})

const Exercise = mongoose.model('Exercise', exerciseSchema)

module.exports = Exercise
