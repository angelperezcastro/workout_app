import api from './api'

export async function login({ email, password }) {
  const res = await api.post('/auth/login', { email, password })
  // Ajusta esto a lo que devuelva tu backend
  return res.data  // idealmente { token, user }
}

export async function register({ email, password, name }) {
  const res = await api.post('/auth/register', { email, password, name })
  return res.data
}
