import { Navigate, useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'


function ProtectedRoute({ children }) {
  const location = useLocation()
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
