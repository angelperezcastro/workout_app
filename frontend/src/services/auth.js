import api from './api'

// LOGIN
export async function login({ email, password }) {
  try {
    const res = await api.post('/auth/login', { email, password })

    // El backend devuelve: { token, user }
    const { token, user } = res.data

    if (!token) {
      throw new Error('El servidor no devolvió un token.')
    }

    return { token, user }
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Error al iniciar sesión'

    throw new Error(message)
  }
}

// REGISTER
export async function register({ email, password, name }) {
  try {
    const res = await api.post('/auth/register', { email, password, name })

    // El backend devuelve: { message: "User created" }
    return {
      message: res.data.message || 'Usuario creado correctamente'
    }
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      'Error al registrarse'

    throw new Error(message)
  }
}
