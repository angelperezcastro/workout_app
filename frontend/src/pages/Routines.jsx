import { useEffect, useMemo, useState } from "react";
import { getRoutines, createRoutine } from "../services/routines";
import { getExercises, createExercise } from "../services/exercises";
import RoutineCard from "../components/RoutineCard";
import { useI18n } from "../i18n/I18nProvider";

function Routines() {
  const { t } = useI18n();

  const [routines, setRoutines] = useState([]);
  const [availableExercises, setAvailableExercises] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [formError, setFormError] = useState("");

  const [routineExercises, setRoutineExercises] = useState([]);

  // Selector visual
  const [openPickExercise, setOpenPickExercise] = useState(false);
  const [exerciseQuery, setExerciseQuery] = useState("");

  const [selectedExerciseId, setSelectedExerciseId] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [weight, setWeight] = useState("");

  // Modal crear ejercicio
  const [openCreateExercise, setOpenCreateExercise] = useState(false);
  const [exName, setExName] = useState("");
  const [exMuscle, setExMuscle] = useState("");
  const [exType, setExType] = useState("");
  const [exImageUrl, setExImageUrl] = useState("");
  const [creatingExercise, setCreatingExercise] = useState(false);
  const [createExerciseError, setCreateExerciseError] = useState("");

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

  const getExerciseName = (id) =>
    availableExercises.find((e) => e._id === id)?.name ||
    t("routines.exerciseFallback");

  const getExerciseImage = (ex) => {
  const raw = (ex?.imageUrl || "").trim();
  if (!raw) return null;

  // URL completa
  if (/^https?:\/\//i.test(raw)) return raw;

  let path = raw;

  // Si ya viene como ruta (empieza por / o por exercisesImages/), no la “duplicamos”
  if (path.startsWith("exercisesImages/") || path.startsWith("exercisesimages/")) {
    path = `/${path}`;
  }

  // Si NO empieza por "/", asumimos filename y lo montamos en /exercisesImages/
  if (!path.startsWith("/")) {
    path = `/exercisesImages/${path}`;
  }

  // Forzar carpeta correcta (I mayúscula) si venía mal guardada
  path = path.replace(/^\/exercisesimages\//, "/exercisesImages/");

  // Encode para espacios
  return encodeURI(path);
};


  const selectedExercise = useMemo(() => {
    if (!selectedExerciseId) return null;
    return availableExercises.find((x) => x._id === selectedExerciseId) || null;
  }, [availableExercises, selectedExerciseId]);

  const selectedExerciseImg = useMemo(() => {
    if (!selectedExercise) return null;
    return getExerciseImage(selectedExercise);
  }, [selectedExercise]);

  const filteredExercises = useMemo(() => {
    const q = exerciseQuery.trim().toLowerCase();
    if (!q) return availableExercises;
    return availableExercises.filter((ex) =>
      (ex.name || "").toLowerCase().includes(q)
    );
  }, [availableExercises, exerciseQuery]);

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
      setFormError(
        err.response?.data?.message || t("routines.formErrorCreateFail")
      );
    } finally {
      setCreating(false);
    }
  };

  const handleCreateExercise = async () => {
    setCreateExerciseError("");

    if (!exName.trim()) {
      setCreateExerciseError(t("routines.exerciseNameLabel"));
      return;
    }

    try {
      setCreatingExercise(true);

      const created = await createExercise({
        name: exName.trim(),
        muscleGroup: exMuscle.trim(),
        type: exType.trim(),
        // puede ser URL completa o filename (del public)
        imageUrl: exImageUrl.trim(),
      });

      setAvailableExercises((prev) =>
        [...prev, created].sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        )
      );

      setSelectedExerciseId(created._id);

      setExName("");
      setExMuscle("");
      setExType("");
      setExImageUrl("");
      setOpenCreateExercise(false);
    } catch (err) {
      console.error(err);
      setCreateExerciseError(
        err.response?.data?.message || t("routines.exerciseCreateFail")
      );
    } finally {
      setCreatingExercise(false);
    }
  };

  if (loading) return <p>{t("routines.loading")}</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold">{t("routines.title")}</h1>
          <p className="text-slate-300">{t("routines.subtitle")}</p>
        </div>
      </div>

      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold">{t("routines.createTitle")}</h2>

          <button
            type="button"
            onClick={() => setOpenCreateExercise(true)}
            className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium"
          >
            {t("routines.createExerciseBtn")}
          </button>
        </div>

        <form onSubmit={handleSubmitRoutine} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-300 mb-1">
                {t("routines.nameLabel")}
              </label>
              <input
                type="text"
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
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
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm resize-none"
                rows={3}
                placeholder={t("routines.descriptionPlaceholder")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium">
              {t("routines.routineExercisesTitle")}
            </h3>

            {availableExercises.length === 0 ? (
              <div className="text-sm text-slate-300 space-y-2">
                <p>
                  No hay ejercicios disponibles. Revisa que estás logueado y que
                  tu frontend llama a <code>/api/exercises</code>.
                </p>
                <button
                  type="button"
                  onClick={() => setOpenCreateExercise(true)}
                  className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
                >
                  {t("routines.createExerciseBtn")}
                </button>
              </div>
            ) : (
              <>
                <div className="grid gap-2 md:grid-cols-[2fr,1fr,1fr,1fr,auto] items-end">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">
                      {t("routines.exerciseLabel")}
                    </label>

                    <button
                      type="button"
                      onClick={() => setOpenPickExercise(true)}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm text-left hover:border-slate-500"
                    >
                      {selectedExercise
                        ? selectedExercise.name
                        : t("routines.selectExercise")}
                    </button>

                    {selectedExercise && (
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-300">
                        <div className="w-14 h-14 rounded-md overflow-hidden border border-slate-800 bg-slate-900 flex-shrink-0">
                          {selectedExerciseImg ? (
                            <img
                              src={selectedExerciseImg}
                              alt={selectedExercise.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                              No img
                            </div>
                          )}
                        </div>

                        <div className="space-y-1">
                          {selectedExercise.muscleGroup && (
                            <div>{selectedExercise.muscleGroup}</div>
                          )}
                          {selectedExercise.type && (
                            <div className="uppercase tracking-wide text-slate-400">
                              {selectedExercise.type}
                            </div>
                          )}
                          {selectedExercise.imageUrl && (
                            <div className="text-slate-500 truncate max-w-[320px]">
                              {selectedExercise.imageUrl}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-1">
                      {t("routines.sets")}
                    </label>
                    <input
                      type="number"
                      min={1}
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                      value={sets}
                      onChange={(e) => setSets(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-1">
                      {t("routines.reps")}
                    </label>
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
                          <th className="px-3 py-2 text-left">
                            {t("routines.exerciseLabel")}
                          </th>
                          <th className="px-3 py-2 text-center">
                            {t("routines.sets")}
                          </th>
                          <th className="px-3 py-2 text-center">
                            {t("routines.reps")}
                          </th>
                          <th className="px-3 py-2 text-center">
                            {t("routines.weightKg")}
                          </th>
                          <th className="px-3 py-2" />
                        </tr>
                      </thead>
                      <tbody>
                        {routineExercises.map((ex, idx) => (
                          <tr key={idx} className="border-t border-slate-800">
                            <td className="px-3 py-2">
                              {getExerciseName(ex.exerciseId)}
                            </td>
                            <td className="px-3 py-2 text-center">{ex.sets}</td>
                            <td className="px-3 py-2 text-center">{ex.reps}</td>
                            <td className="px-3 py-2 text-center">
                              {ex.weight ?? "-"}
                            </td>
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
            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-sm font-medium"
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

      {/* MODAL: seleccionar ejercicio (con imágenes) */}
      {openPickExercise && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-3xl rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h3 className="text-xl font-semibold">
                  {t("routines.selectExercise")}
                </h3>
                <p className="text-sm text-slate-300">
                  Elige un ejercicio de tu catálogo.
                </p>
              </div>

              <button
                onClick={() => setOpenPickExercise(false)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <input
              value={exerciseQuery}
              onChange={(e) => setExerciseQuery(e.target.value)}
              placeholder="Buscar ejercicio..."
              className="w-full mb-4 rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 text-sm"
            />

            <div className="max-h-[60vh] overflow-auto pr-1">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filteredExercises.map((ex) => {
                  const img = getExerciseImage(ex);

                  return (
                    <button
                      key={ex._id}
                      type="button"
                      onClick={() => {
                        setSelectedExerciseId(ex._id);
                        setOpenPickExercise(false);
                        setExerciseQuery("");
                      }}
                      className="text-left rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-800/60 p-3"
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden flex-shrink-0">
                          {img ? (
                            <img
                              src={img}
                              alt={ex.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                              No img
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="font-semibold truncate">{ex.name}</div>
                          <div className="text-xs text-slate-300 mt-1">
                            {ex.muscleGroup || "-"}
                            {ex.type ? ` · ${ex.type}` : ""}
                          </div>
                          {ex.imageUrl && (
                            <div className="text-[11px] text-slate-500 mt-1 truncate">
                              {ex.imageUrl}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={() => setOpenPickExercise(false)}
                className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-900 text-sm"
              >
                Cerrar
              </button>

              <button
                type="button"
                onClick={() => {
                  setOpenPickExercise(false);
                  setOpenCreateExercise(true);
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium"
              >
                {t("routines.createExerciseBtn")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: crear ejercicio */}
      {openCreateExercise && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <h3 className="text-xl font-semibold">
                {t("routines.createExerciseTitle")}
              </h3>
              <button
                onClick={() => {
                  setOpenCreateExercise(false);
                  setCreateExerciseError("");
                }}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  {t("routines.exerciseNameLabel")}
                </label>
                <input
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                  placeholder={t("routines.exerciseNamePlaceholder")}
                  value={exName}
                  onChange={(e) => setExName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  {t("routines.muscleGroupLabel")}
                </label>
                <input
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                  placeholder={t("routines.muscleGroupPlaceholder")}
                  value={exMuscle}
                  onChange={(e) => setExMuscle(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  {t("routines.typeLabel")}
                </label>
                <input
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                  placeholder={t("routines.typePlaceholder")}
                  value={exType}
                  onChange={(e) => setExType(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-1">
                  Image filename (recommended) or URL (optional)
                </label>
                <input
                  className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm"
                  placeholder="Ej: Captura de pantalla 2025-12-04 163954.png"
                  value={exImageUrl}
                  onChange={(e) => setExImageUrl(e.target.value)}
                />
                <p className="text-xs text-slate-400 mt-1">
                  Si pones un filename, debe existir en <code>/public/exercisesImages</code>.
                </p>
              </div>

              {createExerciseError && (
                <p className="text-sm text-red-400">{createExerciseError}</p>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOpenCreateExercise(false)}
                  className="px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-900 text-sm"
                  disabled={creatingExercise}
                >
                  {t("routines.cancel")}
                </button>

                <button
                  type="button"
                  onClick={handleCreateExercise}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-sm font-medium disabled:opacity-60"
                  disabled={creatingExercise}
                >
                  {creatingExercise
                    ? t("routines.creatingExercise")
                    : t("routines.create")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Routines;
