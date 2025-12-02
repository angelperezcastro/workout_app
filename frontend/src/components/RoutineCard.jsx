function RoutineCard({ routine }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{routine.name}</h3>
        {routine.daysPerWeek && (
          <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-300">
            {routine.daysPerWeek} días/sem
          </span>
        )}
      </div>
      {routine.description && (
        <p className="text-sm text-slate-300">{routine.description}</p>
      )}
      {routine.muscleGroup && (
        <p className="text-xs text-slate-400">
          Grupo muscular: {routine.muscleGroup}
        </p>
      )}
    </div>
  )
}

export default RoutineCard
