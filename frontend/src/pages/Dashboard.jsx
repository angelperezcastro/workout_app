import { useI18n } from '../i18n/I18nProvider'


function Dashboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Panel</h1>
      <p className="text-slate-300">
        Aquí más adelante mostraremos un resumen de tus entrenamientos,
        estadísticas, últimas sesiones, etc.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Sesiones esta semana</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Rutinas activas</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
          <p className="text-sm text-slate-400">Series totales</p>
          <p className="text-3xl font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
