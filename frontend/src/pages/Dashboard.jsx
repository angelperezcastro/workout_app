import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoutines } from "../services/routines";

function Dashboard() {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState([]);
  const [open, setOpen] = useState(false);
  const [loadingRoutines, setLoadingRoutines] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoadingRoutines(true);
        const data = await getRoutines();
        setRoutines(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingRoutines(false);
      }
    })();
  }, []);

  const startRoutine = (routineId) => {
    setOpen(false);
    navigate(`/workout/${routineId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Panel</h1>
          <p className="text-slate-300">
            Inicia una rutina y registra tu sesión con tiempo y series completadas.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-6 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg shadow-lg"
        >
          Iniciar rutina
        </button>
      </div>

      {/* Modal selector */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-950 p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <h2 className="text-xl font-semibold">Elige una rutina</h2>
                <p className="text-sm text-slate-300">Selecciona la rutina que vas a entrenar.</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>

            {loadingRoutines ? (
              <p className="text-slate-300">Cargando rutinas...</p>
            ) : routines.length === 0 ? (
              <p className="text-slate-300">
                Aún no tienes rutinas creadas. Ve a “Rutinas” y crea una primero.
              </p>
            ) : (
              <div className="space-y-2">
                {routines.map((r) => (
                  <button
                    key={r._id}
                    onClick={() => startRoutine(r._id)}
                    className="w-full text-left rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 px-4 py-3"
                  >
                    <div className="font-semibold">{r.name}</div>
                    {r.description && (
                      <div className="text-sm text-slate-300 line-clamp-2">{r.description}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Aquí luego puedes mostrar historial de sesiones */}
    </div>
  );
}

export default Dashboard;
