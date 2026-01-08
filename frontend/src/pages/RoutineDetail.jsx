import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoutine } from "../services/routines";
import { useI18n } from "../i18n/I18nProvider";

function RoutineDetail() {
  const { t } = useI18n();
  const { id } = useParams();
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRoutine(id);
        setRoutine(data);
      } catch (err) {
        console.error(err);
        setError(t("routineDetail.loadFail"));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return <p>{t("routineDetail.loading")}</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!routine) return <p>{t("routineDetail.notFound")}</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{routine.name}</h1>

      {routine.description && <p className="text-slate-300">{routine.description}</p>}

      <h2 className="text-xl font-semibold">{t("routineDetail.exercisesTitle")}</h2>

      {routine.exercises?.length === 0 ? (
        <p className="text-slate-400">{t("routineDetail.noExercises")}</p>
      ) : (
        <div className="space-y-4">
          {routine.exercises.map((ex, index) => {
            const exercise = ex.exerciseId || {};
            const hasImage = Boolean(exercise.imageUrl);

            return (
              <div
                key={index}
                className="border border-slate-800 rounded-lg p-4 space-y-3 bg-slate-900/40"
              >
                <div className="flex gap-4 items-start">
                  {hasImage && (
                    <img
                      src={exercise.imageUrl}
                      alt={exercise.name || t("routines.exerciseFallback")}
                      className="w-28 h-28 rounded-md object-cover flex-shrink-0 border border-slate-800"
                    />
                  )}

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-lg">
                        {exercise.name || t("routines.exerciseFallback")}
                      </span>

                      {exercise.muscleGroup && (
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-200">
                          {exercise.muscleGroup}
                        </span>
                      )}
                    </div>

                    {exercise.type && (
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {exercise.type}
                      </p>
                    )}

                    {(ex.sets || ex.reps || ex.weight) ? (
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold">{ex.sets ?? "-"}</span>{" "}
                        {t("routineDetail.series")} ·{" "}
                        <span className="font-semibold">{ex.reps ?? "-"}</span>{" "}
                        {t("routineDetail.reps")} ·{" "}
                        <span className="font-semibold">{ex.weight ?? "-"}</span> kg
                      </p>
                    ) : (
                      <p className="text-slate-300 text-sm">{t("routineDetail.noSetsAssigned")}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RoutineDetail;
