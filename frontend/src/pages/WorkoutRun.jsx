import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRoutine } from "../services/routines";
import { createWorkoutSession } from "../services/workouts";

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;

  const hh = h > 0 ? String(h).padStart(2, "0") + ":" : "";
  return `${hh}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function WorkoutRun() {
  const { id } = useParams(); // routineId
  const navigate = useNavigate();

  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);

  // checkbox state: { [exerciseIndex]: boolean[] }
  const [doneMap, setDoneMap] = useState({});

  useEffect(() => {
    const tick = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);
    return () => clearInterval(tick);
  }, [startedAt]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRoutine(id);
        setRoutine(data);

        // init doneMap based on sets
        const initial = {};
        (data.exercises || []).forEach((ex, idx) => {
          const sets = Number(ex.sets || 0);
          initial[idx] = Array.from({ length: sets }, () => false);
        });
        setDoneMap(initial);
      } catch (e) {
        console.error(e);
        setError("No se pudo cargar la rutina");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const totalSetsDone = useMemo(() => {
    return Object.values(doneMap).reduce(
      (acc, arr) => acc + (arr?.filter(Boolean).length || 0),
      0
    );
  }, [doneMap]);

  const totalSetsPlanned = useMemo(() => {
    if (!routine?.exercises) return 0;
    return routine.exercises.reduce((acc, ex) => acc + Number(ex.sets || 0), 0);
  }, [routine]);

  const toggleSet = (exerciseIdx, setIdx) => {
    setDoneMap((prev) => {
      const copy = { ...prev };
      const arr = [...(copy[exerciseIdx] || [])];
      arr[setIdx] = !arr[setIdx];
      copy[exerciseIdx] = arr;
      return copy;
    });
  };

  const finishWorkout = async () => {
    if (!routine) return;

    const endedAt = Date.now();
    const durationSeconds = Math.floor((endedAt - startedAt) / 1000);

    const performedExercises = (routine.exercises || []).map((ex, idx) => {
      const exerciseObj = ex.exerciseId || {};
      const exerciseId = exerciseObj._id || ex.exerciseId;

      const perSetDone = doneMap[idx] || [];
      const completedSets = perSetDone.filter(Boolean).length;

      return {
        exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        completedSets,
        perSetDone,
      };
    });

    try {
      await createWorkoutSession({
        routineId: id,
        date: new Date(endedAt).toISOString(),
        startedAt: new Date(startedAt).toISOString(),
        endedAt: new Date(endedAt).toISOString(),
        durationSeconds,
        performedExercises,
      });

      navigate("/dashboard");
    } catch (e) {
      console.error(e);
      alert("No se pudo guardar la sesión");
    }
  };

  if (loading) return <p>Cargando rutina...</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!routine) return <p>Rutina no encontrada</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{routine.name}</h1>
          {routine.description && <p className="text-slate-300 mt-1">{routine.description}</p>}
        </div>

        <div className="text-right">
          <div className="text-sm text-slate-400">Tiempo</div>
          <div className="text-2xl font-semibold tabular-nums">{formatTime(elapsed)}</div>
          <div className="text-xs text-slate-400 mt-1">
            Series: {totalSetsDone}/{totalSetsPlanned}
          </div>
        </div>
      </div>

      {/* Exercises */}
      <div className="space-y-4">
        {(routine.exercises || []).map((ex, exerciseIdx) => {
          const exObj = ex.exerciseId || {};
          const sets = Number(ex.sets || 0);
          const perSet = doneMap[exerciseIdx] || [];

          return (
            <div
              key={exerciseIdx}
              className="border border-slate-800 rounded-xl p-4 bg-slate-900/40 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-lg font-semibold">{exObj.name || "Ejercicio"}</div>
                  <div className="text-sm text-slate-300">
                    {sets} series · {ex.reps} reps · {ex.weight ?? "-"} kg
                  </div>
                </div>

                {exObj.muscleGroup && (
                  <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-200">
                    {exObj.muscleGroup}
                  </span>
                )}
              </div>

              {/* Sets checklist */}
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: sets }).map((_, setIdx) => (
                  <label
                    key={setIdx}
                    className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={Boolean(perSet[setIdx])}
                      onChange={() => toggleSet(exerciseIdx, setIdx)}
                      className="h-4 w-4"
                    />
                    <span>Serie {setIdx + 1}</span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Finish */}
      <div className="flex justify-end">
        <button
          onClick={finishWorkout}
          className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold"
        >
          Finalizar rutina
        </button>
      </div>
    </div>
  );
}
