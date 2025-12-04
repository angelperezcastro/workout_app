// backend/seedExercises.js
const mongoose = require("mongoose");
require("dotenv").config();
const Exercise = require("./src/models/Exercise");

const exercises = [
  // --- Pierna ---
  {
    name: "Squats",
    muscleGroup: "Legs",
    type: "Strength",
    imageUrl: "/exercisesImages/Captura de pantalla 2025-12-04 164128.png",
  },
  {
    name: "Quads Extensions",
    muscleGroup: "Legs",
    type: "Strength",
    imageUrl: "/exercisesImages/Captura de pantalla 2025-12-04 164135.png",
  },
  {
    name: "Hamstrings Curl",
    muscleGroup: "Legs",
    type: "Strength",
    imageUrl: "/exercisesImages/Captura de pantalla 2025-12-04 164141.png",
  },
  {
    name: "Romanian Deadlift",
    muscleGroup: "Legs",
    type: "Strength",
    imageUrl: "/exercisesImages/Captura de pantalla 2025-12-04 164105.png",
  },

  // --- Pecho ---
  {
    name: "Bench Press",
    muscleGroup: "Chest",
    type: "Strength",
    imageUrl: "/exercisesImages/Captura de pantalla 2025-12-04 163954.png",
  },
  {
    name: "Upper Chest Flies",
    muscleGroup: "Chest",
    type: "Strength",
    imageUrl: "/exercisesImages/Captura de pantalla 2025-12-04 164151.png",
  },
  {
    name: "Lower Chest Flies",
    muscleGroup: "Chest",
    type: "Strength",
    imageUrl: "/exercisesImages/Captura de pantalla 2025-12-04 164201.png",
  },
  {
    name: "Peck Deck",
    muscleGroup: "Chest",
    type: "Strength",
    imageUrl: "/exercisesImages/Captura de pantalla 2025-12-04 164800.png",
  },

  // --- Espalda ---
  {
    name: "Pull Down",
    muscleGroup: "Back",
    type: "Strength",
    imageUrl: "/exercisesImages/Captura de pantalla 2025-12-04 164807.png",
  },
  {
    name: "Row Machine",
    muscleGroup: "Back",
    type: "Strength",
    imageUrl: "/exercisesImages/Captura de pantalla 2025-12-04 164817.png",
  },
  {
    name: "Standing Row",
    muscleGroup: "Back",
    type: "Strength",
    imageUrl: "/exercisesImages/Captura de pantalla 2025-12-04 164120.png",
  },
  {
    name: "Cable Pull Over",
    muscleGroup: "Back",
    type: "Strength",
    imageUrl: "/exercisesImages/Captura de pantalla 2025-12-04 164826.png",
  },

  // --- Brazos / Hombros ---
  {
    name: "Barbell Biceps Curl",
    muscleGroup: "Arms",
    type: "Strength",
    imageUrl: "/exercisesImages/Captura de pantalla 2025-12-04 164832.png",
  },
  {
    name: "Lateral Raises",
    muscleGroup: "Shoulders",
    type: "Strength",
    imageUrl: "/exercisesImages/Captura de pantalla 2025-12-04 164844.png",
  },
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
