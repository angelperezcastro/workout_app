import { Link, NavLink, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const isLoggedIn = Boolean(localStorage.getItem('token'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const linkClasses = ({ isActive }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition
     ${isActive ? 'bg-primary text-white' : 'text-slate-200 hover:bg-slate-800'}`

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
            W
          </span>
          <span className="font-semibold text-lg tracking-tight">Workout App</span>
        </Link>

        <div className="flex items-center gap-4">
          {isLoggedIn && (
            <>
              <NavLink to="/dashboard" className={linkClasses}>
                Panel
              </NavLink>
              <NavLink to="/routines" className={linkClasses}>
                Rutinas
              </NavLink>
            </>
          )}

          {!isLoggedIn ? (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-200 hover:text-white"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-white bg-primary px-3 py-2 rounded-md hover:bg-primary-dark transition"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-200 hover:text-white"
            >
              Cerrar sesión
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
