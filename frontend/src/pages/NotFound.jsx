import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'


function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center">
      <h1 className="text-5xl font-bold mb-4">404</h1>
      <p className="text-slate-300 mb-6">
        La página que buscas no existe.
      </p>
      <Link
        to="/dashboard"
        className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark"
      >
        Volver al panel
      </Link>
    </div>
  )
}

export default NotFound
