import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { login } from '../services/auth'
import { useI18n } from '../i18n/I18nProvider'


function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/dashboard'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { token } = await login({ email, password })
      localStorage.setItem('token', token)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-lg">
        <h1 className="text-2xl font-semibold mb-2">Iniciar sesión</h1>
        <p className="text-sm text-slate-300 mb-6">
          Accede a tu panel de entrenamientos.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900 px-3 py-2 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Contraseña</label>
            <input
              type="password"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 rounded-lg bg-primary hover:bg-primary-dark text-white py-2 text-sm font-medium disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-400">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-primary-light hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
