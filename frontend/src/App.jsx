import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Routines from './pages/Routines'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import RoutineDetail from "./pages/RoutineDetail"

import "./App.css";



function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/routines"
            element={
              <ProtectedRoute>
                <Routines />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />

          <Route
  path="/routines/:id"
  element={
    <ProtectedRoute>
      <RoutineDetail />
    </ProtectedRoute>
  }
/>

        </Routes>
      </main>
    </div>
  )
}

export default App
