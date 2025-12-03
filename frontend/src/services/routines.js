import api from './api'

export async function getRoutines() {
  const res = await api.get('/routines')
  return res.data
}

export async function createRoutine({ name, description = '', exercises = [] }) {
  const res = await api.post('/routines', {
    name,
    description,
    exercises,
  })
  return res.data
}

export async function getRoutine(id) {
  const res = await api.get(`/routines/${id}`)
  return res.data
}
