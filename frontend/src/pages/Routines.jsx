import { useEffect, useState } from 'react'
import { getRoutines } from '../services/routines'
import RoutineCard from '../components/RoutineCard'

function Routines() {
  const [routines, setRoutines] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  if (loading) return <p>Cargando rutinas...</p>

  if (error)
    return (
      <p className="text-red-400">
        {error}
      </p>
    )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold">Rutinas</h1>
          <p className="text-slate-300">
            Lista de rutinas creadas en tu backend (más adelante podrás crear/editar).
          </p>
        </div>
      </div>

      {routines.length === 0 ? (
        <p className="text-slate-400">
          No hay rutinas todavía. Crea alguna desde el backend o añadiremos
          un formulario aquí más adelante.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {routines.map((routine) => (
            <RoutineCard key={routine._id} routine={routine} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Routines
