import api from "./api";

export async function getExercises() {
  const res = await api.get("/exercises");
  return res.data;
}

export async function createExercise({ name, muscleGroup = "", type = "", imageUrl = "" }) {
  const res = await api.post("/exercises", { name, muscleGroup, type, imageUrl });
  return res.data;
}
