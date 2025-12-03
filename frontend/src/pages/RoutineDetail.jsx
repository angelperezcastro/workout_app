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
          {routine.exercises.map((ex, index) => (
            <div
              key={index}
              className="border border-slate-800 rounded-lg p-4 space-y-3"
            >
              {/* Encabezado del ejercicio */}
              <div className="flex items-center justify-between">
                <span className="font-medium text-lg">
                  {ex.exerciseId?.name || "Ejercicio"}
                </span>

                <span className="text-xs text-slate-400">
                  {ex.exerciseId?.muscleGroup}
                </span>
              </div>

              {/* Resumen de series/reps/peso */}
              {(ex.sets || ex.reps || ex.weight) ? (
                <p className="text-sm text-slate-300">
                  {ex.sets ?? "-"} series ·{" "}
                  {ex.reps ?? "-"} reps ·{" "}
                  {ex.weight ?? "-"} kg
                </p>
              ) : (
                <p className="text-slate-300 text-sm">
                  Este ejercicio no tiene series asignadas.
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RoutineDetail
