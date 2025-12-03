import { useEffect, useState } from 'react'
import { getRoutines, createRoutine } from '../services/routines'
import { getExercises } from '../services/exercises'
import RoutineCard from '../components/RoutineCard'

function Routines() {
  const [routines, setRoutines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')

  // catálogo de ejercicios
  const [availableExercises, setAvailableExercises] = useState([])
  // ejercicios de ESTA rutina
  const [routineExercises, setRoutineExercises] = useState([])

  // campos del "ejercicio que estoy añadiendo"
  const [selectedExerciseId, setSelectedExerciseId] = useState('')
  const [sets, setSets] = useState('')
  const [reps, setReps] = useState('')
  const [weight, setWeight] = useState('')

  // Cargar rutinas y ejercicios al montar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const [routinesData, exercisesData] = await Promise.all([
          getRoutines(),
          getExercises(),
        ])
        setRoutines(routinesData)
        setAvailableExercises(exercisesData)
      } catch (err) {
        console.error(err)
        setError(err.message || 'Error al cargar los datos')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleAddExerciseToRoutine = () => {
    setFormError('')

    if (!selectedExerciseId) {
      setFormError('Selecciona un ejercicio')
      return
    }
    if (!sets || !reps) {
      setFormError('Indica series y repeticiones')
      return
    }

    // Evitar duplicar el mismo ejercicio exactamente igual
    const already = routineExercises.some(
      (e) =>
        e.exerciseId === selectedExerciseId &&
        e.sets === Number(sets) &&
        e.reps === Number(reps) &&
        e.weight === (weight ? Number(weight) : undefined)
    )

    if (already) {
      setFormError('Ese ejercicio con esos datos ya está añadido')
      return
    }

    const newItem = {
      exerciseId: selectedExerciseId,
      sets: Number(sets),
      reps: Number(reps),
      weight: weight ? Number(weight) : undefined,
    }

    setRoutineExercises((prev) => [...prev, newItem])

    // limpiar campos de ese ejercicio
    setSelectedExerciseId('')
    setSets('')
    setReps('')
    setWeight('')
  }

  const handleRemoveExercise = (index) => {
    setRoutineExercises((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmitRoutine = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!name.trim()) {
      setFormError('El nombre de la rutina es obligatorio')
      return
    }

    if (routineExercises.length === 0) {
      setFormError('Añade al menos un ejercicio a la rutina')
      return
    }

    try {
      setCreating(true)

      const newRoutine = await createRoutine({
        name: name.trim(),
        description: description.trim(),
        exercises: routineExercises,
      })

      setRoutines((prev) => [...prev, newRoutine])

      // reset formulario
      setName('')
      setDescription('')
      setRoutineExercises([])
    } catch (err) {
      console.error(err)
      setFormError(
        err.response?.data?.message || 'No se pudo crear la rutina'
      )
    } finally {
      setCreating(false)
    }
  }

  if (loading) return <p>Cargando rutinas...</p>

  if (error)
    return (
      <p className="text-red-400">
        {error}
      </p>
    )

  const getExerciseName = (id) =>
    availableExercises.find((e) => e._id === id)?.name || 'Ejercicio'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold">Rutinas</h1>
          <p className="text-slate-300">
            Crea rutinas eligiendo ejercicios de tu catálogo y definiendo
            series, repeticiones y peso.
          </p>
        </div>
      </div>

      {/* Formulario de creación de rutina */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-4">
        <h2 className="text-xl font-semibold">Crear nueva rutina</h2>
        <form onSubmit={handleSubmitRoutine} className="space-y-4">
          {/* Nombre + descripción */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Nombre de la rutina *
              </label>
              <input
                type="text"
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Ej. Full body, Push/Pull, Pierna..."
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm text-slate-300 mb-1">
                Descripción (opcional)
              </label>
              <textarea
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={3}
                placeholder="Breve descripción de la rutina"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Añadir ejercicios */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium">Ejercicios de la rutina</h3>

            {availableExercises.length === 0 ? (
              <p className="text-sm text-slate-400">
                Aún no tienes ejercicios en tu catálogo. Crea algunos desde el
                backend (colección <code>exercises</code>) para poder añadirlos
                aquí.
              </p>
            ) : (
              <>
                <div className="grid gap-2 md:grid-cols-[2fr,1fr,1fr,1fr,auto] items-end">
                  <div>
                    <label className="block text-sm text-slate-300 mb-1">
                      Ejercicio
                    </label>
                    <select
                      className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={selectedExerciseId}
                      onChange={(e) => setSelectedExerciseId(e.target.value)}
                    >
                      <option value="">Selecciona ejercicio</option>
                      {availableExercises.map((ex) => (
                        <option key={ex._id} value={ex._id}>
                          {ex.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-1">
                      Series
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
                      Reps
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
                      Peso (kg)
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
                    Añadir
                  </button>
                </div>

                {/* Lista de ejercicios añadidos a la rutina */}
                {routineExercises.length > 0 && (
                  <div className="mt-3 border border-slate-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-900/80">
                        <tr>
                          <th className="px-3 py-2 text-left">Ejercicio</th>
                          <th className="px-3 py-2 text-center">Series</th>
                          <th className="px-3 py-2 text-center">Reps</th>
                          <th className="px-3 py-2 text-center">Peso (kg)</th>
                          <th className="px-3 py-2"></th>
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
                              {ex.weight ?? '-'}
                            </td>
                            <td className="px-3 py-2 text-right">
                              <button
                                type="button"
                                onClick={() => handleRemoveExercise(idx)}
                                className="text-xs text-red-400 hover:text-red-300"
                              >
                                Quitar
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

          {formError && (
            <p className="text-sm text-red-400">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={creating}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-medium"
          >
            {creating ? 'Creando rutina...' : 'Guardar rutina'}
          </button>
        </form>
      </section>

      {/* Lista de rutinas existentes */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Tus rutinas</h2>

        {routines.length === 0 ? (
          <p className="text-slate-400">
            Todavía no tienes ninguna rutina. Crea una con el formulario de
            arriba.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {routines.map((routine) => (
              <RoutineCard key={routine._id} routine={routine} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Routines
