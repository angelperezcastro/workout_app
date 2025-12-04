import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getRoutine } from "../services/routines"

function RoutineDetail() {
  const { id } = useParams()
  const [routine, setRoutine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRoutine(id)
        setRoutine(data)
      } catch (err) {
        console.error(err)
        setError("No se pudo cargar la rutina")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) return <p>Cargando rutina...</p>
  if (error) return <p className="text-red-400">{error}</p>
  if (!routine) return <p>Rutina no encontrada</p>

  return (
    <div className="space-y-6">
      {/* Título */}
      <h1 className="text-3xl font-bold">{routine.name}</h1>

      {/* Descripción */}
      {routine.description && (
        <p className="text-slate-300">{routine.description}</p>
      )}

      {/* Ejercicios */}
      <h2 className="text-xl font-semibold">Ejercicios</h2>

      {routine.exercises.length === 0 ? (
        <p className="text-slate-400">Esta rutina no tiene ejercicios.</p>
      ) : (
        <div className="space-y-4">
          {routine.exercises.map((ex, index) => {
            const exercise = ex.exerciseId || {}
            const hasImage = !!exercise.imageUrl

            return (
              <div
                key={index}
                className="border border-slate-800 rounded-lg p-4 space-y-3 bg-slate-900/40"
              >
                <div className="flex gap-4 items-start">
                  {/* Imagen del ejercicio */}
                  {hasImage && (
                    <img
                      src={exercise.imageUrl}
                      alt={exercise.name || "Ejercicio"}
                      className="w-28 h-28 rounded-md object-cover flex-shrink-0 border border-slate-800"
                    />
                  )}

                  {/* Info del ejercicio */}
                  <div className="flex-1 space-y-2">
                    {/* Encabezado del ejercicio */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-medium text-lg">
                        {exercise.name || "Ejercicio"}
                      </span>

                      {exercise.muscleGroup && (
                        <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-200">
                          {exercise.muscleGroup}
                        </span>
                      )}
                    </div>

                    {/* Tipo de ejercicio (si lo tienes) */}
                    {exercise.type && (
                      <p className="text-xs uppercase tracking-wide text-slate-400">
                        {exercise.type}
                      </p>
                    )}

                    {/* Resumen de series/reps/peso */}
                    {(ex.sets || ex.reps || ex.weight) ? (
                      <p className="text-sm text-slate-300">
                        <span className="font-semibold">{ex.sets ?? "-"}</span>{" "}
                        series ·{" "}
                        <span className="font-semibold">{ex.reps ?? "-"}</span>{" "}
                        reps ·{" "}
                        <span className="font-semibold">{ex.weight ?? "-"}</span>{" "}
                        kg
                      </p>
                    ) : (
                      <p className="text-slate-300 text-sm">
                        Este ejercicio no tiene series asignadas.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default RoutineDetail
