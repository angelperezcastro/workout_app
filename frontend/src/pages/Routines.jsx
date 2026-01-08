import { useEffect, useState } from "react";
import { getRoutines, createRoutine } from "../services/routines";
import { getExercises } from "../services/exercises";
import RoutineCard from "../components/RoutineCard";
import { useI18n } from "../i18n/I18nProvider";

function Routines() {
  const { t } = useI18n();

  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const [availableExercises, setAvailableExercises] = useState([]);
  const [routineExercises, setRoutineExercises] = useState([]);

  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const [routinesData, exercisesData] = await Promise.all([
          getRoutines(),
          getExercises(),
        ]);
        setRoutines(routinesData);
        setAvailableExercises(exercisesData);
      } catch (err) {
        console.error(err);
        setError(err.message || t("routines.loadError"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddExerciseToRoutine = () => {
    setFormError("");

    if (!selectedExerciseId) {
      setFormError(t("routines.formErrorSelectExercise"));
      return;
    }
    if (!sets || !reps) {
      setFormError(t("routines.formErrorSetsReps"));
      return;
    }

    const already = routineExercises.some(
      (e) =>
        e.exerciseId === selectedExerciseId &&
        e.sets === Number(sets) &&
        e.reps === Number(reps) &&
        e.weight === (weight ? Number(weight) : undefined)
    );

    if (already) {
      setFormError(t("routines.formErrorDuplicate"));
      return;
    }

    const newItem = {
      exerciseId: selectedExerciseId,
      sets: Number(sets),
      reps: Number(reps),
      weight: weight ? Number(weight) : undefined,
    };

    setRoutineExercises((prev) => [...prev, newItem]);

    setSelectedExerciseId("");
    setSets("");
    setReps("");
    setWeight("");
  };

  const handleRemoveExercise = (index) => {
    setRoutineExercises((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitRoutine = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError(t("routines.formErrorNameRequired"));
      return;
    }

    if (routineExercises.length === 0) {
      setFormError(t("routines.formErrorAtLeastOne"));
      return;
    }

    try {
      setCreating(true);

      const newRoutine = await createRoutine({
        name: name.trim(),
        description: description.trim(),
        exercises: routineExercises,
      });

      setRoutines((prev) => [...prev, newRoutine]);

      setName("");
      setDescription("");
      setRoutineExercises([]);
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.message || t("routines.formErrorCreateFail"));
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <p>{t("routines.loading")}</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  const getExerciseName = (id) =>
    availableExercises.find((e) => e._id === id)?.name || t("routines.exerciseFallback");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold">{t("routines.title")}</h1>
          <p className="text-slate-300">{t("routines.subtitle")}</p>
        </div>
      </div>

      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-4">
        <h2 className="text-xl font-semibold">{t("routines.createTitle")}</h2>

        <form onSubmit={handleSubmitRoutine} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-300 mb-1">{t("routines.nameLabel")}</label>
              <input
                type="text"
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={t("routines.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">
                {t("routines.descriptionLabel")}
              </label>
              <textarea
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={3}
                placeholder={t("routines.descriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">{t("routines.routineExercisesTitle")}</h3>

            {availableExercises.length === 0 ? (
              <p className="text-sm text-slate-400">{t("routines.noCatalog")}</p>
            ) : (
              <>
                <div className="grid gap-2 md:grid-cols-[2fr,1fr,1fr,1fr,auto] items-end">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">
                      {t("routines.exerciseLabel")}
                    </label>
                    <select
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={selectedExerciseId}
                      onChange={(e) => setSelectedExerciseId(e.target.value)}
                    >
                      <option value="">{t("routines.selectExercise")}</option>
                      {availableExercises.map((ex) => (
                        <option key={ex._id} value={ex._id}>
                          {ex.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-1">{t("routines.sets")}</label>
                    <input
                      type="number"
                      min={1}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                      value={sets}
                      onChange={(e) => setSets(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-1">{t("routines.reps")}</label>
                    <input
                      type="number"
                      min={1}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-1">
                      {t("routines.weightKg")}
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddExerciseToRoutine}
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-sm font-medium"
                  >
                    {t("routines.add")}
                  </button>
                </div>

                {routineExercises.length > 0 && (
                  <div className="mt-3 border border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-900/80">
                        <tr>
                          <th className="px-3 py-2 text-left">{t("routines.exerciseLabel")}</th>
                          <th className="px-3 py-2 text-center">{t("routines.sets")}</th>
                          <th className="px-3 py-2 text-center">{t("routines.reps")}</th>
                          <th className="px-3 py-2 text-center">{t("routines.weightKg")}</th>
                          <th className="px-3 py-2" />
                        </tr>
                      </thead>
                      <tbody>
                        {routineExercises.map((ex, idx) => (
                          <tr key={idx} className="border-t border-slate-800">
                            <td className="px-3 py-2">{getExerciseName(ex.exerciseId)}</td>
                            <td className="px-3 py-2 text-center">{ex.sets}</td>
                            <td className="px-3 py-2 text-center">{ex.reps}</td>
                            <td className="px-3 py-2 text-center">{ex.weight ?? "-"}</td>
                            <td className="px-3 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveExercise(idx)}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                {t("routines.remove")}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>

          {formError && <p className="text-sm text-red-400">{formError}</p>}

          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
          >
            {creating ? t("routines.creating") : t("routines.saveRoutine")}
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">{t("routines.yourRoutines")}</h2>

        {routines.length === 0 ? (
          <p className="text-slate-400">{t("routines.noRoutines")}</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {routines.map((routine) => (
              <RoutineCard key={routine._id} routine={routine} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Routines;
