// backend/seedExercises.js
const mongoose = require("mongoose");
require("dotenv").config();
const Exercise = require("./src/models/Exercise");

const exercises = [
  // --- Pierna ---
  { name: "Squats", muscleGroup: "Legs", type: "Strength" },
  { name: "Quads Extensions", muscleGroup: "Legs", type: "Strength" },
  { name: "Hamstrings Curl", muscleGroup: "Legs", type: "Strength" },
  { name: "Romanian Deadlift", muscleGroup: "Legs", type: "Strength" },

  // --- Pecho ---
  { name: "Bench Press", muscleGroup: "Chest", type: "Strength" },
  { name: "Upper Chest Flies", muscleGroup: "Chest", type: "Strength" },
  { name: "Lower Chest Flies", muscleGroup: "Chest", type: "Strength" },
  { name: "Peck Deck", muscleGroup: "Chest", type: "Strength" },

  // --- Espalda ---
  { name: "Pull Down", muscleGroup: "Back", type: "Strength" },
  { name: "Row Machine", muscleGroup: "Back", type: "Strength" },
  { name: "Standing Row", muscleGroup: "Back", type: "Strength" },
  { name: "Cable Pull Over", muscleGroup: "Back", type: "Strength" },

  // --- Brazos / Hombros ---
  { name: "Barbell Biceps Curl", muscleGroup: "Arms", type: "Strength" },
  { name: "Lateral Raises", muscleGroup: "Shoulders", type: "Strength" },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // BORRAR TODOS LOS EJERCICIOS ANTERIORES
    const result = await Exercise.deleteMany({});
    console.log(`🧨 Ejercicios eliminados: ${result.deletedCount}`);

    // INSERTAR NUEVO CATÁLOGO
    await Exercise.insertMany(exercises);
    console.log(`💾 Ejercicios insertados: ${exercises.length}`);
  } catch (err) {
    console.error("❌ Error en seedExercises:", err);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Conexión cerrada");
  }
}

seed();
