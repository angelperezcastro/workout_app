const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const routineRoutes = require('./routes/routineRoutes')
const workoutRoutes = require('./routes/workoutRoutes')
const exerciseRoutes = require('./routes/exerciseRoutes')   


const app = express()

app.use(cors())
app.use(express.json())

// Rutas

app.use('/api/auth', authRoutes)
app.use('/api/routines', routineRoutes)
app.use('/api/workouts', workoutRoutes)
app.use('/api/exercises', exerciseRoutes)   
app.use('/api/workouts', require('./routes/workoutRoutes'));


const PORT = process.env.PORT || 5000

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Conectado a MongoDB')
    app.listen(PORT, () =>
      console.log(`Servidor escuchando en puerto ${PORT}`)
    )
  })
  .catch((err) => console.error('Error conectando a MongoDB:', err))
