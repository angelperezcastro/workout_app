import api from './api'

export async function getRoutines() {
  const res = await api.get('/routines')
  return res.data
}
