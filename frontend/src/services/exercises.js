import api from "./api";

export async function getExercises() {
  const res = await api.get("/exercises");
  return res.data;
}
