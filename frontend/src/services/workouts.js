import api from "./api";

export async function createWorkoutSession(payload) {
  const res = await api.post("/workouts", payload);
  return res.data;
}

export async function getWorkoutSessions() {
  const res = await api.get("/workouts");
  return res.data;
}

// ✅ NUEVO: resumen para Dashboard
export async function getWorkoutSummary() {
  const res = await api.get("/workouts/summary");
  return res.data; // { totalSessions, totalDurationSeconds }
}
