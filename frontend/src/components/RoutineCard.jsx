import { Link } from "react-router-dom"

function RoutineCard({ routine }) {
  const { name, description } = routine

  return (
    <Link to={`/routines/${routine._id}`}>
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 hover:bg-slate-800 transition cursor-pointer space-y-2">
        {/* Nombre de la rutina */}
        <h3 className="text-lg font-semibold">{name}</h3>

        {/* Descripción si existe */}
        {description && (
          <p className="text-sm text-slate-300 line-clamp-2">
            {description}
          </p>
        )}

        {/* Vista previa opcional */}
        <p className="text-xs text-slate-400">
          Haz clic para ver los detalles →
        </p>
      </div>
    </Link>
  )
}

export default RoutineCard
