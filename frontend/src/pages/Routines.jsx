import { useEffect, useState } from 'react'
import { getRoutines, createRoutine } from '../services/routines'
import RoutineCard from '../components/RoutineCard'

function Routines() {
  const [routines, setRoutines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [formError, setFormError] = useState('')

  // Cargar rutinas al montar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getRoutines()
        setRoutines(data)
      } catch (err) {
        setError(err.message || 'Error al cargar las rutinas')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')

    if (!name.trim()) {
      setFormError('El nombre de la rutina es obligatorio')
      return
    }

    try {
      setCreating(true)

      const newRoutine = await createRoutine({
        name: name.trim(),
        description: description.trim(),
        exercises: [], // En la Draft Version aún no gestionamos ejercicios
      })

      // Añadimos la nueva rutina a la lista
      setRoutines((prev) => [...prev, newRoutine])

      // Limpiar formulario
      setName('')
      setDescription('')
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold">Rutinas</h1>
          <p className="text-slate-300">
            Gestiona tus rutinas básicas. Más adelante añadiremos ejercicios,
            edición y más detalles.
          </p>
        </div>
      </div>

      {/* Formulario de creación */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
        <h2 className="text-xl font-semibold">Crear nueva rutina</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
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
            {creating ? 'Creando...' : 'Crear rutina'}
          </button>
        </form>
      </section>

      {/* Lista de rutinas */}
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
