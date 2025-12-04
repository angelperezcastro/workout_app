const mongoose = require("mongoose");
require("dotenv").config();
const Exercise = require("./src/models/Exercise");

const exercises = [
  { name: "Squats", muscleGroup: "Legs", type: "Strength" },
  { name: "Quads Extensions", muscleGroup: "Legs", type: "Strength" },
  { name: "Hamstrings Curl", muscleGroup: "Legs", type: "Strength" },
  { name: "Upper Chest Flies", muscleGroup: "Chest", type: "Strength" },
  { name: "Lower Chest Flies", muscleGroup: "Chest", type: "Strength" },
  { name: "Peck Deck", muscleGroup: "Chest", type: "Strength" },
  { name: "Pull Down", muscleGroup: "Back", type: "Strength" },
  { name: "Row Machine", muscleGroup: "Back", type: "Strength" },
  { name: "Cable Pull Over", muscleGroup: "Back", type: "Strength" },
  { name: "Barbell Biceps Curl", muscleGroup: "Arms", type: "Strength" },
  { name: "Lateral Raises", muscleGroup: "Shoulders", type: "Strength" }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    await Exercise.insertMany(exercises);
    console.log("Exercises inserted successfully");

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

seed();
